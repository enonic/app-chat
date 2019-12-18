var messageLib = require('/lib/chat/message');
var webSocketLib = require('/lib/xp/websocket');

exports.post = function (req) {

    var body = JSON.parse(req.body);

    messageLib.create(body.message);

    webSocketLib.sendToGroup('chat', body.message);

    return {
        contentType: 'application/json',
        body: JSON.stringify([
            {content: 'message1'},
            {content: 'message2'}
        ])
    };
};