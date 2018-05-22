/*
Biz logic for MT Town vitality app


Map state stored in MapStateStore.js

*/

import { observable, computed, toJS } from 'mobx';

import { point, polygon } from '@turf/helpers';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';

export default class AppStateStore {
  @observable focusLnglat;
  @observable data;
  @observable activeLayerKeys;

  constructor(opts){
    this.focusLnglat = opts.focusLnglat;
    this.data = opts.data;
    this.layers = opts.layers;
    this.activeLayerKeys = opts.defaultLayerKeys;
  }

  @computed get activeLayers(){
    return this.layers
      .filter(layer => this.activeLayerKeys.includes(layer.key));
  }

  @computed get focusFeatures(){
    if (!this.focusLnglat) return [];

    return this._locatePointOnLayers(this.focusLnglat, this.layers)
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

  /* External functions */

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

}