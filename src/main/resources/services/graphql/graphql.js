const graphQlLib = require('/lib/chat/graphql');

exports.post = function (req) {
    var body = JSON.parse(req.body);
    var result = graphQlLib.execute(body.query, body.variables);
    return {
        contentType: 'application/json',
        body: result
    };
};