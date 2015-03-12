'use strict';

import MapLoader from '../lib/map-loader';
import {expect} from 'chai';

var EXPECTED_GLOBAL_CALLBACK = 'mapLoaded',
    EXPECTED_URL_TEMPLATE = '//maps.googleapis.com/maps/api/js?v={VERSION}&key={KEY}&callback={CALLBACK}';

function triggerDocumentReady() {
    var event = document.createEvent('HTMLEvents');

    event.initEvent('DOMContentLoaded', false, false);
    document.dispatchEvent(event);
}

/*global expect MapLoader */
describe('Google Maps Loader Test Suite', function () {
    it('should expose a global callback that the main google maps module will invoke once it is fully loaded', function () {
        global[EXPECTED_GLOBAL_CALLBACK]();
    });

    it('should add the google maps script to the dom', function () {
        var expectedVersion = '3.20',
            expectedKey = 'somekey',
            expectedUrl = EXPECTED_URL_TEMPLATE
                .replace('{VERSION}', expectedVersion)
                .replace('{KEY}', expectedKey)
                .replace('{CALLBACK}', EXPECTED_GLOBAL_CALLBACK),
            loadOptions = {
                version: expectedVersion,
                key: expectedKey
            };

        MapLoader.load(loadOptions);
        expect(document.head.querySelector('script')).to.equal(null);

        triggerDocumentReady();

        expect(document.head.querySelector('script').src).to.equal(expectedUrl);
    });
});
