var messageLib = require('/lib/chat/message');

exports.get = function () {
    var messages = messageLib.getMessages();
    return {
        contentType: 'application/json',
        body: JSON.stringify(messages)
    };
};