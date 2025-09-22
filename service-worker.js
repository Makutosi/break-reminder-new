const CACHE_NAME = "break-timer-cache-v2"; 
const ASSETS_TO_CACHE = [
  "/break-reminder-new/",
  "/break-reminder-new/index.html",
  "/break-reminder-new/styles.css",
  "/break-reminder-new/script.js",
  "/break-reminder-new/alert.mp3",
  "/break-reminder-new/favicon-32.png",
  "/break-reminder-new/icons/icon-192.png",
  "/break-reminder-new/icons/icon-512.png",
  "/break-reminder-new/images/background.jpg",
  "/break-reminder-new/images/background-720.jpg",
  "/break-reminder-new/images/aurora.jpg",
  "/break-reminder-new/images/aurora-720.jpg",
  "/break-reminder-new/images/minimal.jpg",
  "/break-reminder-new/images/minimal-720.jpg"
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
