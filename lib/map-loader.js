'use strict';

var URL_PREFIX = '//maps.googleapis.com/maps/api/js',
    CALLBACK_IDENTIFIER = 'mapLoaded';

function mapLoaded() {

}

global[CALLBACK_IDENTIFIER] = mapLoaded;

export default {
    load: function (options) {
        var scriptEl = document.createElement('script');
        scriptEl.src = URL_PREFIX
            + '?v=' + options.version
            + '&key=' + options.key
            + '&callback=' + CALLBACK_IDENTIFIER;

        document.addEventListener('DOMContentLoaded', function() {
            document.head.appendChild(scriptEl);
        });
    }
};
