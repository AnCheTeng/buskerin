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

router.route('/register')
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
          favorite: [],
          lat: "",
          long: "",
          time_stamp: +new Date()
        });
        newMember.save();
        response.send('0');
      } else {
        response.send('1');
      }
      response.end();
    });
  });

router.route('/login')
  .post(parseUrlencoded, function(request, response){
    var newBusker = request.body;
    var buskerEmail = newBusker.email;
    var buskerPWD = newBusker.password;
    jsonArr = [];

    Member.findOne({
      email: buskerEmail,
      password: buskerPWD
    }).exec(function(err, found_Member) {
      if(!found_Member) {
        jsonArr.push({success: false, user_name: "", favorite_list: ""});
      } else {
        //TODO: to update lat and long of this member
        found_Member.time_stamp = +new Date();
        jsonArr.push({success: true, user_name: found_Member.name, favorite_list: found_Member.favorite});
      }
      response.contentType('application/json');
      response.send(JSON.stringify(jsonArr));
      response.end();
    });
  });

  router.route('/searchMemberByKeyword')
    .get(parseUrlencoded, function(request, response){
      var criteria = request.query;
      var keyword = criteria.key;

      Member.find({
        $or:[ {name:keyword}, {email:keyword}, {favorite:keyword} ]
      }).sort({'time_stamp': -1}).exec(function(err, foundData) {
        response.send(foundData);
      });
    });

  router.route('/searchMemberDefault')
    .get(parseUrlencoded, function(request, response){
      var criteria = request.query;
      var idx = parseInt(criteria.idx);

      Member.find().sort({'time_stamp': -1}).exec(function(err, foundData) {
        response.send(foundData[idx]);
      });
    });

module.exports = router;