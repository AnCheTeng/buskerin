var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Member = new Schema({
  name: String,
  email: String,
  password: String,
  favorite: Array,
  busker_Id: String,
  time_stamp: String
}, {
  versionKey: false
});

module.exports = mongoose.model('Member', Member);
