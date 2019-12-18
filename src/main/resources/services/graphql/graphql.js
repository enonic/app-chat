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

var schema = graphQlLib.createSchema({
    query: rootQueryType
});

exports.post = function (req) {
    var body = JSON.parse(req.body);
    var result = graphQlLib.execute(schema, body.query, body.variables);
    return {
        contentType: 'application/json',
        body: result
    };
};