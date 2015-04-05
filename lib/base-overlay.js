'use strict';

var google = global.google;

function getOffsetHeightAndWidth() {
    return {
        height: this.el.offsetHeight,
        width: this.el.offsetWidth
    };
}
function getDimensions() {
    if (this.useCache) {
        if (!this.dimensions) {
            this.dimensions = getOffsetHeightAndWidth.call(this);
        }

        return this.dimensions;
    }

    return getOffsetHeightAndWidth.call(this);
}

function positionOverlayByDimensions(projectedLatLng) {
    var dimensions = getDimensions.call(this),
        offsetHeight = dimensions.height,
        offsetWidth = dimensions.width;

    this.el.style.top = projectedLatLng.y - offsetHeight + 'px';
    this.el.style.left = projectedLatLng.x - Math.floor(offsetWidth / 2) + 'px';
}

function draw() {
    var projection = this.getProjection(),
        projectedLatLng = projection.fromLatLngToDivPixel(this.point);

    positionOverlayByDimensions.call(this, projectedLatLng);
}

function onRemove() {
    var parentEl = this.el.parentNode;

    parentEl.removeChild(this.el);
}

function onAdd() {
    var panes = this.getPanes();

    panes.overlayLayer.appendChild(this.el);
}

function cacheDimensions() {
    this.useCache = true;
}

function BaseOverlay(options) {
    var point = options.point;

    this.el = options.el;
    this.point = new google.maps.LatLng(point.lat, point.lng);

    this.el.style.position = 'absolute';
}

BaseOverlay.prototype = Object.create(google.maps.OverlayView.prototype);
BaseOverlay.prototype.constructor = BaseOverlay;

BaseOverlay.prototype.onAdd = onAdd;
BaseOverlay.prototype.onRemove = onRemove;
BaseOverlay.prototype.draw = draw;
BaseOverlay.prototype.cacheDimensions = cacheDimensions;

module.exports = BaseOverlay;
