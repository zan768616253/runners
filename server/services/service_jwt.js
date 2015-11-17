'use strict';

var _ = require('lodash');
var util = require('util');
var uuid = require('node-uuid');
var jwt = require('jsonwebtoken');
var eventproxy = require('eventproxy');

var SECOND = 1000;

var JWTServiceError = function JWTServiceError(message){
    Error.call(this);
    this.name = 'JWTServiceError';
    this.message = message;
};

var UnauthorizedAccessError = function UnauthorizedAccessError(message){
    Error.call(this);
    this.name = 'UnauthorizedAccessError';
    this.message = message || 'Token verification failed. User not authenticated or token expired.';
};

var NoTokenProvidedError = function NoTokenProvidedError(message){
    Error.call(this);
    this.name = 'NoTokenProvidedError';
    this.message = message || 'No token provided.';
};

util.inherits(JWTServiceError, Error);
util.inherits(UnauthorizedAccessError, Error);
util.inherits(NoTokenProvidedError, Error);

var JWTService = function JWTService(config){
    this.issuer     = config.issuer;
    this.secret     = config.secret;
    this.keyspace   = config.keyspace;
    this.expiration = config.expiration;
}

JWTService.prototype.sign = function(data){
    var jti = uuid.v4();
    var token = jwt.sign({ jti: jti }, this.secret, {
        issuer           : this.issuer,
        expiresInSeconds : this.expiration / SECOND
    });

    return token;
}