/* map-style.js

Custom Mapbox layer styling

See https://github.com/uber/react-map-gl/blob/master/docs/get-started/adding-custom-data.md

*/

// Static style
import defaultMapStyle from './../map-style-basic-v8.json';

// Data for custom map layers
import mtHighSchools from './../geodata/mt-hs-districts.geojson';
import mtTowns from './../geodata/mt-places.geojson';
import mtCounties from './../geodata/mt-counties.geojson';

const style = JSON.parse(JSON.stringify(defaultMapStyle)); // deep clone

// Add data sources
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

// Custom styling
style.layers.push({
  id: 'school-lines',
  source: 'schools',
  type: 'line',
  paint: {
    'line-color': '#ffff33',
    'line-width': 1.5,
    'line-opacity': 0.9,
  }
});

style.layers.push({
  id: 'county-lines',
  source: 'counties',
  type: 'line',
  paint: {
    'line-color': '#e41a1c',
    'line-width': 2,
    'line-opacity': 0.9,
  }
});

// style.layers.push({
//   id: 'school-fill',
//   source: 'schools',
//   type: 'fill',
//   paint: {
//     'fill-color': '#ffff33',
//     'fill-opacity': 0.5,
//   },
//   interactive: true
// });

style.layers.push({
  id: 'town-fill',
  source: 'towns',
  type: 'fill',
  paint: {
    'fill-color': '#ff7f00',
    'fill-opacity': 0.3,
  },
  interactive: true
});

style.layers.push({
  id: 'town-lines',
  source: 'towns',
  type: 'line',
  paint: {
    'line-color': '#ff7f00',
    'line-width': 1.5,
    'line-opacity': 0.9,
  },
  filter: ['in', 'type', 'city', 'town'],
});

// FOR INTERACTION
// style.layers.push({
//   id: 'highlight-towns',
//   source: 'towns',
//   type: 'fill',
//   paint: {
//     'fill-color': '#111',
//     'fill-opacity': 0.1,
//   },
//   filter: ['in', 'id', '']
// })

export default style;