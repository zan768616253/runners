var mongoose = require('mongoose');
var db = 'mongodb://localhost/runners-dev';

mongoose.connect(db);

module.exports.mongoose = mongoose;
module.exports.db = db;