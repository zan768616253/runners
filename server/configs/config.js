var config = {
    debug: false,
    hostname: 'localhost.runners.org',
    port: 3000,
    name: 'runner-club',
    db: 'mongodb://127.0.0.1/runners-dev',
    auth: {
        expiration : 30 * 60 * 1000,
        token_secret : 'runners-secret'
    },


    mail_opts_gmail: {
        service: 'Gmail',
        auth: {
            user: 'wangzan768616253@gmail.com',
            pass: '521ranran521'
        }
    },

}

if (process.env.NODE_ENV === 'test') {
    config.db = 'mongodb://localhost/runners-test';
}

module.exports = config;
