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
  })
  .post(parseUrlencoded, function(request, response){
    var newBusker = request.body;
    var newMember = new Busker({
      num: 'TODO',
      group_name: 'TODO',
      performer_name: 'TODO',
      perform_type: 'TODO',
      perform_content: 'TODO'
    });
    newMember.save(function(err){
      if(err){
        console.error(err);
      }
    });
    response.status(201).json(newMember);
  });

module.exports = router;
