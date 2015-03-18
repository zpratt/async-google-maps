'use strict';

var google = global.google;

function onAdd() {
    var panes = this.getPanes();

    panes.overlayLayer.appendChild(this.el);
}

function positionOverlayByDimensions(projectedLatLng) {
    var offsetHeight = this.el.offsetHeight,
        offsetWidth = this.el.offsetWidth;

    this.el.style.top = projectedLatLng.y - offsetHeight + 'px';
    this.el.style.left = projectedLatLng.x - Math.floor(offsetWidth / 2) + 'px';
}

function draw() {
    var projection = this.getProjection(),
        projectedLatLng = projection.fromLatLngToDivPixel(this.point);

    positionOverlayByDimensions.call(this, projectedLatLng);
}

function BaseOverlay(options) {
    this.el = options.el;
    this.point = new google.maps.LatLng(options.point);

    this.el.style.position = 'absolute';
}

BaseOverlay.prototype = new google.maps.OverlayView();

BaseOverlay.prototype.onAdd = onAdd;
BaseOverlay.prototype.draw = draw;

module.exports = BaseOverlay;
