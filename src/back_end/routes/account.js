var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Busker = require('../Model_Busker');
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
  .post(parseUrlencoded, function(request, response) {
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

router.route('/searchMemberByKeyword')
  .get(parseUrlencoded, function(request, response) {
    var criteria = request.query;
    var keyword = criteria.key;

    Member.find({
      $or: [{
        name: keyword
      }, {
        email: keyword
      }, {
        favorite: keyword
      }]
    }).sort({
      'time_stamp': -1
    }).exec(function(err, foundData) {
      response.send(foundData);
    });
  });

router.route('/searchMemberDefault')
  .get(parseUrlencoded, function(request, response) {
    var criteria = request.query;
    var idx = parseInt(criteria.idx);

    Member.find().sort({
      'time_stamp': -1
    }).exec(function(err, foundData) {
      response.send(foundData[idx]);
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
      Busker.findOne({
        num: favorite_busker
      }).exec(function(err, busker) {
        found_Member.favorite = found_Member.favorite ? found_Member.favorite : [];
        found_Member.favorite = found_Member.favorite.push(busker);
        found_Member.save()
        response.send(found_Member.favorite);
      })

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
      var index = -1;
      found_Member.favorite = found_Member.favorite ? found_Member.favorite : [];
      for (var i = 0, len = found_Member.favorite.length; i < len; i++) {
        if (found_Member.favorite[i].num === delete_busker) {
          index = i;
          break;
        }
      }
      if (index >= 0) {
        found_Member.favorite.splice(index, 1);
        found_Member.save()
      }
      response.send(found_Member.favorite);
    })
  })

module.exports = router;
