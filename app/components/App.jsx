import React from 'react';
import { observer } from 'mobx-react';

import AppStateStore from './../stores/AppStateStore.js';
import MapStateStore from './../stores/MapStateStore.js'

// for viewport management
import { FlyToInterpolator } from 'react-map-gl'
import turfBbox from '@turf/bbox';
import WebMercatorViewport from 'viewport-mercator-project';

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

import defaultMapStyle from './../map-style-custom.json';

const defaultLayerKeys = [
  'places',
  'schools-secondary',
  'reservations',
  'counties',
];

const defaultData = {
  townPopulation: null,
  schoolEnrollment: null,
  schoolTaxBase: null,
  countyPopulation: null,
  countyIncome: null,
};

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

const appState = new AppStateStore({
  focusLnglat: null,
  data: defaultData,
  layers: allLayers,
  defaultLayerKeys: defaultLayerKeys,
});

const mapState = new MapStateStore({
  defaultViewport: defaultViewport,
  defaultStyle: defaultMapStyle,
  allLayers: allLayers,
  defaultLayerKeys: defaultLayerKeys,
});

@observer
export default class App extends React.Component {

  /* Lifecycle methods */

  constructor(props){
    super(props);

    this.webGLok = detectWebGLsupport();

    this.handleMapPointSelect = this.handleMapPointSelect.bind(this)
    this.addActiveLayer = this.addActiveLayer.bind(this)
    this.removeActiveLayer = this.removeActiveLayer.bind(this)
    this.handleMapShapeSelect = this.handleMapShapeSelect.bind(this)
    this.reset = this.reset.bind(this)

    this.state = {
      data: defaultData
    }
  }

  render(){
    // console.log('rendering w/ state...', this.state)

    const map = this.webGLok ? (
      <DistrictMap
          // Display data
          lnglat={appState.focusLnglat}
          focusFeatures={appState.focusFeatures}
          // Map state
          mapState={mapState}
          handleMapPointSelect={this.handleMapPointSelect}
      />): null;

    return (
      <div className="app-container">
        <h1>Montana Explorer</h1>

        <div className="control-container">
          <LayerPicker
            layers={allLayers}
            activeLayers={appState.activeLayers}

            addActiveLayer={this.addActiveLayer}
            removeActiveLayer={this.removeActiveLayer}

          />
          <TownPicker
            options={mtTowns}
            handleChoice={this.handleMapShapeSelect.bind(this)}
          />

          <ResetButton
            onClick={this.reset}
          />
        </div>

        {map}

        <LocationResult
          focusFeatures={appState.focusFeatures}
        />

        <DistrictsResults
          focusFeatures={appState.focusFeatures}
          data={this.state.data}
        />

        <div className="respond-container">
          See something here that deserves a story? Let us know at <a href="mailto:">tkemail@placeholder.com</a>.
        </div>

      </div>
    );
  }

  /* Interaction handlers */
  // TODO: Move these down to approriate components

  handleMapPointSelect(location){
    appState.focusLnglat = location.lnglat;
    this.loadData(appState.focusFeatures);
  }

  handleMapShapeSelect(location){
    appState.focusLnglat = location.lnglat;
    mapState.zoomToShape(location.shape);
    this.loadData(appState.focusFeatures);
  }

  reset(){
    mapState.resetViewport();
    appState.focusLnglat = null;
  }

  /* Layer visibility management */

  addActiveLayer(key){
    let curLayerKeys = appState.activeLayerKeys.slice();
    curLayerKeys.push(key);
    this._setActiveLayers(curLayerKeys);
  }

  removeActiveLayer(key){
    let curLayerKeys = appState.activeLayerKeys.slice();
    curLayerKeys = curLayerKeys.filter(k => k !== key)
    this._setActiveLayers(curLayerKeys);
  }

  _setActiveLayers(layerKeys){
    // TODO: Work out how to avoid redundancy here
    mapState.activeLayerKeys = layerKeys;
    appState.activeLayerKeys = layerKeys;
    this.loadData(appState.focusFeatures);
  }

  /* Async data management */
  // TODO: Refactor this into DataStateStore component

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