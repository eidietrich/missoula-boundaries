/* MapStateStore.js

Store for map viewport and styling state.

Refs:
- https://github.com/uber/react-map-gl/blob/master/docs/get-started/adding-custom-data.md

*/

import { observable, action, computed, toJS } from 'mobx';

// For viewport management
import turfBbox from '@turf/bbox';
import WebMercatorViewport from 'viewport-mercator-project';

// For style management
import { Map, List, fromJS, concat } from 'immutable';
// array location for new shape layers, beneath labels
// different than order attribute for added layers
const insertIndex = -3;

export default class MapStateStore {
  // Viewport
  @observable viewport;
  @observable renderWidth; // map resizes to fit box

  // Styling
  @observable activeLayerKeys;

  constructor(opts){
    this.defaultViewport = opts.defaultViewport;
    this.viewport = opts.defaultViewport;
    this.renderWidth = opts.defaultViewport.width;

    // Style prep
    // Add data sources to defaultStyle once at initialization
    // Build display layers on call
    this.baseStyle = fromJS(opts.defaultStyle);
    this.addedSourceLayers = this._makeGeodataSources(opts.allLayers);
    this.baseStyle = this.baseStyle.mergeIn(['sources'], this.addedSourceLayers)
    this.allDisplayLayers = this._makeDisplayLayers(opts.allLayers)

    this.activeLayerKeys = opts.defaultLayerKeys;

    // this._addGeodataSources(opts.allLayers);
  }

  _makeGeodataSources(layers){
    const addedSources = {}
    layers.forEach(layer => {
      addedSources[layer.key] = Map({
        type: 'geojson',
        data: layer.geodata,
      })
    });
    console.log('sources', addedSources);
    return addedSources;
  }

  _makeDisplayLayers(layers){
    let addedStyleLayers = [];

    layers.forEach(layer => {
      const fillStyle = layer.mapStyle && layer.mapStyle.fill;
      const lineStyle = layer.mapStyle && layer.mapStyle.line;

      if (fillStyle){
        addedStyleLayers.push({
          sourceId: layer.key,
          order: fillStyle.order,
          type: 'fill',
          paintOpts: {
            'fill-color': fillStyle['fill-color'],
            'fill-opacity': fillStyle['fill-opacity']
          },
          filter: fillStyle.filter // true
        })
      }
      if (lineStyle){
        addedStyleLayers.push({
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
        // Hacky toJS here is because map style parser chokes on mobx array
      }
    });

    // sets render order
    addedStyleLayers
      .sort((a,b) => a.order - b.order)

    return List(addedStyleLayers);
  }

  @action
  resetViewport(){
    this.defaultViewport.width = this.renderWidth; // map updates to container width
    this.viewport = this.defaultViewport;
    // return this.viewport;
  }

  @action
  zoomToShape(shape){
    // expects geojson feature
    const vpHelper = new WebMercatorViewport({
      width: this.viewport.width,
      height: this.viewport.height,
    });

    const bbox = turfBbox(shape);
    const bounds = vpHelper.fitBounds(
      [[bbox[0], bbox[1]],[bbox[2],bbox[3]]],
      {padding: 100}
      );

    this.viewport = Object.assign(this.viewport, {
      zoom: bounds.zoom,
      latitude: bounds.latitude,
      longitude: bounds.longitude,
    })
  }

  // OLD CODE FROM WHEN THIS WAS HOSTED IN APP
  // ZOOMING
  // TODO: Re-add this

  // zoomViewport(newViewport){
  //   // setViewport with zoom animation
  //   const viewport = Object.assign(newViewport, {
  //     transitionInterpolator: new FlyToInterpolator(),
  //     transitionDelay: 500,
  //     transitionDuration: 1500,
  //   })
  //   this.setViewport(viewport)
  // }


  // Styling
  @computed get style(){
    console.log('base', this.baseStyle.toJS())
    const useStyles = this.allDisplayLayers.filter(l => this.activeLayerKeys.includes(l.sourceId))

    let style = this.baseStyle;

    useStyles.forEach(d => {
      const newLayer = {
        id: d.sourceId + '-' + d.type,
        source: d.sourceId,
        type: d.type,
        paint: d.paintOpts,
        interactive: true,
      };
      if (d.filter) newLayer.filter = d.filter;
      const newLayers = style.get('layers')
        .insert(insertIndex, Map(newLayer));
      style = style.set('layers', newLayers);
    });

    return style;
  }

}