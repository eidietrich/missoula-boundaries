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
  },
  interactive: true
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
  },
  interactive: true
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