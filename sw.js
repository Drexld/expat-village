self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      try {
        const keys = await caches.keys();
        await Promise.all(keys.map((key) => caches.delete(key)));
      } catch (_) {
        // no-op
      }

      // Force all clients to be controlled immediately.
      await self.clients.claim();
    })(),
  );
});

// Intentionally no fetch handler. This prevents stale worker logic from
// intercepting requests and causing repeated failed fetch loops.
