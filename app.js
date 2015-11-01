var express = require('express');
var session = require('express-session');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');

var routes = require('./server/routes/index.js');
var User = require('./server/models/user.js');

var app = express();

app.set('view engine', 'html'); //for angular use
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static("app"));
app.use("/bower_components",express.static(path.join(__dirname, 'bower_components')));
app.use('/', routes);

module.exports = app;
