import React from 'react';

export default class DistrictsResults extends React.Component {
  render(){
    const districts = this.props.districts;
    const town = districts.town ? (
      <div>
        <h2>{`${districts.town.properties.id} (${districts.town.properties.type})`}</h2>
      </div>
    ) : null;

    const school = districts.school ? (
      <div>
        <h2>{districts.school.properties.id}</h2>
      </div>
    ): null;

    const county = districts.county ? (
      <div>
        <h2>{districts.county.properties.id + ' County'}</h2>
      </div>
    ): null;

    return(
      <div>
        {town}
        {school}
        {county}
      </div>
    )
  }
}