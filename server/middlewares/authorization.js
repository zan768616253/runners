var flash = require('../helpers/helper_flash.js');

exports.requiresLogin = function (req, res, next) {
    if (req.isAuthenticated()) return next()
    if (req.method == 'GET') req.session.returnTo = req.originalUrl
    return res.send(401, 'login needed' ,null);
}

