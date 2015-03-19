'use strict';

var BaseOverlayFactory,

    proxyquire = require('proxyquire'),
    sinon = require('sinon'),

    fakeMap,
    fakeOptions,

    mapLoadedSpy,
    BaseOverlaySpy,
    sandbox;

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
                setMap: sandbox.spy()
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
        mapLoadedSpy.firstCall.yield();

        fakeOverlayInstance = BaseOverlaySpy.returnValues[0];

        sinon.assert.calledOnce(fakeOverlayInstance.setMap);
        sinon.assert.calledWith(fakeOverlayInstance.setMap, fakeMap);
    });
});
