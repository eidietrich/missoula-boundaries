import React from 'react';
import { observer } from 'mobx-react';

import { toJS } from 'mobx-react';

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
  styleLayers: allLayers,
  defaultLayerKeys: defaultLayerKeys,
  defaultViewport: defaultViewport,
  defaultStyle: defaultMapStyle,

});

// const mapState = new MapStateStore({
//   defaultViewport: defaultViewport,
//   defaultStyle: defaultMapStyle,
//   allLayers: allLayers,
//   defaultLayerKeys: defaultLayerKeys,
// });

@observer
export default class App extends React.Component {

  /* Lifecycle methods */

  constructor(props){
    super(props);

    this.webGLok = detectWebGLsupport();
  }

  render(){
    // console.log('rendering w/ state...', this.state)

    const map = this.webGLok ? (
      <DistrictMap
          // Display data
          lnglat={appState.focusLnglat}
          focusFeatures={appState.focusFeatures}
          // Map state
          mapState={appState}
          handleMapPointSelect={appState.handleMapPointSelect}
      />): null;

    return (
      <div className="app-container">
        <h1>Montana Explorer</h1>

        <div className="control-container">
          <LayerPicker
            layers={allLayers}
            activeLayers={appState.activeLayers}

            addActiveLayer={appState.addActiveLayer}
            removeActiveLayer={appState.removeActiveLayer}

          />
          <TownPicker
            options={mtTowns}
            handleChoice={appState.handleMapShapeSelect}
          />

          <ResetButton
            onClick={appState.reset}
          />
        </div>

        {map}

        <LocationResult
          focusFeatures={appState.focusFeatures}
        />
        <DistrictsResults
          focusFeatures={appState.focusFeatures}
          data={appState.data}
        />

        <div className="respond-container">
          See something here that deserves a story? Let us know at <a href="mailto:">tkemail@placeholder.com</a>.
        </div>

      </div>
    );
  }

}