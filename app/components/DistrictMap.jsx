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
import ReactMapGL, { SVGOverlay } from 'react-map-gl';
import turfBbox from '@turf/bbox';
import WebMercatorViewport from 'viewport-mercator-project';


import './../css/mapbox-gl.css';
import defaultMapStyle from './../map-style-basic-v8.json';

const mapAspect = 0.65;

export default class DistrictMap extends React.Component {
  constructor(props){
    // NOTE: Component is being rebuilt every time App.jsx gets a new data layer selected
    super(props)
    this.state = {
      viewport: {
        latitude: props.lnglat[1],
        longitude: props.lnglat[0],
        zoom: 14,
        width: 400,
        height: 300,
      },
    }
    this.mapStyle = defaultMapStyle;
    this._onViewportChange = this._onViewportChange.bind(this);
  }

  componentDidMount(){
    this._setSize();

    // This appears to fire whenever new props are supplied to DistrictMap.jsx
    // componentWillReceiveProps() seems cleaner, but doesn't work
    this._setBounds(this.props.districtFeature);
  }

  _setSize(){
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

    const bbox = turfBbox(shape);
    const bounds = vpHelper.fitBounds(
      [[bbox[0], bbox[1]],[bbox[2],bbox[3]]],
      {padding: 75}
      );
    // TODO: Figure out why this padding value has to be set so high to avoid clipping

    const viewport = Object.assign(this.state.viewport, {
        latitude: bounds.latitude,
        longitude: bounds.longitude,
        zoom: bounds.zoom,
      })

    this.setState({
      viewport: viewport
    })
  }

  _onViewportChange(newViewport){
    this.setState({
      viewport: newViewport
    });
  }

  buildShape(opt, feature, className){
    const coordinates = feature.geometry.coordinates;
    const pathCoords = coordinates[0].map(coord => opt.project(coord))
    const d = 'M' + pathCoords.join(" ")
    return (<g key={feature.properties.id}><path className={className} d={d} /></g>);
  }

  buildShapes(opt, features, className){
    const shapes = features.map(feature => this.buildShape(opt, feature, className));
    return (<g>{shapes}</g>)
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

  render(){
    const isLayerToDraw = this.props.districtFeature != null;

    const labels = (
      <div className='map-label-container'>
        <div className='label-district-name'>
          {this.props.districtName}
        </div>
      </div>
    )

    const focusDistrict = isLayerToDraw ? (
      <SVGOverlay redraw={(opt) => {
        return this.buildShape(opt, this.props.districtFeature, 'district-feature')
      }} />
    ) : null;
    // // Too processing intensive
    // const districts = (
    //   <SVGOverlay redraw={(opt) => {
    //     return this.buildShapes(opt, this.props.districts.features, 'districts')
    //   }} />
    // )

    const markerOverlay = (
      <SVGOverlay redraw={(opt) => {
        return this.buildMarker(opt, this.props.lnglat)
      }} />
    );

    return (
      <div className='map-container' ref='map-container'>
        {labels}
        <ReactMapGL
          {...this.state.viewport}
          mapboxApiAccessToken={process.env.MAPBOX_API_TOKEN}
          mapStyle={this.mapStyle}
          onViewportChange={this._onViewportChange}
        >
          {focusDistrict}
          {markerOverlay}
        </ReactMapGL>

      </div>
    );
  }
}
