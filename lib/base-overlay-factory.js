'use strict';

/**
 * @module async-google-maps/base-overlay-factory
 */

var MapLoader = require('./map-loader');

module.exports = {
    /**
     * Creates an instance of a custom overlay that will position itself on the map based on the overlay dimensions
     * and the provided point.
     *
     * @param options - Options passed to the base overlay constructor
     * @param options.el - The element that the overlay will use to append into the overlay pane.
     * @param options.point - The lat/lng that the overlay will use to position itself on the map.
     * @param options.cacheDimensions - Instruct the Overlay to cache its dimensions after the first time it is drawn
     */
    create: function (options) {
        MapLoader.loaded.then(function () {
            var BaseOverlay = require('./base-overlay'),
                overlayInstance = new BaseOverlay(options),
                shouldCacheDimensions = options.cacheDimensions;

            overlayInstance.setMap(options.map);

            if (shouldCacheDimensions) {
                overlayInstance.cacheDimensions();
            }
        });
    }
};
