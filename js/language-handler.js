/**
 * language-handler.js
 * Módulo para gerenciar a funcionalidade de troca de idiomas em todas as páginas
 */

import { CONFIG, translations } from './config.js';

// Função para carregar o idioma salvo
export function loadSavedLanguage() {
    return localStorage.getItem('language') || CONFIG.DEFAULT_LANGUAGE;
}

// Função para inicializar o manipulador de idiomas
export function initLanguageHandler() {
    console.log('Inicializando manipulador de idiomas...');
    
    // Elementos do menu de idiomas
    const languageMenuItem = document.getElementById('language-menu-item');
    const languageSubmenu = document.querySelector('.language-submenu');
    const languageOptions = document.querySelectorAll('.language-option');
    
    // Carregar o idioma salvo
    const currentLang = loadSavedLanguage();
    console.log('Idioma atual:', currentLang);
    
    // Aplicar o idioma atual
    applyLanguage(currentLang);
    
    // Configurar o manipulador do submenu de idiomas
    if (languageMenuItem && languageSubmenu) {
        languageMenuItem.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            this.classList.toggle('active');
            languageSubmenu.classList.toggle('active');
            languageSubmenu.style.display = languageSubmenu.classList.contains('active') ? 'block' : 'none';
        });
    }
    
    // Configurar os manipuladores das opções de idioma
    if (languageOptions) {
        languageOptions.forEach(option => {
            // Atualizar a visibilidade do ícone de verificação
            const lang = option.getAttribute('data-lang');
            const checkIcon = option.querySelector('i');
            if (checkIcon) {
                checkIcon.style.visibility = lang === currentLang ? 'visible' : 'hidden';
            }
            
            // Adicionar o manipulador de eventos
            option.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const lang = this.getAttribute('data-lang');
                
                console.log('Idioma selecionado:', lang);
                
                // Atualizar visibilidade dos ícones de verificação
                languageOptions.forEach(opt => {
                    const icon = opt.querySelector('i');
                    if (icon) {
                        icon.style.visibility = 'hidden';
                    }
                });
                
                const thisIcon = this.querySelector('i');
                if (thisIcon) {
                    thisIcon.style.visibility = 'visible';
                }
                
                // Aplicar o idioma
                applyLanguage(lang);
                
                // Fechar o submenu após selecionar o idioma
                if (languageSubmenu && languageMenuItem) {
                    languageSubmenu.classList.remove('active');
                    languageSubmenu.style.display = 'none';
                    languageMenuItem.classList.remove('active');
                }
                
                // Mostrar feedback ao usuário
                showNotification(`Idioma alterado para ${this.querySelector('span').textContent}`);
            });
        });
    }
}

// Função para aplicar o idioma
export function applyLanguage(lang) {
    if (!translations[lang]) {
        console.error('Tradução não encontrada para o idioma:', lang);
        console.log('Idiomas disponíveis:', Object.keys(translations));
        return;
    }
    
    console.log('Aplicando idioma:', lang);
    
    // Atualizar o atributo lang do HTML
    document.documentElement.lang = lang;
    
    // Salvar o idioma no localStorage
    localStorage.setItem('language', lang);
    
    // Atualizar os textos da interface
    updateInterfaceTexts(lang);
    
    // Atualizar o título da página
    document.title = translations[lang].appName + ' - ' + translations[lang].subtitle;
    
    // Atualizar gráficos se existirem (para main.js)
    if (window.state && window.state.chart) {
        updateChartLabels(window.state.chart, lang);
    }
    
    // Debug
    console.log('Idioma aplicado:', lang);
    console.log('HTML lang attribute:', document.documentElement.lang);
    console.log('localStorage language:', localStorage.getItem('language'));
}

// Função para atualizar os textos da interface
function updateInterfaceTexts(lang) {
    // Verificar em qual página estamos
    const currentPath = window.location.pathname;
    const pageName = currentPath.split('/').pop() || 'index.html';
    
    console.log('Atualizando textos para a página:', pageName);
    
    // Atualizar elementos comuns a todas as páginas
    updateCommonElements(lang);
    
    // Atualizar elementos específicos da página
    if (pageName.includes('index.html') || pageName === '') {
        updateDashboardElements(lang);
    } else if (pageName.includes('about.html')) {
        updateAboutElements(lang);
    } else if (pageName.includes('contact.html')) {
        updateContactElements(lang);
    } else if (pageName.includes('charts.html')) {
        updateChartsElements(lang);
    } else if (pageName.includes('docs.html')) {
        updateDocsElements(lang);
    }
}

// Função para atualizar elementos comuns a todas as páginas
function updateCommonElements(lang) {
    // Menu principal
    const menuElements = {
        '#dashboard-menu-item span': 'dashboard',
        '#notifications-menu-item span': 'notifications',
        '#charts-menu-item span': 'charts',
        '#settings-menu-item span': 'settings',
        '#language-menu-item span': 'language',
        'a[data-menu-id="user"] span': 'user',
        'a[data-menu-id="logout"] span': 'logout'
    };
    
    // Atualizar cada elemento do menu
    for (const [selector, key] of Object.entries(menuElements)) {
        updateElement(selector, key, lang);
    }
    
    // Footer
    updateElement('#footer-text', 'footerText', lang);
    updateElement('a[href="about.html"]', 'about', lang);
    updateElement('a[href="docs.html"]', 'documentation', lang);
    updateElement('a[href="contact.html"]', 'contact', lang);
    
    // Tema
    updateElement('.theme-toggle-container span', 'darkMode', lang);
}

// Função para atualizar elementos da página de dashboard
function updateDashboardElements(lang) {
    // Título e subtítulo
    updateElement('#title', 'appName', lang);
    updateElement('.subtitle', 'subtitle', lang);
    updateElement('#status', 'connected', lang);
    
    // Mensagem de boas-vindas
    updateElement('.welcome-message h2', 'welcome', lang);
    updateElement('.welcome-message p', 'welcomeMessage', lang);
    
    // Estatísticas
    updateElement('.stat-card:nth-child(1) .stat-title', 'averageFill', lang);
    updateElement('.stat-card:nth-child(2) .stat-title', 'mostFull', lang);
    updateElement('.stat-card:nth-child(3) .stat-title', 'lastUpdate', lang);
    updateElement('.stat-card:nth-child(1) .stat-trend span', 'realTime', lang);
    updateElement('.stat-card:nth-child(2) .stat-trend span', 'monitoring', lang);
    updateElement('.stat-card:nth-child(3) .stat-trend span', 'autoUpdate', lang);
    
    // Mensagem de informação
    updateElement('.ecoponto-info-message p', 'ecopontoInfoMessage', lang);
    
    // Ecopontos
    updateElement('#yellow-label', 'ecopointTypes.yellow', lang, true);
    updateElement('#yellow-container .ecoponto-subtitle', 'yellowSubtitle', lang);
    updateElement('#green-label', 'ecopointTypes.green', lang, true);
    updateElement('#green-container .ecoponto-subtitle', 'greenSubtitle', lang);
    updateElement('#blue-label', 'ecopointTypes.blue', lang, true);
    updateElement('#blue-container .ecoponto-subtitle', 'blueSubtitle', lang);
    
    // Gráfico
    updateElement('.chart-title span', 'chartsTitle', lang);
    updateElement('.chart-btn span', 'timeRanges.24h', lang, true);
}

// Função para atualizar elementos da página sobre
function updateAboutElements(lang) {
    updateElement('.about-title', 'about', lang);
    updateElement('.about-subtitle', 'aboutSubtitle', lang);
    
    // Seções específicas da página sobre
    const aboutSections = document.querySelectorAll('.about-section');
    if (aboutSections && aboutSections.length > 0) {
        // Primeira seção - Sobre o projeto
        if (aboutSections[0]) {
            updateElement(aboutSections[0].querySelector('h2'), 'aboutProject', lang);
            updateElement(aboutSections[0].querySelector('p'), 'aboutProjectText', lang);
        }
        
        // Segunda seção - Tecnologias
        if (aboutSections[1]) {
            updateElement(aboutSections[1].querySelector('h2'), 'technologies', lang);
        }
        
        // Terceira seção - Objetivos
        if (aboutSections[2]) {
            updateElement(aboutSections[2].querySelector('h2'), 'objectives', lang);
            
            // Objetivos individuais
            const objectives = aboutSections[2].querySelectorAll('li');
            if (objectives && objectives.length > 0) {
                for (let i = 0; i < objectives.length; i++) {
                    updateElement(objectives[i], `objective${i+1}`, lang);
                }
            }
        }
        
        // Quarta seção - Equipe
        if (aboutSections[3]) {
            updateElement(aboutSections[3].querySelector('h2'), 'team', lang);
        }
    }
}

// Função para atualizar elementos da página de contato
function updateContactElements(lang) {
    updateElement('.contact-title', 'contact', lang);
    updateElement('.contact-subtitle', 'contactSubtitle', lang);
    
    // Formulário de contato
    updateElement('label[for="name"]', 'name', lang);
    updateElement('label[for="email"]', 'email', lang);
    updateElement('label[for="message"]', 'message', lang);
    updateElement('.submit-btn', 'send', lang);
    
    // Informações de contato
    const contactCards = document.querySelectorAll('.contact-card');
    if (contactCards && contactCards.length > 0) {
        // Email
        if (contactCards[0]) {
            updateElement(contactCards[0].querySelector('h3'), 'emailUs', lang);
        }
        
        // Telefone
        if (contactCards[1]) {
            updateElement(contactCards[1].querySelector('h3'), 'callUs', lang);
        }
        
        // Localização
        if (contactCards[2]) {
            updateElement(contactCards[2].querySelector('h3'), 'visitUs', lang);
        }
    }
}

// Função para atualizar elementos da página de gráficos
function updateChartsElements(lang) {
    updateElement('.charts-title', 'charts', lang);
    updateElement('.charts-subtitle', 'chartsSubtitle', lang);
    
    // Botões de intervalo de tempo
    const timeButtons = document.querySelectorAll('.time-range-btn');
    if (timeButtons && timeButtons.length > 0) {
        updateElement(timeButtons[0], 'timeRanges.24h', lang, true);
        updateElement(timeButtons[1], 'timeRanges.7d', lang, true);
        updateElement(timeButtons[2], 'timeRanges.30d', lang, true);
    }
    
    // Estatísticas
    updateElement('.chart-stat:nth-child(1) .stat-title', 'averageFilling', lang);
    updateElement('.chart-stat:nth-child(2) .stat-title', 'peakFilling', lang);
    updateElement('.chart-stat:nth-child(3) .stat-title', 'fastestFilling', lang);
}

// Função para atualizar elementos da página de documentação
function updateDocsElements(lang) {
    updateElement('.docs-title', 'documentation', lang);
    updateElement('.docs-subtitle', 'docsSubtitle', lang);
    
    // Itens de navegação
    const navItems = document.querySelectorAll('.docs-nav-item');
    if (navItems && navItems.length > 0) {
        updateElement(navItems[0], 'gettingStarted', lang);
        updateElement(navItems[1], 'installation', lang);
        updateElement(navItems[2], 'usage', lang);
        updateElement(navItems[3], 'api', lang);
        updateElement(navItems[4], 'examples', lang);
    }
    
    // Seções
    const sections = document.querySelectorAll('.docs-section');
    if (sections && sections.length > 0) {
        for (let i = 0; i < sections.length; i++) {
            updateElement(sections[i].querySelector('h2'), `docsSection${i+1}Title`, lang);
            updateElement(sections[i].querySelector('p'), `docsSection${i+1}Text`, lang);
        }
    }
}

// Função auxiliar para atualizar um elemento
function updateElement(selector, key, lang, isNestedKey = false) {
    const element = typeof selector === 'string' ? document.querySelector(selector) : selector;
    
    if (!element) {
        return;
    }
    
    let translationValue;
    
    if (isNestedKey) {
        // Lidar com chaves aninhadas como 'ecopointTypes.yellow'
        const keys = key.split('.');
        let currentObj = translations[lang];
        
        for (const k of keys) {
            if (currentObj && currentObj[k] !== undefined) {
                currentObj = currentObj[k];
            } else {
                currentObj = null;
                break;
            }
        }
        
        translationValue = currentObj;
    } else {
        translationValue = translations[lang][key];
    }
    
    if (translationValue) {
        element.textContent = translationValue;
    }
}

// Função para atualizar labels do gráfico
export function updateChartLabels(chart, lang) {
    if (!chart || !translations[lang]) return;
    
    console.log('Atualizando labels do gráfico para:', lang);
    
    // Atualizar título
    if (chart.options.plugins && chart.options.plugins.title) {
        chart.options.plugins.title.text = translations[lang].chartsTitle;
    }
    
    // Atualizar legendas
    if (chart.data && chart.data.datasets) {
        if (chart.data.datasets[0]) chart.data.datasets[0].label = translations[lang].ecopointTypes.yellow;
        if (chart.data.datasets[1]) chart.data.datasets[1].label = translations[lang].ecopointTypes.green;
        if (chart.data.datasets[2]) chart.data.datasets[2].label = translations[lang].ecopointTypes.blue;
    }
    
    // Atualizar eixos
    if (chart.options.scales) {
        if (chart.options.scales.y && chart.options.scales.y.title) {
            chart.options.scales.y.title.text = translations[lang].fillLevel || 'Nível de Enchimento (%)';
        }
        
        if (chart.options.scales.x && chart.options.scales.x.title) {
            chart.options.scales.x.title.text = translations[lang].time || 'Tempo';
        }
    }
    
    // Aplicar as alterações
    chart.update();
}

// Função para mostrar notificação
function showNotification(message, duration = 3000) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, duration);
}

// Inicializar o manipulador de idiomas quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', initLanguageHandler); 