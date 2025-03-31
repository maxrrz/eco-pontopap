// Arquivo para gerenciar funcionalidades PWA

// Detectar se o aplicativo está sendo executado como PWA instalado
function isRunningAsInstalledPwa() {
    return window.matchMedia('(display-mode: standalone)').matches ||
           window.navigator.standalone ||
           document.referrer.includes('android-app://');
}

// Aplicar configurações específicas para PWA
function setupPwaEnvironment() {
    if (isRunningAsInstalledPwa()) {
        console.log('Aplicativo executando como PWA instalado');
        
        // Aplicar altura total à página
        document.documentElement.style.height = '100%';
        document.body.style.height = '100vh';
        document.body.style.overflow = 'hidden';
        
        // Detectar iOS
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                     (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
        
        // Tratar especificamente para iOS
        if (isIOS) {
            console.log('Dispositivo iOS detectado, aplicando tratamentos específicos');
            
            // Esconder a home indicator
            const hideHomeIndicator = document.createElement('div');
            hideHomeIndicator.style.cssText = `
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                height: 30px;
                background-color: ${document.body.classList.contains('dark-mode') ? '#1a1a1a' : '#ffffff'};
                z-index: 9999;
            `;
            document.body.appendChild(hideHomeIndicator);
            
            // Impedir gestos de navegação por deslize (swipe) que podem fechar o app
            document.addEventListener('touchmove', function(e) {
                // Se o gesto começar na parte inferior da tela
                if (e.touches[0].clientY > window.innerHeight - 40) {
                    e.preventDefault();
                }
                
                // Também prevenir gestos com múltiplos toques (pinch)
                if (e.touches.length > 1) {
                    e.preventDefault();
                }
            }, { passive: false });
            
            // Adicionar listener para atualizar a cor da barra inferior quando o tema mudar
            const themeToggle = document.getElementById('theme-toggle');
            if (themeToggle) {
                themeToggle.addEventListener('change', function() {
                    hideHomeIndicator.style.backgroundColor = document.body.classList.contains('dark-mode') 
                        ? '#1a1a1a' 
                        : '#ffffff';
                });
            }
        }
        
        // Ajustar a viewport para cobrir toda a área disponível no iOS
        const viewportMeta = document.querySelector('meta[name="viewport"]');
        if (viewportMeta) {
            viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
        }
        
        // Adicionar classe CSS para identificar modo PWA
        document.body.classList.add('pwa-standalone-mode');
    }
}

// Corrigir alinhamento do cabeçalho em modo standalone
function fixHeaderAlignment() {
    if (isRunningAsInstalledPwa()) {
        const header = document.querySelector('.header');
        if (header) {
            console.log('Ajustando alinhamento do cabeçalho');
            header.style.paddingTop = 'env(safe-area-inset-top, 0)';
        }
    }
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    setupPwaEnvironment();
    
    // Pequeno atraso para garantir que os elementos do DOM estejam disponíveis
    setTimeout(fixHeaderAlignment, 100);
});

// Exportar funções
export { isRunningAsInstalledPwa, setupPwaEnvironment }; 