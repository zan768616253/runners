var should = require('should');

var models = require('../../../server/models');
var User = models.User;

describe('test/models/user.test.js', function () {
    it('should return proxy avatar url', function () {
        var user = new User({email: 'alsotang@gmail.com'});
        user.avatar_url.should.eql('https://gravatar.com/avatar/eeb90e7b92f78e01cac07087165e3640?size=48');
    });
});
