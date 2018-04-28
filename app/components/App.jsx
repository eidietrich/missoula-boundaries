import React from 'react';

import { FlyToInterpolator } from 'react-map-gl'
import turfBbox from '@turf/bbox';
import WebMercatorViewport from 'viewport-mercator-project';

import LayerManager from './../js/LayerManager.js';
import StyleManager from './../js/StyleManager.js';

import TownPicker from './TownPicker.jsx';
import LayerPicker from './LayerPicker.jsx';
import DistrictMap from './DistrictMap.jsx';
import LocationResult from './LocationResult.jsx';
import DistrictsResults from './DistrictsResults.jsx';

import mtTowns from './../geodata/mt-places.geojson'; // Hacky/redundant import
import allLayers from './../js/layers.js'
// import mapStyle from './../js/map-style.js'; // Immutable.js object

import './../css/app.css';
import './../css/control-container.css';
import './../css/map-container.css';
import './../css/results-containers.css';
import './../css/react-dropdown.css';

const defaultLayers = [
  'places',
  // 'schools-secondary',
  // 'reservations',
  'counties',
];

// initial state
const defaultState = {
  focusLnglat: null,
  focusFeatures: [],
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
    this.layerManager = new LayerManager(allLayers);

    this.styleManager = new StyleManager(allLayers);

    const defaults = JSON.parse(JSON.stringify(defaultState)) // deep clone

    const layers = this.layerManager.getLayers(defaultLayers);
    const mapStyle = this.styleManager.getStyleForLayers(layers).toJS()

    this.state = {
      focusLnglat: defaults.focusLnglat,
      focusFeatures: defaults.focusFeatures,
      layers: layers,
      readyToRenderMap: false,
      showLayers: defaults.showLayers,
      mapViewport: Object.assign(defaults.mapViewport, { width: 400, height: 300}),
      mapStyle: mapStyle,
    }
  }

  render(){
    // console.log('rendering w/ state...', this.state)
    console.log('sty', this.state.mapStyle.sources, this.state.mapStyle.layers);
    return (
      <div className="app-container">
        <h1>Montana Explorer</h1>

        <div className="control-container">
          <div onClick={this.reset.bind(this)}>
            [RESET]
          </div>

          <LayerPicker
            layers={this.layerManager.getLayers()}
            activeLayers={this.state.layers}

            addActiveLayer={this.addActiveLayer.bind(this)}
            removeActiveLayer={this.removeActiveLayer.bind(this)}

          />
          <TownPicker
            options={mtTowns}
            handleChoice={this.handleMapShapeSelect.bind(this)}
          />
        </div>

        <DistrictMap
          // Display data
          lnglat={this.state.focusLnglat}
          focusFeatures={this.state.focusFeatures}
          // Map state
          viewport={this.state.mapViewport}
          style={this.state.mapStyle}
          // Interaction handling
          setViewport={this.setViewport.bind(this)}
          handleMapPointSelect={this.handleMapPointSelect.bind(this)}
        />

        <LocationResult
          focusFeatures={this.state.focusFeatures}
        />

        <DistrictsResults
          focusFeatures={this.state.focusFeatures}
        />

        <div className="respond-container">
          See something here that deserves a story? Let us know at <a href="mailto:">tkemail@placeholder.com</a>.
        </div>

      </div>
    );
  }

  /* Interaction handlers */

  handleMapPointSelect(location){
    const lnglat = location.lnglat;

    const focusFeatures = this.layerManager.locatePointOnLayers(lnglat, this.state.layers);

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

  addActiveLayer(key){
    let curLayerKeys = this.state.layers.map(d => d.key);
    curLayerKeys.push(key);
    this._setActiveLayers(curLayerKeys);
    this.setState({

    })
  }

  removeActiveLayer(key){
    let curLayerKeys = this.state.layers.map(d => d.key);
    curLayerKeys = curLayerKeys.filter(k => k !== key)
    this._setActiveLayers(curLayerKeys);
  }

  _setActiveLayers(layerKeys){
    const newState = {}

    const layers = this.layerManager.getLayers(layerKeys);
    const mapStyle = this.styleManager.getStyleForLayers(layers).toJS()
    const focusLnglat = this.state.focusLnglat;

    newState.layers = layers;
    newState.mapStyle = mapStyle;
    if (focusLnglat) {
      newState.focusFeatures = this.layerManager.locatePointOnLayers(focusLnglat, layers);
    }

    this.setState(newState)
  }

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