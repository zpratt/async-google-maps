'use strict';

var MapLoader = require('./map-loader');

module.exports = {
    create: function (options) {
        MapLoader.loaded.then(function () {
            var BaseOverlay = require('./base-overlay'),
                overlayInstance = new BaseOverlay(options);

            overlayInstance.setMap(options.map);
        });
    }
};
