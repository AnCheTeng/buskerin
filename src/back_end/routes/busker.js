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
      $or:[ {perform_name: {'$regex': keyword}}, {perform_type: {'$regex': keyword}}, {perform_content: {'$regex': keyword}} ]
    }).sort({'num': -1}).exec(function(err, foundData) {
      response.send(foundData.splice(idx, 5));
    });
  });

router.route('/searchBuskerDefault')
  .get(parseUrlencoded, function(request, response){
    var criteria = request.query;
    var idx = parseInt(criteria.idx);

    Busker.find().sort({'num': -1}).exec(function(err, foundData) {
      response.send(foundData.splice(idx,5));
    });
  });

router.route('/register')
  .post(parseUrlencoded, function(request, response) {
    var newBusker = request.body;
    var memberName = newBusker.account_name;
    var memberEmail = newBusker.account_email;
    var buskerGroupName = newBusker.p_group_name;
    var buskerPName = newBusker.p_name;
    var buskerPType= newBusker.p_type;
    var buskerPContent = newBusker.p_content;
    var buskerPImg = newBusker.p_img;
    var buskerPWebpage= newBusker.p_webpage;
    var buskerPEmail = newBusker.p_email;
    console.log('MemberBeBusker');

    Busker.findOne({
      group_name: buskerGroupName,
      performer_name: buskerPName,
      perform_type: buskerPType
    }).exec(function(err, found_Member) {
      if (!found_Member) {
        var newNo = randomIntFromInterval(1000000,200000000);
        var newMember = new Busker({
          num: newNo,
          group_name: buskerGroupName,
          performer_name: buskerPName,
          perform_type: buskerPType,
          perform_content: buskerPContent,
          email: buskerPEmail,
          img: buskerPImg,
          lat: "",
          long: "",
          time_stamp: +new Date()
        });
        newMember.save();

        Member.findOne({
          name: memberName,
          email: memberEmail
        }).exec(function(err, found_Member) {
          if(!found_Member) {
            console.log('No this member');
          } else {
            console.log('busker_Id: ' + newNo);
            found_Member.busker_Id = newNo;
          }
          found_Member.save();
        });
        response.send('0');
      } else {
        response.send('1');
      }
      response.end();
    });
  });

  router.route('/locate')
    .post(parseUrlencoded, function(request, response) {
      var newBusker = request.body;
      var memberBuskerId = newBusker.busker_Id;
      var memberLocateLat = newBusker.busker_lat;
      var memberLocateLong = newBusker.busker_long;

      console.log('locate id: ' + memberBuskerId);
      console.log('locate lat: ' + memberLocateLat);
      console.log('locate lng: ' + memberLocateLong);

      Busker.findOne({
        num: memberBuskerId,
      }).exec(function(err, found_Member) {
        if (found_Member) {
          found_Member.lat = memberLocateLat;
          found_Member.long = memberLocateLong;
          response.send('0');
        } else {
          response.send('1');
        }
        response.end();
      });
    });

function randomIntFromInterval(min,max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}

module.exports = router;
