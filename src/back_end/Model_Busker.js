var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Busker = new Schema({
  index: String,
  num: String,
  group_Name: String,
  performer_name: String,
  perform_type: String,
  perform_content: String,
}, {
  versionKey: false
});

module.exports = mongoose.model('Busker', Busker);
