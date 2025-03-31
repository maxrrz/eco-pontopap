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
    const isAndroid = /Android/.test(userAgent);
    const isChrome = /Chrome/.test(userAgent) && !/Edge/.test(userAgent);
    const isSafari = /Safari/.test(userAgent) && !/Chrome/.test(userAgent);
    const isFirefox = /Firefox/.test(userAgent);
    const isEdge = /Edg/.test(userAgent);
    
    // Criar o modal
    instructionsModal = document.createElement('div');
    instructionsModal.id = 'install-instructions-modal';
    instructionsModal.className = 'modal-overlay';
    
    // Conteúdo do modal baseado na plataforma
    let instructionsContent = '';
    
    if (isIOS && isSafari) {
        // Instruções para iOS (Safari)
        instructionsContent = `
            <h2>Instalar o myEcoPonto no iOS</h2>
            <div class="instruction-step">
                <div class="step-number">1</div>
                <div class="step-content">
                    <p>Toque no ícone de compartilhamento <i class="fas fa-share-square"></i> na barra de navegação.</p>
                    <img src="images/install/ios-share.png" alt="Botão de compartilhamento no Safari" class="instruction-image">
                </div>
            </div>
            <div class="instruction-step">
                <div class="step-number">2</div>
                <div class="step-content">
                    <p>Role para baixo e toque em "Adicionar à Tela de Início".</p>
                    <img src="images/install/ios-add.png" alt="Adicionar à Tela de Início" class="instruction-image">
                </div>
            </div>
            <div class="instruction-step">
                <div class="step-number">3</div>
                <div class="step-content">
                    <p>Confirme tocando em "Adicionar" no canto superior direito.</p>
                    <img src="images/install/ios-confirm.png" alt="Confirmar adição" class="instruction-image">
                </div>
            </div>
        `;
    } else if (isAndroid && isChrome) {
        // Instruções para Android (Chrome)
        instructionsContent = `
            <h2>Instalar o myEcoPonto no Android</h2>
            <div class="instruction-step">
                <div class="step-number">1</div>
                <div class="step-content">
                    <p>Toque no menu <i class="fas fa-ellipsis-v"></i> no canto superior direito.</p>
                    <img src="images/install/android-menu.png" alt="Menu do Chrome" class="instruction-image">
                </div>
            </div>
            <div class="instruction-step">
                <div class="step-number">2</div>
                <div class="step-content">
                    <p>Selecione "Instalar aplicativo" ou "Adicionar à tela inicial".</p>
                    <img src="images/install/android-install.png" alt="Instalar aplicativo" class="instruction-image">
                </div>
            </div>
            <div class="instruction-step">
                <div class="step-number">3</div>
                <div class="step-content">
                    <p>Confirme tocando em "Instalar".</p>
                    <img src="images/install/android-confirm.png" alt="Confirmar instalação" class="instruction-image">
                </div>
            </div>
        `;
    } else if (isChrome || isEdge) {
        // Instruções para Chrome/Edge no desktop
        instructionsContent = `
            <h2>Instalar o myEcoPonto no Desktop</h2>
            <div class="instruction-step">
                <div class="step-number">1</div>
                <div class="step-content">
                    <p>Clique no ícone de instalação <i class="fas fa-plus-circle"></i> na barra de endereço.</p>
                    <img src="images/install/desktop-icon.png" alt="Ícone de instalação" class="instruction-image">
                </div>
            </div>
            <div class="instruction-step">
                <div class="step-number">2</div>
                <div class="step-content">
                    <p>Clique em "Instalar" no prompt que aparece.</p>
                    <img src="images/install/desktop-prompt.png" alt="Prompt de instalação" class="instruction-image">
                </div>
            </div>
        `;
    } else if (isFirefox) {
        // Instruções para Firefox
        instructionsContent = `
            <h2>Instalar o myEcoPonto no Firefox</h2>
            <div class="instruction-step">
                <div class="step-number">1</div>
                <div class="step-content">
                    <p>Clique no menu <i class="fas fa-bars"></i> no canto superior direito.</p>
                </div>
            </div>
            <div class="instruction-step">
                <div class="step-number">2</div>
                <div class="step-content">
                    <p>Selecione "+ Adicionar à Tela Inicial".</p>
                </div>
            </div>
            <div class="instruction-step">
                <div class="step-number">3</div>
                <div class="step-content">
                    <p>Confirme clicando em "Adicionar".</p>
                </div>
            </div>
        `;
    } else {
        // Instruções genéricas
        instructionsContent = `
            <h2>Instalar o myEcoPonto</h2>
            <div class="instruction-step">
                <div class="step-number">1</div>
                <div class="step-content">
                    <p>Abra o site no Chrome, Edge ou Safari.</p>
                </div>
            </div>
            <div class="instruction-step">
                <div class="step-number">2</div>
                <div class="step-content">
                    <p>No menu do navegador, procure a opção "Instalar aplicativo" ou "Adicionar à tela inicial".</p>
                </div>
            </div>
            <div class="instruction-step">
                <div class="step-number">3</div>
                <div class="step-content">
                    <p>Siga as instruções na tela para completar a instalação.</p>
                </div>
            </div>
        `;
    }
    
    // Estrutura do modal
    instructionsModal.innerHTML = `
        <div class="modal-content install-instructions-content">
            <div class="modal-header">
                <h2>Como Instalar o myEcoPonto</h2>
                <button class="modal-close"><i class="fas fa-times"></i></button>
            </div>
            <div class="modal-body">
                ${instructionsContent}
                <div class="note">
                    <p><i class="fas fa-info-circle"></i> Nota: Após a instalação, você poderá acessar o myEcoPonto diretamente do seu dispositivo, mesmo quando estiver offline.</p>
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