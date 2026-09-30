/* ═══════════════════════════════════════════════════════
   Smart City – Service Worker (PWA Offline Support)
   ═══════════════════════════════════════════════════════ */

const CACHE_NAME = 'smart-city-v1';
const OFFLINE_URL = './index.html';

const PRECACHE_URLS = [
  './',
  './index.html',
  './manifest.json',
  './src/styles/index.css',
  './src/styles/components.css',
  './src/styles/animations.css',
  './src/styles/pages.css',
  './src/main.js',
  './src/router.js',
  './src/store.js',
  './src/i18n.js',
  './src/notifications.js',
  './src/utils/dom.js',
  './src/components/nav.js',
  './src/components/footer.js',
  './src/components/weather.js',
  './src/components/chart.js',
  './src/components/skeleton.js',
  './src/components/copilot.js',
  './src/pages/home.js',
  './src/pages/services.js',
  './src/pages/report.js',
  './src/pages/community.js',
  './src/pages/dashboard.js',
  './src/pages/map.js',
  './src/pages/ai.js',
  './src/pages/profile.js',
  './src/pages/about.js'
];

// Install: precache critical resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// Activate: clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(names =>
      Promise.all(
        names.filter(n => n !== CACHE_NAME).map(n => caches.delete(n))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch: network-first for API calls, cache-first for assets
self.addEventListener('fetch', event => {
  const { request } = event;

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // API calls: network first
  if (request.url.includes('api.open-meteo.com')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Assets: cache first, fallback to network
  event.respondWith(
    caches.match(request)
      .then(cached => {
        if (cached) return cached;
        return fetch(request).then(response => {
          // Cache successful responses
          if (response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          }
          return response;
        });
      })
      .catch(() => {
        // Offline fallback for navigation requests
        if (request.mode === 'navigate') {
          return caches.match(OFFLINE_URL);
        }
      })
  );
});
