/* DistrictMap.jsx

Component to render a specified location inside a geographic district.

Inputs:
 - props.lnglat --> [lng, lat] coordinate pair of interest point
 - props.districtFeature --> single geojson-format district feature to plot on map
 - props.districtType --> string label for district type being mapped (e.g. 'House district')
 - props.districtName --> string id for district (e.g. 'House District 4')
 - props.districts --> geojson FeatureCollection of all districts in current layer

Outputs:
 - Render container with district information and map with boundary and interest point plotted

NOTES/POSSIBLE GOTCHAS:
- Depending on input library requirements, props.districtShape may or may not be appropriate format. Check whether library expects a geojson {type: "Feature"} or {type: "FeatureCollection"} (props.districtShape is supplied as {type: "Feature" currently})
- Some geomapping systems assume [lat, lng] for coordinates, others [lng, lat]. Make sure props.latlng is in the order the mapping library expects.

*/

import React from 'react';
import ReactMapGL, { SVGOverlay, FlyToInterpolator } from 'react-map-gl';
import turfBbox from '@turf/bbox';
import WebMercatorViewport from 'viewport-mercator-project';


import './../css/mapbox-gl.css';

/* Hoist this reference? */
import mapStyle from './../js/map-style.js';
import defaultMapStyle from './../map-style-basic-v8.json';

import mtTowns from './../geodata/mt-places.geojson';
import mtHighSchools from './../geodata/mt-hs-districts.geojson';
import mtCounties from './../geodata/mt-counties.geojson';

const mapAspect = 0.65;

export default class DistrictMap extends React.Component {
  constructor(props){
    // NOTE: Component is being rebuilt every time App.jsx gets a new data layer selected
    super(props)
    this.state = {
      viewport: {
        latitude: props.lnglat[1],
        longitude: props.lnglat[0],
        zoom: 8,
        width: 400,
        height: 300,
      },
      style: mapStyle,
    }
    this._onViewportChange = this._onViewportChange.bind(this);
  }

  componentDidMount(){
    window.addEventListener('resize', this._setSize.bind(this));
    this._setSize();
  }

  componentWillUnmount(){
    console.log('unmounting map');
    window.removeEventListener('resize', this._setSize.bind(this));
  }

  _setSize(){
    // adjusts map display width to match container width
    let { clientHeight, clientWidth } = this.refs['map-container']
    const viewport = Object.assign(this.state.viewport, {
      width: clientWidth,
      height: clientWidth * mapAspect,
    })
    this.setState({
      viewport: viewport
    })
  }

  _setBounds(shape){
    // Sets map center point / zoom scale to fit shape
    let { clientHeight, clientWidth } = this.refs['map-container']
    const vpHelper = new WebMercatorViewport({
      width: clientWidth,
      height: clientHeight,
    });

    // TODO: Figure out how to avoid redundancy with _setSize
    // BUG: calling this in componentDidMount sets to pre _setSize() viewport shape

    const bbox = turfBbox(shape);
    const bounds = vpHelper.fitBounds(
      [[bbox[0], bbox[1]],[bbox[2],bbox[3]]],
      {padding: 50}
      );

    this._setViewport({
      zoom: bounds.zoom,
      latitude: bounds.latitude,
      longitude: bounds.longitude,
    })
  }

  _setViewport({longitude, latitude, zoom}){
    const viewport = Object.assign(this.state.viewport,
      {
        longitude: longitude,
        latitude: latitude,
        zoom: zoom,
        transitionInterpolator: new FlyToInterpolator(),
        transitionDuration: 400,
      })
    this.setState({ viewport })
  }

  _onViewportChange(newViewport){
    this.setState({
      viewport: newViewport
    });
  }
  _onHover(event) {
    // TODO: Figure out how to setup mouseover effects
  }
  _onClick(event){
    const latlng = event.lngLat
    const address = `(${latlng[0]},${latlng[1]})`
    this.props.handleNewLocation({
      lnglat: latlng,
      address: address
    })

  }

  /* Render methods */

  render(){
    const isDistrictToRender = this.props.districtFeature != null;

    const labels = (
      <div className='map-label-container'>
        <div className='label-district-name'>
          {this.props.districtName}
        </div>
      </div>
    )

    const focusDistrict = isDistrictToRender ? (
      <SVGOverlay redraw={(opt) => {
        return this.buildShape(opt, this.props.districtFeature, 'district-feature')
      }} />
    ) : null ;

    const markerOverlay = (
      <SVGOverlay redraw={(opt) => {
        return this.buildMarker(opt, this.props.lnglat)
      }} />
    );

    return (
      <div className='map-container' ref='map-container'>
        {labels}
        <button onClick={() => this.zoomToStreetLevel()}>Street level</button>
        <button onClick={() => this.zoomToFit()}>Fit district</button>
        <ReactMapGL
          {...this.state.viewport}
          mapboxApiAccessToken={process.env.MAPBOX_API_TOKEN}
          mapStyle={this.state.style}
          onViewportChange={this._onViewportChange}
          // onHover={this._onHover}
          onClick={this._onClick.bind(this)}
        >
          {focusDistrict}
          {markerOverlay}
        </ReactMapGL>
      </div>
    );
  }


  buildShape(opt, feature, className){
    const coordinates = feature.geometry.coordinates;
    const pathCoords = coordinates[0].map(coord => opt.project(coord))
    const d = 'M' + pathCoords.join(" ")
    return (<g key={feature.properties.id}><path className={className} d={d} /></g>);
  }

  buildMarker(opt, lngLat){
    const coord = this.props.lnglat;
    const p = opt.project([coord[0], coord[1]]);
    return (
      <g transform={'translate(' + p[0] + ',' + p[1] + ')'}>
        <circle
          className='point-marker'
          r={8}
        />
      </g>
    );
  }

  /* Interaction handlers */

  zoomToStreetLevel(){
    this._setViewport({
      zoom: 14,
      latitude: this.props.lnglat[1],
      longitude: this.props.lnglat[0],
    })
  }

  zoomToFit(){
    this._setBounds(this.props.districtFeature);
  }
}
