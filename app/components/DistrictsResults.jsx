import React from 'react';

import SchoolEnrollmentResults from './SchoolEnrollmentResults.jsx';
import PlacePopulationResults from './PlacePopulationResults.jsx';
import CountyPopulationResults from './CountyPopulationResults.jsx';

function apiCallback(key, data) {
  const stateUpdate = {};
  stateUpdate[key] = data;
  this.setState(stateUpdate);
}

export default class DistrictsResults extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      townPopulation: null,
      schoolEnrollment: null,
      countyPopulation: null,
    }
  }

  componentDidUpdate(prevProps){
    // Load new data if geographies have chanced
    const focusFeatures = this.props.focusFeatures;
    if (focusFeatures === prevProps.focusFeatures) return;
    this.loadData(focusFeatures);
  }

  loadData(focusFeatures){
    focusFeatures.forEach(layer => {
      if (layer.feature){
        layer.loader(layer.feature, apiCallback.bind(this));
      }
    })
  }

  getFeature(fromSet, key){
    return fromSet.find(d => d.key === key) &&
      fromSet.find(d => d.key === key).feature;
  }

  // Render methods
  // TODO: Consider breaking some of these out into separate components
  render(){
    // console.log('### results component', this.props, this.state)
    const focusFeatures = this.props.focusFeatures;
    const town = this.getFeature(focusFeatures, 'places')
    const school = this.getFeature(focusFeatures, 'schools-secondary')
    const reservation = this.getFeature(focusFeatures, 'reservations')
    const county = this.getFeature(focusFeatures, 'counties')

    const location = this.interpretLocation(town, county, reservation);

    return(
      <div className='results-container'>
        <h2>{location}</h2>
        {this.makeTownResults(town)}
        {this.makeSchoolResults(school)}
        {this.makeCountyResults(county)}
      </div>
    )
  }

  interpretLocation(town, county, reservation){
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

  makeTownResults(feature){
    if(!feature) return null;

    const population = this.state.townPopulation;

    const town = (
      <div className="geography-container town">
        <div className="geography-header">
          {feature.properties.id}
        </div>
        <div className="geography-metric-row">
          <PlacePopulationResults data={population} />
        </div>
      </div>
    );

    return town;
  }

  makeSchoolResults(feature){
    if(!feature) return null;

    const enrollment = this.state.schoolEnrollment;

    const school = (
      <div className="geography-container school">
        <div className="geography-header">
          {feature.properties.id}
        </div>
        <div className="geography-metric-row">
          <SchoolEnrollmentResults data={enrollment} />
        </div>
      </div>
    );

    return school;
  }

  makeCountyResults(feature){
    if(!feature) return null;
    const population = this.state.countyPopulation;

    const county = (
      <div className="geography-container county">
        <div className="geography-header">
          {feature.properties.id + ' County'}
        </div>
        <div className="geography-metric-row">
          <CountyPopulationResults data={population} />
          <CountyPopulationResults data={population} />
          <CountyPopulationResults data={population} />
        </div>
      </div>
    );

    return county;
  }
}