var models = require('../models');
var User = models.User;
var utility = require('utility');
var uuid = require('node-uuid');

exports.getUsersByNames = function (names, callback) {
    if (names.length === 0) {
        return callback(null, []);
    }
    User.find({ loginname: { $in: names } }, callback);
};

exports.getUserByLoginName = function (loginName, callback) {
    User.findOne({'loginname': loginName}, callback);
};

exports.getUserById = function (id, callback) {
    if (!id) {
        return callback();
    }
    User.findOne({_id: id}, callback);
};

exports.getUserByMail = function (email, callback) {
    User.findOne({email: email}, callback);
};

exports.getUsersByIds = function (ids, callback) {
    User.find({'_id': {'$in': ids}}, callback);
};

exports.getUsersByQuery = function (query, opt, callback) {
    User.find(query, '', opt, callback);
};

exports.getUserByNameAndKey = function (loginname, key, callback) {
    User.findOne({loginname: loginname, retrieve_key: key}, callback);
};

exports.removeAsync = function(callback){
    User.find({}).remove(callback);
};

exports.registerAsync = function(email, pass, callback){
    this.newAndSave(null, email, pass, email, null, true, callback);
};

exports.newAndSave = function (name, loginname, pass, email, avatar_url, active, callback) {
    var user         = new User();
    user.name        = loginname;
    user.loginname   = loginname;
    user.pass        = pass;
    user.email       = email;
    user.avatar      = avatar_url;
    user.active      = active || true;
    user.accessToken = uuid.v4();

    user.save(callback);
};

var makeGravatar = function (email) {
    return 'http://www.gravatar.com/avatar/' + utility.md5(email.toLowerCase()) + '?size=48';
};
exports.makeGravatar = makeGravatar;

exports.getGravatar = function (user) {
    return user.avatar || makeGravatar(user);
};