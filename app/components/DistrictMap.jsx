/* DistrictMap.jsx

Component to render a specified location inside a geographic district.

Inputs:
 - props.lngLat --> [lng, lat] coordinate pair of interest point
 - props.districtFeature --> single geojson-format district feature to plot on map
 - props.districtType --> string label for district type being mapped (e.g. 'House district')
 - props.districtName --> string id for district (e.g. 'House District 4')

Outputs:
 - Render container with district information and map with boundary and interest point plotted

TODO:
- Select a React-compatible mapping libary (Mapbox?), able to plot a geojson and point marker
- Wire everything up in this component (a test component is currently being fed dummy data in App.jsx)
- Polish formatting (in app.css or create districtMap.css file)

NOTES/POSSIBLE GOTCHAS:
- Depending on input library requirements, props.districtShape may or may not be appropriate format. Check whether library expects a geojson {type: "Feature"} or {type: "FeatureCollection"} (props.districtShape is supplied as {type: "Feature" currently})
- Some geomapping systems assume [lat, lng] for coordinates, others [lng, lat]. Make sure props.latlng is in the order the mapping library expects.

*/

import React from 'react';
import ReactMapGL, { SVGOverlay } from 'react-map-gl';

import './../css/mapbox-gl.css';
import defaultMapStyle from './../map-style-basic-v8.json';

export default class DistrictMap extends React.Component {
  constructor(props){
    // state.viewport controls map display
    super(props)
    this.state = {
      viewport: {
        latitude: props.lngLat[1],
        longitude: props.lngLat[0],
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
  }

  _setSize(){
    let { clientHeight, clientWidth } = this.refs['map-container']
    const viewport = Object.assign(this.state.viewport, {width: clientWidth})
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
    return (<g><path className={className} d={d} /></g>);
  }

  buildMarker(opt, lngLat){
    const coord = this.props.lngLat;
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

    const labels = (
      <div>
        <div>{'Type: ' + this.props.districtType}</div>
        <div>{'Name: ' + this.props.districtName}</div>
      </div>
    )

    const shapeOverlay = (
      <SVGOverlay redraw={(opt) => {
        return this.buildShape(opt, this.props.districtFeature, 'district-feature')
      }} />
    );

    const markerOverlay = (
      <SVGOverlay redraw={(opt) => {
        return this.buildMarker(opt, this.props.lngLat)
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
          {shapeOverlay}
          {markerOverlay}
        </ReactMapGL>

      </div>
    );
  }
}
