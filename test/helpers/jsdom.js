'use strict';

var jsdom = require('jsdom');

function setupDom() {
    var baseMarkup = '<!DOCTYPE html><html><head><title></title></head><body></body></html>',
        window = jsdom.jsdom(baseMarkup).defaultView;

    global.window = window;
    global.document = window.document;
    global.navigator = window.navigator;
}

setupDom();
