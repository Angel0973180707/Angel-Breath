const CACHE_NAME = 'angel-breath-v1';
const ASSETS = [
  './',
  './index.html',
  './script.js',
  './manifest.json',
  'https://img.icons8.com/ios-filled/192/F2D388/clover.png',
  'https://img.icons8.com/ios-filled/512/F2D388/clover.png'
];

// 安裝 Service Worker 並快取檔案
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache');
      return cache.addAll(ASSETS);
    })
  );
});

// 啟動 Service Worker 並清理舊快取
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 攔截請求並優先從快取讀取
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

