/*
Function for loading data from API

*/

const API_URL = process.env.API_URL || '';

// Helper function

function apiCall(callback, route, code, stateVariable){
    fetch(API_URL + route + code)
      .then(results => results.json())
      .then(json => {
        callback(stateVariable, json.data)
      })
  }

// Others

function loadTownData(town, callback){
  // Current API DB doesn't have data for census places, only incorporated municipalities
  if (town && town.properties.type != 'census place'){
    apiCall(callback, '/place/population/', town.properties.fips, 'townPopulation')
  } else {
    callback('townPopulation', null)
  }
}

function loadSchoolData(school, callback){
  apiCall(callback, '/school/enrollment/hs/', school.properties.le_code, 'schoolEnrollment')
}

function loadCountyData(county, callback){
  apiCall(callback, '/county/population/', county.properties.fips, 'countyPopulation')
}

function loadReservationData(reservation, callback){
  return null;
}


export default {
  loadTownData: loadTownData,
  loadSchoolData: loadSchoolData,
  loadCountyData: loadCountyData,
  loadReservationData: loadReservationData,
}