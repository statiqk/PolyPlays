const V = 'polyplays-a807d376d9';
const CORE = ['./', 'index.html', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png',
  'fonts/instrument-sans-latin-400-normal.woff2', 'fonts/instrument-sans-latin-500-normal.woff2', 'fonts/instrument-sans-latin-600-normal.woff2', 'fonts/instrument-sans-latin-700-normal.woff2',
  'fonts/geist-mono-latin-400-normal.woff2', 'fonts/geist-mono-latin-500-normal.woff2', 'fonts/geist-mono-latin-600-normal.woff2',
  'fonts/bricolage-grotesque-latin-400-normal.woff2', 'fonts/bricolage-grotesque-latin-500-normal.woff2', 'fonts/bricolage-grotesque-latin-600-normal.woff2', 'fonts/bricolage-grotesque-latin-700-normal.woff2', 'fonts/bricolage-grotesque-latin-800-normal.woff2'];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(V).then((c) => c.addAll(CORE.map((u) => new Request(u, { cache: 'reload' })))));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== V).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('message', (e) => { if (e.data === 'SKIP_WAITING') self.skipWaiting(); });
self.addEventListener('fetch', (e) => {
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  e.respondWith(caches.open(V).then((c) => c.match(r, { ignoreSearch: true }).then((hit) => {
    if (hit) return hit;
    return fetch(r).then((res) => { if (res.ok) c.put(r, res.clone()); return res; })
      .catch(() => (r.mode === 'navigate' ? c.match('index.html') : Response.error()));
  })));
});
