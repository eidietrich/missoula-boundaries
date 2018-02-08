import React from 'react';

import DataManager from './../js/DataManager.js'

import LocationForm from './LocationForm.jsx';
import DistrictMap from './DistrictMap.jsx';

import './../css/app.css';

// Data import
// TODO: Find a cleaner way to import multiple datafiles?
// Eventually extract this to its own file
import mtHouseDistricts from './../geodata/mt-house-districts.geojson';

const layers = [
  // only one data layer for now
  {key: 'house-districts', label: 'MT House Districts', data: mtHouseDistricts}
];

/* Development dummy variables */

const dummyMapData = {
  latlng: [46.87292510231656,-113.99293899536133],
  districtShape: {
    "type":"Feature",
    "properties":{id: 'Dummy District'},
    "geometry":{"type":"Polygon","coordinates":[[[-114.16305541992188,46.765265193338],[-113.83621215820312,46.765265193338],[-113.83621215820312,46.95494930564661],[-114.16305541992188,46.95494930564661],[-114.16305541992188,46.765265193338]]]}
  },
  districtType: 'Dummy District',
  districtName: 'Missoula Dummy'
}


export default class App extends React.Component {
  constructor(props){
    super(props);
    this.dataManager = new DataManager(layers);
    this.state = {
      focusLatlng: null,
      mapsToRender: [],
    }

    this.handleNewLatLng = this.handleNewLatLng.bind(this);
  }

  componentDidMount(){
    // SET DUMMY DATA FOR TESTING
    this.setState({
      focusLatlng: dummyMapData.latlng,
      mapsToRender: this.dataManager.locatePointOnLayers(dummyMapData.latlng)
    })
  }

  render(){
    // console.log('rendering w/ state...', this.state)

    const isPointSelected = (this.state.focusLatLng != null)

    // build DistrictMap objects for as many boundaries as there are in state.mapsToRender
    const districtMaps = this.state.mapsToRender.map(map => {
      if (map.feature){
        return (
          <DistrictMap
            key={map.feature.properties.id}
            latlng={this.state.focusLatlng}
            districtShape={map.feature.geometry}
            districtType={map.label}
            districtName={map.feature.properties.id}
          />
        );
      }
    });

    return (
       <div className="app-container">
        <LocationForm
          isPointSelected={isPointSelected}
          handleNewLatLng={this.handleNewLatLng}
        />
        <div className="maps-container">
          {districtMaps}
        </div>
      </div>
    );
  }

  handleNewLatLng(latlng){
    const maps = this.dataManager.locatePointOnLayers(latlng);
    this.setState({
      focusLatlng: latlng,
      mapsToRender: maps
    });
  }
}