var express = require('express');
var app = express();

console.log("===========================Server is starting===========================");
app.use(express.static('../front_end'));

app.get('/', function(request, response) {
  console.log('This is /');
});

app.listen('8888', function(request, response) {
  console.log('listening to 8888 port');
});
