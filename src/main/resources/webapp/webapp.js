var router = require('./router.js');
var webSocketLib = require('/lib/xp/websocket');

exports.get = router.dispatch;

exports.webSocketEvent = function (event) {

    if (event.type == 'open') {
        webSocketLib.addToGroup('chat', event.session.id);
    }

    // if (event.type == 'message') {
    //     webSocketLib.sendToGroup('chat', event.message);
    // }

    if (event.type == 'close') {
        webSocketLib.removeFromGroup('chat', event.session.id);
    }

};