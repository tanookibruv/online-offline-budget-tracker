const FILES_TO_CACHE = [
    "/",
    "/db.js",
    "/index.js",
    "/manifest.json",
    "/styles.css",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png"
];

const CACHE_NAME = "static-cache-v1";
const DATA_CACHE_NAME = "data-cache-v1";

//install
self.addEventListener("install", function(evt) {
    evt.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log("cache opened");
            return cache.addAll(FILES_TO_CACHE);
        })
    );
})

//fetch data
self.addEventListener("fetch", function(evt) {
    if (evt.request.url.includes("/api/")) {
        evt.respondWith(
            caches.open(DATA_CACHE_NAME).then(cache => {
                return fetch(evt.request)
                .then(response => {
                    if (response.status === 200) {
                        cache.put(evt.request.url, response.clone());
                    }

                    return response;
                })
                .catch(err => {
                    return cache.match(evt.request);
                });
            }).catch(err => console.log(err))
        );

        return;
    }

    evt.respondWith(
        fetch(evt.request).catch(function() {
            return caches.match(evt.request).then(function(response) {
                if (response) {
                    return response;
                } else if (evt.request.headers.get("accept").includes("text/html")) {
                    return caches.match("/")
                }
            });
        })
    );
});