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

  Busker.remove();

  source.on('response', function(res) {
    res.pipe(downloadFile);
  });

  downloadFile.on('finish', function() {
    fs.readFile(xmlPath, {encoding: 'utf-8'}, function(err, data){
      var jsonObj = parser.toJson(data);
      var buskerList = JSON.parse(jsonObj);
      for (var i = 0; i < buskerList.datas.Performer.length; i++) {
        var busker = buskerList.datas.Performer[i];
        var newMember = new Busker();
        newMember.idx = i;
        newMember.num = busker.performer_no;
        newMember.group_Name = busker.group_name;
        newMember.performer_name = busker.performer_name;
        newMember.perform_type = busker.perform_type;
        newMember.perform_content = busker.perform_content;
        console.log('===== New Member =====');
        console.log('Idx: ' + newMember.idx);
        console.log('Num: ' + newMember.num);
        console.log('group_num: ' + newMember.group_name);
        console.log('performer_name: ' + newMember.performer_name);
        console.log('perform_type: ' + newMember.perform_type);
        console.log('perform_content: ' + newMember.perform_content);
        newMember.save();
      }
      fs.writeFile(jsonPath, jsonObj, {encoding: 'utf-8'}, function(err){
        if(err) {
          console.error(err);
        }
      });
    });
  });
}
