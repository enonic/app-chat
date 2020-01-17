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

// var messagePublishers = [];
// eventLib.listener({
//     type: 'node.created',
//     callback: function (event) {
//         log.debug('Event - node.created: ' + JSON.stringify(event));
//         const id = event.data.nodes[0].id;
//         const message = messageLib.getMessage(id);
//         if (message) {
//             const publishers = Java.synchronized(() => messagePublishers.slice(0), messagePublishers)();
//             log.debug('Event - Sending to [' + publishers.length + '] publishers: ' + JSON.stringify(message));
//             publishers.forEach(publisher => publisher.onNext(message));
//         }
//     }
// });

// var rootSubscriptionType = graphQlLib.createObjectType({
//     name: 'Subscription',
//     fields: {
//         messages: {
//             type: messageType,
//             resolve: () => {
//                 log.debug('Creating publisher');
//                 const publisher = graphQlLib.createSingleSubscriberPublisher();
//                 Java.synchronized(() => messagePublishers.push(publisher), messagePublishers)();
//                 return publisher;
//             }
//         }
//     }
// });


var emitters = [];
eventLib.listener({
    type: 'node.created',
    callback: function (event) {
        log.debug('Event - node.created: ' + JSON.stringify(event));
        const id = event.data.nodes[0].id;
        const message = messageLib.getMessage(id);
        if (message) {
            const currentEmitters = Java.synchronized(() => emitters.slice(0), emitters)();
            log.debug('Event - Sending to [' + currentEmitters.length + '] publishers: ' + JSON.stringify(message));
            currentEmitters.forEach(emitter => emitter.onNext(message));
        }
    }
});


var rootSubscriptionType = graphQlLib.createObjectType({
    name: 'Subscription',
    fields: {
        messages: {
            type: messageType,
            resolve: () => {
                log.debug('Creating publisher');
                const publisher = graphQlLib.createOnSubscribePublisher({
                    onSubscribe: emitter => {
                        Java.synchronized(() => emitters.push(emitter), emitters)();
                    },
                    onCancel: (emitter) => {
                        Java.synchronized(() => {
                            let index = emitters.indexOf(emitter);
                            if (index !== -1) {
                                emitters.splice(index, 1);
                            }
                        }, emitters)();
                    }
                });
                return publisher;
            }
        }
    }
});


// var rootSubscriptionType = graphQlLib.createObjectType({
//     name: 'Subscription',
//     fields: {
//         messages: {
//             type: messageType,
//             resolve: () => {
//                 const publisher = graphQlLib.createOnSubscribePublisher(emitter => {
//                     eventLib.listener({
//                         type: 'node.created',
//                         callback: function (event) {
//                             log.info(JSON.stringify(event));
//                             const id = event.data.nodes[0].id;
//                             const message = messageLib.getMessage(id);
//                             log.info('message:' + JSON.stringify(message));
//                             if (message) {
//                                 emitter.onNext(message);
//                             }
//                         }
//                     });
//                 });
//                 return publisher;
//             }
//         }
//     }
// });


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