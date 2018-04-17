import React from 'react';

import SchoolEnrollmentResults from './SchoolEnrollmentResults.jsx'

const API_URL = process.env.API_URL || '';

export default class DistrictsResults extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      townPopulation: null,
      schoolEnrollment: null,
    }
  }

  componentDidUpdate(prevProps){

    // Load new data if geographies have chanced
    const town = this.props.districts.town
    if (town && town !== prevProps.districts.town){
      this.loadTownData(town);
    }

    const school = this.props.districts.school
    if (school !== prevProps.districts.school){
      this.loadSchoolData(school)
    }

    const county = this.props.districts.county
    if (county !== prevProps.districts.county){
      this.loadCountyData(county)
    }

  }

  // Render methods
  // TODO: Consider breaking some of these out into separate components
  render(){
    // console.log('results state', this.state)
    const districts = this.props.districts;
    const location = this.interpretLocation(districts);
    return(
      <div>
        <h2>{location}</h2>
        {this.makeTownResults(districts.town)}
        {this.makeSchoolResults(districts.school)}
        {this.makeCountyResults(districts.county)}
      </div>
    )
  }

  interpretLocation(districts){
    let locationDescription = 'none';
    if (districts.town && districts.county) {
      switch (districts.town.properties.type){
        case 'city':
          locationDescription = `City of ${districts.town.properties.id}`
          break;
        case 'town':
          locationDescription = `Town of ${districts.town.properties.id}`
          break;
        case 'census place':
          locationDescription = `${districts.town.properties.id} (unincorporated)`
          break;
        case 'consolidated city/county':
          locationDescription = `${districts.town.properties.id} (consolidated city/county)`
      }
    } else if (districts.county) {
      locationDescription = `Unincorporated ${districts.county.properties.id} County`
    }
    return locationDescription;
  }

  makeTownResults(feature){
    const population = this.state.townPopulation;

    const populationItems = population ? Object.keys(population).map(key => {
      return <li key={key}>{key + ': ' + population[key]}</li>
    }) : null;
    const populationList = population ? (
      <div>
         <p>Population</p>
         <ul>{populationItems}</ul>
      </div>
    ) : null;

    const town = feature ? (
      <div>
        <h3>{feature.properties.id}</h3>
        {populationList}
      </div>
    ) : null;

    return town;
  }

  makeSchoolResults(feature){
    if(feature === null) return null;

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
    const county = feature ? (
      <div>
        <h3>{feature.properties.id + ' County'}</h3>
      </div>
    ): null;

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