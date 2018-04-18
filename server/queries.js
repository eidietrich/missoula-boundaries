var promise = require('bluebird')

var options = {
  promiseLib: promise
}

var pgp = require('pg-promise')(options);
var connectionString = 'postgres://localhost:5432/mt-vitality-metrics'
var db = pgp(connectionString);

// add query functions

function getPlacePopulations(req, res, next){
  db.any('select * from mt_place_populations')
    .then(function(data){
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved place populations',
          source: 'US Census Bureau'
        });
    })
    .catch(function(err) {
      return next(err)
    })
}

function getSinglePlacePopulation(req, res, next){
  var placeFips = req.params.fips;
  db.one('select * from mt_place_populations where place = $1 limit 1', placeFips)
    .then(function(data){
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved one place',
          source: 'US Census Bureau'
        })
    })
    .catch(function(err) {
      return next(err)
    })
}

// NB: High school enrollment only!
function getSingleDistrictHSEnrollment(req, res, next){
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

module.exports = {
  getPlacePopulations: getPlacePopulations,
  getSinglePlacePopulation: getSinglePlacePopulation,
  getSingleDistrictHSEnrollment: getSingleDistrictHSEnrollment,
}

