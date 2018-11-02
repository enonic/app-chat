var authLib = require('/lib/xp/auth');
var router = require('./router.js');

exports.get = function (req) {

    // if (!authLib.getUser()) {
    //     return {
    //         status: 401
    //     }
    // }

    return router.dispatch(req);
};