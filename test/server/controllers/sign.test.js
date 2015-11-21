var app = require('../../../../runners/app');
var request = require('supertest')(app);
var agent = require('supertest').agent(app);
var should = require('should');
var utility = require('utility');
var pedding = require('pedding');
var mm = require('mm');

var config = require('../../../server/configs/config');
var UserProxy = require('../../../server/proxys').User;
var SuperAgentUtils = require('../superagent_utils');
var UserSeed = require('../../../../runners/seeds/user');

var agentUtils = new SuperAgentUtils(agent);

describe('test/controllers/sign.test.js', function (){
        var now = +new Date();
        var loginname = 'testuser' + now;
        var email = 'testuser' + now + '@gmail.com';
        var pass = 'wtffffffffffff';
        var usersToSeed = 10;

        var performLogin = function(user, password){
            return request.post('/signin')
                .send({
                    email : user.email,
                    pass : password
                })
                .endAsync()
                .then(agentUtils.saveJWT.bind(agentUtils));
        };

        afterEach(function () {
            mm.restore();
        });

        describe('sign up', function () {
            it('should sign up a user', function (done) {
                done = pedding(done, 1);

                request.post('/signup')
                    .send({
                        loginname: loginname,
                        email: email,
                        password: pass,
                        re_password: pass,
                    })
                    .expect(200, function(err, res){
                        should.not.exists(err);
                        res.text.should.containEql('欢迎加入');
                        UserProxy.getUserByLoginName(loginname, function (err, user){
                            should.not.exists(err);
                            user.should.ok;
                            done();
                        })
                    })
            });

            it('should not sign up a user when email is exists', function(done){
                request.post('/signup')
                    .send({
                        loginname: loginname + '1',
                        email: email,
                        pass: pass,
                        re_pass: pass,
                    })
                    .expect(422, done);
            })
        });
    }
);