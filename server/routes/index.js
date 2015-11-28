var express = require('express');
var site = require('../controllers/site');
var sign = require('../controllers/sign');
var user = require('../controllers/user');
var auth = require('../middlewares/authorization')
var router = express.Router();

module.exports = function (app, passport){

    app.get('/', site.index);

    app.post('/signin', sign.signin);
    app.post('/signup', sign.signup);
    app.post('/signout', sign.signout);
    app.post('/checkemail', sign.checkEmail);
    app.post('/checkloginname', sign.checkLoginname);
};
