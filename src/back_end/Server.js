var express = require('express');
var mongoose = require('mongoose');
var Busker = require('./Model_Busker');
var Member = require('./Model_Member');
var app = express();

mongoose.connect('mongodb://localhost/busker');

console.log("===========================Server is starting===========================");

app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use(express.static('../front_end'));

var busker = require('./routes/busker');
var account = require('./routes/account');


app.use('/busker', busker);
app.use('/account', account);

app.get('/', function(request, response) {
  console.log('Hello~');
});

app.listen('8888', function(request, response) {
  console.log('listening to 8888 port');
});

