var eventLib = require('/lib/xp/event');
var webSocketLib = require('/lib/xp/websocket');
var messageLib = require('/lib/chat/message');
require('/lib/chat/repo').init();

eventLib.listener({
    type: 'node.created',
    callback: function (event) {
        log.debug('Event - node.created: ' + JSON.stringify(event));
        const id = event.data.nodes[0].id;
        const message = messageLib.getMessage(id);
        if (message) {
            webSocketLib.sendToGroup('rest', JSON.stringify(message));
        }
    }
});

log.info('Chat application started');