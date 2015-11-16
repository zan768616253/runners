var config = {
    debug: false,
    hostname: 'localhost.runners.org',
    port: 3000,
    name: 'runner-club',
    db: 'mongodb://127.0.0.1/runners-dev',

    mail_opts_gmail: {
        service: 'Gmail',
        auth: {
            user: 'wangzan768616253@gmail.com',
            pass: '521ranran521'
        }
    },
    //mail_opts_126: {
    //    host: 'smtp.126.com',
    //    port: 25,
    //    auth: {
    //        user: 'runnerclub@126.com',
    //        pass: 'runners'
    //    }
    //},


}

if (process.env.NODE_ENV === 'test') {
    config.db = 'mongodb://localhost/runners-test';
}

module.exports = config;
