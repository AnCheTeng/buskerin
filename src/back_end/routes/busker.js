var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Busker = require('../Model_Busker');
var Member = require('../Model_Member');

var router = express.Router();
var parseUrlencoded = bodyParser.urlencoded({extended:false});

mongoose.createConnection('mongodb://localhost/busker');

router.route('/')
  .get(function(request, response) {
    Busker.find().exec(function(err, foundData) {
      response.send(foundData);
    });
  });

router.route('/searchBuskerByKeyword')
  .get(parseUrlencoded, function(request, response){
    var criteria = request.query;
    var keyword = criteria.key;
    var idx = parseInt(criteria.idx);
    console.log('keyword: ' + keyword + ' idx: ' + idx);

    Busker.find({
      $or:[ {perform_name:keyword}, {perform_type:keyword}, {perform_content:keyword} ]
    }).sort({'num': -1}).exec(function(err, foundData) {
      response.send(foundData.slice(idx, idx+5));
    });
  });

router.route('/searchBuskerDefault')
  .get(parseUrlencoded, function(request, response){
    var criteria = request.query;
    var idx = parseInt(criteria.idx);

    Busker.find().sort({'num': -1}).exec(function(err, foundData) {
      response.send(foundData[idx]);
    });
  });

module.exports = router;
