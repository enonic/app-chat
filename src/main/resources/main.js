var mustacheLib = require('/lib/xp/mustache');
var view = resolve('main.html');

exports.get = function (req) {
    var body = mustacheLib.render(view, {
        text: 'Hello! I am a template'
    });
    return {
        body: body,
        contentType: 'text/html'
    };
};