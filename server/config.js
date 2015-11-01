var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/runners-dev');

module.exports.mongoose = mongoose;