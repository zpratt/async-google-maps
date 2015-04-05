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

function calculateTop() {
    return projectedLatLng.y - initialOffsetHeight + 'px';
}

function calculateLeft() {
    return projectedLatLng.x - Math.floor(initialOffsetWidth / 2) + 'px';
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateHeightAndWidth() {
    initialOffsetHeight = randomInt(20, 1000);
    initialOffsetWidth = randomInt(20, 1000);
}

function setFakeData() {
    generateHeightAndWidth();

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

function setDimensionsOfOverlayElement() {
    overlayElement.style.height = initialOffsetHeight + 'px';
    overlayElement.style.width = initialOffsetWidth + 'px';
}

function setupDom() {
    overlayPaneElement = document.createElement('div');
    overlayElement = document.createElement('div');
    setDimensionsOfOverlayElement();
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
        var expectedTop = calculateTop(),
            expectedLeft = calculateLeft();

        expect(overlayElement.style.top).to.equal('');
        expect(overlayElement.style.left).to.equal('');

        overlayInstance.draw();

        expect(overlayElement.style.top).to.equal(expectedTop);
        expect(overlayElement.style.left).to.equal(expectedLeft);
    });

    it('should remove itself from the DOM when its map is unset', function () {
        overlayInstance.onAdd();

        overlayInstance.onRemove();

        expect(overlayPaneElement.contains(overlayElement)).to.equal(false);
    });

    it('should cache the dimensions of the associated DOM element', function () {
        var expectedTop = calculateTop(),
            expectedLeft = calculateLeft();

        overlayInstance.cacheDimensions();
        overlayInstance.draw();

        generateHeightAndWidth();
        setDimensionsOfOverlayElement();

        overlayInstance.draw();
        expect(overlayElement.style.top).to.equal(expectedTop);
        expect(overlayElement.style.left).to.equal(expectedLeft);
    });
});
