(function(exports){
    var loginStatus = {
        Success: 'login successful',
        Failed: 'login failed'
    }

    exports.loginStatus = loginStatus;
})(typeof exports === 'undefined' ? this['config'] = {} : exports);