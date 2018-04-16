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

module.exports = {
  getPlacePopulations: getPlacePopulations,
  getSinglePlacePopulation: getSinglePlacePopulation,
}

