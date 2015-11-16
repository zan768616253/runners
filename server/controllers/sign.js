'use strict';

var passport = require('passport');
var validator = require('validator');
var eventproxy = require('eventproxy');
var utility = require('utility');

var config = require('../configs/config');
var User = require('../proxys/user');
var flash = require('../helpers/helper_flash');
var mail = require('../helpers/helper_mail');
var tools = require('../helpers/helper_tools');

function signin(req, res, next){
    passport.authenticate('local-signin', function(err, user, info){
        if (err || !user) {
            res.status(500);
            return res.send(flash(500, info ,null));
        }

        req.logIn(user, function(err){
            if (err) {
                return next(err);
            }
            res.status(200);
            return res.send(flash(200, "loged in", null));
        })
    })(req, res, next);
}

function signup(req, res, next){
    var email = validator.trim(req.body.email).toLowerCase();
    var loginname = validator.trim(req.body.loginname).toLowerCase();
    var password = validator.trim(req.body.password);
    var re_password = validator.trim(req.body.re_password);

    var ep = new eventproxy();
    ep.fail(next);
    ep.on('prop_err', function(msg){
        res.status(422);
        res.send(flash(422, msg, {error: msg, loginname: loginname, email: email}));
    });

    if (loginname === '' || password === '' || re_password === '' || email === ''){
        return ep.emit('prop_err', '信息不完整。');
    }
    if (!tools.validateId(loginname)) {
        return ep.emit('prop_err', '用户名不合法。');
    }
    if (!validator.isEmail(email)) {
        return ep.emit('prop_err', '邮箱不合法。');
    }
    if (password !== re_password) {
        return ep.emit('prop_err', '两次密码输入不一致。');
    }

    User.getUsersByQuery({'$or': [{'loginname': loginname}, {'email': email}]}, {}, function(err, users){
        if (err) {
            return next(err);
        }
        if (users.length > 0) {
            res.status(422);
            return res.send(flash(422, '用户名或邮箱已被使用。', null));
        }

        var avatar_url = User.makeGravatar(email);
        User.newAndSave('', loginname, password, email, avatar_url, false, function (err){
            if (err) {
                return next(err);
            }

            mail.sendActiveMail(email, utility.md5(email + config.session_secret), loginname, email);
            res.status(200);
            return res.send(flash(200, '欢迎加入 ' + config.name + '！我们已给您的注册邮箱发送了一封邮件，请点击里面的链接来激活您的帐号。', null));
        });
    });
}

function signout(req, res, next){
    req.logout();
    res.status(200);
    return res.send(flash(200, '！用户已登出', null));
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

            mail.sendResetPassMail(email, retrieveKey, user.loginname);
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

module.exports.signin = signin;
module.exports.signup = signup;
module.exports.signout = signout;
module.exports.activeAccount = activeAccount;
module.exports.updateSearchPass = updateSearchPass;
module.exports.resetPass = resetPass;
module.exports.updatePass = updatePass;