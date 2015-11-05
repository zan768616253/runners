'use strict';

var passport = require('passport');
var config_passport = require('../configs/config_passport.js');
var flash = require('../helpers/helper_flash.js');

function signinUser(req, res, next){
    passport.authenticate('local', function(err, user, info){
        if (err || !user) {
            return res.send(400, info ,null);
        }

        req.logIn(user, function(err){
            if (err) {
                return next(err);
            }
            return res.send(400, "loged in" ,null);
        })
    })(req, res, next);
}

module.exports.signin = signinUser;