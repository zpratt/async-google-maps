'use strict';

function OverlayView() {
    return;
}

OverlayView.prototype.getPanes = function () {
    return;
};

OverlayView.prototype.getProjection = function () {
    return;
};

var fakeGoogleMapsApi = {
    maps: {
        Map: function () {
            return;
        },
        event: {
            addListenerOnce: function () {
                return;
            }
        },
        LatLng: function () {

        },
        OverlayView: OverlayView
    }
};

global.google = fakeGoogleMapsApi;

module.exports = fakeGoogleMapsApi;
