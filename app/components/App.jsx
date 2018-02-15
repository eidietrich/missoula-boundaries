import React from 'react';

import Dropdown from 'react-dropdown';

import DataManager from './../js/DataManager.js'

import LocationForm from './LocationForm.jsx';
import DistrictMap from './DistrictMap.jsx';

import layers from './../js/layers.js'

import './../css/app.css';
import './../css/control-container.css';
import './../css/react-dropdown.css';

// For initial app state config. May not be necessary depending on UI choices.
const initLayerKey = 'house-districts'
const initLnglat = [-113.99293899536133, 46.87292510231656,];

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
      focusLnglat: initLnglat,
      focusAddress: 'Placeholder spot',
      mapsToRender: this.dataManager.locatePointOnLayers(initLnglat),
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

        <h1>Montana Boundaries</h1>

        <div className="control-container">
          <div className="label">Location</div>
          {addressContainer}
          <LocationForm
            isPointSelected={isPointSelected}
            focusAddress={this.state.focusAddress}
            handleNewLocation={this.handleNewLocation}
          />

          <div className="label">Layer</div>
          <Dropdown
            options={layerOptions}
            onChange={this.handleLayerSelect}
            value={this.state.currentLayerLabel}
            placeholder={'Select layer'}
          />
        </div>

        {districtMap}

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