var graphQlLib = require('/lib/graphql');
var messageLib = require('/lib/chat/message');

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
messagePublisher.offer({
    authorName: 'AUser',
    content: 'Test'
});
messagePublisher.offer({
    authorName: 'AUser',
    content: 'Test2'
});
messagePublisher.noMoreData();

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

exports.post = function (req) {
    var body = JSON.parse(req.body);
    var result = graphQlLib.execute(schema, body.query, body.variables);

    log.info('result.data: ' + result.data);
    if (result.data instanceof com.enonic.lib.graphql.Publisher) {
        result.data.subscribe(graphQlLib.createSubscriber({
            onNext: (result) => log.info(JSON.stringify(result))
        }));
    }
    return {
        contentType: 'application/json',
        body: result
    };
};