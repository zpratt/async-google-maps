'use strict';

var BaseOverlayFactory,

    proxyquire = require('proxyquire'),
    sinon = require('sinon'),

    fakeMap,
    fakeOptions,

    mapLoadedSpy,
    BaseOverlaySpy,
    sandbox;

function resolveMapPromiseAndGetOverlayInstance() {
    mapLoadedSpy.firstCall.yield();

    return BaseOverlaySpy.returnValues[0];
}
describe('Base Overlay Factory Test Suite', function () {
    beforeEach(function () {
        sandbox = sinon.sandbox.create();

        fakeMap = {};
        fakeOptions = {
            map: fakeMap
        };

        mapLoadedSpy = sandbox.spy();
        BaseOverlaySpy = sandbox.spy(function () {
            return {
                setMap: sandbox.spy(),
                cacheDimensions: sandbox.spy()
            };
        });

        BaseOverlayFactory = proxyquire('../lib/base-overlay-factory', {
            './base-overlay': BaseOverlaySpy,
            './map-loader': {
                loaded: {
                    then: mapLoadedSpy
                }
            }
        });
    });

    afterEach(function () {
        sandbox.restore();
    });

    it('should create an instance of the overlay after the google maps API has loaded', function () {
        BaseOverlayFactory.create(fakeOptions);
        sinon.assert.notCalled(BaseOverlaySpy);

        mapLoadedSpy.firstCall.yield();

        sinon.assert.calledOnce(BaseOverlaySpy);
        sinon.assert.calledWith(BaseOverlaySpy, fakeOptions);
        sinon.assert.calledWithNew(BaseOverlaySpy);
    });

    it('should set the map on the overlay instance after creating it', function () {
        var fakeOverlayInstance;

        BaseOverlayFactory.create(fakeOptions);
        fakeOverlayInstance = resolveMapPromiseAndGetOverlayInstance();

        sinon.assert.calledOnce(fakeOverlayInstance.setMap);
        sinon.assert.calledWith(fakeOverlayInstance.setMap, fakeMap);
    });

    it('should tell the overlay instance to cache its dimensions when the option is set', function () {
        var fakeOverlayInstance;

        fakeOptions.cacheDimensions = true;

        BaseOverlayFactory.create(fakeOptions);
        fakeOverlayInstance = resolveMapPromiseAndGetOverlayInstance();
        sinon.assert.calledOnce(fakeOverlayInstance.cacheDimensions);
    });

    it('should not tell the overlay instance to cache its dimensions when the option is not set', function () {
        var fakeOverlayInstance;

        BaseOverlayFactory.create(fakeOptions);
        fakeOverlayInstance = resolveMapPromiseAndGetOverlayInstance();
        sinon.assert.notCalled(fakeOverlayInstance.cacheDimensions);
    });
});
