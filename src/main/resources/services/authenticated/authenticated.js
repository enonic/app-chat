var authLib = require('/lib/xp/auth');

exports.get = function () {
    return {
        contentType: 'application/json',
        body: JSON.stringify({
            authenticated: !!authLib.getUser()
        })
    };
};