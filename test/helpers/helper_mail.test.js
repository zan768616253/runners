var mail = require('../../server/helpers/helper_mail');

describe('test/helpers/helper_mail.test.js', function(){
    describe('sendActiveMail', function(){
        it('should ok', function(){
            mail.sendActiveMail('768616253@qq.com', 'token', 'eric');
        })
    })
})