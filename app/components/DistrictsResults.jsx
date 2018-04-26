import React from 'react';

// NOTE: focus features come with 'displayer' property that provides instructions on how to render them

export default class DistrictsResults extends React.Component {
  constructor(props){
    super(props)
    // This is a weird place to store fetched data
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
    function apiCallback(key, data) {
      const stateUpdate = {};
      stateUpdate[key] = data;
      this.setState(stateUpdate);
    }

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

    const results = focusFeatures.map(feature =>
      feature.displayer(feature.feature, this.state)
    );

    return(
      <div className='results-container'>
        <div className="results-location-header">{location}</div>
        {results}
      </div>
    )
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