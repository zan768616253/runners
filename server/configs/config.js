var config = {
    debug: false,
    hostname: 'localhost.runners.org',
    port: process.env.PORT || 3000,
    name: 'runner-club',
    db: 'mongodb://127.0.0.1/runners-dev',
    logs: false,
    auth: {
        issuer : 'runners',
        expiration : 30 * 60 * 1000,
        token_secret : 'runners-secret'
    },
    client: {
        root   : '/app',
        tmp    : '',
    },
    redis: {
        keyspace : 'session:',
        host     : process.env.REDIS_URL ? url.parse(process.env.REDIS_URL).hostname           : undefined,
        port     : process.env.REDIS_URL ? url.parse(process.env.REDIS_URL).port               : undefined,
        pass     : process.env.REDIS_URL ? url.parse(process.env.REDIS_URL).auth.split(':')[1] : undefined
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
