// =========================================
// SERVICE WORKER
// =========================================

const CACHE_NAAM = 'mijn-gezondheid-v1';

const BESTANDEN_OM_TE_CACHEN = [
    '/index.html',
    '/dashboard.html',
    '/toevoegen.html',
    '/about.html',
    '/contact.html',
    '/css/style.css',
    '/js/app.js',
    '/manifest.json'
];

// Installatie: bestanden in cache opslaan
self.addEventListener('install', function(e) {
    e.waitUntil(
        caches.open(CACHE_NAAM).then(function(cache) {
            return cache.addAll(BESTANDEN_OM_TE_CACHEN);
        })
    );
});

// Activatie: oude caches verwijderen
self.addEventListener('activate', function(e) {
    e.waitUntil(
        caches.keys().then(function(sleutels) {
            return Promise.all(
                sleutels.filter(sleutel => sleutel !== CACHE_NAAM)
                        .map(sleutel => caches.delete(sleutel))
            );
        })
    );
});

// Fetch: uit cache serveren als offline
self.addEventListener('fetch', function(e) {
    e.respondWith(
        caches.match(e.request).then(function(cachedResponse) {
            return cachedResponse || fetch(e.request);
        })
    );
});