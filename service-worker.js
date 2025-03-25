const CACHE_NAME = 'ecoponto-pap-v5';
const urlsToCache = [
  '/',
  '/index.html',
  '/offline.html',
  '/css/styles.css',
  '/css/pwa.css',
  '/css/login.css',
  '/css/install-instructions.css',
  '/css/mobile-header-fix.css',
  '/js/main.js',
  '/js/pwa.js',
  '/js/auth.js',
  '/js/config.js',
  '/js/menu-functions.js',
  '/js/menu-functions.css',
  '/js/language-system.js',
  '/js/charts-module.css',
  '/js/chart.js',
  '/js/install-instructions.js',
  '/manifest.json',
  '/images/icon-192x192.png',
  '/images/icon-512x512.png',
  '/photos/tgeiclaro.png',
  '/photos/Cabecalho.JPG',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap',
  'https://cdn.jsdelivr.net/npm/chart.js'
];

// Instalação do Service Worker
self.addEventListener('install', event => {
  // Força a ativação imediata do novo service worker
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberto e atualizado');
        return cache.addAll(urlsToCache);
      })
  );
});

// Ativação do Service Worker
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  
  // Assume o controle de todos os clientes imediatamente
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              console.log('Removendo cache antigo:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
    ])
  );
});

// Estratégia de cache: Cache First, then Network, com fallback para offline.html
self.addEventListener('fetch', event => {
  // Ignorar requisições para o Google Analytics e outras APIs externas
  if (event.request.url.includes('google-analytics.com') || 
      event.request.url.includes('analytics.google.com') ||
      event.request.url.includes('accounts.google.com')) {
    return;
  }
  
  // Não fazer cache das requisições à API
  if (event.request.url.includes('ecopontos-server.onrender.com/dados')) {
    console.log('Requisição à API detectada, não usando cache:', event.request.url);
    
    event.respondWith(
      fetch(event.request)
        .catch(error => {
          console.error('Erro ao buscar dados da API:', error);
          // Se estiver offline, retornar um erro JSON
          return new Response(JSON.stringify({
            yellow: 0,
            green: 0,
            blue: 0,
            error: 'Falha na conexão'
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        })
    );
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - retorna a resposta do cache
        if (response) {
          return response;
        }

        // Clone da requisição
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest)
          .then(response => {
            // Verifica se recebemos uma resposta válida
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone da resposta
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(error => {
            // Se a requisição falhar (offline), verificar se é uma requisição de página
            if (event.request.mode === 'navigate') {
              // Retornar a página offline
              return caches.match('/offline.html');
            }
            
            // Para outros recursos, apenas retornar o erro
            throw error;
          });
      })
  );
});

// Adicionar evento de sincronização em background
self.addEventListener('sync', event => {
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

// Função para sincronizar dados quando online
async function syncData() {
  console.log('Sincronizando dados em background');
  // Implementação real depende dos requisitos específicos
  return true;
} 