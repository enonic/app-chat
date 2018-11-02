var messageLib = require('/lib/chat/message')

exports.post = function (req) {
    var body = JSON.parse(req.body);

    messageLib.create(body.message);
    return {
        contentType: 'application/json',
        body: JSON.stringify([
            {content: 'message1'},
            {content: 'message2'}
        ])
    };
};