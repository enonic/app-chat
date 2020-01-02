var mustacheLib = require('/lib/mustache');
var portalLib = require('/lib/xp/portal');
var router = require('/lib/router')();
var mainTemplate = resolve("main-template.html");
var manifestTemplate = resolve("manifest-template.json");
var swTemplate = resolve("sw-template.js");

var version = (Date.now() / 1000).toFixed();

router.get('/', function (req) {
    return {
        body: mustacheLib.render(mainTemplate, {
            appUrl: getAppUrl(),
            baseUrl: getBaseUrl(),
            serviceUrl: portalLib.serviceUrl({service: ''}),
            loginUrl: portalLib.loginUrl({redirect: portalLib.url({path: '/webapp/' + app.name, type: 'absolute'})})
        }),
        contentType: 'text/html'
    };
});

router.get('/manifest.json', function () {
    return {
        body: mustacheLib.render(manifestTemplate, {
            startUrl: getAppUrl()
        }),
        contentType: 'application/json'
    };
});

router.get('/sw.js', function () {
    return {
        headers: {
            'Service-Worker-Allowed': getBaseUrl()
        },
        body: mustacheLib.render(swTemplate, {
            version: version,
            baseUrl: getBaseUrl()
        }),
        contentType: 'application/javascript'
    };
});

router.get('/ws', function (req) {
    return {
        webSocket: {
            data: {
                group: 'rest'
            }
        }
    };
});

router.get('/ws-graphql', function (req) {
    return {
        webSocket: {
            data: {
                group: 'graphql'
            }
        }
    };
});

function getBaseUrl() {
    var appUrl = getAppUrl();
    return endWithSlash(appUrl) ? appUrl.substring(0, appUrl.length - 1) : appUrl;
}

function getAppUrl() {
    return portalLib.url({path: '/webapp/' + app.name});
}

function endWithSlash(url) {
    return url.charAt(url.length - 1) === '/';
}

exports.dispatch = function (req) {
    return router.dispatch(req);
};