'use strict';

var URL_PREFIX = '//maps.googleapis.com/maps/api/js',
    CALLBACK_IDENTIFIER = 'mapLoaded',

    mapLoadedDeferred,
    mapLoadedPromise;

global[CALLBACK_IDENTIFIER] = function mapLoaded() {
    mapLoadedDeferred.resolve();
};

function buildUrl(options) {
    return URL_PREFIX
        + '?v=' + options.version
        + '&key=' + options.key
        + '&callback=' + CALLBACK_IDENTIFIER;
}

module.exports = {
    load: function (options) {
        var scriptEl = document.createElement('script');
        scriptEl.src = buildUrl(options);

        document.addEventListener('DOMContentLoaded', function() {
            document.head.appendChild(scriptEl);
        });

        mapLoadedDeferred = {};
        mapLoadedPromise = new Promise(function (resolve, reject) {
            mapLoadedDeferred.resolve = resolve;
            mapLoadedDeferred.reject = reject;
        });

        return mapLoadedPromise;
    },

    create: function (mapContainer, options) {
        return new Promise(function (resolve) {
            mapLoadedPromise.then(function () {
                var googleMaps = require('./google-maps-shim.js'),
                    mapInstance = new googleMaps.maps.Map(mapContainer, options);

                googleMaps.maps.event.addListenerOnce(mapInstance, 'idle', function () {
                    resolve(mapInstance);
                });
            });
        });
    }
};
