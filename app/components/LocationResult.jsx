import React from 'react';

import MapMarker from './MapMarker.jsx';

export default class LocationResult extends React.Component {

  render(){
    const focusFeatures = this.props.focusFeatures;
    const town = this.getFeature(focusFeatures, 'places')
    const school = this.getFeature(focusFeatures, 'schools-secondary')
    const reservation = this.getFeature(focusFeatures, 'reservations')
    const county = this.getFeature(focusFeatures, 'counties')

    const location = this.interpretLocation(town, county, reservation);

    const marker = location ? (
      <svg width={20} height={30}>
        <g transform="scale(0.5) translate(20,55)">
          <MapMarker x={0} y={0} />
        </g>
      </svg>
    ): null;

    return <div className="results-location-header">
      {marker}
      {location}
    </div>
  }

  getFeature(fromSet, key){
    return fromSet.find(d => d.key === key) &&
      fromSet.find(d => d.key === key).feature;
  }

  interpretLocation(town, county, reservation){
    // Takes focus geographies and creates language description
    let locationDescription = null;

    if (town && county) {
      switch (town.properties.type){
        case 'city':
          locationDescription = `City of ${town.properties.id}`
          break;
        case 'town':
          locationDescription = `Town of ${town.properties.id}`
          break;
        case 'census place':
          locationDescription = `${town.properties.id} (unincorporated)`
          break;
        case 'consolidated city/county':
          locationDescription = `${town.properties.id} (consolidated city/county)`
      }
    } else if (county) {
      locationDescription = `Unincorporated ${county.properties.id} County`
    }

    if (reservation){
      const name = reservation.properties.id;
      locationDescription += ` (${name} Reservation)`
    }

    return locationDescription;
  }

}