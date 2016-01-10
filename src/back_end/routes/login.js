var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Member = require('../Model_Member');

var router = express.Router();
var parseUrlencoded = bodyParser.urlencoded({extended:false});

mongoose.createConnection('mongodb://localhost/busker');

var jsonArr = [];

router.route('/')
  .get(function(request, response) {
    Member.find().exec(function(err, foundData) {
      response.send(foundData);
    });
  })
  .post(function(request, response) {
    
  })

module.exports = router;
