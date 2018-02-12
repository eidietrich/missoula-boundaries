import React from 'react';

import Dropdown from 'react-dropdown';

import DataManager from './../js/DataManager.js'

import LocationForm from './LocationForm.jsx';
import DistrictMap from './DistrictMap.jsx';

import './../css/react-dropdown.css';
import './../css/app.css';

// Data import
// TODO: Find a cleaner way to import multiple datafiles?
// Eventually extract this to its own file
import mtHouseDistricts from './../geodata/mt-house-districts.geojson';
import mtSenateDistricts from './../geodata/mt-senate-districts.geojson';

const layers = [
  // only one data layer for now
  {key: 'house-districts', label: 'Montana House Districts', data: mtHouseDistricts},
  {key: 'senate-districts', label: 'Montana Senate Districts', data: mtSenateDistricts}
];

/* Development dummy variables */

const dummyMapData = {
  lnglat: [-113.99293899536133, 46.87292510231656,],
  districtShape: {
    "type":"Feature",
    "properties":{id: 'Dummy District'},
    "geometry":{"type":"Polygon","coordinates":[[[-114.16305541992188,46.765265193338],[-113.83621215820312,46.765265193338],[-113.83621215820312,46.95494930564661],[-114.16305541992188,46.95494930564661],[-114.16305541992188,46.765265193338]]]}
  },
  districtType: 'Dummy District',
  districtName: 'Missoula Dummy'
}

const initLayerKey = 'house-districts'


export default class App extends React.Component {
  constructor(props){
    super(props);
    this.dataManager = new DataManager(layers);
    this.state = {
      focusLnglat: null,
      focusAddress: null,
      mapsToRender: [],
      currentLayerKey: null,
      currentLayerLabel: null,
    }

    this.handleNewLocation = this.handleNewLocation.bind(this);
    this.handleLayerSelect = this.handleLayerSelect.bind(this);
  }

  componentDidMount(){
    // SET DUMMY DATA
    // TODO: Think through what initial app state should be
    this.setState({
      focusLnglat: dummyMapData.lnglat,
      mapsToRender: this.dataManager.locatePointOnLayers(dummyMapData.lnglat),
      currentLayerKey: initLayerKey,
      currentLayerLabel: this._getLayerLabel(initLayerKey),
    })
  }

  render(){
    console.log('rendering w/ state...', this.state)

    const isPointSelected = (this.state.focusLnglat != null)

    // build DistrictMap for boundaries in current layer
    const layerOptions = layers.map(layer => {
      return {
        value: layer.key,
        label: layer.label
      }
    });

    const renderMap = this.state.mapsToRender.filter(map => map.key === this.state.currentLayerKey)[0];// filter returns an array
    const districtMap = renderMap ? (
        <DistrictMap
          key={renderMap.feature.properties.id}
          lnglat={this.state.focusLnglat}
          districtFeature={renderMap.feature}
          districtType={renderMap.label}
          districtName={renderMap.feature.properties.id}
        />
      ) : null;

    const addressContainer = this.state.focusAddress ? (
        <div className="address-container">
          {this.state.focusAddress}
        </div>
      ) : null;

    return (
       <div className="app-container">
        <LocationForm
          isPointSelected={isPointSelected}
          handleNewLocation={this.handleNewLocation}
        />
        {addressContainer}

        <div className="label">Select layer</div>
        <Dropdown
          options={layerOptions}
          onChange={this.handleLayerSelect}
          value={this.state.currentLayerLabel}
          placeholder={'Select layer'}
        />

        <div className="maps-container">
          {districtMap}
        </div>
      </div>
    );
  }

  _getLayerLabel(key){
    const curLayer = layers.filter(layer => {
      return layer.key === key;
    })[0];
    console.log(curLayer);
    return curLayer.label;
  }

  /* Interaction handlers */

  handleNewLocation(location){
    // pass location as {lnglat, address} object
    const lnglat = location.lnglat;
    const address = location.address;
    const maps = this.dataManager.locatePointOnLayers(lnglat);

    this.setState({
      focusLnglat: lnglat,
      focusAddress: address,
      mapsToRender: maps
    });
  }

  handleLayerSelect(e){
    this.setState({
      currentLayerKey: e.value,
      currentLayerLabel: this._getLayerLabel(e.value),
    })
  }
}