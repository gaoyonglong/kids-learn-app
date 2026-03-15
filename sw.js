// Service Worker - 离线支持
const CACHE_NAME = 'kids-learn-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/css/main.css',
  '/css/animations.css',
  '/css/games.css',
  '/js/data.js',
  '/js/speech.js',
  '/js/storage.js',
  '/js/rewards.js',
  '/js/games/tracing.js',
  '/js/games/matching.js',
  '/js/games/drag.js',
  '/js/games/listen.js',
  '/js/app.js',
  '/manifest.json'
];

// 安装事件 - 缓存资源
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('缓存资源...');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// 激活事件 - 清理旧缓存
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => caches.delete(name))
        );
      })
      .then(() => self.clients.claim())
  );
});

// 请求事件 - 缓存优先策略
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // 如果缓存中有，直接返回
        if (response) {
          return response;
        }

        // 否则从网络获取
        return fetch(event.request)
          .then((response) => {
            // 不缓存非成功的响应
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // 克隆响应并缓存
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // 网络失败时返回离线页面（如果有的话）
            return caches.match('/index.html');
          });
      })
  );
});

// 后台同步
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-progress') {
    event.waitUntil(syncProgress());
  }
});

// 同步进度（预留接口）
async function syncProgress() {
  // 可以在这里添加与服务器同步的逻辑
  console.log('同步学习进度...');
}