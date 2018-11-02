var authLib = require('/lib/xp/auth');
var router = require('./router.js');

exports.get = function (req) {
    return router.dispatch(req);
};