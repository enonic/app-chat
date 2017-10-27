fetch(serviceBaseUrl + '/get-messages')
    .then(response => response.json())
    .then(json => {
        json.forEach(message => {
            const messageElement = document.createElement('span');
            messageElement.innerHTML = message.content;
            document.getElementById('main').appendChild(messageElement);
        });
    });