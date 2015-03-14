'use strict';

var expect = require('chai').expect,
    fakeGoogleMapsApi = require('./helpers/fake-google-maps.js'),
    googleMaps = require('../lib/google-maps-shim');

describe('Google Maps Global Shim Test Suite', function () {
    it('should shim the google global so that it can be `require`\'d', function () {
        expect(googleMaps).to.equal(fakeGoogleMapsApi);
    });
});
