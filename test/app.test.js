process.env.NODE_ENV = 'test';

var request = require('supertest');
var should = require('should');

var app = require('../app');
var config = require('../server/configs/config');

describe('test/app.test.js', function (){
    it('should / status 200', function (done){
        request(app).get('/').end(function (err, res){
                res.status.should.equal(200);
                done();
            }
        );
    })
});