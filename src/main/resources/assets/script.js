function retrieveMessages() {
    document.getElementById('main').innerHTML = '';
    fetch(serviceBaseUrl + '/get-messages')
        .then(response => response.json())
        .then(json => {
            json.forEach(message => {
                const messageElement = document.createElement('span');
                messageElement.innerHTML = '<b>' + message.authorName + ':</b> ' + message.content;
                document.getElementById('main').appendChild(messageElement);
            });
        });
}

function onSend() {
    const message = document.getElementById('message-textarea').value;
    document.getElementById('message-textarea').value = '';


    fetch(serviceBaseUrl + '/send-message', {
        method: 'POST',
        body: JSON.stringify({
            message: message
        })
    })
        .then(response => response.json())
        .then(json => {
            retrieveMessages();
        });
}

document.getElementById('send-button')
    .addEventListener("click", onSend);

retrieveMessages();


