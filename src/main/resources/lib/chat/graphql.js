var graphQlLib = require('/lib/graphql');
var messageLib = require('/lib/chat/message');
var eventLib = require('/lib/xp/event');

var messageType = graphQlLib.createObjectType({
    name: 'Message',
    fields: {
        authorName: {
            type: graphQlLib.GraphQLString
        },
        content: {
            type: graphQlLib.GraphQLString
        },
    }
});

var rootQueryType = graphQlLib.createObjectType({
    name: 'Query',
    fields: {
        messages: {
            type: graphQlLib.list(messageType),
            resolve: messageLib.getMessages
        }
    }
});


var messagePublisher = graphQlLib.createPublisher({});
eventLib.listener({
    type: 'node.created',
    callback: function (event) {
        log.info(JSON.stringify(event));
        const id = event.data.nodes[0].id;
        const message = messageLib.getMessage(id);
        log.info('message:' + JSON.stringify(message));
        if (message) {
            messagePublisher.offer(message);
        }
    }
});

var rootSubscriptionType = graphQlLib.createObjectType({
    name: 'Subscription',
    fields: {
        messages: {
            type: messageType,
            resolve: () => messagePublisher
        },
        messages2: {
            type: messageType,
            resolve: () => messagePublisher
        }
    }
});

var schema = graphQlLib.createSchema({
    query: rootQueryType,
    subscription: rootSubscriptionType,
});

function execute(query, variables) {
    return graphQlLib.execute(schema, query, variables);
}

function createSubscriber(params) {
    return graphQlLib.createSubscriber(params);
}

exports.execute = execute;
exports.createSubscriber = createSubscriber;