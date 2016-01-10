var express = require('express');
var mongoose = require('mongoose');
var Busker = require('./Model_Busker');
var Member = require('./Model_Member');
var app = express();

mongoose.connect('mongodb://localhost/busker');

console.log("===========================Server is starting===========================");
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

