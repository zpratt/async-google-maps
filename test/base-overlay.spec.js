'use strict';

var fakeGoogleMaps = require('./helpers/fake-google-maps'),
    BaseOverlay = require('../lib/base-overlay'),

    expect = require('chai').expect,
    sinon = require('sinon'),

    sandbox,

    fakeMapInstance,
    latLngLiteral,
    fakeLatLng,
    projectedLatLng,

    initialOffsetHeight,
    initialOffsetWidth,

    overlayPaneElement,
    overlayElement,
    overlayOptions,
    overlayInstance;

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function setFakeData() {
    initialOffsetHeight = randomInt(20, 1000);
    initialOffsetWidth = randomInt(20, 1000);
    latLngLiteral = {
        lat: 0.0,
        lng: 0.0
    };

    fakeLatLng = {};
    fakeMapInstance = {};

    projectedLatLng = {
        x: initialOffsetWidth + randomInt(1, 100),
        y: initialOffsetHeight + randomInt(1, 100)
    };
}
function setupDom() {
    overlayPaneElement = document.createElement('div');
    overlayElement = document.createElement('div');
    overlayElement.style.height = initialOffsetHeight + 'px';
    overlayElement.style.width = initialOffsetWidth + 'px';
}
function setupStubs() {
    sandbox.stub(fakeGoogleMaps.maps.OverlayView.prototype, 'getPanes')
        .returns({
            overlayLayer: overlayPaneElement
        });

    sandbox.stub(fakeGoogleMaps.maps.OverlayView.prototype, 'getProjection')
        .returns({
            fromLatLngToDivPixel: function (latLng) {
                if (latLng === fakeLatLng) {
                    return projectedLatLng;
                }
            }
        });

    sandbox.stub(fakeGoogleMaps.maps, 'LatLng', function (lat, lng) {
        if (lat === latLngLiteral.lat && lng === latLngLiteral.lng) {
            return fakeLatLng;
        }
    });
}
describe('Base Overlay Test Suite', function () {
    beforeEach(function () {
        sandbox = sinon.sandbox.create();

        setFakeData();
        setupDom();
        setupStubs();

        overlayOptions = {
            point: latLngLiteral,
            el: overlayElement,
            map: fakeMapInstance
        };

        overlayInstance = new BaseOverlay(overlayOptions);
    });

    afterEach(function () {
        sandbox.restore();
    });

    it('should be an instance of a google maps overlay view', function () {
        expect(overlayInstance).to.be.an.instanceOf(fakeGoogleMaps.maps.OverlayView);
    });

    it('should absolutely position the overlay', function () {
        expect(overlayElement.style.position).to.equal('absolute');
    });

    it('should append the provided element into the DOM', function () {
        expect(overlayPaneElement.contains(overlayElement)).to.equal(false);

        overlayInstance.onAdd();

        expect(overlayPaneElement.contains(overlayElement)).to.equal(true);
    });

    it('should position the overlay once the map is idle', function () {
        var expectedTop = projectedLatLng.y - initialOffsetHeight + 'px',
            expectedLeft = projectedLatLng.x - Math.floor(initialOffsetWidth / 2) + 'px';

        expect(overlayElement.style.top).to.equal('');
        expect(overlayElement.style.left).to.equal('');

        overlayInstance.draw();

        expect(overlayElement.style.top).to.equal(expectedTop);
        expect(overlayElement.style.left).to.equal(expectedLeft);
    });
});
