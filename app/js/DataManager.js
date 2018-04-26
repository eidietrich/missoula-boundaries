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
  constructor(allLayers){
    this.allLayers = allLayers;
    this.showLayers = [];
  }

  setShowLayers(showLayerKeys){
    this.showLayers = this.allLayers
      .filter(layer => {
        return showLayerKeys.includes(layer.key)
      })
  }

  showAllLayers(){
    this.showLayers = this.allLayers;
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

  locatePointOnLayers(lnglat){
    const maps = this.showLayers.map(layer => {
      const features = layer.geodata.features;
      const containingFeature = this.getContainingFeature(features, lnglat)
      return {
        key: layer.key,
        label: layer.label,
        cssClass: layer.cssClass,
        loader: layer.loader, // routing for API call
        feature: containingFeature

      };

    });
    return maps;
  }

}