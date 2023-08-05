const cacheName = "PersinoxDev-Drapotichat-1.1";
const contentToCache = [
    "Build/drapotichat.loader.js",
    "Build/drapotichat.framework.js",
    "Build/drapotichat.data",
    "Build/drapotichat.wasm",
    "TemplateData/style.css"
];

// Vérifier si l'environnement est une extension Chrome
const isChromeExtension = window.chrome && chrome.runtime && chrome.runtime.id;

if (!isChromeExtension) {
    self.addEventListener('install', function (e) {
        console.log('[Service Worker] Install');
        
        e.waitUntil((async function () {
            const cache = await caches.open(cacheName);
            console.log('[Service Worker] Caching all: app shell and content');
            await cache.addAll(contentToCache);
        })());
    });

    self.addEventListener('fetch', function (e) {
        e.respondWith((async function () {
            let response = await caches.match(e.request);
            console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
            if (response) { return response; }

            response = await fetch(e.request);
            const cache = await caches.open(cacheName);
            console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
            cache.put(e.request, response.clone());
            return response;
        })());
    });
}
