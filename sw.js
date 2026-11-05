const CACHE_NAME = 'mental-picture-cache-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './icon.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      return cachedResponse || fetch(e.request).then((networkResponse) => {
        return caches.open(CACHE_NAME).then((cache) => {
          // Opcional: almacenar en caché dinámicamente recursos nuevos como imágenes de iconos
          if (e.request.method === 'GET' && e.request.url.startsWith(self.location.origin)) {
            cache.put(e.request, networkResponse.clone());
          }
          return networkResponse;
        });
      }).catch(() => {
        // Fallback defensivo en caso de error de red absoluto
        return caches.match('./index.html');
      });
    })
  );
});