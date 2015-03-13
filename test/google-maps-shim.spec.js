import {expect} from 'chai';

var fakeGoogleMapsApi = {};
global.google = fakeGoogleMapsApi;

import googleMaps from '../lib/google-maps-shim';

/*global expect googleMaps */

describe('Google Maps Global Shim Test Suite', function () {
    it('should shim the google global so that it can be `require\'d`', function () {
        expect(googleMaps).to.equal(fakeGoogleMapsApi);
    });
});
