var flash = require('../helpers/helper_flash.js');

exports.index = function (req, res, next){
    res.status(200);
    return res.render('index');
}