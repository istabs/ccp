/* Generated with a content version: a new export refreshes the offline document. */
const PREFIX = 'ccp:' + self.registration.scope + ':';
const CACHE = PREFIX + '9da5cc7a6cf1d6b0';
const ASSETS = ["index.html", "manifest.webmanifest", "icons/GGL.svg", "icons/ccp-180.png", "icons/ccp-192.png", "icons/ccp-512.png"].map(path => new URL(path, self.registration.scope).href);
const DOCUMENT = new URL('index.html', self.registration.scope).href;
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)));
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    for (const name of await caches.keys()) {
      if (name.startsWith(PREFIX) && name !== CACHE) await caches.delete(name);
    }
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  url.hash = '';
  url.search = '';
  if (!ASSETS.includes(url.href)) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    try {
      const response = await fetch(event.request);
      if (response.ok) await cache.put(url.href, response.clone());
      else if (event.request.mode === 'navigate' && url.href === DOCUMENT) {
        return (await cache.match(DOCUMENT)) || response;
      }
      return response;
    } catch (error) {
      const saved = await cache.match(url.href);
      if (saved) return saved;
      throw error;
    }
  })());
});
