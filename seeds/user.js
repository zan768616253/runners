'use strict';

var _ = require('lodash');
var BB = require('bluebird');
var chance = require('chance').Chance();
var Log = require('../server/helpers/helper_log');
var User = require('../server/proxys').User;

var PASSWORD = 'test';

module.exports = {
    seed: function(n){
        return BB.all(_.times(n, function(i){

            var user = new User({
                email: chance.email({ domain: 'test.com' })
            });

            return User.registerAsync(user, PASSWORD)
                .then(function(user){
                    Log.info(user.email + ' added with password: "' + PASSWORD + '".');
                    return user;
                });
        }));
    }

};