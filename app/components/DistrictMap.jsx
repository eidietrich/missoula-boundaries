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

import ReactMapGL, { SVGOverlay } from 'react-map-gl'

import './../css/mapbox-gl.css';

const mapAspect = 0.65;

const markerShape = "M0-18.9c-2.6,0-4.7,2.1-4.7,4.7c0,0.9,1.1,3.6,1.7,5.3L0,0l3-8.9c0,0,1.7-4.2,1.7-5.3C4.7-16.8,2.6-18.9,0-18.9z M0-12.6c-0.9,0-1.5-0.7-1.5-1.5s0.7-1.5,1.5-1.5s1.5,0.7,1.5,1.5S0.9-12.6,0-12.6z";



export default class DistrictMap extends React.Component {

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

    this.props.setViewport({
      width: clientWidth,
      height: clientWidth * mapAspect,
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
          onViewportChange={this._onViewportChange.bind(this)}
          onClick={this._onClick.bind(this)}
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
    return (
      <g transform={'translate(' + p[0] + ',' + p[1] + '), scale(1)'}>
        <circle
          className='point-marker-icon-shadow'
          cx={0} cy={0} r={8}
          transform='scale(1,0.5)' />
        <path
          className='point-marker-icon'
          transform='scale(2)'
          d={markerShape}/>
      </g>
    );
  }
}
