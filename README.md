# missoula-boundaries

WIP Web app that lets users enter a Montana address, returns which county/municipalities/school districts/legislative districts it's part of. Inspired by [Seattle Boundaries](https://github.com/seattleio/boundaries).

## Project components:

- Geographic data store --> Geojson files in github repo directory
    - Shapefile data is easily available for most districts. Will need to collect/clean/standardize as GeoJSON
- Backend system for taking a point (lat/long coords) and returning the boundaries it's part of --> techology???
    - Use: https://github.com/manuelbieh/Geolib
    - OR: https://github.com/Turfjs/turf
- Front end application --> React/Mapbox
    - Form for entering address, geocoding it and sending it to boundary API
        - Use [Mapbox Geocoding API](https://www.mapbox.com/geocoding/), free up to 50K requests/mo
    - Response page for displaying API
        - List of which districts the address is part of
        - Map of boundary for district

## Project structure

- app/ - source directory
    - /components/ - React components
        - App.jsx - Wrapper
        - DataManager.js - non-display class for managing app data
            - handles lat/long within calculation
        - LocationForm.jsx - React component for entering location of interest
            - collects address, geocodes, passes to DataManager
        - DistrictMap.jsx - React component for displaying interest point inside appropriate boundaries
    - /css/
    - /geodata/ - Geojson boundary data
- build/ - build directory
- scripts - Scripts for data collection/processing (e.g. converting source shapefiles to geojson)


## Workplan:

1. Build a proof of concept using [MT House Districts](http://leg.mt.gov/css/Committees/interim/2011-2012/districting/adopted-plan.asp).

2. Add in other geographies

## References:
- https://github.com/seattleio/boundaries-api
- https://github.com/seattleio/boundaries
- https://github.com/seattleio/seattle-boundaries-data
- https://github.com/mapbox/mapbox-react-examples

Looks like Seattle Boundaries is split into web app, API and geography repos. Web app is built with Choo (some lightweight JS framework) and Mapbox maps. API uses Node's http server, it looks like.

The geography (boundaries) repo stores things as geojsons, with some packaging so they're hosted on [NPM](https://www.npmjs.com/package/seattle-boundaries). The overall project uses node/NPM to collect its parts together.

References for setting up react development environment with webpack/Babel:
- https://scotch.io/tutorials/setup-a-react-environment-using-webpack-and-babel
- https://stanko.github.io/webpack-babel-react-revisited/
- https://blog.jonathanargentiero.com/how-to-load-a-json-content-inside-a-js-module-with-webpack/
- https://github.com/ReactJSResources/react-webpack-babel
- https://webpack.js.org/guides/production/
