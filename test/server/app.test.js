process.env.NODE_ENV = 'test';

var app = require('../../server/app');
var config = require('../../server/configs/config');

var request = require('supertest')(app);
var should = require('should');

describe('test/app.test.js', function (){
    it('should / status 200', function (done){
        request.get('/').end(function (err, res){
                res.status.should.equal(200);
                done();
            }
        );
    })
});