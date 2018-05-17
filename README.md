# Montana Explorer

Web interface for exploring Montana municipalities, school districts and counties - showing boundaries and statistical info. Inspired by [Seattle Boundaries](https://github.com/seattleio/boundaries) and [Census Reporter](https://censusreporter.org/).

## Build requirements

Needs a [Mapbox public token](https://www.mapbox.com/help/how-access-tokens-work/) key. Using dotenv,  token is stored in MAPBOX_API_TOKEN. See `.env.example`.


## Project components:

- Geographic data store --> Geojson files in github repo directory
    - Shapefile data is easily available for most districts. Will need to collect/clean/standardize as GeoJSON
- Data processing system for taking a point (lat/long coords) and returning the boundaries it's part of. Uses [Turf.js](https://github.com/Turfjs/turf).
- Front end application
    - React
    - [react-map-gl](https://github.com/uber/react-map-gl). Poorly documented but powerful React binding for [Mapbox GL JS](https://www.mapbox.com/mapbox-gl-js/api/).
- Back end server using Postgres databsase
    - Based on http://mherman.org/blog/2016/03/13/designing-a-restful-api-with-node-and-postgres/#.WtP0J9PwaAw
    - Data wrangling scripts in /scripts folder
    - CORS handling: https://medium.com/trisfera/using-cors-in-express-cac7e29b005b

## Project structure

- app/ - Frontend React app
    - /components/ - React components
        - App.jsx - Wrapper
        - layers.js - config file for map layers
        - DataManager.js - non-display class for managing app data w/ Turf.js
            - handles lat/long within calculation
        - LocationForm.jsx - React component for entering location of interest
            - collects address, geocodes, passes to DataManager
        - DistrictMap.jsx - React component for displaying interest point inside appropriate boundaries
    - /css/
    - /js/ - Other JS files
    - /geodata/ - Geojson boundary data
- server/ - backend Express API app
- scripts - Scripts for data collection/processing (e.g. converting source shapefiles to geojson)
- source-data/ - Raw data for data processing scripts
- data/mt-vitality-metrics.bak - Text dump of Postgres database used to feed backend API (used for xfer)

## References:

Inspiration
- https://github.com/seattleio/boundaries-api
- https://github.com/seattleio/boundaries
- https://github.com/seattleio/seattle-boundaries-data
- https://github.com/mapbox/mapbox-react-examples

References for setting up react development environment with webpack/Babel:
- https://scotch.io/tutorials/setup-a-react-environment-using-webpack-and-babel
- https://stanko.github.io/webpack-babel-react-revisited/
- https://blog.jonathanargentiero.com/how-to-load-a-json-content-inside-a-js-module-with-webpack/
- https://github.com/ReactJSResources/react-webpack-babel
- https://webpack.js.org/guides/production/

Deployment references
- https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/deployment
- https://medium.freecodecamp.org/i-built-this-now-what-how-to-deploy-a-react-app-on-a-digitalocean-droplet-662de0fe3f48
- https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-16-04
- https://www.digitalocean.com/community/tutorials/how-to-set-up-nginx-server-blocks-virtual-hosts-on-ubuntu-16-04
- https://medium.com/@timmykko/deploying-create-react-app-with-nginx-and-ubuntu-e6fe83c5e9e7
- https://www.digitalocean.com/community/tutorials/how-to-backup-postgresql-databases-on-an-ubuntu-vps
- http://carrot.is/coding/nginx_introduction
- https://cressler.io/how-to-deploy-react-boilerplate-to-digital-ocean
- https://expressjs.com/en/guide/debugging.html
- https://www.digitalocean.com/community/tutorials/how-to-use-sftp-to-securely-transfer-files-with-a-remote-server
