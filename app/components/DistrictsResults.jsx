import React from 'react';
import { observer } from 'mobx-react';

// NOTE: focus features come with 'displayer' property that provides instructions on how to render them

@observer
export default class DistrictsResults extends React.Component {

  render(){
    const focusFeatures = this.props.appState.focusFeatures;
    const data = this.props.appState.data;

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