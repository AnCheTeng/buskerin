var express = require('express');
var request = require('request');
var fs = require('fs');
var url = 'http://data.taipei/opendata/datalist/datasetMeta/download;jsessionid=6CB2E55BF3850495121F0DB94610C2AC?id=5e4db75d-734e-42b7-8284-df413aa8122a&rid=bf0f5218-73a7-429b-ae30-3a87ab818927';
var app = express();

crawler();

function crawler() {

  var source = request(url);
  var downloadFile = fs.createWriteStream('./busker.xml');

  source.on('response', function(res) {
    res.pipe(downloadFile);
  });

  downloadFile.on('finish', function() {
    console.log('Download Finished')
  });
}
