import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

async function clearStaleLocalServiceWorkers() {
  const host = window.location.hostname;
  const isLocalHost = host === 'localhost' || host === '127.0.0.1';

  if (!isLocalHost || !('serviceWorker' in navigator)) {
    return;
  }

  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    if (!registrations.length) {
      return;
    }

    await Promise.all(registrations.map((registration) => registration.unregister()));

    if ('caches' in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
    }

    // Reload once so the page boots without stale service-worker interception.
    if (!sessionStorage.getItem('sw-cleared-once')) {
      sessionStorage.setItem('sw-cleared-once', 'true');
      window.location.reload();
    }
  } catch (error) {
    console.warn('Service worker cleanup skipped:', error);
  }
}

void clearStaleLocalServiceWorkers();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
