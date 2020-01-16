var messageLib = require('/lib/chat/message');

exports.post = function (req) {
    const body = JSON.parse(req.body);
    const createdMessageNode = messageLib.create(body.message);
    const message = messageLib.getMessage(createdMessageNode._id);
    const messageJson = JSON.stringify(message);
    return {
        contentType: 'application/json',
        body: messageJson
    };
};