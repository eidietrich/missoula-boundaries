import React from 'react';

const markerShape = "M0-18.9c-2.6,0-4.7,2.1-4.7,4.7c0,0.9,1.1,3.6,1.7,5.3L0,0l3-8.9c0,0,1.7-4.2,1.7-5.3C4.7-16.8,2.6-18.9,0-18.9z M0-12.6c-0.9,0-1.5-0.7-1.5-1.5s0.7-1.5,1.5-1.5s1.5,0.7,1.5,1.5S0.9-12.6,0-12.6z";

function MapMarker(props) {
  return (
    <g transform={'translate(' + props.x + ',' + props.y + '), scale(1)'}>
      <circle
        className='point-marker-icon-shadow'
        cx={0} cy={0} r={8}
        transform='scale(1,0.5)' />
      <path
        className='point-marker-icon'
        transform='scale(2)'
        d={markerShape}/>
  </g>);
}

export default MapMarker;