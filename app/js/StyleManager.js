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
  constructor(layers){
    this.defaultStyle = fromJS(defaultMapStyle);


    // location for new shape layers, beneath labels
    this.insertIndex = -3;

    this.addGeodataSources(layers);
    this.style = this.defaultStyle;
    // defaultStyle is constant, style changes

    this.addDisplayLayers(layers);
  }

  getStyle(){
    return this.style;
  }

  // This should happen every time the style in App is changed
  addDisplayLayers(layers){
    console.log('adl', layers);

    let mapStyles = [];

    layers.forEach(layer => {
      const fillStyle = layer.mapStyle && layer.mapStyle.fill;
      const lineStyle = layer.mapStyle && layer.mapStyle.line;

      if (fillStyle){
        mapStyles.push({
          sourceId: layer.key,
          order: fillStyle.order,
          type: 'fill',
          paintOpts: {
            'fill-color': fillStyle['fill-color'],
            'fill-opacity': fillStyle['fill-opacity']
          },
          filter: fillStyle.filter
        })
      }
      if (lineStyle){
        mapStyles.push({
          sourceId: layer.key,
          order: lineStyle.order,
          type: 'line',
          paintOpts: {
            'line-color': lineStyle['line-color'],
            'line-opacity': lineStyle['line-opacity'],
            'line-width': lineStyle['line-width']
          },
          filter: lineStyle.filter
        })
      }
    });

    mapStyles
      .sort((a,b) => a.order - b.order) // ascending
      .forEach(d => {
        this.addDisplayLayer(d.sourceId, d.type, d.paintOpts, d.filter);
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


  // This should happen once at construction
  addGeodataSources(layers){
    layers.forEach(layer => {
      this.addGeojsonSourceLayer(layer.geodata, layer.key)
    })
  }

  addGeojsonSourceLayer(featureCollection, id){
    this.defaultStyle = this.defaultStyle.setIn(['sources', id], {
      type: 'geojson',
      data: featureCollection,
    })
  }

}