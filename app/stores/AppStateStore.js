/*
Biz logic for MT Town vitality app

*/

import { observable, computed, action, toJS } from 'mobx';

import { point, polygon } from '@turf/helpers';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';

// For viewport management
import turfBbox from '@turf/bbox';
import WebMercatorViewport from 'viewport-mercator-project';

// For style management
import { Map, List, fromJS, concat } from 'immutable';
const insertIndex = -3;

export default class AppStateStore {
  @observable focusLnglat;
  @observable data;
  @observable activeLayerKeys;

  // Map State
  @observable viewport;
  @observable renderWidth;

  constructor(opts){
    this.focusLnglat = opts.focusLnglat;
    this.data = opts.data;
    this.layers = opts.layers; // display layers
    this.activeLayerKeys = opts.defaultLayerKeys;

    this.defaultViewport = opts.defaultViewport;
    this.viewport = opts.defaultViewport;
    this.renderWidth = opts.defaultViewport.width;

    // Styling management
    this.baseStyle = fromJS(opts.defaultStyle);
    this.addedSourceLayers = this._makeGeodataSources(opts.styleLayers);
    this.baseStyle = this.baseStyle.mergeIn(['sources'], this.addedSourceLayers)
    this.allDisplayLayers = this._makeDisplayLayers(opts.styleLayers)

    // Handler bindings
    this._updateData = this._updateData.bind(this);
    this.handleMapPointSelect = this.handleMapPointSelect.bind(this);
    this.handleMapShapeSelect = this.handleMapShapeSelect.bind(this)
    this.addActiveLayer = this.addActiveLayer.bind(this)
    this.removeActiveLayer = this.removeActiveLayer.bind(this)
    this.reset = this.reset.bind(this)
  }


  @action
  loadData(){
    this.focusFeatures.forEach(layer => {
      if (layer.feature){
        layer.loader(layer.feature, this._updateData);
      }
    })
  }

  _updateData(key, newValue){
    this.data[key] = newValue;
  }

  @action
  handleMapPointSelect(lnglat){
    this.focusLnglat = lnglat;
    this.loadData();
  }

  @action
  handleMapShapeSelect(location){
    this.focusLnglat = location.lnglat;
    this.zoomToShape(location.shape);
    this.loadData();
  }

  @action
  addActiveLayer(key){
    const newLayerKeys = this.activeLayerKeys.concat([key]);
    this.activeLayerKeys = newLayerKeys;
    this.loadData();
  }

  @action
  removeActiveLayer(key){
    const newLayerKeys = this.activeLayerKeys
      .filter(k => k !== key);
    this.activeLayerKeys = newLayerKeys;
    this.loadData();
  }

  @action
  reset(){
    this.resetViewport();
    this.focusLnglat = null;
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

  @computed get activeLayers(){
    return this.layers
      .filter(layer => this.activeLayerKeys.includes(layer.key));
  }

  @computed get focusFeatures(){
    if (!this.focusLnglat) return [];

    return this._locatePointOnLayers(this.focusLnglat, this.layers)
  }

  @computed get style(){
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

  _setActiveLayers(layerKeys){
    this.activeLayerKeys = layerKeys;
    this.loadData()
  }

  _getContainingFeature(features, lnglat){
    // parses a geojson feature array (features) and return the feature (if any) that contains [lat, lng] coordinate

    const pt = point(toJS(lnglat));
    const withinFeatures = features.filter((f) => {
      return booleanPointInPolygon(pt, f)
    })

    if (withinFeatures.length > 1) {
      console.log('overlap!')
      return withinFeatures[0];
    } else if (withinFeatures.length === 1) {
      return withinFeatures[0];
    } else if (withinFeatures.length === 0) {
      return null;
    }
  }

  _locatePointOnLayers(lnglat, layers){
    const maps = layers.map(layer => {
      const features = layer.geodata.features;
      const containingFeature = this._getContainingFeature(features, lnglat)
      return {
        key: layer.key,
        label: layer.label,
        cssClass: layer.cssClass,
        loader: layer.loader, // routing for API calls
        displayer: layer.displayer, // instructions for result rendering
        feature: containingFeature,
      };
    });
    return maps;
  }

  // Layer style management
  _makeGeodataSources(layers){
    const addedSources = {}
    layers.forEach(layer => {
      addedSources[layer.key] = Map({
        type: 'geojson',
        data: layer.geodata,
      })
    });
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
}