var repoLib = require('/lib/chat/repo');
var authLib = require('/lib/xp/auth');


function create(message) {
    var repoConn = repoLib.connect();
    var userKey = authLib.getUser().key;
    repoConn.create({
        _parentPath: '/channels/demo',
        author: userKey,
        content: message
    });
    //TODO
    repoConn.refresh('SEARCH');
}

function getMessages() {
    var repoConn = repoLib.connect();
    return repoConn.findChildren({
        parentKey: '/channels/demo',
        count: 50
    }).hits.map(function (hit) {
        var node = repoConn.get(hit.id);
        return {
            authorName: authLib.getPrincipal(node.author).displayName,
            content: node.content
        }
    });
}

exports.create = create;
exports.getMessages = getMessages;