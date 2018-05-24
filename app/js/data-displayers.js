/*

Functional react components for displaying data results for each geography.

This files uses JSX

Convoluted form here because these need to be passed to DistrictResults.jsx (via layers.js) as functions

*/

import React from 'react';
import { observer } from 'mobx-react';


import SchoolEnrollmentResults from './../components/data-displayers/SchoolEnrollmentResults.jsx';
import SchoolTaxBaseResults from './../components/data-displayers/SchoolTaxBaseResults.jsx';

import PlacePopulationResults from './../components/data-displayers/PlacePopulationResults.jsx';

import CountyPopulationResults from './../components/data-displayers/CountyPopulationResults.jsx';
import CountyIncomeResults from './../components/data-displayers/CountyIncomeResults.jsx';

class FeatureResults extends React.Component {
  render(){
    return (
      <div className="geography-container town" key={this.props.id}>
        <div className="geography-header">
          {this.props.label}
        </div>
        <div className="geography-metric-row">
          {this.props.children}
        </div>
      </div>
    )
  }
}

@observer
class TownResults extends React.Component {
  render(){
    const feature = this.props.feature;
    const id = feature && feature.properties.id;

    const population = this.props.data.townPopulation;

    return feature ? (
      <FeatureResults id={id} label={id} >
         <PlacePopulationResults data={population} />
      </FeatureResults>
    ) : null;
  }
}

@observer
class SchoolResults extends React.Component {
  render(){
    const feature = this.props.feature;
    const id = feature && feature.properties.id;

    const enrollment = this.props.data.schoolEnrollment;
    const taxBase = this.props.data.schoolTaxBase;

    return feature ? (
      <FeatureResults id={id} label={id} >
          <SchoolEnrollmentResults data={enrollment} />
          <SchoolTaxBaseResults data={taxBase} />
      </FeatureResults>
    ) : null;
  }
}

@observer
class CountyResults extends React.Component {
  render(){
    const feature = this.props.feature;
    const id = feature && feature.properties.id;

    const population = this.props.data.countyPopulation;
    const income = this.props.data.countyIncome;

    return feature ? (
      <FeatureResults id={id} label={id} >
          <CountyPopulationResults data={population} />
          <CountyIncomeResults data={income} />
      </FeatureResults>
    ) : null;
  }
}

@observer
class ReservationResults extends React.Component {
  render(){
    const feature = this.props.feature;
    const id = feature && feature.properties.id;

    return feature ? (
      <FeatureResults id={id} label={id} >
      </FeatureResults>
    ) : null;
  }
}

export default {
  makeTownResults: (feature, data) =>
    <TownResults key={1} feature={feature} data={data} />,
  makeSchoolResults: (feature, data) =>
    <SchoolResults key={2} feature={feature} data={data} />,
  makeCountyResults: (feature, data) =>
    <CountyResults key={3} feature={feature} data={data} />,
  makeReservationResults: (feature, data) =>
    <ReservationResults key={4} feature={feature} data={data} />,
}