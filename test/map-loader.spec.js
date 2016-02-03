'use strict';

var fakeGoogle = require('./helpers/fake-google-maps.js'),
    MapLoader,

    SyncPromise = require('./helpers/sync-promise.js'),
    path = require('path'),

    expect = require('chai').expect,
    sinon = require('sinon'),

    EXPECTED_GLOBAL_CALLBACK = 'mapLoaded',
    EXPECTED_KEY_URL_TEMPLATE = '//maps.googleapis.com/maps/api/js?v={VERSION}&key={KEY}&callback={CALLBACK}',
    EXPECTED_CLIENT_CHANNEL_URL_TEMPLATE = '//maps.googleapis.com/maps/api/js?v={VERSION}&client={CLIENT}&channel={CHANNEL}&callback={CALLBACK}',

    sandbox,

    fakeMapInstance,

    expectedVersion,
    expectedKey,
    expectedClient,
    expectedChannel,
    expectedKeyUrl,
    expectedClientChannelUrl,
    loadOptions,
    loadClientChannelOptions,
    fakeMapOptions,
    mapContainer,

    documentReadyCallback,
    mapIdleCallback;

function triggerDocumentReady() {
    documentReadyCallback();
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

    sandbox.stub(document, 'addEventListener', function (event, callback) {
        if (event === 'DOMContentLoaded') {
            documentReadyCallback = callback;
        }
    });
}

function defineFakeData() {
    fakeMapInstance = {};
    fakeMapOptions = {};
    mapContainer = {};

    expectedVersion = '3.20';
    expectedKey = 'somekey';
    expectedClient = 'myclient';
    expectedChannel = 'mychannel';

    expectedKeyUrl = EXPECTED_KEY_URL_TEMPLATE
        .replace('{VERSION}', expectedVersion)
        .replace('{KEY}', expectedKey)
        .replace('{CALLBACK}', EXPECTED_GLOBAL_CALLBACK);

    expectedClientChannelUrl = EXPECTED_CLIENT_CHANNEL_URL_TEMPLATE
        .replace('{VERSION}', expectedVersion)
        .replace('{CLIENT}', expectedClient)
        .replace('{CHANNEL}', expectedChannel)
        .replace('{CALLBACK}', EXPECTED_GLOBAL_CALLBACK);

    loadOptions = {
        version: expectedVersion,
        key: expectedKey
    };

    loadClientChannelOptions = {
        version: expectedVersion,
        client: expectedClient,
        channel: expectedChannel
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
        var cachedModule = path.join(__dirname, '..', 'lib', 'map-loader.js');

        sandbox.restore();

        SyncPromise.unsetSandbox();
        mapIdleCallback = null;
        documentReadyCallback = null;
        document.head.innerHTML = '';

        delete require.cache[cachedModule];
    });

    describe('When loaded before DOMContentLoaded event has fired', function () {
        beforeEach(function () {
            document.readyState = 'loading';

            MapLoader = require('../lib/map-loader');
        });

        it('should add the google maps key url script to the dom by default', function () {
            var scriptEl;

            MapLoader.load(loadOptions);
            expect(document.head.querySelector('script')).to.equal(null);

            triggerDocumentReady();

            scriptEl = document.head.querySelector('script');
            expect(scriptEl.src).to.equal(expectedKeyUrl);
            expect(scriptEl.type).to.equal('text/javascript');
        });

        it('should add the google maps client/channel url script to the dom if client/channel found', function () {
            var scriptEl;

            MapLoader.load(loadClientChannelOptions);
            expect(document.head.querySelector('script')).to.equal(null);

            triggerDocumentReady();

            scriptEl = document.head.querySelector('script');
            expect(scriptEl.src).to.equal(expectedClientChannelUrl);
            expect(scriptEl.type).to.equal('text/javascript');
        });

        it('should resolve the promise once google maps is loaded and the global callback is invoked', function () {
            var mapLoadPromise = MapLoader.load(loadOptions);

            sinon.assert.notCalled(mapLoadPromise.resolve);
            global[EXPECTED_GLOBAL_CALLBACK]();

            sinon.assert.calledOnce(mapLoadPromise.resolve);
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

        it('should expose a hook to know when the google maps API is ready', function () {
            var mapLoadedPromise = MapLoader.loaded,
                promiseFromLoad = MapLoader.load(loadOptions);

            expect(mapLoadedPromise).to.equal(promiseFromLoad);
        });

        it('should only load the google maps API once', function () {
            sinon.assert.calledOnce(global.Promise);
            global.Promise.reset();

            MapLoader.load(loadOptions);
            triggerDocumentReady();
            MapLoader.load(loadOptions);

            sinon.assert.notCalled(global.Promise);
            expect(document.getElementsByTagName('script')).to.have.length(1);
        });
    });

    describe('When loaded after DOMContentLoaded event has fired', function () {
        beforeEach(function () {
            document.readyState = 'interactive';

            MapLoader = require('../lib/map-loader');
        });

        it('should add the google maps script to the dom immediately', function () {
            var scriptEl;

            expect(document.head.querySelector('script')).to.equal(null);
            MapLoader.load(loadOptions);

            scriptEl = document.head.querySelector('script');
            expect(scriptEl.src).to.equal(expectedKeyUrl);
            expect(scriptEl.type).to.equal('text/javascript');
        });

        it('should only load the google maps API once', function () {
            sinon.assert.calledOnce(global.Promise);
            global.Promise.reset();

            MapLoader.load(loadOptions);
            MapLoader.load(loadOptions);

            sinon.assert.notCalled(global.Promise);
            expect(document.getElementsByTagName('script')).to.have.length(1);
        });
    });
});
