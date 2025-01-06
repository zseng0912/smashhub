// Cache version
const CACHE_NAME = "smashhub-cache-v1";

// Files to cache
const ASSETS_TO_CACHE = [
  "/",
  "/main/index.html",
  "/main/styles.css",
  "/main/main.js",
  "/main/header.html", 
  "/main/header.js",
  "/images/logo1.png",
  "/images/logo192.png",
  "/images/logo512.png",
  "/images/Wide.png",
  "/images/99.jpg",
  "/images/apacs.jpg",
  "/images/golden_sport.jpg",
  "/images/lcw_ld.png",
  "/main/venues.html",
  "/main/venues.css",
  "/main/booking.html",
  "/main/contact.html",
  "/main/contact.css",
  "/main/about.html",
  "/main/about.css",
  "/data/venues.json",
];

// Install event
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Caching assets...");
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Activate event
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("Clearing old cache...");
            return caches.delete(cache);
          }
        })
      )
    )
  );
});

// Fetch event
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached response if available, else fetch from network
      return response || fetch(event.request);
    })
  );
});
