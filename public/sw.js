// ╔══════════════════════════════════════════════════════════╗
// ║  Aura Mezen — Service Worker                             ║
// ║  Stratégie Cache-First pour images & vidéos             ║
// ╚══════════════════════════════════════════════════════════╝

const CACHE_NAME = 'aura-mezen-v1';

// Noms de caches séparés pour mieux gérer les quotas
const CACHES = {
  images: 'aura-images-v1',   // photos produits (Supabase)
  videos: 'aura-videos-v1',   // vidéos (Cloudinary)
  static: 'aura-static-v1',   // JS/CSS/fonts
};

// Durées TTL en secondes
const TTL = {
  images: 30 * 24 * 60 * 60, // 30 jours
  videos: 7  * 24 * 60 * 60, // 7 jours
  static: 30 * 24 * 60 * 60, // 30 jours
};

// ── Install : pas de pré-cache, activation immédiate ────────
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => !Object.values(CACHES).includes(k))
          .map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// ── Helpers ─────────────────────────────────────────────────
function isExpired(response, ttlSeconds) {
  const dateHeader = response.headers.get('sw-cached-at');
  if (!dateHeader) return false;
  return Date.now() - parseInt(dateHeader, 10) > ttlSeconds * 1000;
}

async function cacheFirst(request, cacheName, ttlSeconds) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  if (cached && !isExpired(cached, ttlSeconds)) {
    return cached;
  }

  try {
    const response = await fetch(request);
    if (response && response.status === 200) {
      // Cloner + ajouter header de date de mise en cache
      const headers = new Headers(response.headers);
      headers.set('sw-cached-at', Date.now().toString());
      const cloned = new Response(await response.clone().arrayBuffer(), {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
      cache.put(request, cloned);
    }
    return response;
  } catch {
    // Hors-ligne → retourner le cache expiré si disponible
    return cached || Response.error();
  }
}

// ── Routing ─────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 1. Vidéos Cloudinary → Cache-First 7 jours
  if (url.hostname === 'res.cloudinary.com') {
    event.respondWith(cacheFirst(request, CACHES.videos, TTL.videos));
    return;
  }

  // 2. Images Supabase Storage → Cache-First 30 jours
  if (url.hostname.includes('supabase.co') && request.destination === 'image') {
    event.respondWith(cacheFirst(request, CACHES.images, TTL.images));
    return;
  }

  // 3. Images optimisées Next.js (/_next/image) → Cache-First 30 jours
  if (url.pathname.startsWith('/_next/image')) {
    event.respondWith(cacheFirst(request, CACHES.images, TTL.images));
    return;
  }

  // 4. Assets statiques Next.js → Cache-First 30 jours
  if (url.pathname.startsWith('/_next/static')) {
    event.respondWith(cacheFirst(request, CACHES.static, TTL.static));
    return;
  }

  // Tout le reste → réseau normal
});
