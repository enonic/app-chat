var repoLib = require('/lib/chat/repo');
var authLib = require('/lib/xp/auth');


function create(message) {
    var repoConn = repoLib.connect();
    var userKey = authLib.getUser().key;
    var createdNode = repoConn.create({
        _parentPath: '/channels/demo',
        author: userKey,
        content: message
    });
    //TODO
    repoConn.refresh('SEARCH');
    return createdNode;
}

function getMessages() {
    var repoConn = repoLib.connect();
    return repoConn.findChildren({
        parentKey: '/channels/demo',
        count: 50,
        childOrder: '_ts ASC'
    }).hits.map(function (hit) {
        var node = repoConn.get(hit.id);
        return {
            authorName: authLib.getPrincipal(node.author).displayName,
            content: node.content
        }
    });
}

function getMessage(key) {
    var repoConn = repoLib.connect();
    var node = repoConn.get(key);
    return {
        authorName: authLib.getPrincipal(node.author).displayName,
        content: node.content
    }
}

exports.create = create;
exports.getMessages = getMessages;
exports.getMessage = getMessage;