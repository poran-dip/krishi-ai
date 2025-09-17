// sw.js
const CACHE_NAME = "krishi-ai-cache-v1";

const PRECACHE_ASSETS = [
  "/",
  "/_not-found",
  "/dashboard",
  "/logo.svg",
  "/globals.css",
  "/favicon.ico",
];

// install: just activate immediately
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_ASSETS))
  );
  self.skipWaiting();
});

// activate: cleanup old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => key !== CACHE_NAME && caches.delete(key)))
    )
  );
  self.clients.claim();
});

// fetch handler
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      try {
        // try network first
        const res = await fetch(event.request);
        // clone & store in cache for offline later
        cache.put(event.request, res.clone());
        return res;
      } catch (err) {
        // fallback to cache if offline
        const cachedRes = await cache.match(event.request);
        if (cachedRes) return cachedRes;

        // fallback: simple offline message
        if (event.request.headers.get("accept")?.includes("text/html")) {
          // return dashboard page if available offline
          const fallback = await cache.match("/dashboard");
          if (fallback) return fallback;
        }

        // as last resort, return a simple fallback response
        return new Response("You are offline and this page was not cached yet.", {
          status: 503,
          headers: { "Content-Type": "text/plain" },
        });
      }
    })()
  );
});
