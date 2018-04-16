var express = require('express');
var router = express.Router();

var db = require('../queries');

/* GET home page. */
router.get('/api/places/populations', db.getPlacePopulations)
router.get('/api/places/populations/:fips', db.getSinglePlacePopulation)
router.get('/', function(req, res, next) {
  res.render('index', { title: 'MONTANA' });
});

module.exports = router;
