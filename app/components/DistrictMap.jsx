/* DistrictMap.jsx

Component to render a specified location inside a geographic district.

Inputs:
 - props.latlng --> [lat, lng] coordinate pair of interest point
 - props.districtShape --> geojson-format district feature to plot on map
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
import mapStyle from './../map-style-basic-v8.json';

export default class DistrictMap extends React.Component {
  render(){
    const dummyOutputs = (
      <div>
        <div>#TODO: DistrictMap</div>
        <div>{'Type: ' + this.props.districtType}</div>
        <div>{'Name: ' + this.props.districtName}</div>
        <div>{'Focus Point: ' + this.props.lngLat}</div>
        <div>{'District Shape: ' + this.props.districtShape.coordinates}</div>
      </div>
    )

    // const MapboxMap = ReactMapboxGL({
    //   accessToken: process.env.MAPBOX_API_TOKEN
    // })

    // const customStyle = {
    //     version: 8,
    //     sources: {
    //         points: {
    //             type: 'geojson',
    //             data: {
    //                 type: 'FeatureCollection',
    //                 features: [
    //                     {type: 'Feature', geometry: {type: 'Point', coordinates: [-113.99293899536133, 46.87292510231656]}}
    //                 ]
    //             }
    //         }
    //     },
    //     layers: [
    //         {
    //             id: 'my-layer',
    //             type: 'circle',
    //             source: 'points',
    //             paint: {
    //                 'circle-color': '#f00',
    //                 'circle-radius': '4'
    //             }
    //         }
    //     ]
    // };

    return (
      <div className='map-container'>
        {dummyOutputs}
        <ReactMapGL
          mapboxApiAccessToken={process.env.MAPBOX_API_TOKEN}
          width={400}
          height={300}
          latitude={this.props.lngLat[1]}
          longitude={this.props.lngLat[0]}
          zoom={14}
          mapStyle={mapStyle}
        >
          <SVGOverlay
            redraw={(opt) => {
              const p1 = opt.project([this.props.lngLat[0], this.props.lngLat[1]]);
              return (
                <g>
                  <circle
                    style={{fill: 'white', opacity: 1, stroke: 'red', 'strokeWidth': '2px'}}
                    r={8}
                    transform={'translate(' + p1[0] + ',' + p1[1] + ')'}
                  />
                </g>
              )
            }}
          />
        </ReactMapGL>

      </div>
    );
  }
}
