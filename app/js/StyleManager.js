/* StyleManager.js

Object for managing mapbox layer styling

https://github.com/uber/react-map-gl/blob/master/docs/get-started/adding-custom-data.md

*/

import { fromJS } from 'immutable';

import defaultMapStyle from './../map-style-custom.json';

// Data for custom map layers
import mtHighSchools from './../geodata/mt-hs-districts.geojson';
import mtTowns from './../geodata/mt-places.geojson';
import mtCounties from './../geodata/mt-counties.geojson';
import mtReservations from './../geodata/mt-reservations.geojson';

export default class StyleManager {
  constructor(){
    this.defaultStyle = fromJS(defaultMapStyle);
    this.style = this.defaultStyle;

    // location for new shape layers, beneath labels
    this.insertIndex = -3;

    this.addGeojsonSourceLayer(mtTowns, 'towns')
    this.addGeojsonSourceLayer(mtHighSchools, 'schools')
    this.addGeojsonSourceLayer(mtCounties, 'counties')
    this.addGeojsonSourceLayer(mtReservations, 'reservations')

    this.addDisplayLayer('counties','fill', {
      'fill-color': '#666',
      'fill-opacity': 0.05,
    })
    this.addDisplayLayer('reservations','fill', {
      'fill-color': '#f781bf',
      'fill-opacity': 0.2,
    })
    this.addDisplayLayer('schools','fill', {
      'fill-color': '#666',
      'fill-opacity': 0.05,
    })
    this.addDisplayLayer('schools','line', {
      'line-color': '#ffff33',
      'line-opacity': 0.5,
      'line-width': {
        'base': 2,
        'stops': [
          [4, 1],
          [13, 8]
        ],
      }
    });
    this.addDisplayLayer('counties','line', {
      'line-color': '#e41a1c',
      'line-opacity': 0.5,
      'line-width': {
        'base': 2,
        'stops': [
          [4, 1],
          [13, 8]
        ]
      }
    });

    this.addDisplayLayer('towns','fill', {
      'fill-color': '#ff7f00',
      'fill-opacity': 0.3,
    })
    this.addDisplayLayer('towns','line', {
      'line-color': '#ff7f00',
      'line-opacity': 0.9,
      'line-width': {
        'base': 2,
        'stops': [
          [4, 1],
          [13, 3]
        ]
      }
    }, ['in', 'type', 'city', 'town']);
  }

  getStyle(){
    return this.style;
  }

  addGeojsonSourceLayer(featureCollection, id){
    this.style = this.style.setIn(['sources', id], {
      type: 'geojson',
      data: featureCollection,
    })
  }

  addDisplayLayer(sourceId, type, paintOpts, filter=null){
    const newLayer = {
      id: sourceId + '-' + type,
      source: sourceId,
      type: type,
      paint: paintOpts,
      interactive: true,
    }
    if (filter) newLayer.filter = filter;

    const newLayers = this.style.get('layers').insert(this.insertIndex, newLayer)
    this.style = this.style.set('layers', newLayers)
  }

}