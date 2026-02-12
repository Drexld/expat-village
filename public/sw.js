const SW_VERSION = 'v3';
const SHELL_CACHE = `expat-village-shell-${SW_VERSION}`;
const ASSET_CACHE = `expat-village-assets-${SW_VERSION}`;
const API_CACHE = `expat-village-api-${SW_VERSION}`;
const ALL_CACHES = [SHELL_CACHE, ASSET_CACHE, API_CACHE];

const APP_SHELL = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.webmanifest',
  '/brand/expat-village-icon-navy.svg',
  '/brand/expat-village-logo-light-navy.svg',
  '/brand/expat-village-logo-navy.svg',
];

const API_TIMEOUT_MS = 4500;

function isSameOrigin(url) {
  return url.origin === self.location.origin;
}

function isApiRequest(url) {
  return url.pathname.startsWith('/api/');
}

function isNavigationRequest(request) {
  return request.mode === 'navigate';
}

function isStaticAssetRequest(url) {
  return /\/assets\/|\.css$|\.js$|\.mjs$|\.png$|\.jpg$|\.jpeg$|\.svg$|\.webp$|\.woff2?$|\.ttf$/.test(
    url.pathname,
  );
}

async function cachePutSafe(cacheName, request, response) {
  if (!response || !response.ok) return;
  const cache = await caches.open(cacheName);
  await cache.put(request, response.clone());
}

function withTimeout(promise, timeoutMs) {
  const timeout = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('network-timeout')), timeoutMs);
  });
  return Promise.race([promise, timeout]);
}

async function handleNavigation(request) {
  try {
    const response = await fetch(request);
    await cachePutSafe(SHELL_CACHE, '/index.html', response);
    return response;
  } catch {
    const cached = await caches.match('/index.html');
    if (cached) return cached;
    return (await caches.match('/offline.html')) || Response.error();
  }
}

async function handleApi(request) {
  try {
    const networkResponse = await withTimeout(fetch(request), API_TIMEOUT_MS);
    await cachePutSafe(API_CACHE, request, networkResponse);
    return networkResponse;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    return new Response(
      JSON.stringify({
        offline: true,
        message: 'No cached API response available while offline.',
      }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
}

async function handleStaticAsset(request) {
  const cached = await caches.match(request);
  const networkFetch = fetch(request)
    .then(async (response) => {
      await cachePutSafe(ASSET_CACHE, request, response);
      return response;
    })
    .catch(() => null);

  if (cached) {
    // Stale-while-revalidate for fast UI boot.
    void networkFetch;
    return cached;
  }

  const response = await networkFetch;
  return response || Response.error();
}

async function handleDefault(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    await cachePutSafe(ASSET_CACHE, request, response);
    return response;
  } catch {
    if (request.destination === 'document') {
      return (await caches.match('/offline.html')) || Response.error();
    }
    return Response.error();
  }
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.map((key) => {
            if (!ALL_CACHES.includes(key)) {
              return caches.delete(key);
            }
            return Promise.resolve();
          }),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('message', (event) => {
  if (event?.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (!isSameOrigin(url)) return;

  if (isNavigationRequest(request)) {
    event.respondWith(handleNavigation(request));
    return;
  }

  if (isApiRequest(url)) {
    event.respondWith(handleApi(request));
    return;
  }

  if (isStaticAssetRequest(url)) {
    event.respondWith(handleStaticAsset(request));
    return;
  }

  event.respondWith(handleDefault(request));
});
