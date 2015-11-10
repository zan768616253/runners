var express = require('express');
var sign = require('../controllers/sign.js');
var user = require('../controllers/user.js');
var auth = require('../middlewares/authorization.js')
var router = express.Router();

module.exports = function (app, passport){

    app.post('/signin', sign.signin);



};
