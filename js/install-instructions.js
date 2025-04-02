/**
 * install-instructions.js
 * Script para exibir instruções de instalação do myEcoPonto
 */

// Definir a função globalmente
function showInstallInstructions() {
    // Verificar se já existe um modal de instruções
    let instructionsModal = document.getElementById('install-instructions-modal');
    
    if (instructionsModal) {
        instructionsModal.remove();
    }
    
    // Detectar o sistema operacional e navegador
    const userAgent = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
    const isAndroid = /Android/.test(userAgent) && !/Edge/.test(userAgent);
    const isChrome = /Chrome/.test(userAgent) && !/Edge/.test(userAgent);
    const isSafari = /Safari/.test(userAgent) && !/Chrome/.test(userAgent);
    const isFirefox = /Firefox/.test(userAgent);
    const isEdge = /Edg/.test(userAgent);
    
    // Obter o idioma atual
    const currentLanguage = window.languageState?.currentLanguage || 
                            localStorage.getItem('language') || 
                            'pt';
    
    // Função para obter texto traduzido
    const getTranslatedText = (key, defaultText) => {
        if (window.translations && window.translations[currentLanguage] && window.translations[currentLanguage][key]) {
            return window.translations[currentLanguage][key];
        }
        return defaultText;
    };
    
    // Textos traduzidos
    const texts = {
        modalTitle: getTranslatedText('installAppModalTitle', 'Instalar a aplicação do myEcoponto'),
        closeButton: getTranslatedText('close', 'Fechar'),
        
        // iOS
        iOSTitle: getTranslatedText('installAppIOSTitle', 'Instalar o myEcoPonto no iOS'),
        iOSStep1: getTranslatedText('installAppIOSStep1', 'Toque no ícone de compartilhamento na barra de navegação.'),
        iOSStep2: getTranslatedText('installAppIOSStep2', 'Role para baixo e toque em "Adicionar à Tela de Início".'),
        iOSStep3: getTranslatedText('installAppIOSStep3', 'Confirme tocando em "Adicionar" no canto superior direito.'),
        
        // Android
        androidTitle: getTranslatedText('installAppAndroidTitle', 'Instalar o myEcoPonto no Android'),
        androidStep1: getTranslatedText('installAppAndroidStep1', 'Toque no menu no canto superior direito.'),
        androidStep2: getTranslatedText('installAppAndroidStep2', 'Selecione "Instalar aplicativo" ou "Adicionar à tela inicial".'),
        androidStep3: getTranslatedText('installAppAndroidStep3', 'Confirme tocando em "Instalar".'),
        
        // Desktop
        desktopTitle: getTranslatedText('installAppDesktopTitle', 'Instalar o myEcoPonto no Desktop'),
        desktopStep1: getTranslatedText('installAppDesktopStep1', 'Clique no ícone de instalação na barra de endereço.'),
        desktopStep2: getTranslatedText('installAppDesktopStep2', 'Clique em "Instalar" no prompt que aparece.'),
        
        // Firefox
        firefoxTitle: getTranslatedText('installAppFirefoxTitle', 'Instalar o myEcoPonto no Firefox'),
        firefoxStep1: getTranslatedText('installAppFirefoxStep1', 'Clique no menu no canto superior direito.'),
        firefoxStep2: getTranslatedText('installAppFirefoxStep2', 'Selecione "+ Adicionar à Tela Inicial".'),
        firefoxStep3: getTranslatedText('installAppFirefoxStep3', 'Confirme clicando em "Adicionar".'),
        
        // Genérico
        genericTitle: getTranslatedText('installAppGenericTitle', 'Instalar o myEcoPonto'),
        genericStep1: getTranslatedText('installAppGenericStep1', 'Abra o site no Chrome, Edge ou Safari.'),
        genericStep2: getTranslatedText('installAppGenericStep2', 'No menu do navegador, procure a opção "Instalar aplicativo" ou "Adicionar à tela inicial".'),
        genericStep3: getTranslatedText('installAppGenericStep3', 'Siga as instruções na tela para completar a instalação.'),
        
        // Nota
        installNote: getTranslatedText('installAppNote', 'Nota: Após a instalação, você poderá acessar o myEcoPonto diretamente do seu dispositivo, mesmo quando estiver offline.')
    };
    
    // Criar o modal
    instructionsModal = document.createElement('div');
    instructionsModal.id = 'install-instructions-modal';
    instructionsModal.className = 'modal-overlay';
    
    // Conteúdo do modal baseado na plataforma
    let instructionsContent = '';
    
    if (isIOS && isSafari) {
        // Instruções para iOS (Safari)
        instructionsContent = `
            <h2>${texts.iOSTitle}</h2>
            <div class="instruction-step">
                <div class="step-number">1</div>
                <div class="step-content">
                    <p>${texts.iOSStep1}</p>
                    <img src="images/install/ios-share.png" alt="Botão de compartilhamento no Safari" class="instruction-image">
                </div>
            </div>
            <div class="instruction-step">
                <div class="step-number">2</div>
                <div class="step-content">
                    <p>${texts.iOSStep2}</p>
                    <img src="images/install/ios-add.png" alt="Adicionar à Tela de Início" class="instruction-image">
                </div>
            </div>
            <div class="instruction-step">
                <div class="step-number">3</div>
                <div class="step-content">
                    <p>${texts.iOSStep3}</p>
                    <img src="images/install/ios-confirm.png" alt="Confirmar adição" class="instruction-image">
                </div>
            </div>
        `;
    } else if (isAndroid && isChrome) {
        // Instruções para Android (Chrome)
        instructionsContent = `
            <h2>${texts.androidTitle}</h2>
            <div class="instruction-step">
                <div class="step-number">1</div>
                <div class="step-content">
                    <p>${texts.androidStep1}</p>
                    <img src="images/install/android-menu.png" alt="Menu do Chrome" class="instruction-image">
                </div>
            </div>
            <div class="instruction-step">
                <div class="step-number">2</div>
                <div class="step-content">
                    <p>${texts.androidStep2}</p>
                    <img src="images/install/android-install.png" alt="Instalar aplicativo" class="instruction-image">
                </div>
            </div>
            <div class="instruction-step">
                <div class="step-number">3</div>
                <div class="step-content">
                    <p>${texts.androidStep3}</p>
                    <img src="images/install/android-confirm.png" alt="Confirmar instalação" class="instruction-image">
                </div>
            </div>
        `;
    } else if (isChrome || isEdge) {
        // Instruções para Chrome/Edge no desktop
        instructionsContent = `
            <h2>${texts.desktopTitle}</h2>
            <div class="instruction-step">
                <div class="step-number">1</div>
                <div class="step-content">
                    <p>${texts.desktopStep1}</p>
                    <img src="images/install/desktop-icon.png" alt="Ícone de instalação" class="instruction-image">
                </div>
            </div>
            <div class="instruction-step">
                <div class="step-number">2</div>
                <div class="step-content">
                    <p>${texts.desktopStep2}</p>
                    <img src="images/install/desktop-prompt.png" alt="Prompt de instalação" class="instruction-image">
                </div>
            </div>
        `;
    } else if (isFirefox) {
        // Instruções para Firefox
        instructionsContent = `
            <h2>${texts.firefoxTitle}</h2>
            <div class="instruction-step">
                <div class="step-number">1</div>
                <div class="step-content">
                    <p>${texts.firefoxStep1}</p>
                </div>
            </div>
            <div class="instruction-step">
                <div class="step-number">2</div>
                <div class="step-content">
                    <p>${texts.firefoxStep2}</p>
                </div>
            </div>
            <div class="instruction-step">
                <div class="step-number">3</div>
                <div class="step-content">
                    <p>${texts.firefoxStep3}</p>
                </div>
            </div>
        `;
    } else {
        // Instruções genéricas
        instructionsContent = `
            <h2>${texts.genericTitle}</h2>
            <div class="instruction-step">
                <div class="step-number">1</div>
                <div class="step-content">
                    <p>${texts.genericStep1}</p>
                </div>
            </div>
            <div class="instruction-step">
                <div class="step-number">2</div>
                <div class="step-content">
                    <p>${texts.genericStep2}</p>
                </div>
            </div>
            <div class="instruction-step">
                <div class="step-number">3</div>
                <div class="step-content">
                    <p>${texts.genericStep3}</p>
                </div>
            </div>
        `;
    }
    
    // Estrutura do modal
    instructionsModal.innerHTML = `
        <div class="modal-content install-instructions-content">
            <div class="modal-header">
                <h2>${texts.modalTitle}</h2>
                <button class="modal-close"><i class="fas fa-times"></i></button>
            </div>
            <div class="modal-body">
                ${instructionsContent}
                <div class="note">
                    <p><i class="fas fa-info-circle"></i> ${texts.installNote}</p>
                </div>
            </div>
        </div>
    `;
    
    // Adicionar o modal ao DOM
    document.body.appendChild(instructionsModal);
    
    // Mostrar o modal com animação
    setTimeout(() => {
        instructionsModal.classList.add('visible');
    }, 10);
    
    // Adicionar evento para fechar o modal
    const closeButton = instructionsModal.querySelector('.modal-close');
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            instructionsModal.classList.remove('visible');
            setTimeout(() => {
                instructionsModal.remove();
            }, 300);
        });
    }
    
    // Fechar o modal ao clicar fora dele
    instructionsModal.addEventListener('click', (e) => {
        if (e.target === instructionsModal) {
            instructionsModal.classList.remove('visible');
            setTimeout(() => {
                instructionsModal.remove();
            }, 300);
        }
    });
}

// Tornar a função disponível globalmente
window.showInstallInstructions = showInstallInstructions;

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM carregado em install-instructions.js');
    
    // Obter o botão de instalação da aplicação
    const installAppButton = document.getElementById('install-app-button');
    
    // Adicionar evento ao botão de instalação
    if (installAppButton) {
        console.log('Botão de instalação encontrado, adicionando evento de clique');
        installAppButton.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Botão de instalação clicado via install-instructions.js');
            showInstallInstructions();
        });
    } else {
        console.error('Botão de instalação não encontrado no DOM');
    }
}); 