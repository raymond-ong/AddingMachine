// store resources into cache for offline support
self.addEventListener("install", e=> {
	console.log("[SW] Install!");
	e.waitUntil(
		caches.open("static").then(cache => {
			return cache.addAll([
				"./", 
				"./index.css", 
				"./images/add.png",
				"./images/maskable_icon.png",
				"./images/reload_48.png",
				"./images/splash512.png",
				"./index.js"
				]);
		})
	);
	
});

// intercept fetch requests. If inside cache, use cached version. Else go the network.
self.addEventListener("fetch", e => {
	console.log('[SW] fetch request for', e);
	e.respondWith(
		caches.match(e.request).then(response => {
			return response || fetch(e.request);
		})
	);
});