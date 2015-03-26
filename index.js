'use strict';

/**
 * @author zach pratt
 * @licence MIT
 * @module async-google-maps
 */

var MapLoader = require('./lib/map-loader'),
    BaseOverlayFactory = require('./lib/base-overlay-factory');

module.exports = {
    /**
     * See {@link async-google-maps/map-loader}
     * */
    MapLoader: MapLoader,
    /**
     * See {@link async-google-maps/base-overlay-factory}
     * */
    BaseOverlayFactory: BaseOverlayFactory
};
