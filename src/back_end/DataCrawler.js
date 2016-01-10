var express = require('express');
var mongoose = require('mongoose');
var request = require('request');
var parser = require('xml2json');
var Busker = require('./Model_Busker');
var Member = require('./Model_Member');
var util = require('util');
var fs = require('fs');
var url = 'http://data.taipei/opendata/datalist/datasetMeta/download;jsessionid=6CB2E55BF3850495121F0DB94610C2AC?id=5e4db75d-734e-42b7-8284-df413aa8122a&rid=bf0f5218-73a7-429b-ae30-3a87ab818927';

mongoose.connect('mongodb://localhost/busker');

crawler();

function crawler() {

  var xmlPath = './data/busker.xml';
  var jsonPath = './data/busker.json';
  var source = request(url);
  var downloadFile = fs.createWriteStream(xmlPath);

  source.on('response', function(res) {
    res.pipe(downloadFile);
  });

  downloadFile.on('finish', function() {
    Busker.remove({}, function() {});
    fs.readFile(xmlPath, {
      encoding: 'utf-8'
    }, function(err, data) {
      var jsonObj = parser.toJson(data);
      var buskerList = JSON.parse(jsonObj);
      var raw_array = buskerList.datas.Performer;
      // i < buskerList.datas.Performer.length
      raw_array = ObjectArrayUnique(raw_array, "performer_no");
      for (var i = 0, len = raw_array.length; i < len; i++) {

        var busker = raw_array[i];

        refineData(busker);
        // Create a new instance of Busker
        var newMember = new Busker({
          num: busker.performer_no,
          group_name: busker.group_name,
          performer_name: busker.performer_name,
          perform_type: busker.perform_type,
          perform_content: busker.perform_content,
          email: busker.email,
          img: "https://pbs.twimg.com/profile_images/557472607985876992/2RF6SFTW.jpeg",
          lat: "",
          long: "",
          time_stamp: +new Date()
        });
        newMember.save(function(err) {
          if (err) {
            console.error(err);
          }
        });

        logger(newMember);

      }
      fs.writeFile(jsonPath, jsonObj, {
        encoding: 'utf-8'
      }, function(err) {
        if (err) {
          console.error(err);
        }
      });
    });
  });
}

// Speed up calls to hasOwnProperty
var hasOwnProperty = Object.prototype.hasOwnProperty;

function isEmpty(obj) {

  // null and undefined are "empty"
  if (obj == null) return true;
  if (obj == undefined) return true;

  // Assume if it has a length property with a non-zero value
  // that that property is correct.
  if (obj.length > 0) return false;
  if (obj.length === 0) return true;

  // Otherwise, does it have any properties of its own?
  // Note that this doesn't handle
  // toString and valueOf enumeration bugs in IE < 9
  for (var key in obj) {
    if (hasOwnProperty.call(obj, key)) return false;
  }

  return true;
}

function refineData(busker) {
  // Pre-assign those empty value
  if (isEmpty(busker.group_name) && isEmpty(busker.performer_name)) {
    // console.log('Both names are empty');
    busker.group_name = 'Who are you';
    busker.performer_name = 'Who are you';
  } else if (isEmpty(busker.group_name) && !isEmpty(busker.performer_name)) {
    // console.log('group_name is empty');
    busker.group_name = busker.performer_name;
  } else if (!isEmpty(busker.group_name) && isEmpty(busker.performer_name)) {
    // console.log('performer_name is empty');
    busker.performer_name = busker.group_name;
  }
  if (isEmpty(busker.perform_content)) {
    busker.perform_content = 'None';
  }
  if (isEmpty(busker.email)) {
    busker.email = 'None';
  }
}

function logger(newMember) {
  // Log
  console.log('===== New Member =====');
  console.log('Num: ' + newMember.num);
  console.log('group_name: ' + newMember.group_name);
  console.log('performer_name: ' + newMember.performer_name);
  console.log('perform_type: ' + newMember.perform_type);
  console.log('perform_content: ' + newMember.perform_content);

  // console.log('===== New Member =====');
  // console.log('Num: ' + typeof newMember.num);
  // console.log('group_name: ' + typeof newMember.group_name);
  // console.log('performer_name: ' + typeof newMember.performer_name);
  // console.log('perform_type: ' + typeof newMember.perform_type);
  // console.log('perform_content: ' + typeof newMember.perform_content);
}

function ObjectArrayIndexOf(myArray, searchTerm, property) {
  for (var i = 0, len = myArray.length; i < len; i++) {
    if (myArray[i][property] === searchTerm) return i;
  }
  return -1;
}

function ObjectArrayUnique(myArray, uniqProperty) {

  var result = [];
  var duplicate = 0;

  while(myArray.length!=0){
    var uniq_elem = myArray.shift();

    duplicate = ObjectArrayIndexOf(myArray, uniq_elem[uniqProperty], uniqProperty);

    while(duplicate>=0) {
      myArray.splice(duplicate, 1);
      duplicate = ObjectArrayIndexOf(myArray, uniq_elem[uniqProperty], uniqProperty);
    }
    result.push(uniq_elem);
  }

  return result;
}
