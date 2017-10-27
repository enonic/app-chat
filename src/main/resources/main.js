exports.get = function (req) {
    return {
        body: '<html><body><h1>Hello world!</h1></body></html>',
        contentType: 'text/html'
    };
};