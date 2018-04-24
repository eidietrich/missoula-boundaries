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

  // Render methods
  // TODO: Consider breaking some of these out into separate components
  render(){
    // console.log('### results component', this.props, this.state)
    const focusFeatures = this.props.focusFeatures;
    const town =
      focusFeatures.find(d => d.key === 'places') &&
      focusFeatures.find(d => d.key === 'places').feature;
    const school =
      focusFeatures.find(d => d.key === 'schools-secondary') &&
      focusFeatures.find(d => d.key === 'schools-secondary').feature;
    const county =
      focusFeatures.find(d => d.key === 'counties') &&
      focusFeatures.find(d => d.key === 'counties').feature;

    const location = this.interpretLocation(town, county);

    return(
      <div>
        <h2>{location}</h2>
        {this.makeTownResults(town)}
        {this.makeSchoolResults(school)}
        {this.makeCountyResults(county)}
      </div>
    )
  }

  interpretLocation(town, county){
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
    return locationDescription;
  }

  makeTownResults(feature){
    if(!feature) return null;

    const population = this.state.townPopulation;

    const town = (
      <div>
        <h3>{feature.properties.id}</h3>
        <PlacePopulationResults data={population} />
      </div>
    );

    return town;
  }

  makeSchoolResults(feature){
    if(!feature) return null;

    const enrollment = this.state.schoolEnrollment;

    const school = (
      <div>
        <h3>{feature.properties.id}</h3>
        <SchoolEnrollmentResults data={enrollment} />
      </div>
    );

    return school;
  }

  makeCountyResults(feature){
    if(!feature) return null;
    const population = this.state.countyPopulation;

    const county = (
      <div>
        <h3>{feature.properties.id + ' County'}</h3>
        <CountyPopulationResults data={population} />
      </div>
    );

    return county;
  }
}