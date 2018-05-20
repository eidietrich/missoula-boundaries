import { observable, action } from 'mobx';

import turfBbox from '@turf/bbox';
import WebMercatorViewport from 'viewport-mercator-project';

export default class MapStateStore {
  @observable viewport;
  @observable renderWidth;

  constructor(opts){
    this.defaultViewport = opts.defaultViewport;
    this.viewport = opts.defaultViewport;
    this.renderWidth = opts.defaultViewport.width;
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



}