var promise = require('bluebird')

var options = {
  promiseLib: promise
}

var pgp = require('pg-promise')(options);
var connectionString = 'postgres://localhost:5432/mt-vitality-metrics'
var db = pgp(connectionString);

// add query functions

// function getPlacePopulations(req, res, next){
//   db.any('select fips, place, year, population from mt_place_population')
//     .then(function(data){
//       console.log(data.slice(5))
//       res.status(200)
//         .json({
//           status: 'success',
//           data: data,
//           message: 'Retrieved place populations',
//           source: 'US Census Bureau'
//         });
//     })
//     .catch(function(err) {
//       return next(err)
//     })
// }

function getPlacePopulation(req, res, next){
  var placeFips = req.params.fips;
  db.any('select fips, place, year, population from mt_place_population where fips = $1', placeFips)
    .then(function(data){
      const grouped = {}
      grouped.place = data[0].place
      grouped.fips = data[0].fips
      grouped.population = data.map(d => {
        return {
          year: d.year,
          population: d.population,
        }
      }).sort((a,b) => a.year.localeCompare(b.year))

      res.status(200)
        .json({
          status: 'success',
          data: grouped,
          message: 'Retrieved place population history',
          source: 'US Census Bureau'
        })
    })
    .catch(function(err) {
      return next(err)
    })
}

// NB: High school enrollment only!
function getDistrictHSEnrollment(req, res, next){
  var districtCode = req.params.le_code;
  db.any(`select * from mt_school_enrollment where code = $1`, districtCode)
  .then(function(data){
      // data processing
      // TODO: Break this out as separate file

      const grouped = {}
      grouped.code = data[0].code
      grouped.counties = data[0].county
      grouped.districts = [...new Set(data.map(d => d.district))] // get uniques
      grouped.schools = [...new Set(data.map(d => d.school))]
      grouped.years = [...new Set(data.map(d => d.year))]
      grouped.grades = [...new Set(data.map(d => d.grade))]
      grouped.enrollment = grouped.years.map(year => {
        const curYear = data.filter(d => d.year === year)
        const enrollment = curYear.reduce((a,b) => {
          return a + b.hs_enrollment
        }, 0)
        return {year: year, enrollment: enrollment}
      }).sort((a,b) => a.year.localeCompare(b.year)) // alphabetic sort for year order

      res.status(200)
        .json({
          status: 'success',
          data: grouped,
          message: 'Retrieved district enrollment data',
          source: 'MT Office of Public Instruction'
        })
  })
  .catch(function(err) {
    return next(err)
  })
}

function getCountyPopulation(req, res, next){
  var placeFips = req.params.fips;
  db.any('select fips, place, year, population from mt_county_population where fips = $1', placeFips)
    .then(function(data){
      const grouped = {}
      grouped.place = data[0].place
      grouped.fips = data[0].fips
      grouped.population = data.map(d => {
        return {
          year: d.year,
          population: d.population,
        }
      }).sort((a,b) => a.year.localeCompare(b.year))

      res.status(200)
        .json({
          status: 'success',
          data: grouped,
          message: 'Retrieved county population history',
          source: 'US Census Bureau'
        })
    })
    .catch(function(err) {
      return next(err)
    })
}

function getCountyIncome(req, res, next){
  var placeFips = req.params.fips;
  db.any('select fips, name, year, pc_income from mt_county_economy where fips= $1', placeFips)
    .then(function(data){
      const grouped = {}
      grouped.place = data[0].place
      grouped.fips = data[0].fips
      grouped.income = data.map(d => {
        return {
          year: d.year,
          perCapitaIncome: d.pc_income,
        }
      }).sort((a,b) => a.year.localeCompare(b.year))

      res.status(200)
        .json({
          status: 'success',
          data: grouped,
          source: 'U.S. Bureau of Economic Analysis'
        })
    })
    .catch(function(err) {
      return next(err)
    })
}

module.exports = {
  getPlacePopulation: getPlacePopulation,
  getDistrictHSEnrollment: getDistrictHSEnrollment,
  getCountyPopulation: getCountyPopulation,
  getCountyIncome: getCountyIncome,
}

