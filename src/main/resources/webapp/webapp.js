var router = require('./router.js');
var graphQlLib = require('/lib/chat/graphql');
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
        if ('graphql' === event.data.group) {
            log.info('Received a GraphQL WS message: ' + JSON.stringify(event));

            var sessionId = event.session.id;
            var message = JSON.parse(event.message);
            var result = graphQlLib.execute(message.query, message.variables);

            if (result.data instanceof com.enonic.lib.graphql.Publisher) {
                result.data.subscribe(graphQlLib.createSubscriber({
                    onNext: (result) => {
                        log.info('Sending WS event to [' + sessionId + ']: ' + JSON.stringify(result));
                        webSocketLib.send(sessionId, JSON.stringify(result));
                    }
                }));
            }
        }
    }
};