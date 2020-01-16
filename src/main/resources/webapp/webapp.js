var router = require('./router.js');
var graphQlLib = require('/lib/chat/graphql');
var webSocketLib = require('/lib/xp/websocket');

exports.get = router.dispatch;

exports.webSocketEvent = function (event) {
    log.debug('WebSocketEvent: ' + JSON.stringify(event));

    if (event.type == 'open') {
        log.debug('WebSocketEvent - Open: Add [' + event.session.id + '] to group [' + event.data.group + ']');
        webSocketLib.addToGroup(event.data.group, event.session.id);
    }

    if (event.type == 'close') {
        log.debug('WebSocketEvent - Close: Remove [' + event.session.id + '] from group [' + event.data.group + ']');
        webSocketLib.removeFromGroup(event.data.group, event.session.id);
    }

    if (event.type == 'message') {
        log.debug('WebSocketEvent - Message');
        if ('graphql' === event.data.group) {
            var sessionId = event.session.id;
            var message = JSON.parse(event.message);
            var result = graphQlLib.execute(message.query, message.variables);

            if (result.data instanceof com.enonic.lib.graphql.Publisher) {
                log.debug('WebSocketEvent - Subscription [' + sessionId + ']');
                result.data.subscribe(graphQlLib.createSubscriber({
                    onNext: (result) => {
                        log.debug('Sending WS event to [' + sessionId + ']: ' + JSON.stringify(result));
                        webSocketLib.send(sessionId, JSON.stringify(result));
                    }
                }));
            }
        }
    }
};