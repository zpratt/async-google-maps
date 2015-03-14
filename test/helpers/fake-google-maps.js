'use strict';

var fakeGoogleMapsApi = {
    maps: {
        Map: function () {
            return;
        },
        event: {
            addListenerOnce: function () {
                return;
            }
        }
    }
};

global.google = fakeGoogleMapsApi;

module.exports = fakeGoogleMapsApi;
