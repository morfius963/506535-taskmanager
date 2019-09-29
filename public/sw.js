const CACHE_NAME = `TASKMANAGER_APP`;

self.addEventListener(`install`, (evt) => {
  evt.waitUntil(
      caches.open(CACHE_NAME)
        .then((cache) => {
          return cache.addAll([
            `./`,
            `./index.html`,
            `./bundle.js`,
            `./css/style.css`,
            `./css/normalize.css`,
            `./img/close.svg`,
            `./img/wave.svg`,
            `./fonts/HelveticaNeueCyr-Bold.woff`,
            `./fonts/HelveticaNeueCyr-Bold.woff2`,
            `./fonts/HelveticaNeueCyr-Medium.woff`,
            `./fonts/HelveticaNeueCyr-Medium.woff2`,
            `./fonts/HelveticaNeueCyr-Roman.woff`,
            `./fonts/HelveticaNeueCyr-Roman.woff2`
          ]);
        })
  );
});

self.addEventListener(`fetch`, (evt) => {
  evt.respondWith(
      caches.match(evt.request)
        .then((response) => {
          return response ? response : fetch(evt.request);
        })
        .catch((err) => {
          throw err;
        })
  );
});

