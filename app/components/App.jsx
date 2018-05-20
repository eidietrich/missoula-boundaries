import React from 'react';
import { observer } from 'mobx-react';

import MapStateStore from './../stores/MapStateStore.js'

// for viewport management
import { FlyToInterpolator } from 'react-map-gl'
import turfBbox from '@turf/bbox';
import WebMercatorViewport from 'viewport-mercator-project';

import LayerManager from './../js/LayerManager.js';
import StyleManager from './../js/StyleManager.js';

import ResetButton from './ResetButton.jsx';
import TownPicker from './TownPicker.jsx';
import LayerPicker from './LayerPicker.jsx';

import DistrictMap from './DistrictMap.jsx';
import LocationResult from './LocationResult.jsx';
import DistrictsResults from './DistrictsResults.jsx';

import mtTowns from './../geodata/mt-places.geojson'; // Hacky/redundant import
import allLayers from './../js/layers.js'

import { detectWebGLsupport } from './../js/utils.js';

import './../css/app.css';
import './../css/control-container.css';
import './../css/map-container.css';
import './../css/results-containers.css';
import './../css/react-dropdown.css';

const defaultLayers = [
  'places',
  'schools-secondary',
  'reservations',
  'counties',
];

// initial state
const defaultState = {
  focusLnglat: null,
  focusFeatures: [],
  // mapViewport: {
  //   latitude: 46.75,
  //   longitude: -109.88,
  //   bearing: 0,
  //   pitch: 10,
  //   zoom: 4.75,
  //   minZoom: 4,
  //   maxZoom: 13,
  // },
  data: {
    townPopulation: null,
    schoolEnrollment: null,
    schoolTaxBase: null,
    countyPopulation: null,
    countyIncome: null,
  }
}

const defaultViewport = {
    latitude: 46.75,
    longitude: -109.88,
    bearing: 0,
    pitch: 10,
    zoom: 4.75,
    minZoom: 4,
    maxZoom: 13,
    width: 400,
    height: 300,
};

const mapState = new MapStateStore({
  defaultViewport: defaultViewport
});

@observer
export default class App extends React.Component {

  /* Lifecycle methods */

  constructor(props){
    super(props);
    this.layerManager = new LayerManager(allLayers);

    this.styleManager = new StyleManager(allLayers);

    this.webGLok = detectWebGLsupport();

    const defaults = JSON.parse(JSON.stringify(defaultState)) // deep clone

    const layers = this.layerManager.getLayers(defaultLayers);
    const mapStyle = this.styleManager.getStyleForLayers(layers);

    this.state = {
      focusLnglat: defaults.focusLnglat,
      focusFeatures: defaults.focusFeatures,
      layers: layers,
      showLayers: defaults.showLayers,
      // mapViewport: Object.assign(defaults.mapViewport, { width: 400, height: 300}),
      mapStyle: mapStyle,
      data: defaults.data,
    }
  }

  render(){
    // console.log('rendering w/ state...', this.state)
    const map = this.webGLok ? (
      <DistrictMap
          // Display data
          lnglat={this.state.focusLnglat}
          focusFeatures={this.state.focusFeatures}
          // Map state
          mapState={mapState}
          style={this.state.mapStyle}
          // Interaction handling
          // setViewport={this.setViewport.bind(this)}
          handleMapPointSelect={this.handleMapPointSelect.bind(this)}
      />): null;

    return (
      <div className="app-container">
        <h1>Montana Explorer</h1>

        <div className="control-container">
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

          <ResetButton
            onClick={this.reset.bind(this)}
          />
        </div>

        {map}

        <LocationResult
          focusFeatures={this.state.focusFeatures}
        />

        <DistrictsResults
          focusFeatures={this.state.focusFeatures}
          data={this.state.data}
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
    this.loadData(focusFeatures);

    this.setState({
      focusLnglat: lnglat,
      focusFeatures: focusFeatures,
    });
  }

  handleMapShapeSelect(location){
    const shape = location.shape;
    mapState.zoomToShape(shape);
    this.handleMapPointSelect(location);
  }

  reset(){
    // const defaultViewport = JSON.parse(JSON.stringify(defaultState.mapViewport))
    // this.setViewport(defaultViewport)
    mapState.resetViewport();
    this.setState({
      focusLnglat: null,
      focusFeatures: []
    })
  }

  /* Layer visibility management */

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
    const mapStyle = this.styleManager.getStyleForLayers(layers);
    const focusLnglat = this.state.focusLnglat;

    newState.layers = layers;
    newState.mapStyle = mapStyle;
    if (focusLnglat) {
      const focusFeatures = this.layerManager.locatePointOnLayers(focusLnglat, layers);
      this.loadData(focusFeatures);
      newState.focusFeatures = focusFeatures;

    }

    this.setState(newState)
  }

  /* Async data management */
  // TODO: Figure out how to refactor this away

  updateData(key, newValue){
    // Updates piece of data held in app state
    const newData = {};
    newData[key] = newValue;
    const update = Object.assign(this.state.data, newData)
    this.setState({ data: update });
  }

  loadData(focusFeatures){
    // loads data for set of focusFeature
    focusFeatures.forEach(layer => {
      if (layer.feature){
        layer.loader(layer.feature, this.updateData.bind(this));
      }
    })
  }

}