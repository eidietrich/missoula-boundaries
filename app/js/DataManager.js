/* DataManager.js

Object for managing/parsing data

#TODO: Finish thinking through architecture here

Expects:
  layers - array of geojson feature collections to be included

*/

export default class DataManager {
  constructor(layers){
    this.layers = layers;
  }

  /* Internal functions */

  getContainingFeature(features, latlng){
    // parse a geojson feature collection (features) and return the feature (if any) that contains [lat, lng] coordinate
    // TODO: Figure out spatial library to use
    return null;
  }

  /* External functions */
  geocodeAddress(address){
    // interface with external API (Mapbox? Google?) to translate a string address into a [lat, lng] coordinate

    // Might make more sense to put this in LocationForm
  }

  locateAddressOnLayers(latlng){
    const maps = this.layers.map(layer => {
      const features = layer.data.features;
      const containingFeature = getContainingFeature(features, latlng)
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