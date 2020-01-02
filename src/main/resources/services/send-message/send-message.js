var messageLib = require('/lib/chat/message');
var webSocketLib = require('/lib/xp/websocket');

exports.post = function (req) {
    const body = JSON.parse(req.body);
    const createdMessageNode = messageLib.create(body.message);
    const message = messageLib.getMessage(createdMessageNode._id);
    const messageJson = JSON.stringify(message);
    webSocketLib.sendToGroup('rest', messageJson);

    return {
        contentType: 'application/json',
        body: messageJson
    };
};