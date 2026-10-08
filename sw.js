const V = 'cuentas-v3';
const FILES = ['./', 'index.html', 'manifest.webmanifest', 'icon.svg'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(V).then(c => Promise.allSettled(FILES.map(f => c.add(f)))));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))));
  self.clients.claim();
});
// Red primero (así recibes las actualizaciones); sin internet usa la copia guardada.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(r => { const c = r.clone(); caches.open(V).then(ch => ch.put(e.request, c)); return r; })
      .catch(() => caches.match(e.request).then(m => m || caches.match('index.html')))
  );
});
