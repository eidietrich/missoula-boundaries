import React from 'react';

import { FlyToInterpolator } from 'react-map-gl'
import turfBbox from '@turf/bbox';
import WebMercatorViewport from 'viewport-mercator-project';

import DataManager from './../js/DataManager.js';
import StyleManager from './../js/StyleManager.js';

import TownPicker from './TownPicker.jsx';
import DistrictMap from './DistrictMap.jsx';
import DistrictsResults from './DistrictsResults.jsx';

import mtTowns from './../geodata/mt-places.geojson'; // Hacky/redundant import
import layers from './../js/layers.js'
// import mapStyle from './../js/map-style.js'; // Immutable.js object

import './../css/app.css';
import './../css/control-container.css';
import './../css/results-containers.css';
import './../css/react-dropdown.css';

// initial state
const defaultState = {
  focusLnglat: null,
  focusFeatures: [],
  showLayers: [
    'places',
    'schools-secondary',
    'reservations',
    'counties',
  ],
  mapViewport: {
    latitude: 46.75,
    longitude: -109.88,
    bearing: 0,
    pitch: 10,
    zoom: 4.75,
    minZoom: 4,
    maxZoom: 13,
  }
}

export default class App extends React.Component {

  /* Lifecycle methods */

  constructor(props){
    super(props);
    this.dataManager = new DataManager(layers);
    this.dataManager.setShowLayers(defaultState.showLayers);

    this.styleManager = new StyleManager();

    const defaults = JSON.parse(JSON.stringify(defaultState)) // deep clone
    this.state = {
      focusLnglat: defaults.focusLnglat,
      focusFeatures: defaults.focusFeatures,
      readyToRenderMap: false,
      mapViewport: Object.assign(defaults.mapViewport, { width: 400, height: 300}),
      mapStyle: this.styleManager.getStyle().toJS(),
    }
  }

  /* Render functions */

  buildControlPanel(){
    // TODO: Find less hacky way to get town districts?
    return (
      <div className="control-container">
        <TownPicker
          options={mtTowns}
          handleChoice={this.handleMapShapeSelect.bind(this)}
        />
      </div>
    );
  }

  buildMap(){
    return (
      <DistrictMap
        lnglat={this.state.focusLnglat}
        focusFeatures={this.state.focusFeatures}

        viewport={this.state.mapViewport}
        style={this.state.mapStyle}

        setViewport={this.setViewport.bind(this)}
        handleMapPointSelect={this.handleMapPointSelect.bind(this)}
      />
    );
  }

  buildResults(){
    return (
      <DistrictsResults
        focusFeatures={this.state.focusFeatures}
      />
    )
  }

  render(){
    // console.log('rendering w/ state...', this.state)
    return (
       <div className="app-container">
        <h1>Montana Explorer</h1>
        <div
          onClick={this.reset.bind(this)}>
          [RESET]
        </div>

        {this.buildControlPanel()}
        {this.buildMap()}
        {this.buildResults()}

      </div>
    );
  }

  /* Interaction handlers */

  handleMapPointSelect(location){
    const lnglat = location.lnglat;

    const focusFeatures = this.dataManager.locatePointOnLayers(lnglat);

    this.setState({
      focusLnglat: lnglat,
      focusFeatures: focusFeatures,
    });
  }

  handleMapShapeSelect(location){
    const shape = location.shape;
    this.zoomToShape(shape);
    this.handleMapPointSelect(location);
  }

  setViewport(newViewport){
    const viewport = Object.assign(this.state.mapViewport, newViewport)
    this.setState({
      mapViewport: viewport
    })
  }

  zoomViewport(newViewport){
    // setViewport with zoom animation
    const viewport = Object.assign(newViewport, {
      transitionInterpolator: new FlyToInterpolator(),
      transitionDelay: 500,
      transitionDuration: 1500,
    })
    this.setViewport(viewport)
  }

  zoomToShape(shape){
    const vpHelper = new WebMercatorViewport({
      width: this.state.mapViewport.width,
      height: this.state.mapViewport.height,
    });

    const bbox = turfBbox(shape);
    const bounds = vpHelper.fitBounds(
      [[bbox[0], bbox[1]],[bbox[2],bbox[3]]],
      {padding: 100}
      );

    this.zoomViewport({
      zoom: bounds.zoom,
      latitude: bounds.latitude,
      longitude: bounds.longitude,
    })
  }
  //

  reset(){
    const defaultViewport = JSON.parse(JSON.stringify(defaultState.mapViewport))
    this.setViewport(defaultViewport)
    this.setState({
      focusLnglat: null,
      // mapStyle: this.styleManager.getStyle().toJS(),
      focusFeatures: []
    })
  }

}