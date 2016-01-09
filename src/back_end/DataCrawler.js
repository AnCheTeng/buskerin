var express = require('express');
var request = require('request');
var parser = require('xml2json');
var util = require('util');
var fs = require('fs');
var url = 'http://data.taipei/opendata/datalist/datasetMeta/download;jsessionid=6CB2E55BF3850495121F0DB94610C2AC?id=5e4db75d-734e-42b7-8284-df413aa8122a&rid=bf0f5218-73a7-429b-ae30-3a87ab818927';

crawler();

function crawler() {

  var xmlPath = './busker.xml';
  var jsonPath = './busker.json';
  var source = request(url);
  var downloadFile = fs.createWriteStream(xmlPath);
  var input = fs.createReadStream('./busker.xml');
  var output = fs.createWriteStream('./busker.json');

  source.on('response', function(res) {
    res.pipe(downloadFile);
  });

  downloadFile.on('finish', function() {
    fs.readFile(xmlPath, {encoding: 'utf-8'}, function(err, data){
      var jsonObj = parser.toJson(data);
      fs.writeFileSync(jsonPath, jsonObj, 'utf-8');
    });
  });
}
