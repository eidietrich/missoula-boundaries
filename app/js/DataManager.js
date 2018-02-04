/* DataManager.js

Object for managing/parsing data

Expects:
  layers - array of geojson feature collections to be included

TODO:
- Select geoprocessing library
- Set up tests

NOTES:
- Spatial analysis w/ Turf.js: http://turfjs.org/docs

*/

import { point, polygon } from '@turf/helpers';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';

export default class DataManager {
  constructor(layers){
    this.layers = layers;
  }

  /* Internal functions */

  getContainingFeature(features, latlng){
    // parses a geojson feature array (features) and return the feature (if any) that contains [lat, lng] coordinate

    const lnglat = latlng.reverse();
    const pt = point(lnglat);
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

  locatePointOnLayers(latlng){
    const maps = this.layers.map(layer => {
      const features = layer.data.features;
      const containingFeature = this.getContainingFeature(features, latlng)
      return {
        key: layer.key,
        label: layer.label,
        feature: containingFeature
      };
    });
    return maps;
  }

  getLayers(){
    return this.layers;
  }

}