/* map-style.js

Custom Mapbox layer styling

See https://github.com/uber/react-map-gl/blob/master/docs/get-started/adding-custom-data.md

*/

// Static style
// import defaultMapStyle from './../map-style-basic-v8.json';
import defaultMapStyle from './../map-style-custom.json';

// Data for custom map layers
import mtHighSchools from './../geodata/mt-hs-districts.geojson';
import mtTowns from './../geodata/mt-places.geojson';
import mtCounties from './../geodata/mt-counties.geojson';

const style = JSON.parse(JSON.stringify(defaultMapStyle)); // deep clone

// location for new shape layers, beneath labels
const insertIndex = -3;


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
style.layers.splice(insertIndex, 0, {
  id: 'county-fill',
  source: 'schools',
  type: 'fill',
  paint: {
    'fill-color': '#ffff33',
    'fill-opacity': 0.05,
  },
  interactive: true
});

style.layers.splice(insertIndex, 0, {
  id: 'school-lines',
  source: 'schools',
  type: 'line',
  paint: {
    'line-color': '#ffff33',
    'line-opacity': 0.9,
    'line-width': {
      'base': 2,
      'stops': [
        [4, 1],
        [13, 8]
      ]
    }

  }
});

style.layers.splice(insertIndex, 0, {
  id: 'county-lines',
  source: 'counties',
  type: 'line',
  paint: {
    'line-color': '#e41a1c',
    'line-opacity': 0.9,
    'line-width': {
      'base': 2,
      'stops': [
        [4, 1],
        [13, 8]
      ]
    }
  }
});



style.layers.splice(insertIndex, 0, {
  id: 'town-fill',
  source: 'towns',
  type: 'fill',
  paint: {
    'fill-color': '#ff7f00',
    'fill-opacity': 0.3,
  },
  interactive: true
});

style.layers.splice(insertIndex, 0, {
  id: 'town-lines',
  source: 'towns',
  type: 'line',
  paint: {
    'line-color': '#ff7f00',
    'line-opacity': 0.9,
    'line-width': {
      'base': 2,
      'stops': [
        [4, 1],
        [13, 3]
      ]
    }
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