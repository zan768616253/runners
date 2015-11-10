'use strict';

var passport = require('passport');
var check = require('validator').check;
var sanitize = require('validator').sanitize;

var User = require('../proxys/user.js');
var flash = require('../helpers/helper_flash.js');

function signin(req, res, next){
    passport.authenticate('local-signin', function(err, user, info){
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

function signup(req, res, next){
    var email = sanitize(req.body.email).trim();
    var username = sanitize(req.body.username).trim();
    var password = sanitize(req.body.password).trim();
}


module.exports.signin = signin;
module.exports.signup = signup;