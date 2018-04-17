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
      // highlightTown: null
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
  // _onHover(event) {
  //   // TODO: Figure out how to setup mouseover effects
  //   // THIS DOESN'T WORK
  //   if(event.features){
  //     // event.features.forEach(d => console.log(d))
  //     const town = event.features.find(d => d.layer.id === 'town-fill')
  //     const newStyle = JSON.parse(JSON.stringify(mapStyle))

  //     if (town){
  //       console.log('add highlight')
  //       newStyle.layers
  //         .find(d => d.id === 'highlight-towns')
  //         .filter[2] = town.properties.id
  //       this.setState({
  //         style: newStyle,
  //         highlightTown: town.properties.id
  //       })
  //     } else {
  //       console.log('clear highlight')
  //       newStyle.layers
  //         .find(d => d.id === 'highlight-towns')
  //         .filter[2] = ''
  //       this.setState({
  //         style: mapStyle,
  //         highlightTown: null
  //       })
  //     }
  //   }
  // }
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

    // const isDistrictToRender = this.props.districtFeature != null;

    // const labels = (
    //   <div className='map-label-container'>
    //     <div className='label-district-name'>
    //       {this.props.districtName}
    //     </div>
    //   </div>
    // )

    // console.log('t', this.props.townFeature)
    // console.log('s', this.props.schoolFeature)
    // console.log('c', this.props.countyFeature)

    const focusTown = this.props.townFeature ? (
      <SVGOverlay redraw={(opt) => {
        return this.buildShape(opt, this.props.townFeature, 'map-highlight town')
      }} />
    ) : null ;

    const focusSchool = this.props.schoolFeature ? (
      <SVGOverlay redraw={(opt) => {
        return this.buildShape(opt, this.props.schoolFeature, 'map-highlight school')
      }} />
    ) : null ;

    const focusCounty = this.props.countyFeature ? (
      <SVGOverlay redraw={(opt) => {
        return this.buildShape(opt, this.props.countyFeature, 'map-highlight county')
      }} />
    ) : null ;

    const markerOverlay = (
      <SVGOverlay redraw={(opt) => {
        return this.buildMarker(opt, this.props.lnglat)
      }} />
    );

    return (
      <div className='map-container' ref='map-container'>
        <ReactMapGL
          {...this.state.viewport}
          mapboxApiAccessToken={process.env.MAPBOX_API_TOKEN}
          mapStyle={this.state.style}
          onViewportChange={this._onViewportChange}
          // onHover={this._onHover.bind(this)}
          onClick={this._onClick.bind(this)}
        >
          {focusCounty}
          {focusSchool}
          {focusTown}
          {markerOverlay}
        </ReactMapGL>
      </div>
    );
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
