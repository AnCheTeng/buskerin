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
  .put(parseUrlencoded, function(request, response){
    var newBusker = request.body;
    var buskerName = newBusker.name;
    var buskerEmail = newBusker.email;
    var buskerPWD = newBusker.password;

    Member.findOne({
      name: buskerName,
      email: buskerEmail
    }).exec(function(err, found_Member) {
      if(!found_Member) {
        var newMember = new Member({
          name: buskerName,
          email: buskerEmail,
          password: buskerPWD,
          favorite: []
        });
        newMember.save();
        response.send('0');
      } else {
        response.send('1');
      }
      response.end();
    });
  });

module.exports = router;
