'use strict';

/**
 * @module async-google-maps/map-loader
 */

var URL_PREFIX = '//maps.googleapis.com/maps/api/js',
    CALLBACK_IDENTIFIER = 'mapLoaded',

    scriptLoaded = false,
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

function appendScript(scriptEl) {
    document.head.appendChild(scriptEl);
    scriptLoaded = true;
}

function appendScriptWhenDocumentReady(scriptEl) {
    if (!scriptLoaded && document.readyState !== 'loading') {
        appendScript(scriptEl);
    } else {
        document.addEventListener('DOMContentLoaded', function () {
            appendScript(scriptEl);
        });
    }
}

function injectGoogleMapsScript(options) {
    var scriptEl = document.createElement('script');
    scriptEl.src = buildUrl(options);
    scriptEl.type = 'text/javascript';

    appendScriptWhenDocumentReady(scriptEl);
}

function init() {
    createMapLoadedPromise();
}

init();

module.exports = {
    /**
     * Asynchronously loads the google maps javascript library, given the supplied options.
     * Returns a promise that will be resolved once the google maps loader has finished.
     * Once the promise resolves, it is safe to reference anything under the `google.maps` namespace.
     * This method should only be called once for a given application.
     *
     * @param {Object} options - The configuration used to load the google maps API
     * @param {string} options.version - The version of the google maps API to load
     * @param {string} options.key - The API key of the consuming application
     * @returns {Promise}
     * */
    load: function loadGoogleMapsAsync(options) {
        injectGoogleMapsScript(options);

        return mapLoadedPromise;
    },

    /**
     * @property {Promise} loaded - A reference to a promise that is resolved once the google maps API is ready.
     */
    loaded: (function () {
        return mapLoadedPromise;
    }()),

    /**
     * Creates a map instance given the supplied options. The options will be passed into the `google.maps.Map` constructor,
     * therefore, all options from the [google maps api](https://developers.google.com/maps/documentation/javascript/reference#MapOptions) can be used.
     * This function returns a promise which will be resolved once the newly created map instance is in the `idle` state,
     * which is the point at which overlays, markers, and geometries can be added to the map.
     *
     * @param mapContainer - The element to attach the map instance to
     * @param options - Options passed to the google Map constructor
     * @returns {Promise}
     * */
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
