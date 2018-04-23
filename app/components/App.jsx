import React from 'react';

import { FlyToInterpolator } from 'react-map-gl'
import turfBbox from '@turf/bbox';
import WebMercatorViewport from 'viewport-mercator-project';

import DataManager from './../js/DataManager.js'

import TownPicker from './TownPicker.jsx';
import DistrictMap from './DistrictMap.jsx';
import DistrictsResults from './DistrictsResults.jsx';

import mtTowns from './../geodata/mt-places.geojson'; // Hacky/redundant import
import layers from './../js/layers.js'
import mapStyle from './../js/map-style.js'; // Immutable.js object

import './../css/app.css';
import './../css/control-container.css';
import './../css/react-dropdown.css';

// initial state
const defaultState = {
  focusLnglat: null,
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

    const defaults = JSON.parse(JSON.stringify(defaultState)) // deep clone
    this.state = {
      focusLnglat: defaults.focusLnglat,
      readyToRenderMap: false,
      districts: {
        town: null,
        school: null,
        county: null,
      },
      mapViewport: Object.assign(defaults.mapViewport, { width: 400, height: 300}),
      mapStyle: mapStyle
    }
  }

  componentDidMount(){
    // Was previously necessary for some reason
    // this.setState({
    //   readyToRenderMap: true,
    // })
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
    // if (!this.state.readyToRenderMap) return null;
    // May no longer be necessary

    return (
      <DistrictMap
        // key={renderLayer.feature.properties.id}
        lnglat={this.state.focusLnglat}
        townFeature={this.state.districts.town}
        schoolFeature={this.state.districts.school}
        countyFeature={this.state.districts.county}

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
        districts={this.state.districts}
      />
    )
  }

  render(){
    // console.log('rendering w/ state...', this.state)
    return (
       <div className="app-container">
        <h1>How is your town doing?</h1>
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

    // const address = location.address;
    const maps = this.dataManager.locatePointOnLayers(lnglat);

    const districts = {
      town: maps.find(d => d.key === 'places').feature,
      school: maps.find(d => d.key === 'schools-secondary').feature,
      county: maps.find(d => d.key === 'counties').feature
    }

    this.setState({
      focusLnglat: lnglat,
      districts: districts
    });
  }

  // // THIS IS TOO LAGGY
  // handleMapHover(features){
  //   // features that are hovered over
  //   // console.log('map hover', features)

  //   // filter to town feature
  //   const town = features.find(d => d.layer.id === 'town-fill')
  //   if (town){
  //     // console.log(town.properties)
  //     this.setFilterValue('town-mouseover', town.properties.fips)
  //   } else {
  //     this.setFilterValue('town-mouseover', '')
  //   }

  // }

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
      districts: {
        town: null,
        school: null,
        county: null,
      },
      mapStyle: mapStyle
    })
  }

  // // Failed (for now) effort to render focus shapes with Mapbox styling
  // changeMapStyleColor(){
  //   // This produces a warning, trigers full map refresh
  //   // ImmutableJS is used as solution to this on examples

  //   const layerId = 'town-fill';
  //   const newColor = '#0000ff';

  //   this.changeMultipleFilters({
  //     'town': '04975',
  //     'school': '0369',
  //     'county': '30007',
  //   })

  //   // this.changeMapFillColor(layerId, newColor);
  //   // this.changeFilterValue('highlight-town-line', '04975')
  //   // this.changeFilterValue('highlight-school-district-line', '0369')
  //   // this.changeFilterValue('highlight-county-line', '30007')

  //   console.log('ddd');

  // }

  // changeMultipleFilters(newIds){
  //   const townLayerIndex = mapStyle.toJS().layers.findIndex(d => d.id === 'highlight-town-line', '04975')
  //   const schoolLayerIndex = mapStyle.toJS().layers.findIndex(d => d.id === 'highlight-school-district-line')
  //   const countyLayerIndex = mapStyle.toJS().layers.findIndex(d => d.id === 'highlight-county-line')

  //   let newMapStyle = this.state.mapStyle;
  //   newMapStyle = newMapStyle.setIn(['layers', townLayerIndex, 'filter', 2], newIds.town)
  //   newMapStyle = newMapStyle.setIn(['layers', schoolLayerIndex, 'filter', 2], newIds.school)
  //   newMapStyle = newMapStyle.setIn(['layers', countyLayerIndex, 'filter', 2], newIds.county)
  //   console.log('x', newMapStyle)
  //   this.setState({
  //     mapStyle: newMapStyle
  //   })
  // }

  // changeMapFillColor(layerId, color){
  //   const layerIndex = mapStyle.toJS().layers.findIndex(d => d.id === layerId)
  //   this.setState({
  //     mapStyle: this.state.mapStyle.setIn(['layers', layerIndex, 'paint', 'fill-color'], color)
  //   })
  // }

  setFilterValue(layerId, newFilterId){
    console.log(layerId, newFilterId)
    const layerIndex = mapStyle.toJS().layers.findIndex(d => d.id === layerId)
    this.setState({
      mapStyle: this.state.mapStyle.setIn(['layers', layerIndex, 'filter', 2], newFilterId)
    })
  }

}