// Registrar o Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js', {
      scope: '/',
      updateViaCache: 'none'
    })
      .then(registration => {
        console.log('Service Worker registrado com sucesso:', registration.scope);
        
        // Verificar por atualizações a cada hora
        setInterval(() => {
          registration.update();
          console.log('Service worker atualizado');
        }, 60 * 60 * 1000);
      })
      .catch(error => {
        console.error('Falha ao registrar o Service Worker:', error);
      });
  });
}

// Verificar se o app já está sendo executado como PWA instalado
function isPWAInstalled() {
  // Verificar vários métodos para detectar modo standalone
  return (
    window.matchMedia('(display-mode: standalone)').matches || 
    window.matchMedia('(display-mode: fullscreen)').matches || 
    window.matchMedia('(display-mode: minimal-ui)').matches || 
    window.navigator.standalone || // Para iOS Safari
    document.referrer.includes('android-app://') ||
    window.location.href.includes('?standalone=true') // URL param para testes
  );
}

// Criar e mostrar a splash screen
function showSplashScreen() {
  // Verificar se já existe uma splash screen
  if (document.querySelector('.splash-screen')) {
    return;
  }
  
  // Criar a splash screen
  const splashScreen = document.createElement('div');
  splashScreen.className = 'splash-screen';
  
  // Adicionar conteúdo
  splashScreen.innerHTML = `
    <img src="images/icon-192x192.png" alt="EcoPonto Logo" class="splash-logo">
    <h1 class="splash-title">EcoPonto Inteligente</h1>
    <p class="splash-subtitle">Monitorização em Tempo Real</p>
  `;
  
  // Adicionar ao body
  document.body.appendChild(splashScreen);
  
  // Esconder após 2 segundos
  setTimeout(() => {
    splashScreen.classList.add('hidden');
    
    // Remover do DOM após a animação
    setTimeout(() => {
      splashScreen.remove();
    }, 500);
  }, 2000);
}

// Adicionar evento para instalação do PWA
let deferredPrompt;

window.addEventListener('load', () => {
  // Verificar se o app já está instalado
  if (isPWAInstalled()) {
    console.log('Aplicação já está instalada como PWA');
    
    // Mostrar splash screen apenas quando executado como PWA
    showSplashScreen();
    
    // Esconder o botão de instalação
    const installButton = document.getElementById('install-button');
    const installDivider = document.getElementById('install-divider');
    
    if (installButton && installDivider) {
      installButton.style.display = 'none';
      installDivider.style.display = 'none';
    }
    
    // Adicionar classe ao body para ajustes específicos de PWA
    document.body.classList.add('pwa-installed');
  }
});

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevenir o comportamento padrão do Chrome
  e.preventDefault();
  // Armazenar o evento para uso posterior
  deferredPrompt = e;
  
  // Mostrar o botão de instalação personalizado
  const installButton = document.getElementById('install-button');
  const installDivider = document.getElementById('install-divider');
  
  if (installButton && installDivider) {
    installButton.style.display = 'flex';
    installDivider.style.display = 'block';
    installButton.classList.add('pulse-animation');
    
    installButton.addEventListener('click', (event) => {
      event.preventDefault();
      // Remover a animação de pulsação
      installButton.classList.remove('pulse-animation');
      
      // Mostrar o prompt de instalação
      deferredPrompt.prompt();
      
      // Esperar pela escolha do usuário
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('Usuário aceitou a instalação do PWA');
        } else {
          console.log('Usuário recusou a instalação do PWA');
        }
        // Limpar a referência
        deferredPrompt = null;
        
        // Esconder o botão
        installButton.style.display = 'none';
        installDivider.style.display = 'none';
      });
    });
  }
});

// Verificar se o app já está instalado
window.addEventListener('appinstalled', (evt) => {
  console.log('Aplicação instalada com sucesso!');
  
  // Esconder o botão de instalação
  const installButton = document.getElementById('install-button');
  const installDivider = document.getElementById('install-divider');
  
  if (installButton && installDivider) {
    installButton.style.display = 'none';
    installDivider.style.display = 'none';
  }
  
  // Adicionar classe ao body para ajustes específicos de PWA
  document.body.classList.add('pwa-installed');
});

// Detectar quando o usuário está offline
window.addEventListener('load', () => {
  function updateOnlineStatus() {
    // O indicador de status offline foi removido
    // Nada mais é necessário aqui
  }

  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
  
  // Verificar o status inicial
  updateOnlineStatus();
  
  // Atualizar o status quando o idioma mudar
  window.addEventListener('languageChanged', updateOnlineStatus);
}); 