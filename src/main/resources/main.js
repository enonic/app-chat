var mustacheLib = require('/lib/xp/mustache');
var authLib = require('/lib/xp/auth');
var view = resolve('main.html');

require('/lib/chat/repo').init();


exports.get = function (req) {

    if (!authLib.getUser()) {
        return {
            status: 401
        }
    }

    var body = mustacheLib.render(view, {
        appUrl: '/app/' + app.name,
        serviceBaseUrl: '/app/' + app.name + '/_/service/' + app.name
    });
    return {
        body: body,
        contentType: 'text/html'
    };
};