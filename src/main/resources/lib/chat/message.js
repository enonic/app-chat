var repoLib = require('/lib/chat/repo');
var authLib = require('/lib/xp/auth');


function create(message) {
    var repoConn = repoLib.connect();
    var userKey = authLib.getUser().key;
    repoConn.create({
        _parentPath: '/channels/demo',
        author: userKey,
        message: message
    });
    //TODO
    repoConn.refresh('SEARCH');
}

exports.create = create;