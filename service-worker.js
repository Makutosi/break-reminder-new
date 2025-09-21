const CACHE_NAME = "break-timer-cache-v1";
const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/styles.css",
  "/script.js",
  "/alert.mp3",
  "/images/background.jpg",
  "/images/background-720.jpg",
  "/images/aurora.jpg",
  "/images/aurora-720.jpg",
  "/images/minimal.jpg",
  "/images/minimal-720.jpg"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
