var flash = require('../helpers/helper_flash.js');

function ensureAuthenticated(req, res, next){
    if (req.isAuthenticated()) return next();
    return res.send(401, 'login needed' ,null);
}

exports.ensureAuthenticated = ensureAuthenticated;

