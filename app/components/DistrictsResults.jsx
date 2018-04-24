import React from 'react';

import SchoolEnrollmentResults from './SchoolEnrollmentResults.jsx';
import PlacePopulationResults from './PlacePopulationResults.jsx';
import CountyPopulationResults from './CountyPopulationResults.jsx';

const API_URL = process.env.API_URL || '';

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
    const focusFeatures = this.props.focusFeatures;
    // Load new data if geographies have chanced

    // TODO: Generalize this via layers.js config
    // OR generalize load function
    const directory = {
      'places': this.loadTownData.bind(this),
      'schools-secondary': this.loadSchoolData.bind(this),
      'counties': this.loadCountyData.bind(this),
    }
    const layers = Object.keys(directory);

    layers.forEach(key => {
      const district =
        focusFeatures.find(d => d.key === key) &&
        focusFeatures.find(d => d.key === key).feature;
      const prevDistrict =
        prevProps.focusFeatures.find(d => d.key === key) &&
        prevProps.focusFeatures.find(d => d.key === key).feature;
      const isUpdate = (district !== prevDistrict);
      if (district && isUpdate){
        // call appropriate load function
        directory[key](district);
      }
    });
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

  // Data management
  loadTownData(town){
    // Current API DB doesn't have data for census places, only incorporated municipalities
    if (town && town.properties.type != 'census place'){
      this.apiCall('/place/population/', town.properties.fips, 'townPopulation')
    } else {
      this.setState({townPopulation: null})
    }
  }

  loadSchoolData(school){
    this.apiCall('/school/enrollment/hs/', school.properties.le_code, 'schoolEnrollment')
  }

  loadCountyData(county){
    this.apiCall('/county/population/', county.properties.fips, 'countyPopulation')
  }

  apiCall(route, code, stateVariable){
    fetch(API_URL + route + code)
      .then(results => results.json())
      .then(json => {
        const stateUpdate = {}
        stateUpdate[stateVariable] = json.data;
        this.setState(stateUpdate)
      })
  }
}