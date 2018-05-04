import React from 'react';

// NOTE: focus features come with 'displayer' property that provides instructions on how to render them

export default class DistrictsResults extends React.Component {

  render(){
    const focusFeatures = this.props.focusFeatures;
    const data = this.props.data;

    const results = focusFeatures.map(feature =>
      feature.displayer(feature.feature, data)
    );

    return(
      <div className='results-container'>
        {results}
      </div>
    )
  }


}