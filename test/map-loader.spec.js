'use strict';

var fakeGoogle = require('./helpers/fake-google-maps.js'),
    MapLoader = require('../lib/map-loader'),
    SyncPromise = require('./helpers/sync-promise.js'),
    expect = require('chai').expect,
    sinon = require('sinon'),

    EXPECTED_GLOBAL_CALLBACK = 'mapLoaded',
    EXPECTED_URL_TEMPLATE = '//maps.googleapis.com/maps/api/js?v={VERSION}&key={KEY}&callback={CALLBACK}',

    sandbox,

    fakeMapInstance,

    expectedVersion,
    expectedKey,
    expectedUrl,
    loadOptions,
    fakeMapOptions,
    mapContainer,

    mapIdleCallback;

function triggerDocumentReady() {
    var event = document.createEvent('HTMLEvents');

    event.initEvent('DOMContentLoaded', false, false);
    document.dispatchEvent(event);
}

function givenGoogleMapsLibHasLoaded() {
    MapLoader.load(loadOptions);

    global[EXPECTED_GLOBAL_CALLBACK]();
}

function defineStubs() {
    sandbox.stub(global, 'Promise', function (resolver) {
        return new SyncPromise.Promise(resolver);
    });

    sandbox.stub(fakeGoogle.maps, 'Map')
        .returns(fakeMapInstance);

    sandbox.stub(fakeGoogle.maps.event, 'addListenerOnce', function (mapInstance, eventName, callback) {
        if (mapInstance === fakeMapInstance && eventName === 'idle') {
            mapIdleCallback = callback;
        }
    });
}

function defineFakeData() {
    fakeMapInstance = {};
    fakeMapOptions = {};
    mapContainer = {};

    expectedVersion = '3.20';
    expectedKey = 'somekey';
    expectedUrl = EXPECTED_URL_TEMPLATE
        .replace('{VERSION}', expectedVersion)
        .replace('{KEY}', expectedKey)
        .replace('{CALLBACK}', EXPECTED_GLOBAL_CALLBACK);

    loadOptions = {
        version: expectedVersion,
        key: expectedKey
    };
}

describe('Google Maps Loader Test Suite', function () {
    beforeEach(function () {
        sandbox = sinon.sandbox.create();
        SyncPromise.setSandbox(sandbox);

        defineFakeData();
        defineStubs();
    });

    afterEach(function () {
        sandbox.restore();

        SyncPromise.unsetSandbox();
        mapIdleCallback = null;
    });

    it('should add the google maps script to the dom', function () {
        var scriptEl;

        MapLoader.load(loadOptions);
        expect(document.head.querySelector('script')).to.equal(null);

        triggerDocumentReady();

        scriptEl = document.head.querySelector('script');
        expect(scriptEl.src).to.equal(expectedUrl);
        expect(scriptEl.type).to.equal('text/javascript');
    });

    it('should resolve the promise once google maps is loaded and the global callback is invoked', function () {
        var mapLoadPromise = MapLoader.load(loadOptions);

        sinon.assert.notCalled(mapLoadPromise.resolve);
        global[EXPECTED_GLOBAL_CALLBACK]();

        sinon.assert.calledOnce(mapLoadPromise.resolve);
    });

    it('should create a map instance with the supplied options', function () {
        sinon.assert.notCalled(fakeGoogle.maps.Map);
        givenGoogleMapsLibHasLoaded();

        MapLoader.create(mapContainer, fakeMapOptions);

        sinon.assert.calledOnce(fakeGoogle.maps.Map);
        sinon.assert.calledWith(fakeGoogle.maps.Map, mapContainer, fakeMapOptions);
        sinon.assert.calledWithNew(fakeGoogle.maps.Map);
    });

    it('should resolve with a google maps instance once the map is idle', function () {
        var mapIdlePromise;

        givenGoogleMapsLibHasLoaded();
        mapIdlePromise = MapLoader.create(fakeMapOptions);

        sinon.assert.notCalled(mapIdlePromise.resolve);

        mapIdleCallback();

        sinon.assert.calledOnce(mapIdlePromise.resolve);
        sinon.assert.calledWith(mapIdlePromise.resolve, fakeMapInstance);
    });
});
