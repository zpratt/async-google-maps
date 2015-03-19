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

function createDeferredToAllowForResolutionAfterGoogleMapsLoaderFinishes(resolve, reject) {
    mapLoadedDeferred = {
        resolve: resolve,
        reject: reject
    };
}

function createMapLoadedPromise() {
    mapLoadedPromise = new Promise(function (resolve, reject) {
        createDeferredToAllowForResolutionAfterGoogleMapsLoaderFinishes(resolve, reject);
    });
}

function appendScriptOnDocumentReady(scriptEl) {
    document.addEventListener('DOMContentLoaded', function () {
        document.head.appendChild(scriptEl);
    });
}

function injectGoogleMapsScript(options) {
    var scriptEl = document.createElement('script');
    scriptEl.src = buildUrl(options);
    scriptEl.type = 'text/javascript';

    appendScriptOnDocumentReady(scriptEl);
}

function init() {
    createMapLoadedPromise();
}

init();

module.exports = {
    load: function loadGoogleMapsAsync(options) {
        injectGoogleMapsScript(options);

        return mapLoadedPromise;
    },

    loaded: (function () {
        return mapLoadedPromise;
    }()),

    create: function createMap(mapContainer, options) {
        return new Promise(function mapIdleResolver(resolve) {
            mapLoadedPromise.then(function whenMapHasLoaded() {
                var googleMaps = require('./google-maps-shim.js'),
                    mapInstance = new googleMaps.maps.Map(mapContainer, options);

                googleMaps.maps.event.addListenerOnce(mapInstance, 'idle', function mapIdleHandler() {
                    resolve(mapInstance);
                });
            });
        });
    }
};
