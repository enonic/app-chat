var router = require('./router.js');
var webSocketLib = require('/lib/xp/websocket');

exports.get = router.dispatch;

exports.webSocketEvent = function (event) {
    log.info('webSocketEvent: ' + JSON.stringify(event));

    if (event.type == 'open') {
        webSocketLib.addToGroup(event.data.group, event.session.id);
    }

    if (event.type == 'close') {
        webSocketLib.removeFromGroup(event.data.group, event.session.id);
    }

    if (event.type == 'message') {

    }
};