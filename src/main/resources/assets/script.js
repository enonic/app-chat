function retrieveMessages() {
    fetch(serviceBaseUrl + '/get-messages')
        .then(response => response.json())
        .then(json => {
            json.forEach(message => {
                const messageElement = document.createElement('span');
                messageElement.innerHTML = message.content;
                document.getElementById('main').appendChild(messageElement);
            });
        });
}


document.getElementById('send-button')
    .addEventListener("click", onSend);

function onSend() {
    const message = document.getElementById('send-button').value;

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


