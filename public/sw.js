const CACHE_NAME = 'tainan-ems-v1-0-1'; // 更新版本號以觸發更新

// 定義需要預先快取的資源
const PRECACHE_URLS = [
  './', 
  './index.html', // 強烈建議將主檔案改名為 index.html
  './manifest.json',
  
  // === 外部核心資源 (React, Tailwind, Icons) ===
  'https://unpkg.com/react@18/umd/react.development.js',
  'https://unpkg.com/react-dom@18/umd/react-dom.development.js',
  'https://unpkg.com/@babel/standalone/babel.min.js',
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/lucide@latest',
  
  // === 字體 (注意：這只能快取 CSS，字體檔本身難以預先快取，離線時可能回退系統字體) ===
  'https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700&display=swap',

  // === 圖片資源 (從 HTML 中提取的完整清單) ===
  './PIC/EMT.png',
  './119.png',
  './PIC/119.png',
  './PIC/standard.png',
  './PIC/On-site assessment.png',
  './PIC/Non-traumatic.png',
  './PIC/trauma.png',
  './PIC/C4_transport.png',
  './PIC/C5_handover.png',
  './PIC/C6_ohca.png',
  './PIC/C6_ohca1.png',
  './PIC/igel.png',
  './PIC/babyOHCA.png',
  './PIC/DSED.png',
  './PIC/M1_consciousness.png',
  './PIC/M1_consciousness1.png',
  './PIC/M2_choking.png',
  './PIC/M3_anaphylaxis.png',
  './PIC/M3_baby.png',
  './PIC/M4_dyspnea.png',
  './PIC/M5_shock.png',
  './PIC/M5_1.png',
  './PIC/M6_chest_pain.png',
  './PIC/M7_stroke.png',
  './PIC/Cincinnati.png',
  './PIC/Los_Angeles.png',
  './PIC/M8_blood_sugar.png',
  './PIC/M9_poison.png',
  './PIC/M10_seizure.png',
  './PIC/M11_ob_gyn.png',
  './PIC/M12_delivery.png',
  './PIC/M13_neonate.png',
  './PIC/M14_heat.png',
  './PIC/T1_head_trauma.png',
  './PIC/T1_airway.png',
  './PIC/T2_chest_trauma.png',
  './PIC/T2_2.png',
  './PIC/T3_abd_trauma.png',
  './PIC/T4_limb_trauma.png',
  './PIC/T5_crush.png',
  './PIC/T6_burn.png',
  './PIC/T6_burn_1.png',
  './PIC/T7_snake.png',
  './PIC/QRcode.png',
  './PIC/S1_intubation.png',
  './PIC/S2_tachycardia.png',
  './PIC/S3_bradycardia.png',
  './PIC/S4_pain.png',
  './PIC/Vas.png',
  './PIC/S4_pain_1.png',
  './PIC/S5_psych.png',
  './PIC/S8_mci.png',
  './PIC/S8_mci_1.png',
  './PIC/S8_mci_2.png',
  './PIC/START.png',
  './PIC/jumpSTART.png',
  './PIC/S9_support.png',
  './PIC/S9_1.png',
  './PIC/S10_ultrasound.png',
  './PIC/Award.png',
  './PIC/Award_Criteria_1.png',
  './PIC/Award_Criteria_2.png',
  './PIC/Radio_1.png',
  './PIC/Radio_2.png',
  './PIC/disinfect.png',
  './PIC/disinfect_1.png',
  './PIC/condolences.png',
  './PIC/CarVideo.png',
  './PIC/AED.png',
  './PIC/Car_accident.png',
  './PIC/Record_sheet.png',
  './PIC/vital_signs.png',
  './PIC/Jump_land.png',
  './PIC/Director.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Pre-caching all assets');
        // 使用 addAll 若其中一個失敗，整個安裝會失敗，這有助於確保完整性
        return cache.addAll(PRECACHE_URLS);
      })
      .catch(err => console.error('[Service Worker] Cache addAll failed:', err))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // 策略：快取優先 (Cache First)，確保離線速度與穩定
        if (cachedResponse) {
          return cachedResponse;
        }

        // 若快取無資料，則網路請求並寫入快取 (動態快取)
        return fetch(event.request).then((networkResponse) => {
            // 檢查回應是否有效 (包含 Google Fonts 的 opaque response)
            if (!networkResponse || networkResponse.status !== 200 && networkResponse.type !== 'opaque') {
                return networkResponse;
            }

            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseToCache);
            });
            return networkResponse;
        }).catch(() => {
            // 離線且無快取時的處理 (可選：回傳一個預設的 offline.html 或圖片)
            // 目前先保持沈默
        });
      })
  );
});