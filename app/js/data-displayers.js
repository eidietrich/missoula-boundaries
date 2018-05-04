/*

Functional react components for displaying data results for each geography.

This files uses JSX

*/

import React from 'react';


import SchoolEnrollmentResults from './../components/data-displayers/SchoolEnrollmentResults.jsx';
import PlacePopulationResults from './../components/data-displayers/PlacePopulationResults.jsx';
import CountyPopulationResults from './../components/data-displayers/CountyPopulationResults.jsx';
import CountyIncomeResults from './../components/data-displayers/CountyIncomeResults.jsx';




function makeTownResults(feature, data){
  if(!feature) return null;

  const population = data.townPopulation;

  const town = (
    <div className="geography-container town" key={feature.properties.id}>
      <div className="geography-header">
        {feature.properties.id}
      </div>
      <div className="geography-metric-row">
        <PlacePopulationResults data={population} />
        <PlacePopulationResults data={population} />
      </div>
    </div>
  );

  return town;
}

function makeSchoolResults(feature, data){
  if(!feature) return null;

  const enrollment = data.schoolEnrollment;

  const school = (
    <div className="geography-container school" key={feature.properties.id}>
      <div className="geography-header">
        {feature.properties.id}
      </div>
      <div className="geography-metric-row">
        <SchoolEnrollmentResults data={enrollment} />
      </div>
    </div>
  );

  return school;
}

function makeCountyResults(feature, data){
  if(!feature) return null;
  const population = data.countyPopulation;
  const income = data.countyIncome;

  const county = (
    <div className="geography-container county" key={feature.properties.id}>
      <div className="geography-header">
        {feature.properties.id + ' County'}
      </div>
      <div className="geography-metric-row">
        <CountyPopulationResults data={population} />
        <CountyIncomeResults data={income} />
      </div>
    </div>
  );

  return county;
}

function makeReservationResults(feature, data){
  if(!feature) return null;

  const reservation = (
    <div className="geography-container county" key={feature.properties.id}>
      <div className="geography-header">
        {feature.properties.id + ' Reservation'}
      </div>
      <div>Data TK</div>
    </div>
  );

  return reservation;
}

export default {
  makeTownResults: makeTownResults,
  makeSchoolResults: makeSchoolResults,
  makeCountyResults: makeCountyResults,
  makeReservationResults: makeReservationResults,
}