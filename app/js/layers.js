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

*/

const layers = [
  {
    key: 'places',
    label: 'Towns',
    cssClass: 'town',
    geodata: mtTowns,
    loader: dataLoaders.loadTownData,
    displayer: dataDisplayers.makeTownResults,
  },
  {
    key: 'schools-secondary',
    label: 'High School Districts',
    cssClass: 'school',
    geodata: mtHighSchools,
    loader: dataLoaders.loadSchoolData,
    displayer: dataDisplayers.makeSchoolResults,
  },
  {
    key: 'reservations',
    label: 'American Indian Reservations',
    cssClass: 'reservation',
    geodata: mtReservations,
    loader: dataLoaders.loadReservationData,
    displayer: dataDisplayers.makeReservationResults,
  },
  {
    key: 'counties',
    label: 'Counties',
    cssClass: 'county',
    geodata: mtCounties,
    loader: dataLoaders.loadCountyData,
    displayer: dataDisplayers.makeCountyResults,
  },
]

export default layers;