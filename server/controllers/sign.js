'use strict';

var passport = require('passport');
var validator = require('validator');
var eventproxy = require('eventproxy');
var utility = require('utility');

var JWTRedisService = require('../services/service_jwt');
var config = require('../configs/config');
var proxys = require('../proxys');
var helpers = require('../helpers');
var User = proxys.User;
var flash = helpers.Flash;
var mail = helpers.Mail;
var tools = helpers.Tools;
var jwtRedisService = new JWTRedisService({
    host       : config.redis.host,
    port       : config.redis.port,
    pass       : config.redis.pass,
    keyspace   : config.redis.keyspace,
    issuer     : config.auth.issuer,
    secret     : config.auth.token_secret,
    expiration : config.auth.expiration
});

function signin(req, res, next){
    var email = validator.trim(req.body.email).toLowerCase();
    var password = validator.trim(req.body.password);
    if(email && password) {
        req.user = {
            email     : email,
            password  : password
        };

        req.email = email;
        req.password = password;

        passport.authenticate('local', function(err, user, info){
            if (err) {
                res.status(500);
                return res.send(flash(500, err ,null));
            }
            if (!user){
                res.status(401);
                return res.send(flash(401, 'Unauthorized' ,null));
            }
            req.logIn(user, { session: false }, function(err){
                if (err) {
                    res.status(500);
                    return res.send(flash(500, err ,null));
                }
                return jwtRedisService.sign(user).then(function(token){
                    if (!token){
                        res.status(500);
                        return res.send(flash(500, "Authentication Interbale Err!", null));
                    }
                    res.status(200);
                    res.send(flash(200, "Authentication successful!", {
                        token   : token,
                        user    : user
                    }));
                })
            });
        })(req, res, next);
    } else{
        res.status(401);
        return res.send(flash(401, 'Not enough information to log in' ,null));
    }
}

function signout(req, res, next){
    if (!req.token){
        res.status(200);
        return res.send(flash(200, "Not loged in", null));
    }

    return jwtRedisService.expire(req.token)
        .then(function(reply){
            delete req.token;
            delete req.session;
            delete req.user;
        })
        .then(function(){
            res.status(200);
            return res.send(flash(200, "Loged out", null));
        })
}

function signup(req, res, next){
    var email = validator.trim(req.body.email).toLowerCase();
    var loginName = validator.trim(req.body.loginName).toLowerCase();
    var password = validator.trim(req.body.password);
    var re_password = validator.trim(req.body.re_password);

    var ep = new eventproxy();
    ep.fail(next);
    ep.on('prop_err', function(msg){
        res.status(422);
        res.send(flash(422, msg, {error: msg, loginName: loginName, email: email}));
    });

    if (loginName === '' || password === '' || re_password === '' || email === ''){
        return ep.emit('prop_err', '信息不完整。');
    }
    if (!tools.validateId(loginName)) {
        return ep.emit('prop_err', '用户名不合法。');
    }
    if (!validator.isEmail(email)) {
        return ep.emit('prop_err', '邮箱不合法。');
    }
    if (password !== re_password) {
        return ep.emit('prop_err', '两次密码输入不一致。');
    }

    User.getUsersByQuery({'$or': [{'login_name': loginName}, {'email': email}]}, {}, function(err, users){
        if (err) {
            return next(err);
        }
        if (users.length > 0) {
            res.status(422);
            return res.send(flash(422, '用户名或邮箱已被使用。', null));
        }

        var avatar_url = User.makeGravatar(email);
        User.newAndSave('', loginName, password, email, avatar_url, false, function (err){
            if (err) {
                return next(err);
            }

            mail.sendActiveMail(email, utility.md5(email + config.session_secret), loginName, email);
            res.status(200);
            return res.send(flash(200, '欢迎加入 ' + config.name + '！我们已给您的注册邮箱发送了一封邮件，请点击里面的链接来激活您的帐号。', null));
        });
    });
}

function activeAccount(req, res, next){
    var key  = validator.trim(req.query.key);
    var name = validator.trim(req.query.name);

    User.getUserByLoginName(name, function (err, user){
        if (err) {
            return next(err);
        }
        if (!user) {
            return next(new Error('[ACTIVE_ACCOUNT] no such user: ' + name));
        }
        var passhash = user.pass;
        if (!user) {
            res.status(422);
            return res.send(flash(422, '信息有误，帐号无法被激活。', null));
        }
        if (user.active) {
            res.status(422);
            return res.send(flash(422, '帐号已经是激活状态。', null));
        }
        user.active = true;
        user.save(function(err){
            if (err) {
                return next(err);
            }
            res.status(200);
            return res.send(flash(200, '帐号已经是激活状态。', null));
        });
    });
}

function updateSearchPass(req, res, next) {
    var email = validator.trim(req.body.email).toLowerCase();
    if (!validator.isEmail(email)) {
        res.status(422);
        return res.send(flash(422, '邮箱不合法。', null));
    }

    // 动态生成retrive_key和timestamp到users collection,之后重置密码进行验证
    var retrieveKey  = uuid.v4();
    var retrieveTime = new Date().getTime();

    User.getUserByMail(email, function (err, user){
        if (!user) {
            res.status(422);
            return res.send(flash(422, '没有这个电子邮箱。', null));
        }

        user.retrieve_key = retrieveKey;
        user.retrieve_time = retrieveTime;

        user.save(function (err){
            if (err) {
                return next(err);
            }

            mail.sendResetPassMail(email, retrieveKey, user.loginName);
            return res.render('', {success: '我们已给您填写的电子邮箱发送了一封邮件，请在24小时内点击里面的链接来重置密码。'});
        });
    });
}

function resetPass(req, res, next){
    var key  = validator.trim(req.query.key);
    var name = validator.trim(req.query.name);

    User.getUserByNameAndKey(name, key, function (err, user) {
        if (!user) {
            res.status(422);
            return res.send(flash(422, '信息有误，密码无法重置。', null));
        }
        var now = new Date().getTime();
        var oneDay = 1000 * 60 * 60 * 24;
        if (!user.retrieve_time || now - user.retrieve_time > oneDay){
            res.status(422);
            return res.send(flash(422, '该链接已过期，请重新申请。', null));
        }
        res.status(200);
        return res.send(flash(200, '密码可以重置。', {name: name, key: key}));
    });
}

function updatePass (req, res, next){
    var psw   = validator.trim(req.body.psw) || '';
    var repsw = validator.trim(req.body.repsw) || '';
    var key   = validator.trim(req.body.key) || '';
    var name  = validator.trim(req.body.name) || '';

    var ep = new eventproxy();
    ep.fail(next);

    if (psw !== repsw) {
        res.status(422);
        return res.send(flash(422, '两次密码输入不一致。', null));
    }
    User.getUserByNameAndKey(name, key,
        ep.done(function (user) {
            if (!user) {
                res.status(422);
                return res.send(flash(422, '错误的激活链接。', null));
            }

            user.pass = psw;
            user.retrieve_key = null;
            user.retrieve_time = null;
            user.active = true; // 用户激活

            user.save(function(err){
                if (err) {
                    return next(err);
                }
                res.status(200);
                return res.send(flash(200, '你的密码已重置。', null));
            })
        })
    );
}

function checkEmail(req, res, next){
    var email = validator.trim(req.body.email).toLowerCase();

    User.getUserByMail(email, function(err, user){
        if (err) {
            return next(err);
        }
        if (user) {
            return res.send(flash(422, '邮箱已被使用。', null));
        }

        return res.send(flash(200, '邮箱可以使用。', null));
    });
}


function checkLoginname(req, res, next){
    var loginName = validator.trim(req.body.loginName).toLowerCase();

    User.getUserByLoginName(loginName, function(err, user){
        if (err) {
            return next(err);
        }
        if (user) {
            return res.send(flash(422, '用户名已被使用。', null));
        }

        return res.send(flash(200, '用户名可以使用。', null));
    });
}


module.exports.signin = signin;
module.exports.signup = signup;
module.exports.signout = signout;
module.exports.activeAccount = activeAccount;
module.exports.updateSearchPass = updateSearchPass;
module.exports.resetPass = resetPass;
module.exports.updatePass = updatePass;
module.exports.checkEmail = checkEmail;
module.exports.checkLoginname = checkLoginname;