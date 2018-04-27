// Data import

// GEODATA

// import mtHouseDistricts from './../geodata/mt-house-districts.geojson';
// import mtSenateDistricts from './../geodata/mt-senate-districts.geojson';
// import mtElemSchools from './../geodata/mt-elem-districts.geojson';
import mtHighSchools from './../geodata/mt-hs-districts.geojson';
import mtTowns from './../geodata/mt-places.geojson';
import mtReservations from './../geodata/mt-reservations.geojson';
import mtCounties from './../geodata/mt-counties.geojson';

import dataLoaders from './data-loaders.js';
import dataDisplayers from './data-displayers.js';


/*

Idea is to set up a data structure that
- [x] works with DataManager.js,
- [x] feeds into DistrictMap focusFeatures,
- [x] tells DistrictResults.jsx which values to display
- [ ] enables a toggle layer on/off state functionality

# Layer specification
- key
- label
- cssClass - key used for style bindings
- geodata - geojson feature collection
- loader - function for making API calls to pull in feature-related data
- displayer - function for rendering results from feature (is it redundant with loader?)
- mapStyle - style for rendering on mapBox map (note that these are passed through StyleManager.js, so new style conditions may not propogate unless they're handled there).


See https://github.com/uber/react-map-gl/blob/master/docs/get-started/adding-custom-data.md

*/

const layers = [
  {
    key: 'places',
    label: 'Towns',
    cssClass: 'town', // for highlight
    geodata: mtTowns,
    loader: dataLoaders.loadTownData,
    displayer: dataDisplayers.makeTownResults,
    mapStyle: {
      fill: {
        'order': 9,
        'fill-color': '#ff7f00',
        'fill-opacity': 0.3
      },
      line: {
        'order': 10,
        'line-color': '#ff7f00',
        'line-opacity': 0.9,
        'line-width' : {
          'base': 2,
          'stops': [[4, 1],[13, 3]]
        },
        'filter' : ['in', 'type', 'city', 'town'],
      }
    }
  },
  {
    key: 'schools-secondary',
    label: 'High School Districts',
    cssClass: 'school',
    geodata: mtHighSchools,
    loader: dataLoaders.loadSchoolData,
    displayer: dataDisplayers.makeSchoolResults,
    mapStyle: {
      fill: {
        'order': 3,
        'fill-color': '#666',
        'fill-opacity': 0.05
      },
      line: {
        'order': 4,
        'line-color': '#ffff33',
        'line-opacity': 0.5,
        'line-width' : {
          'base': 2,
          'stops': [[4, 1],[13, 8]]
        }
      }
    }
  },
  {
    key: 'reservations',
    label: 'American Indian Reservations',
    cssClass: 'reservation',
    geodata: mtReservations,
    loader: dataLoaders.loadReservationData,
    displayer: dataDisplayers.makeReservationResults,
    mapStyle: {
      fill: {
        'order': 2,
        'fill-color': '#f781bf',
        'fill-opacity': 0.2
      },
      line: null,
    }
  },
  {
    key: 'counties',
    label: 'Counties',
    cssClass: 'county',
    geodata: mtCounties,
    loader: dataLoaders.loadCountyData,
    displayer: dataDisplayers.makeCountyResults,
    mapStyle: {
      fill: {
        'order': 1,
        'fill-color': '#666',
        'fill-opacity': 0.05
      },
      line: {
        'order': 5,
        'line-color': '#e41a1c',
        'line-opacity': 0.5,
        'line-width' : {
          'base': 2,
          'stops': [[4, 1],[13, 8]]
        },
      }
    }
  },
]

export default layers;