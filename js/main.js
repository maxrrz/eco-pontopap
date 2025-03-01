import { CONFIG, translations } from './config.js';
import * as helpers from '../src/utils/helpers.js';
import { initGoogleAuth, checkAuthStatus } from './auth.js';

// Estado global da aplicação
const state = {
    chart: null,
    dataUpdateInterval: null,
    lastData: { yellow: 0, green: 0, blue: 0 },
    isFirstLoad: true,
    historicalData: {
        yellow: [],
        green: [],
        blue: []
    },
    chartMode: 'realtime', // 'realtime' ou '24h'
    last24hData: {
        yellow: [],
        green: [],
        blue: [],
        labels: []
    }
};

// Manipuladores de eventos
function setupEventListeners() {
    // Menu de hambúrguer
    const menuButton = document.getElementById('menu-button');
    const menuPanel = document.querySelector('.menu-panel');
    const menuOverlay = document.querySelector('.menu-overlay');
    const menuClose = document.querySelector('.menu-close');

    if (menuButton && menuPanel && menuOverlay && menuClose) {
        const toggleMenu = () => {
            menuButton.classList.toggle('active');
            menuPanel.classList.toggle('active');
            menuOverlay.classList.toggle('active');
            document.body.style.overflow = menuPanel.classList.contains('active') ? 'hidden' : '';
        };

        menuButton.addEventListener('click', toggleMenu);
        menuClose.addEventListener('click', toggleMenu);
        menuOverlay.addEventListener('click', toggleMenu);

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && menuPanel.classList.contains('active')) {
                toggleMenu();
            }
        });
    }

    // Tema
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDark = helpers.handleTheme();
            updateThemeUI(isDark);
            if (state.chart) {
                updateChartTheme(isDark);
            }
        });
    }

    // Botão últimas 24h
    const last24hBtn = document.querySelector('.chart-btn');
    if (last24hBtn) {
        last24hBtn.addEventListener('click', () => {
            const btnText = last24hBtn.querySelector('span');
            const currentLang = localStorage.getItem('language') || 'pt';

            if (state.chartMode === 'realtime') {
                // Mudar para modo 24h
                state.chartMode = '24h';
                btnText.textContent = translations[currentLang].realTime || 'Tempo Real';

                // Gerar dados simulados para as últimas 24 horas
                const hoursData = [];
                for (let i = 24; i >= 0; i--) {
                    const date = new Date();
                    date.setHours(date.getHours() - i);
                    hoursData.push(date.toLocaleTimeString());
                }

                // Salvar dados atuais
                state.last24hData.labels = [...state.chart.data.labels];
                state.last24hData.yellow = [...state.historicalData.yellow];
                state.last24hData.green = [...state.historicalData.green];
                state.last24hData.blue = [...state.historicalData.blue];

                // Atualizar labels do gráfico
                state.chart.data.labels = hoursData;

                // Gerar dados simulados para cada contentor
                const generateData = () => {
                    const data = [];
                    let value = Math.floor(Math.random() * 30) + 20; // Valor inicial entre 20 e 50
                    for (let i = 0; i < 25; i++) {
                        value += Math.floor(Math.random() * 11) - 5; // Variação de -5 a +5
                        value = Math.max(0, Math.min(100, value)); // Manter entre 0 e 100
                        data.push(value);
                    }
                    return data;
                };

                // Atualizar datasets
                state.chart.data.datasets[0].data = generateData();
                state.chart.data.datasets[1].data = generateData();
                state.chart.data.datasets[2].data = generateData();
            } else {
                // Voltar para modo realtime
                state.chartMode = 'realtime';
                btnText.textContent = translations[currentLang].last24h || 'Últimas 24h';

                // Restaurar dados anteriores
                state.chart.data.labels = [...state.last24hData.labels];
                state.chart.data.datasets[0].data = [...state.last24hData.yellow];
                state.chart.data.datasets[1].data = [...state.last24hData.green];
                state.chart.data.datasets[2].data = [...state.last24hData.blue];
            }

            // Atualizar o gráfico
            state.chart.update();
        });
    }

    // Menu de idiomas
    const languageToggle = document.querySelector('.language-toggle');
    const languageMenu = document.getElementById('language-menu');
    const languageBackdrop = document.getElementById('language-backdrop');
    const languageOptions = document.querySelectorAll('.language-option');

    if (languageToggle && languageMenu && languageBackdrop) {
        // Garantir que o menu está fechado inicialmente
        languageMenu.classList.remove('show');
        languageBackdrop.classList.remove('show');
        document.body.style.overflow = '';

        // Função para abrir o menu
        const openMenu = () => {
            languageMenu.classList.add('show');
            languageBackdrop.classList.add('show');
            document.body.style.overflow = 'hidden';
        };

        // Função para fechar o menu
        const closeMenu = () => {
            languageMenu.classList.remove('show');
            languageBackdrop.classList.remove('show');
            document.body.style.overflow = '';
        };

        // Fechar o menu imediatamente após o carregamento da página
        closeMenu();

        languageToggle.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            
            const isMenuOpen = languageMenu.classList.contains('show');
            if (isMenuOpen) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        // Fechar o menu quando clicar no backdrop
        languageBackdrop.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            closeMenu();
        });

        // Fechar o menu quando clicar fora
        document.addEventListener('click', (event) => {
            const isClickInside = event.target.closest('.language-select');
            const isMenuOpen = languageMenu.classList.contains('show');
            if (!isClickInside && isMenuOpen) {
                closeMenu();
            }
        });

        // Fechar o menu quando pressionar ESC
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && languageMenu.classList.contains('show')) {
                closeMenu();
            }
        });

        // Adicionar eventos aos botões de idioma
        if (languageOptions) {
            languageOptions.forEach(option => {
                option.addEventListener('click', (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    const lang = option.dataset.lang;
                    if (lang && translations[lang]) {
                        updateLanguage(lang);
                        closeMenu();
                    }
                });
            });
        }
    }
}

// Função para atualizar a UI do tema
function updateThemeUI(isDark) {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle?.querySelector('i');
    const themeText = themeToggle?.querySelector('span');
    const themeImage = document.getElementById('theme-image');

    if (themeIcon && themeText) {
        if (isDark) {
            themeIcon.className = 'fas fa-sun';
            themeText.textContent = translations[helpers.loadSavedLanguage()].themeLight || 'Tema Claro';
            if (themeImage) {
                themeImage.src = 'photos/tgeiescuro.png';
            }
        } else {
            themeIcon.className = 'fas fa-moon';
            themeText.textContent = translations[helpers.loadSavedLanguage()].themeDark || 'Tema Escuro';
            if (themeImage) {
                themeImage.src = 'photos/tgeiclaro.png';
            }
        }
    }
}

// Função para atualizar o idioma
function updateLanguage(lang) {
    if (!translations[lang]) return;

    document.documentElement.lang = lang;
    localStorage.setItem('language', lang);

    // Atualizar textos da interface
    updateInterfaceTexts(lang);
    
    // Atualizar labels do gráfico se ele existir
    if (state.chart) {
        updateChartLabels(lang);
    }
}

// Atualizar textos da interface
function updateInterfaceTexts(lang) {
    const elements = {
        title: { selector: '#title', text: 'title' },
        subtitle: { selector: '.subtitle', text: 'subtitle' },
        status: { selector: '#status', text: 'status' },
        averageFill: { selector: '.stat-card:nth-child(1) .stat-title', text: 'averageFill' },
        mostFull: { selector: '.stat-card:nth-child(2) .stat-title', text: 'mostFull' },
        lastUpdate: { selector: '.stat-card:nth-child(3) .stat-title', text: 'lastUpdate' },
        realTime: { selector: '.stat-card:nth-child(1) .stat-trend span', text: 'realTime' },
        monitoring: { selector: '.stat-card:nth-child(2) .stat-trend span', text: 'monitoring' },
        autoUpdate: { selector: '.stat-card:nth-child(3) .stat-trend span', text: 'autoUpdate' },
        yellowLabel: { selector: '#yellow-label', text: 'yellowLabel' },
        yellowSubtitle: { selector: '#yellow-container .ecoponto-subtitle', text: 'yellowSubtitle' },
        greenLabel: { selector: '#green-label', text: 'greenLabel' },
        greenSubtitle: { selector: '#green-container .ecoponto-subtitle', text: 'greenSubtitle' },
        blueLabel: { selector: '#blue-label', text: 'blueLabel' },
        blueSubtitle: { selector: '#blue-container .ecoponto-subtitle', text: 'blueSubtitle' },
        historyTitle: { selector: '.chart-title span', text: 'historyTitle' },
        last24h: { selector: '.chart-btn span', text: 'last24h' },
        footerText: { selector: '#footer-text', text: 'footerText' },
        language: { selector: '.language-toggle span', text: 'language' },
        about: { selector: 'a[href="about.html"]', text: 'about' },
        documentation: { selector: 'a[href="docs.html"]', text: 'documentation' },
        contact: { selector: 'a[href="contact.html"]', text: 'contact' }
    };

    for (const [key, { selector, text }] of Object.entries(elements)) {
        const element = document.querySelector(selector);
        if (element && translations[lang][text]) {
            element.textContent = translations[lang][text];
        }
    }

    // Atualizar o texto do botão de tema
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        const isDark = document.body.classList.contains('dark-mode');
        const themeText = themeToggle.querySelector('span');
        if (themeText) {
            themeText.textContent = isDark ? translations[lang].themeLight : translations[lang].themeDark;
        }
    }
}

// Atualizar labels do gráfico
function updateChartLabels(lang) {
    state.chart.data.datasets[0].label = translations[lang].yellowLabel || 'Plástico/Metal';
    state.chart.data.datasets[1].label = translations[lang].greenLabel || 'Vidro';
    state.chart.data.datasets[2].label = translations[lang].blueLabel || 'Papel/Cartão';
    state.chart.update();
}

// Initialize authentication when the page loads
document.addEventListener('DOMContentLoaded', () => {
    initGoogleAuth();
    checkAuthStatus();
    // Carregar preferências salvas
    const savedLanguage = helpers.loadSavedLanguage();
    const savedTheme = helpers.loadSavedTheme();
    
    // Atualizar idioma
    updateLanguage(savedLanguage);
    
    // Atualizar tema
    updateThemeUI(savedTheme === 'dark');
    
    // Inicializar gráfico
    initChart();
    
    // Configurar eventos
    setupEventListeners();
    
    // Iniciar atualizações
    startDataUpdate();
});

// Inicialização do gráfico
function initChart() {
    const ctx = document.getElementById('historyChart').getContext('2d');
    const currentLang = localStorage.getItem('language') || 'pt';
    
    state.chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: translations[currentLang].yellowLabel || 'Plástico/Metal',
                data: state.historicalData.yellow,
                borderColor: '#FFD700',
                tension: 0.4,
                fill: false
            }, {
                label: translations[currentLang].greenLabel || 'Vidro',
                data: state.historicalData.green,
                borderColor: '#008000',
                tension: 0.4,
                fill: false
            }, {
                label: translations[currentLang].blueLabel || 'Papel/Cartão',
                data: state.historicalData.blue,
                borderColor: '#0000FF',
                tension: 0.4,
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: document.body.classList.contains('dark-mode') ? '#fff' : '#333'
                    }
                },
                title: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    grid: {
                        color: document.body.classList.contains('dark-mode') ? 
                            'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        color: document.body.classList.contains('dark-mode') ? '#fff' : '#333'
                    }
                },
                x: {
                    grid: {
                        color: document.body.classList.contains('dark-mode') ? 
                            'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        color: document.body.classList.contains('dark-mode') ? '#fff' : '#333'
                    }
                }
            }
        }
    });
}

// Atualização dos dados
function updateData(data) {
    if (!data) return;
    
    const timestamp = new Date().toLocaleTimeString();
    
    // Atualizar histórico apenas se estiver no modo realtime
    if (state.chartMode === 'realtime') {
        // Atualizar histórico
        state.historicalData.yellow.push(data.yellow);
        state.historicalData.green.push(data.green);
        state.historicalData.blue.push(data.blue);

        // Manter apenas os últimos N pontos
        if (state.historicalData.yellow.length > CONFIG.CHART_HISTORY_SIZE) {
            state.historicalData.yellow.shift();
            state.historicalData.green.shift();
            state.historicalData.blue.shift();
        }

        // Atualizar labels do gráfico
        if (!state.chart.data.labels) {
            state.chart.data.labels = [];
        }
        state.chart.data.labels.push(timestamp);
        if (state.chart.data.labels.length > CONFIG.CHART_HISTORY_SIZE) {
            state.chart.data.labels.shift();
        }

        // Atualizar datasets
        state.chart.data.datasets[0].data = [...state.historicalData.yellow];
        state.chart.data.datasets[1].data = [...state.historicalData.green];
        state.chart.data.datasets[2].data = [...state.historicalData.blue];
        
        // Atualizar o gráfico
        state.chart.update();
    }

    // Atualizar estatísticas
    updateStatistics(data);
    
    // Atualizar barras de progresso
    updateProgressBars(data);
}

// Atualizar estatísticas
function updateStatistics(data) {
    const currentLang = localStorage.getItem('language') || 'pt';
    
    // Calcular média
    const values = [data.yellow, data.green, data.blue].filter(val => val > 0);
    const average = values.length > 0 ? Math.round(values.reduce((a, b) => a + b) / values.length) : 0;
    document.getElementById('average-fill').textContent = average > 0 ? `${average}%` : '-';

    // Encontrar contentor mais cheio
    const containers = [
        { name: translations[currentLang].yellowLabel, value: data.yellow },
        { name: translations[currentLang].greenLabel, value: data.green },
        { name: translations[currentLang].blueLabel, value: data.blue }
    ];
    
    const mostFull = containers.reduce((prev, current) => 
        (current.value > prev.value) ? current : prev
    );
    
    document.getElementById('most-full').textContent = mostFull.value > 0 
        ? `${mostFull.name} (${mostFull.value}%)`
        : '-';

    // Atualizar última atualização
    const lastUpdateTime = new Date().toLocaleTimeString();
    document.getElementById('last-update').textContent = lastUpdateTime;

    // Atualizar textos da interface
    updateInterfaceTexts(currentLang);
}

// Atualizar barras de progresso
function updateProgressBars(data) {
    const bars = {
        yellow: document.getElementById('yellow-bar'),
        green: document.getElementById('green-bar'),
        blue: document.getElementById('blue-bar')
    };

    const percentages = {
        yellow: document.getElementById('yellow-percentage'),
        green: document.getElementById('green-percentage'),
        blue: document.getElementById('blue-percentage')
    };

    for (const [color, value] of Object.entries(data)) {
        // Atualizar barra de progresso
        const bar = bars[color];
        if (bar) {
            bar.style.width = `${value}%`;
            bar.classList.toggle('warning', value >= 75 && value < 90);
            bar.classList.toggle('critical', value >= 90);
        }

        // Atualizar display de porcentagem
        const percentage = percentages[color];
        if (percentage) {
            percentage.textContent = `${value}%`;
            percentage.style.color = value >= 90 ? 'var(--danger-color)' : 
                                   value >= 75 ? 'var(--warning-color)' : 
                                   'var(--text-primary)';
        }
    }
}

// Buscar dados da API
async function fetchData() {
    try {
        const response = await fetch(CONFIG.API_URL, {
            signal: AbortSignal.timeout(CONFIG.API_TIMEOUT)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Verificar se os dados são diferentes dos últimos recebidos
        if (state.isFirstLoad || 
            data.yellow !== state.lastData.yellow || 
            data.green !== state.lastData.green || 
            data.blue !== state.lastData.blue) {
            
            state.lastData = { ...data };
            updateData(data);
            state.isFirstLoad = false;
        }
        
        updateConnectionStatus(true);
    } catch (error) {
        console.error('Erro ao obter dados:', error);
        updateData({ yellow: 0, green: 0, blue: 0 });
        updateConnectionStatus(false);
    }
}

// Atualizar status de conexão
function updateConnectionStatus(isConnected) {
    const statusDot = document.querySelector('.status-dot');
    const statusText = document.querySelector('#status');
    const currentLang = localStorage.getItem('language') || 'pt';

    if (statusDot && statusText) {
        statusDot.classList.toggle('connected', isConnected);
        statusText.textContent = isConnected ? 
            translations[currentLang].connected : 
            translations[currentLang].disconnected;
    }
}

// Iniciar atualizações de dados
function startDataUpdate() {
    if (state.dataUpdateInterval) {
        clearInterval(state.dataUpdateInterval);
    }
    fetchData();
    state.dataUpdateInterval = setInterval(fetchData, CONFIG.UPDATE_INTERVAL_CONNECTED);
}

// Atualizar tema do gráfico
function updateChartTheme(isDark) {
    if (!state.chart) return;

    const textColor = isDark ? '#fff' : '#333';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

    state.chart.options.plugins.legend.labels.color = textColor;
    state.chart.options.scales.y.grid.color = gridColor;
    state.chart.options.scales.x.grid.color = gridColor;
    state.chart.options.scales.y.ticks.color = textColor;
    state.chart.options.scales.x.ticks.color = textColor;
    state.chart.update('none'); // Use 'none' to prevent animation during theme change
} 