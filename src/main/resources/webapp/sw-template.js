var CACHE_NAME = 'app-chat-{{version}}';
var urlsToCache = [
    '{{baseUrl}}',
    '{{baseUrl}}/manifest.json',
    '{{baseUrl}}/style/main.css',
    '{{baseUrl}}/js/script.js'
];

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(urlsToCache))
    );
});

self.addEventListener('activate', function (event) {
    var cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys()
            .then(function (cacheNames) {
                return Promise.all(
                    cacheNames.map(function (cacheName) {
                        if (cacheWhitelist.indexOf(cacheName) === -1) {
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
    );
});

self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request, {
            ignoreVary: true,
            cacheName: CACHE_NAME
        })
            .then((response) => response || fetch(event.request))
    );
});
