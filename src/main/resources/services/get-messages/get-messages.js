exports.get = function () {
    return {
        contentType: 'application/json',
        body: JSON.stringify([
            {content: 'message1'},
            {content: 'message2'}
        ])
    };
};