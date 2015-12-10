var app = require('../../../server/app');
var request = require('supertest')(app);
var agent = require('supertest').agent(app);
var should = require('should');
var utility = require('utility');
var pedding = require('pedding');

var config = require('../../../server/configs/config');
var UserProxy = require('../../../server/proxys').User;
var SuperAgentUtils = require('../superagent_utils');

var agentUtils = new SuperAgentUtils(agent);

describe('test/controllers/sign.test.js', function (){
        var now = +new Date();
        var loginName = 'testuser' + now;
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

        describe('sign up', function () {
            it('should sign up a user', function (done) {
                request.post('/signup')
                    .send({
                        loginName: loginName,
                        email: email,
                        password: pass,
                        re_password: pass,
                    })
                    .expect(200, function(err, res){
                        should.not.exists(err);
                        res.text.should.containEql('欢迎加入');
                        UserProxy.getUserByLoginName(loginName, function (err, user){
                            should.not.exists(err);
                            user.should.ok;
                            done();
                        })
                    })
            });

            it('should not sign up a user when email is exists', function(done){
                request.post('/signup')
                    .send({
                        loginName: loginName + '1',
                        email: email,
                        pass: pass,
                        re_pass: pass,
                    })
                    .expect(422, done);
            });
        });

        describe('sign in', function (){
            it('should respond 401 (invalid credentials)', function(done){
                request.post('/signin')
                    .send({
                        email: 'fake@user.com',
                        password: 'fake_password',
                    })
                    .expect(401, function(err, res){
                        should.not.exists(err);
                        res.body.should.not.be.empty;
                        res.body.status.message.should.equal('Unauthorized');
                        done();
                    })
            });

            it('should respond 401 (missing credentials)', function(done){
                request.post('/signin')
                    .expect(401, function(err, res){
                        should.not.exists(err);
                        res.body.should.not.be.empty;
                        res.body.status.message.should.equal('Not enough information to log in');
                        done();
                    });
            });

            it('should respond 401 (invalid password)', function(done){
                request.post('/signin')
                    .send({
                        email: email,
                        password: 'fake_password',
                    })
                    .expect(401, function(err, res){
                        should.not.exists(err);
                        res.body.should.not.be.empty;
                        res.body.status.message.should.equal('Unauthorized');
                        done();
                    })
            })

            it('should respond 200', function(done){
                request.post('/signin')
                    .send({
                        email: email,
                        password: pass,
                    })
                    .expect(200, function(err, res){
                        should.not.exists(err);
                        res.body.should.not.be.empty;
                        res.body.status.message.should.equal('Authentication successful!');
                        done();
                    })
            })
        });

        describe('sign out', function (){
            it('should respond 204', function(done){
                request.post('/signout')
                    .expect(200).end(done);
            })
        });

        describe('email existed', function(){
            it('should exist', function(done){
                request.post('/checkemail')
                    .send({
                        email: email
                    })
                    .expect(200, function(err, res){
                        should.not.exists(err);
                        res.body.should.not.be.empty;
                        res.body.status.message.should.equal('邮箱已被使用。');
                        done();
                    })
            });

            it('should not exist', function(done){
                request.post('/checkemail')
                    .send({
                        email: 'fake@user.com'
                    })
                    .expect(200, function(err, res){
                        should.not.exists(err);
                        res.body.should.not.be.empty;
                        res.body.status.message.should.equal('邮箱可以使用。');
                        done();
                    })
            });
        });

        describe('login_name existed', function(){
            it('should exist', function(done){
                request.post('/checkloginname')
                    .send({
                        loginName: loginName
                    })
                    .expect(200, function(err, res){
                        should.not.exists(err);
                        res.body.should.not.be.empty;
                        res.body.status.message.should.equal('用户名已被使用。');
                        done();
                    })
            });

            it('should not exist', function(done){
                request.post('/checkloginname')
                    .send({
                        loginName: 'fakeuser'
                    })
                    .expect(200, function(err, res){
                        should.not.exists(err);
                        res.body.should.not.be.empty;
                        res.body.status.message.should.equal('用户名可以使用。');
                        done();
                    })
            });
        });
    }
);