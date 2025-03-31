/**
 * device-detection.js
 * Detecta o tipo de dispositivo e sistema operacional do usuário
 */

// Função para detectar o tipo de dispositivo
export function detectDevice() {
    const userAgent = navigator.userAgent.toLowerCase();
    let deviceType = {
        isIOS: false,
        isMac: false,
        isAndroid: false,
        isWindows: false,
        deviceName: 'Desconhecido'
    };

    // Verifica se é iOS (iPhone, iPad, iPod)
    if (/iphone|ipad|ipod/.test(userAgent)) {
        deviceType.isIOS = true;
        deviceType.deviceName = 'iOS';
    }
    // Verifica se é MacOS
    else if (/macintosh|mac os x/.test(userAgent) && !(/iphone|ipad|ipod/.test(userAgent))) {
        deviceType.isMac = true;
        deviceType.deviceName = 'Mac';
    }
    // Verifica se é Android
    else if (/android/.test(userAgent)) {
        deviceType.isAndroid = true;
        deviceType.deviceName = 'Android';
    }
    // Verifica se é Windows
    else if (/windows/.test(userAgent)) {
        deviceType.isWindows = true;
        deviceType.deviceName = 'Windows';
    }

    return deviceType;
}

// Função para mostrar os passos de instalação específicos para cada plataforma
export function showInstallSteps() {
    const device = detectDevice();
    let installStepsElement = document.getElementById('install-steps');
    
    if (!installStepsElement) return;
    
    let installStepsContent = '';
    
    if (device.isIOS) {
        installStepsContent = `
            <h3>Passos para instalar no iOS (iPhone/iPad)</h3>
            <ol>
                <li>Abra esta página no <strong>Safari</strong> (outros navegadores não são suportados)</li>
                <li>Toque no ícone de <strong>Compartilhar</strong> <i class="fas fa-share-square"></i> na parte inferior da tela</li>
                <li>Role para baixo e toque em <strong>Adicionar à Tela de Início</strong></li>
                <li>Confirme tocando em <strong>Adicionar</strong> no canto superior direito</li>
                <li>Agora a aplicação aparecerá na sua tela inicial como um aplicativo nativo</li>
            </ol>
        `;
    } else if (device.isMac) {
        installStepsContent = `
            <h3>Passos para instalar no Mac</h3>
            <ol>
                <li>Abra esta página no <strong>Safari</strong> ou <strong>Chrome</strong></li>
                <li>No Safari: Clique em <strong>Safari > Configurações > Sites</strong> e ative "Adicionar aplicativos web à tela inicial"</li>
                <li>No Chrome: Clique nos três pontos no canto superior direito, depois em <strong>Instalar myEcoponto</strong></li>
                <li>Confirme a instalação na janela de diálogo</li>
                <li>O aplicativo será adicionado à sua pasta de Aplicativos e ao Dock</li>
            </ol>
        `;
    } else if (device.isAndroid) {
        installStepsContent = `
            <h3>Passos para instalar no Android</h3>
            <ol>
                <li>Abra esta página no <strong>Chrome</strong> ou navegador compatível</li>
                <li>Toque no banner de instalação que aparece automaticamente <i class="fas fa-arrow-down"></i></li>
                <li>OU toque nos três pontos no canto superior direito</li>
                <li>Selecione <strong>Instalar aplicativo</strong> ou <strong>Adicionar à tela inicial</strong></li>
                <li>Confirme tocando em <strong>Instalar</strong></li>
                <li>O aplicativo será adicionado à tela inicial do seu dispositivo</li>
            </ol>
        `;
    } else if (device.isWindows) {
        installStepsContent = `
            <h3>Passos para instalar no Windows</h3>
            <ol>
                <li>Abra esta página no <strong>Microsoft Edge</strong> ou <strong>Google Chrome</strong></li>
                <li>Em Edge: Clique nos três pontos no canto superior direito, depois em <strong>Aplicativos > Instalar este site como um aplicativo</strong></li>
                <li>Em Chrome: Clique nos três pontos no canto superior direito, depois em <strong>Instalar myEcoponto</strong></li>
                <li>Confirme a instalação na janela de diálogo</li>
                <li>O aplicativo será adicionado à sua Área de Trabalho e Menu Iniciar</li>
            </ol>
        `;
    } else {
        // Dispositivo desconhecido - mostra instruções genéricas
        installStepsContent = `
            <h3>Passos para instalar</h3>
            <p>O seu dispositivo não foi reconhecido. Aqui estão as instruções gerais:</p>
            <ol>
                <li>No Chrome ou Edge: Clique nos três pontos no canto superior direito</li>
                <li>Selecione <strong>Instalar aplicativo</strong> ou <strong>Adicionar à tela inicial</strong></li>
                <li>No Safari iOS: Use o botão de compartilhar e selecione <strong>Adicionar à Tela de Início</strong></li>
                <li>No Firefox Android: Toque nos três pontos e selecione <strong>Instalar</strong></li>
            </ol>
        `;
    }
    
    installStepsElement.innerHTML = installStepsContent;
} 