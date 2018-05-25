/* DistrictMap.jsx

Component to render map with Mapbox style and specifi

Inputs:
  - props.lnglat --> [lng, lat] coordinate pair of interest point/marker
  - props.focusFeature --> array of features to map as geojson overlay boundaries
  - viewport - viewport control object
  - style - mapbox style (includes custom boundaries currrently)
  - setViewport - way to pass viewport changes up to viewport object
  - handleMapPointSelect - function for handling map click

Outputs:
 - Render container with district information and map with boundaries and interest point plotted


*/

import React from 'react';
import {observer} from "mobx-react";

import ReactMapGL, { SVGOverlay, NavigationControl } from 'react-map-gl'

import MapMarker from './MapMarker.jsx';

import './../css/mapbox-gl.css';

// const mapAspect = 0.65;

const navStyle = {
  position: 'absolute',
  top: 0,
  right: 0,
  padding: '10px'
};

@observer
export default class DistrictMap extends React.Component {
  constructor(props){
    super(props);

    this._setSize = this._setSize.bind(this);
    this._updateViewport = this._updateViewport.bind(this);
    this._onClick = this._onClick.bind(this);

  }
  componentDidMount(){
    window.addEventListener('resize', this._setSize);
    this._setSize();
  }

  componentWillUnmount(){
    // console.log('unmounting map');
    window.removeEventListener('resize', this._setSize);
  }

  _setSize(){
    // adjusts map display width to match container width/height
    let { clientHeight, clientWidth } = this.refs['map-container']
    this.props.appState.renderWidth = clientWidth;
    this._updateViewport({
      width: clientWidth,
      height: clientHeight
    })
  }

  _updateViewport(newViewport){
    const viewport = Object.assign(this.props.appState.viewport, newViewport)
    this.props.appState.viewport = viewport;
  }

  _onClick(event){
    const lnglat = event.lngLat;
    this.props.appState.handleMapPointSelect(lnglat)
  }

  /* Render methods */

  render(){
    // console.log('map props', this.props)
    const state = this.props.appState;

    const focusShapes = state.focusFeatures
      .slice().reverse() // slice to avoid mutation
      .map(d => {
        return this.makeHighlightFeature(d.feature, d.cssClass)
      });

    const markerOverlay = state.focusLnglat ? (
      <SVGOverlay redraw={(opt) => {
        return this.buildMarker(opt, state.focusLnglat)
      }} />
    ) : null;

    const zoom = (
      <div className="nav" style={navStyle}>
        <NavigationControl
          onViewportChange={this._updateViewport}
          showCompass={false}
        />
      </div>
    );

    return (
      <div className='map-container' ref='map-container'>
        <ReactMapGL
          {...this.props.appState.viewport}
          mapboxApiAccessToken={process.env.MAPBOX_API_TOKEN}
          mapStyle={state.style}
          onViewportChange={this._updateViewport}
          onClick={this._onClick}
          dragRotate={false}
          attributionControl={true}
        >
          {focusShapes}
          {markerOverlay}
        </ReactMapGL>
      </div>
    );
  }

  makeHighlightFeature(geo, cssClass){
    if (!geo) return null;
    return (
      <SVGOverlay key={cssClass} redraw={(opt) => {
        return this.buildShape(opt, geo, 'map-highlight ' + cssClass)
      }} />
    )
  }

  buildShape(opt, feature, className){
    const isMulti = feature.geometry.type === 'MultiPolygon'
    // Possible TODO - set up data import scripts so all shapes are multipolygons
    // OR refactor this

    if (!isMulti) {
      const coordinates = feature.geometry.coordinates;
      const pathCoords = coordinates[0].map(coord => opt.project(coord))
      const d = 'M' + pathCoords.join(" ")
      return (<g key={feature.properties.id}><path className={className} d={d} /></g>);
    } else {
      const coordinates = feature.geometry.coordinates;
      const paths = coordinates.map((shape, i) => {
        const pathCoords = shape[0].map(coord => {
          const projected = opt.project(coord)
          return projected;
        })
        const d = 'M' + pathCoords.join(" ")
        return (<path className={className} d={d} key={String(i)} />);
      })
      return (<g key={feature.properties.id}>
        {paths}
      </g>);
    }
  }

  buildMarker(opt, lnglat){
    const p = opt.project([lnglat[0], lnglat[1]]);
    return(<MapMarker x={p[0]} y={p[1]} />);
  }
}
