var express = require('express');
var session = require('express-session');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');
var passport = require('passport');
var mongoose = require('mongoose');
var mongoStore = require('connect-mongo')(session);

var routes = require('./server/routes/index');
var config = require('./server/configs/config');
var config_passport = require('./server/configs/config_passport');

var app = express();

app.set('view engine', 'html'); //for angular use
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cookieSession({ secret: 'secret' }));

app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: 'secret',
    store: new mongoStore({
        url: config.db,
        collection : 'sessions'
    })
}));

app.use(require('express-session')({
    secret: 'runners-secret',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static("app"));
app.use("/bower_components", express.static(path.join(__dirname, 'bower_components')));

config_passport(passport);
routes(app, passport);

module.exports = app;
