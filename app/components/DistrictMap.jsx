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

export default class DistrictMap extends React.Component {
  constructor(props){
    super(props);

    this._setSize = this._setSize.bind(this);
    this._onViewportChange = this._onViewportChange.bind(this);
    this._onClick = this._onClick.bind(this);

  }
  componentDidMount(){
    window.addEventListener('resize', this._setSize);
    this._setSize();
  }

  componentWillUnmount(){
    console.log('unmounting map');
    window.removeEventListener('resize', this._setSize);
  }

  _setSize(){
    // adjusts map display width to match container width/height
    let { clientHeight, clientWidth } = this.refs['map-container']

    this.props.setViewport({
      width: clientWidth,
      // height: clientWidth * mapAspect,
      height: clientHeight,
    })
  }

  _onViewportChange(newViewport){
    this.props.setViewport(newViewport)
  }

  _onClick(event){
    const latlng = event.lngLat;
    this.props.handleMapPointSelect({
      lnglat: latlng,
    })
  }

  /* Render methods */

  render(){

    const focusShapes = this.props.focusFeatures
      .slice().reverse() // slice to avoid mutation
      .map(d => {
        return this.makeHighlightFeature(d.feature, d.cssClass)
      });

    const markerOverlay = this.props.lnglat ? (
      <SVGOverlay redraw={(opt) => {
        return this.buildMarker(opt, this.props.lnglat)
      }} />
    ) : null;

    return (
      <div className='map-container' ref='map-container'>
        <ReactMapGL
          {...this.props.viewport}
          mapboxApiAccessToken={process.env.MAPBOX_API_TOKEN}
          mapStyle={this.props.style}
          onViewportChange={this._onViewportChange}
          onClick={this._onClick}
          dragRotate={false}
          attributionControl={true}
        >

          {markerOverlay}
          <div className="nav" style={navStyle}>
            <NavigationControl
              onViewportChange={this._onViewportChange}
              showCompass={false}
            />
          </div>
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
