var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Busker = new Schema({
  num: String,
  group_name: String,
  performer_name: String,
  perform_type: String,
  perform_content: String,
  email: String,
  website: String,
  img: String,
  lat: String,
  long: String,
  time_stamp: String
}, {
  versionKey: false
});

module.exports = mongoose.model('Busker', Busker);
