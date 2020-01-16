function retrieveMessages() {
    document.getElementById('main').innerHTML = '';

    if (useGraphQl()) {
        fetch(config.serviceUrl + '/graphql', {
            method: 'POST',
            body: "{\"query\":\"{messages{authorName content}}\\n\"}"
        })
            .then(response => response.json())
            .then(json => json.data.messages)
            .then(handleRetrievedMessages);
    } else {
        fetch(config.serviceUrl + '/get-messages')
            .then(response => response.json())
            .then(handleRetrievedMessages);
    }
}

function handleRetrievedMessages(messages) {
    messages.forEach(handleRetrievedMessage);
}

function handleRetrievedMessage(message) {
    const messageElement = document.createElement('span');
    messageElement.innerHTML = '<b>' + message.authorName + ':</b> ' + message.content;
    document.getElementById('main').prepend(messageElement);
}

function onSend() {
    const message = document.getElementById('message-textarea').value;
    document.getElementById('message-textarea').value = '';

    fetch(config.serviceUrl + '/send-message', {
        method: 'POST',
        body: JSON.stringify({
            message: message
        })
    });
}

function checkAuthenticated() {
    fetch(config.serviceUrl + '/authenticated')
        .then(response => response.json())
        .then(json => {
            if (!json.authenticated) {
                location = config.loginUrl;
            } else {
                retrieveMessages();
            }
        })
        .catch(error => {
            const messageElement = document.createElement('span');
            messageElement.innerHTML = '<b>ERROR - ' + error.message + '</b>';
            document.getElementById('main').appendChild(messageElement);
        });
}

function createWebSocket() {
    const useGraphQlResult = useGraphQl();
    const socket = new WebSocket('ws://localhost:8080' + config.appUrl + (useGraphQlResult ? '/ws-graphql' : '/ws-rest'));

    if (useGraphQlResult) {
        socket.addEventListener('open', function (event) {
            console.log("WS - GraphQL - Web socket opened");

            var query = 'subscription MessageSubscription { messages { authorName content } }';
            var graphqlMsg = {
                query: query,
                variables: {}
            };
            socket.send(JSON.stringify(graphqlMsg));
        });

        socket.addEventListener('message', function (event) {
            console.log('"WS GraphQL - Event received:', event.data);
            handleRetrievedMessage(JSON.parse(event.data).data.messages);
        });
    } else {
        socket.addEventListener('message', function (event) {
            console.log('WS Rest - Event received: ', event.data);
            handleRetrievedMessage(JSON.parse(event.data));
        });
    }
}

function useGraphQl() {
    return new URL(window.location).searchParams.get('api') === 'graphql';
}

document.getElementById('send-button')
    .addEventListener('click', onSend);

document.getElementById('message-textarea')
    .addEventListener('keyup', (event) => {
        if ('Enter' === event.key) {
            onSend(event);
        }
    });

checkAuthenticated();
createWebSocket();




