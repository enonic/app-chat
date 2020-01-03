const graphQlLib = require('/lib/chat/graphql');

exports.post = function (req) {
    var body = JSON.parse(req.body);
    var result = graphQlLib.execute(body.query, body.variables);

    // log.info('result.data: ' + result.data);
    // if (result.data instanceof com.enonic.lib.graphql.Publisher) {
    //     result.data.subscribe(graphQlLib.createSubscriber({
    //         onNext: (result) => log.info(JSON.stringify(result))
    //     }));
    // }
    return {
        contentType: 'application/json',
        body: result
    };
};