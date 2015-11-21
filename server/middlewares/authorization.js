var JWTRedisService = require('../services/service_jwt');
var config = require('../configs/config');
var helpers = require('../helpers');
var flash = helpers.Flash;
var jwtRedisService = new JWTRedisService({
    host       : config.redis.host,
    port       : config.redis.port,
    pass       : config.redis.pass,
    keyspace   : config.redis.keyspace,
    issuer     : config.auth.issuer,
    secret     : config.auth.token_secret,
    expiration : config.auth.expiration
});


function ensureAuthenticated(req, res, next){
    return jwtRedisService.verify(req.token)
        .spread(function(jti, user){
            req.session = {
                jti  : jti,
                user : JSON.parse(user)
            };
            next();
        })
        .catch(JWTRedisService.NoTokenProvidedError, JWTRedisService.UnauthorizedAccessError,
            function(){
                res.status(401);
                return res.send(flash(401, 'Unauthorized' ,null));
            }
        )
}

exports.ensureAuthenticated = ensureAuthenticated;

