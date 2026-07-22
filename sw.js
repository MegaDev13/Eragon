/**
 * Crônica de Aethelgard - Service Worker PWA / APK Offline Cache (sw.js)
 * Intercepta requisições, serve arquivos instantaneamente do cache offline e busca atualizações no GitHub.
 */

const CACHE_NAME = "aethelgard-cache-v1.0.42";
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./assets/style.css",
  "./assets/data_loader.js",
  "./version.json",
  "./flags/flags_manager.js",
  "./engine/attributes.js",
  "./engine/hidden_attributes.js",
  "./world/calendar.js",
  "./world/delayed_consequences.js",
  "./world/map_manager.js",
  "./world/kingdoms.js",
  "./world/npcs.js",
  "./dragons/dragon_manager.js",
  "./magic/magic_manager.js",
  "./combat/weapons_manager.js",
  "./items/crafting_manager.js",
  "./skills/skills_manager.js",
  "./guilds/guilds_manager.js",
  "./economy/economy_manager.js",
  "./quests/quest_manager.js",
  "./events/events_engine.js",
  "./combat/combat_manager.js",
  "./story/narrative_engine.js",
  "./story/endings_manager.js",
  "./save/save_manager.js",
  "./audio/audio_manager.js",
  "./world/companions_manager.js",
  "./combat/combat_vfx.js",
  "./ui/ui_icons.js",
  "./ui/ui_lore.js",
  "./ui/ui_creation.js",
  "./ui/ui_story.js",
  "./ui/ui.js",
  "./engine/updater.js",
  "./engine/core.js",
  "./assets/backgrounds/title_bg.jpg",
  "./assets/backgrounds/eldoria_city.jpg",
  "./assets/dragons/ignis_aurum.jpg",
  "./assets/portraits/lyra.jpg",
  "./assets/portraits/alden.jpg"
];

// Instalação: Cachear todos os arquivos principais da engine
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[ServiceWorker] Caching core assets for offline APK/PWA execution...");
      return cache.addAll(CORE_ASSETS).catch(err => {
        console.warn("[ServiceWorker] Alguns assets não puderam ser cacheados na instalação:", err);
      });
    })
  );
});

// Ativação: Limpar caches antigos quando houver nova versão
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName.startsWith("aethelgard-cache-")) {
            console.log("[ServiceWorker] Deletando cache antigo:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Estratégia Stale-While-Revalidate para atualizações fluidas
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  // Para requisições de versão (version.json), tentar sempre network-first para capturar novidades do GitHub
  if (event.request.url.includes("version.json")) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse.ok) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return networkResponse;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Para arquivos do jogo e assets: Stale-While-Revalidate (retorna rápido do cache e atualiza em background)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === "basic") {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Ignora erro de rede offline
      });

      return cachedResponse || fetchPromise;
    })
  );
});
