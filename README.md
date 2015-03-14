# async-google-maps
Asynchronous loading and creation of google maps

[![Build Status](https://travis-ci.org/zpratt/async-google-maps.svg)](https://travis-ci.org/zpratt/async-google-maps)

## Running tests

1. Install io.js (needed for jsdom)
- `npm i`
- `npm test`

## Usage

```javascript

var MapLoader = require('async-google-maps');

MapLoader.load({
    key: 'some-api-key',
    version: '3.20'
});

MapLoader.create(
    document.querySelector('.map-container'),
    {
        center: {
            lat: 40.0,
            lng: -90.0
        },
        zoom: 7
    }
);
```

### Promises

This library leverages the ES6 promise implementation, which is currently [available in most modern browsers](http://caniuse.com/#feat=promises). If you wish to use it with browsers that do not support the ES6 promise implementation, then I recommend using [a polyfill](https://github.com/jakearchibald/es6-promise).

### Why?

I have intentionally limited the production dependencies of this module, so you are not forced to use a particular library.

## API

### MapLoader.load

Asynchronously loads the google maps javascript library, given the supplied options. Returns a promise that will be resolved once the google maps loader has finished. Once the promise resolves, it is safe to reference anything under the `google.maps` namespace. This method should only be called once for a given application.

### MapLoader.create

Creates a map instance given the supplied options. The options will be passed into the `google.maps.Map` constructor, therefore, all options from the [google maps api](https://developers.google.com/maps/documentation/javascript/reference#MapOptions) can be used. This function returns a promise which will be resolved once the newly created map instance is in the `idle` state, which is the point at which overlays, markers, and geometries can be added to the map.
