const CACHE_NAME = 'tainan-ems-v1';

// 定義需要預先快取的外部資源 (CDN)
// 包含 React, Tailwind, 字體與圖示庫
const PRECACHE_URLS = [
  './', // 快取主頁面
  './119.png',
  'https://unpkg.com/react@18/umd/react.development.js',
  'https://unpkg.com/react-dom@18/umd/react-dom.development.js',
  'https://unpkg.com/@babel/standalone/babel.min.js',
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/lucide@latest',
  'https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700&display=swap'
];

// 安裝 Service Worker 並快取核心資源
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(PRECACHE_URLS);
      })
  );
  self.skipWaiting();
});

// 啟用新的 Service Worker
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
  self.clients.claim();
});

// 攔截網路請求：優先使用快取，若無則請求網路並寫入快取 (Stale-while-revalidate 策略)
self.addEventListener('fetch', (event) => {
  // 排除非 GET 請求或 chrome-extension 等協定
  if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // 如果快取中有，先回傳快取內容
        if (cachedResponse) {
          // 同時背景更新快取 (下次開啟就是新的)
          fetch(event.request).then((networkResponse) => {
            if(networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, networkResponse.clone());
              });
            }
          }).catch(() => {}); // 忽略離線時的更新錯誤
          
          return cachedResponse;
        }

        // 如果快取沒有，則發送網路請求
        return fetch(event.request).then((response) => {
          // 檢查回應是否有效
          if (!response || response.status !== 200 || response.type !== 'basic' && response.type !== 'cors') {
            return response;
          }

          // 將新請求到的資源放入快取 (例如操作指引的圖片)
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        });
      })
  );
});