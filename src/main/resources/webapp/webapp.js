var router = require('./router.js');
var graphQlLib = require('/lib/chat/graphql');
var webSocketLib = require('/lib/xp/websocket');

exports.get = router.dispatch;

var graphQlSubscribers = {};

exports.webSocketEvent = function (event) {
    log.debug('WebSocketEvent: ' + JSON.stringify(event));

    if (event.type == 'open') {
        log.debug('WebSocketEvent - Open: Add [' + event.session.id + '] to group [' + event.data.group + ']');
        webSocketLib.addToGroup(event.data.group, event.session.id);
    }

    if (event.type == 'close') {
        log.debug('WebSocketEvent - Close: Remove [' + event.session.id + '] from group [' + event.data.group + ']');
        webSocketLib.removeFromGroup(event.data.group, event.session.id);

        const graphQlSubscriber = removeSubscriber(event.session.id);
        if (graphQlSubscriber) {
            log.debug('WebSocketEvent - Cancel subscription [' + event.session.id + ']');
            graphQlSubscriber.cancelSubscription();
        }
    }

    if (event.type == 'message') {
        log.debug('WebSocketEvent - Message');
        if ('graphql' === event.data.group) {
            var sessionId = event.session.id;
            var message = JSON.parse(event.message);
            var result = graphQlLib.execute(message.query, message.variables);

            if (result.data instanceof com.enonic.lib.graphql.Publisher) {
                log.debug('WebSocketEvent - Subscription [' + sessionId + ']');

                const subscriber = graphQlLib.createSubscriber({
                    onNext: (result) => {
                        log.debug('Sending WS event to [' + sessionId + ']: ' + JSON.stringify(result));
                        webSocketLib.send(sessionId, JSON.stringify(result));
                    }
                });
                storeSubscriber(sessionId, subscriber);
                result.data.subscribe(subscriber);
            }
        }
    }
};

function storeSubscriber(sessionId, subscriber) {
    log.debug('WebSocketEvent - Store subscriber [' + sessionId + ']');
    Java.synchronized(() => graphQlSubscribers[sessionId] = subscriber, graphQlSubscribers)();
}

function removeSubscriber(sessionId) {
    log.debug('WebSocketEvent - Remove subscriber [' + sessionId + ']');
    return Java.synchronized(() => {
        const subscriber = graphQlSubscribers[sessionId];
        if (subscriber) {
            delete  graphQlSubscribers[sessionId];
        }
        return subscriber;
    }, graphQlSubscribers)();
}