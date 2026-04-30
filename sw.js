/* 啾啾日常 ChickaDay — Minimal Service Worker
 *
 * Cache-first for the static shell + assets so players can launch offline once
 * they've visited at least once. State lives in localStorage which persists
 * independently — so the pet "ages" while offline already (per game logic).
 *
 * Versioning: bump CACHE_VERSION on any shipped change so old caches purge.
 */
const CACHE_VERSION = "chickaday-v1-2026-04-30-iter194";

// What gets pre-fetched on install — keep tight to the app shell so first
// install is fast. Other assets fall through to runtime caching below.
const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./src/cfg.js",
  "./src/i18n.js",
  "./src/utils.js",
  "./src/animations.js",
  "./src/notifications.js",
  "./src/ui.js",
  "./src/dex.js",
  "./src/achievements.js",
  "./src/audio.js",
  "./src/share.js",
  "./src/wants.js",
  "./src/events.js",
  "./src/daily.js",
  "./src/idle.js",
  "./src/evolve.js",
  "./src/shop.js",
  "./src/save.js",
  "./src/tick.js",
  "./src/interactions.js",
  "./src/menus.js",
  "./src/settings.js",
  "./src/render.js",
  "./src/game.js",
  "./src/style.css",
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  // Drop stale caches from previous deploys.
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const req = event.request;
  // Only handle GETs from same origin (we have no cross-origin assets).
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;

  // Cache-first with network fallback + opportunistic cache fill.
  event.respondWith(
    caches.match(req).then(hit => {
      if (hit) return hit;
      return fetch(req).then(res => {
        // Only cache successful basic responses to avoid poisoning.
        if (res && res.status === 200 && res.type === "basic") {
          const copy = res.clone();
          caches.open(CACHE_VERSION).then(c => c.put(req, copy));
        }
        return res;
      }).catch(() => caches.match("./index.html")); // last-resort offline shell
    })
  );
});
