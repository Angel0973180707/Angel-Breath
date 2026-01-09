/* Angel Breath - sw.js (complete overwrite) */

const CACHE_VERSION = "angel-breath-v1.0.4"; // ✅ 每次改版請 +1（很重要）
const PRECACHE = `${CACHE_VERSION}-precache`;
const RUNTIME = `${CACHE_VERSION}-runtime`;

const CORE_ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];

// 安裝：預快取核心資源
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(PRECACHE).then((cache) => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

// 啟用：清舊快取 + 立刻接管
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((k) => {
          if (![PRECACHE, RUNTIME].includes(k)) return caches.delete(k);
          return null;
        })
      )
    )
  );
  self.clients.claim();

  // ✅ 通知所有頁面：有新版 SW，請重新整理
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      clients.forEach((client) => client.postMessage({ type: "SW_UPDATED" }));
    })
  );
});

// 工具：stale-while-revalidate（先回快取，再背景更新）
async function staleWhileRevalidate(req) {
  const cache = await caches.open(RUNTIME);
  const cached = await cache.match(req);

  const fetchPromise = fetch(req)
    .then((res) => {
      const url = new URL(req.url);
      if (url.origin === self.location.origin) {
        cache.put(req, res.clone());
      }
      return res;
    })
    .catch(() => cached);

  return cached || fetchPromise;
}

// 工具：導航（開 app）=> cache-first + 背景更新
async function handleNavigate(req) {
  const cache = await caches.open(PRECACHE);
  const cached = await cache.match("./index.html");

  // 背景更新 index.html
  fetch("./index.html")
    .then((res) => cache.put("./index.html", res.clone()))
    .catch(() => null);

  return cached || fetch(req);
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // 導航請求（進入 app）
  if (req.mode === "navigate") {
    event.respondWith(handleNavigate(req));
    return;
  }

  // 只處理同源
  if (url.origin !== self.location.origin) return;

  // 對 CSS/JS/JSON/PNG 用 stale-while-revalidate：確保會更新
  if (
    url.pathname.endsWith(".css") ||
    url.pathname.endsWith(".js") ||
    url.pathname.endsWith(".json") ||
    url.pathname.endsWith(".png")
  ) {
    event.respondWith(staleWhileRevalidate(req));
    return;
  }

  // 其他資源：一般 cache-first
  event.respondWith(
    caches.match(req).then((cached) => cached || fetch(req))
  );
});
