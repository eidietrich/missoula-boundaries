import React from 'react';

import DataManager from './../js/DataManager.js'

import LocationForm from './LocationForm.jsx';
import DistrictMap from './DistrictMap.jsx';

import './../css/app.css';

// Data import
// TODO: Find a cleaner way to import multiple datafiles
// Maybe extract this to its own file
import mtHouseDistricts from './../geodata/mt-house-districts.geojson';

const layers = [
  // only one data layer for now
  {key: 'house-districts', label: 'MT House Districts', data: mtHouseDistricts}
];

export default class App extends React.Component {
  constructor(props){
    super(props);
    this.dataManager = new DataManager(layers);
    this.state = {
      focusLatlng: null,
      mapsToRender: [],
    }
  }

  render(){


    // build DistrictMap objects for as many boundaries as there are in state.mapsToRender
    const districtMaps = this.state.mapsToRender.map(map => {
      <DistrictMap
        latlng={this.state.focusLatlng}
        districtShape={map.feature}
        districtType={map.key}
        districtName={map.feature.properties.id}
      />
    })

    return (
       <div className="app-container">
        <LocationForm
          handleAddress={this.handleNewAddress}
        />
        <div className="maps-container">
          {districtMaps}
        </div>
      </div>
    );
  }

  handleNewAddress(address){
    const latlng = this.dataManager.geocodeAddress(address);
    const maps = this.dataManager.locateAddressOnLayers(latlng)
    this.setState({
      focusLatlng: latlng,
      mapsToRender: maps
    })
  }
}