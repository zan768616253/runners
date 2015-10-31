var models = require('../models');
var User = models.User;

exports.getUsersByNames = function(names, callback){
    if (names.length === 0) {
        return callback(null, []);
    }
    User.find({ name: {$in: names} }, callback);
}

exports.getUserByLoginName = function (loginName, callback) {
    User.findOne({'loginname': loginName}, callback);
};

exports.getUserById = function (id, callback) {
    User.findOne({_id: id}, callback);
};

exports.getUserByName = function (name, callback) {
    User.findOne({name: name}, callback);
};

exports.getUserByMail = function (email, callback) {
    User.findOne({email: email}, callback);
};

exports.getUsersByIds = function (ids, callback) {
    User.find({'_id': {'$in': ids}}, callback);
};

exports.getUsersByQuery = function (query, opt, callback) {
    User.find(query, [], opt, callback);
};

exports.getUserByQuery = function (name, key, callback) {
    User.findOne({name: name, retrieve_key: key}, callback);
};

exports.newAndSave = function (name, loginname, pass, email, avatar_url, active, callback) {
    var user = new User();
    user.name = name;
    user.loginname = loginname;
    user.pass = pass;
    user.email = email;
    user.avatar = avatar_url;
    user.active = false;
    user.save(callback);
};

