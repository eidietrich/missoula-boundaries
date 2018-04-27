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

    const results = focusFeatures.map(feature =>
      feature.displayer(feature.feature, this.state)
    );

    return(
      <div className='results-container'>
        {results}
      </div>
    )
  }


}