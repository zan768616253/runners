'use strict';
require('../server/app')

var _ = require('lodash');
var BB = require('bluebird');
var chance = require('chance').Chance();
var Log = require('../server/helpers/helper_log');
var User = require('../server/proxys').User;

var PASSWORD = 'test';

module.exports = {
    seed: function(n){
        return BB.all(_.times(n, function(i){
            var email = chance.email({ domain: 'test.com' });
            User.registerAsync(email, PASSWORD);
        }));
    }

};