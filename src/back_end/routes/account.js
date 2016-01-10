var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Member = require('../Model_Member');

var router = express.Router();
var parseUrlencoded = bodyParser.urlencoded({
  extended: false
});

mongoose.createConnection('mongodb://localhost/busker');

var jsonArr = [];

router.route('/')
  .get(function(request, response) {
    Member.find().exec(function(err, foundData) {
      response.send(foundData);
    });
  })

router.route('/register')
  .put(parseUrlencoded, function(request, response) {
    var newBusker = request.body;
    var buskerName = newBusker.name;
    var buskerEmail = newBusker.email;
    var buskerPWD = newBusker.password;

    Member.findOne({
      name: buskerName,
      email: buskerEmail
    }).exec(function(err, found_Member) {
      if (!found_Member) {
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

router.route('/login')
  .post(parseUrlencoded, function(request, response) {
    var newBusker = request.body;
    var buskerEmail = newBusker.email;
    var buskerPWD = newBusker.password;
    jsonArr = [];

    Member.findOne({
      email: buskerEmail,
      password: buskerPWD
    }).exec(function(err, found_Member) {
      if (!found_Member) {
        jsonArr.push({
          success: false,
          user_name: "",
          favorite_list: ""
        });
      } else {
        jsonArr.push({
          success: true,
          user_name: found_Member.name,
          favorite_list: found_Member.favorite
        });
      }
      response.contentType('application/json');
      response.send(JSON.stringify(jsonArr));
      response.end();
    });
  });

router.route('/favorite')
  .post(parseUrlencoded, function(request, response) {
    var newFavorite = request.body;
    var account = newFavorite.email;
    var pwd = newFavorite.password;
    var favorite_busker = newFavorite.performer_no;

    Member.findOne({
      email: account,
      password: pwd
    }).exec(function(err, found_Member) {
      found_Member.favorite = found_Member.favorite.push(favorite_busker);
      found_Member.save()
      var response_json = found_Member;
      delete response_json["password"];
      response.send(response_json);
    })

  })

  .delete(parseUrlencoded, function(request, response) {
    var newFavorite = request.body;
    var account = newFavorite.email;
    var pwd = newFavorite.password;
    var delete_busker = newFavorite.performer_no;

    Member.findOne({
      email: account,
      password: pwd
    }).exec(function(err, found_Member) {
      var index = found_Member.favorite.indexOf(delete_busker);
      if (index >= 0) {
        found_Member.favorite.splice(index, 1);
        found_Member.save()
      }
      var response_json = found_Member;
      delete response_json["password"];
      response.send(response_json);
    })
  })

module.exports = router;
