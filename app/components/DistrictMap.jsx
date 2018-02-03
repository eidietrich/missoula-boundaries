/* DistrictMap.jsx

Component to render a specified location inside a geographic district.

Inputs:
 - props.latlng --> [lat, lng] coordinate pair of interest point
 - props.districtShape --> geojson district feature to plot on map
 - props.districtType --> string label for district type being mapped (e.g. 'House district')
 - props.districtName --> string id for district (e.g. 'House District 4')

Outputs:
 - Render container with district information and map with boundary and interest point plotted

*/

import React from 'react';

export default class DistrictMap extends React.Component {
  render(){
    return (
      <div className='map-container'>
        #TODO: DistrictMap
      </div>
    )
  }
}

