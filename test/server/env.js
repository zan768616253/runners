'use strict';

var mongoose = require('mongoose');

var config = require('../../server/configs/config');
var User = require('../../server/proxys').User;
var UserSeed = require('../../seeds').User;

var usersToSeed = 1;

beforeEach(function (done) {
    function clearDB() {
        for (var i in mongoose.connection.collections) {
            mongoose.connection.collections[i].remove(function() {});
        }

        //UserSeed.seed(usersToSeed);

        return done();
    }

    if (mongoose.connection.readyState === 0) {
        mongoose.connect(config.db, function (err) {
            if (err) {
                throw err;
            }
            return clearDB();
        });
    } else {
        return clearDB();
    }
});

afterEach(function (done) {
    mongoose.disconnect();
    return done();
});