var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var BB = require('bluebird');
var redis = require('redis');
var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');

var routes = require('./routes/index');
var config = require('./configs/config');
var config_passport = require('./configs/config_passport');
var helpers = require('./helpers/index');


var TokenExtractor = helpers.TokenExtractor;

var app = express();

app.set('view engine', 'html'); //for angular use
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(passport.initialize());

app.use(express.static(path.join(__dirname, config.client.root)));
console.log(path.join(__dirname, config.client.root));
app.use("/bower_components", express.static(path.join(__dirname, config.client.bower)));

config_passport(passport);
routes(app, passport);

app.use(TokenExtractor);

BB.promisifyAll(mongoose.Model);
BB.promisifyAll(mongoose.Model.prototype);
BB.promisifyAll(mongoose.Query.prototype);
BB.promisifyAll(redis.RedisClient.prototype);
BB.promisifyAll(jwt);

module.exports = app;
