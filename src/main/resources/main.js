var mustacheLib = require('/lib/xp/mustache');
var view = resolve('main.html');

exports.get = function (req) {
    var body = mustacheLib.render(view, {
        appUrl: '/app/' + app.name
    });
    return {
        body: body,
        contentType: 'text/html'
    };
};