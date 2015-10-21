var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');

var app = express();
app.set('view engine', 'html'); //for angular use
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static("app"));
app.use("/bower_components",express.static(path.join(__dirname, 'bower_components')));
app.use('/', routes);

module.exports = app;