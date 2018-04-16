import React from 'react';

const API_URL = process.env.API_URL || '';

export default class DistrictsResults extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      townData: {
        population: null,
      },
      schoolData: {},
      countyData: {},
    }
  }

  componentDidUpdate(prevProps){
    // Test for new town
    const town = this.props.districts.town;
    const prevTown = prevProps.districts.town;
    if (prevTown !== town){
      // Current API DB doesn't have data for census places, only incorporated municipalities
      if (town && town.properties.type != 'census place'){
        this._getTownPopulation(town.properties.fips)
      } else {
        this.setState({townData: {}})
      }
    }


  }

  // Render methods
  // TODO: Consider breaking some of these out into separate components
  render(){
    const districts = this.props.districts;
    return(
      <div>
        {this.makeTownResults(districts.town)}
        {this.makeSchoolResults(districts.school)}
        {this.makeCountyResults(districts.county)}
      </div>
    )
  }

  makeTownResults(feature){
    const popData = this.state.townData.population;

    const dataList = popData ? Object.keys(popData).map(key => {
      return <li key={key}>{key + ': ' + popData[key]}</li>
    }) : null;

    const town = feature ? (
      <div>
        <h2>{`${feature.properties.id} (${feature.properties.type})`}</h2>
        <p>FIPS: {feature.properties.fips}</p>
        <ul>{dataList}</ul>
      </div>
    ) : null;

    return town;
  }

  makeSchoolResults(feature){
    const school = feature ? (
      <div>
        <h2>{feature.properties.id}</h2>
      </div>
    ): null;

    return school;
  }

  makeCountyResults(feature){
    const county = feature ? (
      <div>
        <h2>{feature.properties.id + ' County'}</h2>
      </div>
    ): null;

    return county;
  }

  // Data management

  _getTownPopulation(fips){
    fetch(API_URL + '/place/population/' + fips)
      .then(results => results.json())
      .then(results => {
        const townData = this.state.townData;
        townData['population'] = results.data;
        this.setState({ townData: townData })
      })
  }
}