var mailer = require('nodemailer');
var util = require('util');

var config = require('../configs/config.js');
var transporter = mailer.createTransport(config.mail_opts_gmail);
var SITE_ROOT_URL = 'http://' + config.hostname;

var sendMail = function (data) {
    if (config.debug) {
        return;
    }
    // 遍历邮件数组，发送每一封邮件，如果有发送失败的，就再压入数组，同时触发mailEvent事件
    transporter.sendMail(data, function (err, info) {
        if (err) {
            // 写为日志
            console.log(err);
        }
    });
};
exports.sendMail = sendMail;

exports.sendActiveMail = function (who, token, name) {
    var from    = util.format('%s <%s>', config.name, config.mail_opts_gmail.auth.user);
    var to      = who;
    var subject = config.name + '社区帐号激活';
    var html    = '<p>您好：' + name + '</p>' +
        '<p>我们收到您在' + config.name + '社区的注册信息，请点击下面的链接来激活帐户：</p>' +
        '<a href  = "' + SITE_ROOT_URL + '/active_account?key=' + token + '&name=' + name + '">激活链接</a>' +
        '<p>若您没有在' + config.name + '社区填写过注册信息，说明有人滥用了您的电子邮箱，请删除此邮件，我们对给您造成的打扰感到抱歉。</p>' +
        '<p>' + config.name + '社区 谨上。</p>';

    exports.sendMail({
        from: from,
        to: to,
        subject: subject,
        text: 'hello world!',
        html: html
    });
};

exports.sendResetPassMail = function (who, token, name) {
    var from = util.format('%s <%s>', config.name, config.mail_opts.auth.user);
    var to = who;
    var subject = config.name + '社区密码重置';
    var html = '<p>您好：' + name + '</p>' +
        '<p>我们收到您在' + config.name + '社区重置密码的请求，请在24小时内单击下面的链接来重置密码：</p>' +
        '<a href="' + SITE_ROOT_URL + '/reset_pass?key=' + token + '&name=' + name + '">重置密码链接</a>' +
        '<p>若您没有在' + config.name + '社区填写过注册信息，说明有人滥用了您的电子邮箱，请删除此邮件，我们对给您造成的打扰感到抱歉。</p>' +
        '<p>' + config.name + '社区 谨上。</p>';

    exports.sendMail({
        from: from,
        to: to,
        subject: subject,
        html: html
    });
};
