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

export default class DistrictMap extends React.Component {
  render(){
    const dummyOutputs = (
      <div>
        <div>#TODO: DistrictMap</div>
        <div>{'Type: ' + this.props.districtType}</div>
        <div>{'Name: ' + this.props.districtName}</div>
        <div>{'Focus Point: ' + this.props.latlng}</div>
        <div>{'District Shape: ' + this.props.districtShape.geometry.coordinates}</div>
      </div>
    )

    return (
      <div className='map-container'>
        {dummyOutputs}
      </div>
    )
  }
}

