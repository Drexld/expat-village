// Service Worker for Expat Village PWA
// Version 1.1.0

const CACHE_NAME = 'expat-village-v2'
const OFFLINE_URL = '/'

// Files to cache immediately on install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/icon.svg',
  '/logo.svg',
  '/manifest.json'
]

// Install event - cache essential assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...')
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Precaching assets')
      return cache.addAll(PRECACHE_ASSETS)
    }).then(() => {
      return self.skipWaiting()
    })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...')
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    }).then(() => {
      return self.clients.claim()
    })
  )
})

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return

  // Skip external requests
  if (!event.request.url.startsWith(self.location.origin)) return

  const isNavigation = event.request.mode === 'navigate'
  const isStaticAsset = ['script', 'style', 'worker'].includes(event.request.destination)

  if (isNavigation) {
    // Network-first for HTML to avoid stale app shell
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const responseToCache = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(OFFLINE_URL, responseToCache))
          return response
        })
        .catch(() => caches.match(OFFLINE_URL))
    )
    return
  }

  if (isStaticAsset) {
    // Stale-while-revalidate for JS/CSS
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          const responseToCache = networkResponse.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseToCache))
          return networkResponse
        })
        return cachedResponse || fetchPromise
      })
    )
    return
  }

  // Default: network-first for other GETs
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const responseToCache = response.clone()
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseToCache))
        return response
      })
      .catch(() => caches.match(event.request))
  )
})

// Handle messages from the app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})
