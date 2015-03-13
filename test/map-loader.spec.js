'use strict';

import MapLoader from '../lib/map-loader';
import SyncPromise from './helpers/sync-promise.js';

import {expect} from 'chai';
import sinon from 'sinon';

var EXPECTED_GLOBAL_CALLBACK = 'mapLoaded',
    EXPECTED_URL_TEMPLATE = '//maps.googleapis.com/maps/api/js?v={VERSION}&key={KEY}&callback={CALLBACK}',

    sandbox,

    expectedVersion,
    expectedKey,
    expectedUrl,
    loadOptions;

function triggerDocumentReady() {
    var event = document.createEvent('HTMLEvents');

    event.initEvent('DOMContentLoaded', false, false);
    document.dispatchEvent(event);
}

/*global sinon expect SyncPromise MapLoader */
describe('Google Maps Loader Test Suite', function () {
    beforeEach(function () {
        sandbox = sinon.sandbox.create();

        sandbox.stub(global, 'Promise', function (resolver) {
            return new SyncPromise.Promise(resolver);
        });

        SyncPromise.setSandbox(sandbox);

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
    });

    afterEach(function () {
        sandbox.restore();

        SyncPromise.unsetSandbox();
    });

    it('should add the google maps script to the dom', function () {
        MapLoader.load(loadOptions);
        expect(document.head.querySelector('script')).to.equal(null);

        triggerDocumentReady();

        expect(document.head.querySelector('script').src).to.equal(expectedUrl);
    });

    it('should resolve the promise once google maps is loaded and the global callback is invoked', function () {
        var loadPromise = MapLoader.load(loadOptions);

        expect(loadPromise).to.be.an.instanceOf(SyncPromise.Promise);

        sinon.assert.notCalled(loadPromise.resolve);
        global[EXPECTED_GLOBAL_CALLBACK]();

        sinon.assert.calledOnce(loadPromise.resolve);
    });
});
