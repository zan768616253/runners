'use strict';

var LocalStrategy = require('passport-local').Strategy;
var models = require('../models');
var User = models.User;

module.exports = function(passport){
    passport.serializeUser(function(user, done){
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done){
        User.findById(id, done);
    });

    passport.use(local);
}

var local = new LocalStrategy({ usernameField: 'email', passwordField : 'password' },
    function(email, password, done){
        User.authenticate(email, password, function(err, user){
            if (err) {
                return done(err, null, { message: 'login error.' });
            }
            if (!user) {
                return done(null, false, { message: 'Invalid email or password.' });
            }
            return done(null, user, { message: 'login successfully.' });
        });
    }
 );