var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Busker = require('./Model_Busker');
var Member = require('./Model_Member');

var router = express.Router();
var parseUrlencoded = bodyParser.urlencoded({extended:false});

mongoose.connect('mongodb://localhost/busker');

var buskers = {
  'Slow motion': 'To act like a robot',
  'Ball magic': 'Magical balls',
  'Kong Fu': 'Do some easy steps to interact with people'
};

router.route('/')
  .get(function(request, response) {
    response.json(Object.keys(buskers));
  })
  .post(parseUrlencoded, function(request, response){
    var newBusker = request.body;
    buskers[newBusker.name] = newBusker.description;
    response.status(201).json(newBusker.name);
  });


router.route('/:name')
  .all(function (request, response, next){
    var name = request.params.name;
    var Busker = name[0].toUpperCase() + name.slice(1).toLowerCase();
    request.pName = Busker;
    next();
  })
  .delete(function(request, response) {
    delete buskers[request.pName];
    response.sendStatus(200);
  })
  .get(function(request, response) {
    var description = buskers[request.pName];
    if (!description) {
      response.status(404).json('No description is ' + request.params.name);
    } else {
      response.json(description);
    }
  });

module.exports = router;
