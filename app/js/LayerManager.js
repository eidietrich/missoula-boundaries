
/* LayerManager.js

Object for managing/parsing data layers

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

export default class LayerManager {
  constructor(layers){
    this.layers = layers;
  }

  getLayers(layerKeys){
    // null argument --> get all layers
    if (!layerKeys) return this.layers;

    // list of layer keys --> get some layers
    return this.layers
      .filter(layer => {
        return layerKeys.includes(layer.key)
      })
  }

  /* Internal functions */

  getContainingFeature(features, lnglat){
    // parses a geojson feature array (features) and return the feature (if any) that contains [lat, lng] coordinate

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

  locatePointOnLayers(lnglat, layers){
    const maps = layers.map(layer => {
      const features = layer.geodata.features;
      const containingFeature = this.getContainingFeature(features, lnglat)
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