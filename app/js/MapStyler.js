/* MapStyler.js

Object for managing Mapbox styling

*/

import mtHighSchools from './../geodata/mt-hs-districts.geojson';
import mtTowns from './../geodata/mt-places.geojson';
import mtCounties from './../geodata/mt-counties.geojson';

import defaultMapStyle from './../map-style-basic-v8.json';


const style = JSON.parse(JSON.stringify(defaultMapStyle)); // deep clone

style.sources['towns'] = {
      type: 'geojson',
      data: mtTowns,
    }
    style.sources['schools'] = {
      type: 'geojson',
      data: mtHighSchools,
    }
    style.sources['counties'] = {
      type: 'geojson',
      data: mtCounties,
    }

    style.layers.push({
      id: 'school-lines',
      source: 'schools',
      type: 'line',
      paint: {
        'line-color': '#00ff7f',
        'line-width': 1,
        'line-opacity': 0.6,
      }
    });

    style.layers.push({
      id: 'county-lines',
      source: 'counties',
      type: 'line',
      paint: {
        'line-color': '#ff007f',
        'line-width': 2,
        'line-opacity': 0.6,
      }
    });

    style.layers.push({
      id: 'school-fill',
      source: 'schools',
      type: 'fill',
      paint: {
        'fill-color': '#00ff7f',
        'fill-opacity': 0.1,
      }
    });

    style.layers.push({
      id: 'town-fill',
      source: 'towns',
      type: 'fill',
      paint: {
        // 'line-color': '#ff7f00',
        // 'line-width': 1,
        // 'line-opacity': 0.6,
        'fill-color': '#ff7f00',
        'fill-opacity': 0.3,
      }
    });

    style.layers.push({
      id: 'town-lines',
      source: 'towns',
      type: 'line',
      paint: {
        'line-color': '#ff7f00',
        'line-width': 1,
        'line-opacity': 0.6,
      }
    });

export default style;

// export default class MapStyler {
//   constructor(){
//     this.style = JSON.parse(JSON.stringify(defaultMapStyle)); // deep clone
//   }

//   buildStyle(){
//     this.style.sources['counties'] = {
//       type: 'geojson',
//       data: mtCounties,
//     }

//     this.style.sources['schoolDistricts'] = {
//       type: 'geojson',
//       data: mtHighSchools,
//     }

//     this.style.sources['towns'] = {
//       type: 'geojson',
//       data: mtTowns,
//     }

//     this.style.layers.push({
//       id: 'district-lines',
//       source: 'counties',
//       type: 'line',
//       paint: {
//         'line-color': '#ff7f00',
//         'line-width': 1,
//         'line-opacity': 0.6,
//       }
//     });

//     // this.style.layers.push({
//     //   id: 'counties-fill',
//     //   source: 'counties',
//     //   type: 'fill',
//     //   paint: {
//     //     'fill-color': '#ff7f00',
//     //     'fill-opacity': 0.3,
//     //   }
//     // })
//     // this.style.layers.push({
//     //   id: 'schoolDistricts-fill',
//     //   source: 'schoolDistricts',
//     //   type: 'fill',
//     //   paint: {
//     //     'fill-outline-color': '#eee',
//     //     'fill-color': '#ff007f',
//     //     'fill-opacity': 0.3,
//     //   }
//     // })
//     // this.style.layers.push({
//     //   id: 'towns-fill',
//     //   source: 'towns',
//     //   type: 'fill',
//     //   paint: {
//     //     'fill-outline-color': '#eee',
//     //     'fill-color': '#00ff7f',
//     //     'fill-opacity': 0.3,
//     //   }
//     // })

//     return this.style;

//   }

//   getDefault(){
//     return defaultMapStyle;
//   }


// }