'use strict';

var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user.js');

module.exports = function(passport){
    passport.serializeUser(function(user, done){
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done){
        User.findById(id, done);
    });

    passport.use(local);
}

var local = new LocalStrategy({
        usernameField: 'email',
        passwordField: 'pass'
    }, function(email, pass, done){
        User.authenticate(email, password, function(err, user){
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, { message: 'Invalid email or password.' });
            }
            return done(null, user);
        });
    }
 );