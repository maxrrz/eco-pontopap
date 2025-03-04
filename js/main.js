import { CONFIG, translations } from './config.js';
import * as helpers from '../src/utils/helpers.js';
import { MenuManager } from './menu-functions.js';

console.log('Módulo main.js carregado!');
console.log('CONFIG.IS_LOCAL_DEV:', CONFIG.IS_LOCAL_DEV);

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

// Inicializar a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM carregado, inicializando aplicação...');
    
    try {
        // Carregar tema salvo
        const savedTheme = localStorage.getItem('theme');
        const isDarkTheme = savedTheme === 'dark' || 
                          (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
        
        // Atualizar UI com base no tema
        updateThemeUI(isDarkTheme);
        
        // Inicializar gráfico
        initChart();
        
        // Configurar event listeners
        setupEventListeners();
        
        // Iniciar atualizações de dados
        startDataUpdate();
        
        // Verificar periodicamente se o intervalo de atualização está ativo
        setInterval(() => {
            if (!window.dataUpdateInterval) {
                console.warn('Intervalo de atualização não encontrado, reiniciando...');
                startDataUpdate();
            }
        }, 30000); // Verificar a cada 30 segundos
        
        console.log('Aplicação inicializada com sucesso!');
    } catch (error) {
        console.error('Erro ao inicializar aplicação:', error);
    }
});

// Manipuladores de eventos
function setupEventListeners() {
    // Menu de hambúrguer
    const menuButton = document.getElementById('menu-button');
    const menuPanel = document.querySelector('.menu-panel');
    const menuOverlay = document.querySelector('.menu-overlay');
    const menuClose = document.querySelector('.menu-close');
    const themeToggle = document.getElementById('theme-toggle');
    const languageMenuItem = document.getElementById('language-menu-item');
    const languageSubmenu = document.querySelector('.language-submenu');
    const languageOptions = document.querySelectorAll('.language-option');

    if (menuButton && menuPanel && menuOverlay && menuClose) {
        const toggleMenu = () => {
            menuButton.classList.toggle('active');
            menuPanel.classList.toggle('active');
            menuOverlay.classList.toggle('active');
            document.body.style.overflow = menuPanel.classList.contains('active') ? 'hidden' : '';
        };

        menuButton.addEventListener('click', toggleMenu);
        menuClose.addEventListener('click', toggleMenu);
        menuOverlay.addEventListener('click', function(e) {
            // Fechar qualquer submenu aberto
            if (languageSubmenu && languageSubmenu.classList.contains('active')) {
                languageSubmenu.classList.remove('active');
                languageSubmenu.style.display = 'none';
                if (languageMenuItem) languageMenuItem.classList.remove('active');
            }
            toggleMenu();
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && menuPanel.classList.contains('active')) {
                // Fechar qualquer submenu aberto primeiro
                if (languageSubmenu && languageSubmenu.classList.contains('active')) {
                    languageSubmenu.classList.remove('active');
                    languageSubmenu.style.display = 'none';
                    if (languageMenuItem) languageMenuItem.classList.remove('active');
                } else {
                    toggleMenu();
                }
            }
        });
    }

    // Manipulador do submenu de idiomas
    if (languageMenuItem && languageSubmenu) {
        languageMenuItem.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation(); // Impedir que o evento se propague para o menu principal
            this.classList.toggle('active');
            languageSubmenu.classList.toggle('active');
            languageSubmenu.style.display = languageSubmenu.classList.contains('active') ? 'block' : 'none';
        });
    }

    // Manipulador das opções de idioma
    if (languageOptions) {
        languageOptions.forEach(option => {
            option.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation(); // Impedir que o evento se propague para o menu principal
                const lang = this.getAttribute('data-lang');
                
                // Atualizar visibilidade dos ícones de verificação
                languageOptions.forEach(opt => {
                    opt.querySelector('i').style.visibility = 'hidden';
                });
                this.querySelector('i').style.visibility = 'visible';
                
                // Atualizar idioma
                updateLanguage(lang);
                
                // Fechar o submenu após selecionar o idioma
                languageSubmenu.classList.remove('active');
                languageSubmenu.style.display = 'none';
                languageMenuItem.classList.remove('active');
            });
        });
    }

    // Inicializar o ícone de verificação do idioma atual
    const currentLang = localStorage.getItem('language') || 'pt';
    if (languageOptions) {
        languageOptions.forEach(option => {
            const lang = option.getAttribute('data-lang');
            option.querySelector('i').style.visibility = lang === currentLang ? 'visible' : 'hidden';
        });
    }

    // Manipulador do toggle de tema
    if (themeToggle) {
        themeToggle.addEventListener('change', function() {
            const isDark = this.checked;
            document.body.classList.toggle('dark-mode', isDark);
            helpers.saveThemePreference(isDark);
            updateThemeUI(isDark);
            updateChartTheme(isDark);
        });
        
        // Inicializar o toggle com a preferência salva
        const savedTheme = helpers.loadThemePreference();
        themeToggle.checked = savedTheme;
        
        // Inicializar o texto e o ícone do botão de tema
        updateThemeUI(savedTheme);
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
    const themeImage = document.getElementById('theme-image');
    const themeText = document.querySelector('.theme-toggle-container span');
    const themeIcon = document.querySelector('.theme-toggle-container i');

    if (themeToggle) {
        // Atualizar o estado do checkbox do toggle switch
        themeToggle.checked = isDark;
    }

    if (themeText) {
        // Atualizar o texto do botão de tema
        themeText.textContent = isDark ? 'Modo Claro' : 'Modo Escuro';
    }

    if (themeIcon) {
        // Atualizar o ícone do botão de tema
        themeIcon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
        themeIcon.style.color = '#0066cc';
    }

    if (themeImage) {
        if (isDark) {
            themeImage.src = 'photos/tgeiescuro.png';
        } else {
            themeImage.src = 'photos/tgeiclaro.png';
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
    if (!state.chart) return;
    
    state.chart.data.datasets[0].label = translations[lang].yellowLabel || 'Plástico/Metal';
    state.chart.data.datasets[1].label = translations[lang].greenLabel || 'Vidro';
    state.chart.data.datasets[2].label = translations[lang].blueLabel || 'Papel/Cartão';
    
    // Atualizar títulos dos eixos se existirem
    if (state.chart.options.scales.y.title) {
        state.chart.options.scales.y.title.text = translations[lang].fillLevel || 'Nível de Enchimento (%)';
    }
    
    if (state.chart.options.scales.x.title) {
        state.chart.options.scales.x.title.text = translations[lang].time || 'Tempo';
    }
    
    state.chart.update();
}

// Inicializar o módulo quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM carregado, inicializando módulo principal...');
    
    try {
        // Carregar tema salvo
        const savedTheme = localStorage.getItem(CONFIG.THEME_KEY) || CONFIG.DEFAULT_THEME;
        console.log('Tema salvo:', savedTheme);
        
        // Atualizar UI com o tema salvo
        const isDarkTheme = savedTheme === 'dark';
        updateThemeUI(isDarkTheme);
        
        // Inicializar gráfico
        initChart();
        
        // Configurar event listeners
        setupEventListeners();
        
        // Iniciar atualizações de dados
        startDataUpdate();
        
        // Verificar periodicamente se as atualizações de dados estão funcionando
        setInterval(() => {
            console.log('Verificando sistema de atualização de dados...');
            
            // Se o intervalo de atualização não existir, reiniciar
            if (!window.dataUpdateInterval) {
                console.warn('Intervalo de atualização não encontrado, reiniciando...');
                startDataUpdate();
            }
        }, 30000); // Verificar a cada 30 segundos
        
        console.log('Módulo principal inicializado com sucesso');
    } catch (error) {
        console.error('Erro ao inicializar módulo principal:', error);
    }
});

// Inicialização do gráfico
async function initChart() {
    const ctx = document.getElementById('historyChart').getContext('2d');
    const currentLang = localStorage.getItem('language') || 'pt';
    
    // Importar o módulo de correção de gráficos
    try {
        const { fixCharts } = await import('./charts-fix.js');
        const chartUtils = fixCharts();
        const colors = chartUtils.getChartColors();
        const commonOptions = chartUtils.getCommonOptions();
        
        // Configurar opções específicas para este gráfico
        const chartOptions = {
            ...commonOptions,
            plugins: {
                ...commonOptions.plugins,
                legend: {
                    ...commonOptions.plugins.legend,
                    position: 'top'
                }
            },
            scales: {
                ...commonOptions.scales,
                y: {
                    ...commonOptions.scales.y,
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: translations[currentLang].fillLevel || 'Nível de Enchimento (%)',
                        color: chartUtils.isDarkMode ? '#e0e0e0' : '#333'
                    }
                },
                x: {
                    ...commonOptions.scales.x,
                    title: {
                        display: true,
                        text: translations[currentLang].time || 'Tempo',
                        color: chartUtils.isDarkMode ? '#e0e0e0' : '#333'
                    }
                }
            }
        };
        
        // Criar o gráfico com as configurações melhoradas
        state.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: translations[currentLang].yellowLabel || 'Plástico/Metal',
                    data: state.historicalData.yellow,
                    borderColor: colors.yellow.stroke,
                    backgroundColor: colors.yellow.fill,
                    tension: 0.3,
                    borderWidth: 2,
                    pointRadius: 3,
                    fill: false
                }, {
                    label: translations[currentLang].greenLabel || 'Vidro',
                    data: state.historicalData.green,
                    borderColor: colors.green.stroke,
                    backgroundColor: colors.green.fill,
                    tension: 0.3,
                    borderWidth: 2,
                    pointRadius: 3,
                    fill: false
                }, {
                    label: translations[currentLang].blueLabel || 'Papel/Cartão',
                    data: state.historicalData.blue,
                    borderColor: colors.blue.stroke,
                    backgroundColor: colors.blue.fill,
                    tension: 0.3,
                    borderWidth: 2,
                    pointRadius: 3,
                    fill: false
                }]
            },
            options: chartOptions
        });
    } catch (error) {
        console.error('Erro ao carregar o módulo de correção de gráficos:', error);
        
        // Fallback para o gráfico original em caso de erro
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
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    }
}

// Atualização dos dados
function updateData(data) {
    console.log('Atualizando dados com:', data);
    
    try {
        // Função utilitária para converter valores em porcentagens
        const toPercentage = (value) => {
            // Se o valor já for uma string com '%', retorna como está
            if (typeof value === 'string' && value.includes('%')) {
                return value;
            }
            
            // Converte para número se for string
            const numValue = typeof value === 'string' ? parseFloat(value) : value;
            
            // Verifica se é um número válido
            if (isNaN(numValue)) {
                console.warn(`Valor inválido para conversão em porcentagem: ${value}`);
                return '0%'; // Valor padrão
            }
            
            // Retorna o valor com símbolo de porcentagem
            return `${numValue}%`;
        };
        
        // Verificar se os dados são válidos
        if (!data || typeof data !== 'object') {
            console.error('Dados inválidos recebidos:', data);
            return;
        }
        
        // Atualizar barras de progresso com os dados recebidos
        updateProgressBars(data);
        
        // Atualizar estatísticas
        updateStatistics(data);
        
        // Atualizar status de conexão
        updateConnectionStatus(true);
        
        console.log('Dados atualizados com sucesso');
    } catch (error) {
        console.error('Erro ao atualizar dados:', error);
        updateConnectionStatus(false);
    }
}

// Atualizar estatísticas
function updateStatistics(data) {
    console.log('Atualizando estatísticas com:', data);
    
    try {
        // Função utilitária para converter valores em porcentagens
        const toPercentage = (value) => {
            // Se o valor já for uma string com '%', retorna como está
            if (typeof value === 'string' && value.includes('%')) {
                return value;
            }
            
            // Converte para número se for string
            const numValue = typeof value === 'string' ? parseFloat(value) : value;
            
            // Verifica se é um número válido
            if (isNaN(numValue)) {
                console.warn(`Valor inválido para conversão em porcentagem: ${value}`);
                return '0%'; // Valor padrão
            }
            
            // Retorna o valor com símbolo de porcentagem
            return `${numValue}%`;
        };
        
        // Verificar se os dados são válidos
        if (!data || typeof data !== 'object') {
            console.error('Dados inválidos recebidos para estatísticas:', data);
            return;
        }
        
        // Extrair valores dos dados (garantindo que sejam números)
        const yellowValue = parseFloat(data.yellow || data.amarelo || 0);
        const greenValue = parseFloat(data.green || data.verde || 0);
        const blueValue = parseFloat(data.blue || data.azul || 0);
        
        console.log('Valores para estatísticas:', { yellowValue, greenValue, blueValue });
        
        // Calcular média de enchimento
        const averageFill = (yellowValue + greenValue + blueValue) / 3;
        const averageFillElement = document.getElementById('average-fill');
        
        if (averageFillElement) {
            averageFillElement.textContent = toPercentage(Math.round(averageFill));
            console.log('Média de enchimento atualizada:', averageFillElement.textContent);
        } else {
            console.warn('Elemento de média de enchimento não encontrado');
        }
        
        // Identificar contentor mais cheio
        const containers = [
            { name: 'Plástico e Metal', value: yellowValue },
            { name: 'Vidro', value: greenValue },
            { name: 'Papel e Cartão', value: blueValue }
        ];
        
        const mostFull = containers.reduce((prev, current) => 
            (current.value > prev.value) ? current : prev
        );
        
        const mostFullElement = document.getElementById('most-full');
        
        if (mostFullElement) {
            mostFullElement.textContent = `${mostFull.name} (${toPercentage(mostFull.value)})`;
            console.log('Contentor mais cheio atualizado:', mostFullElement.textContent);
        } else {
            console.warn('Elemento de contentor mais cheio não encontrado');
        }
        
        // Atualizar timestamp da última atualização
        const lastUpdateElement = document.getElementById('last-update');
        
        if (lastUpdateElement) {
            const now = new Date();
            lastUpdateElement.textContent = now.toLocaleTimeString();
            console.log('Timestamp de última atualização:', lastUpdateElement.textContent);
        } else {
            console.warn('Elemento de última atualização não encontrado');
        }
        
        console.log('Estatísticas atualizadas com sucesso');
    } catch (error) {
        console.error('Erro ao atualizar estatísticas:', error);
    }
}

// Atualizar barras de progresso
function updateProgressBars(data) {
    console.log('Atualizando barras de progresso com:', data);
    
    try {
        // Função utilitária para converter valores em porcentagens
        const toPercentage = (value) => {
            // Se o valor já for uma string com '%', retorna como está
            if (typeof value === 'string' && value.includes('%')) {
                return value;
            }
            
            // Converte para número se for string
            const numValue = typeof value === 'string' ? parseFloat(value) : value;
            
            // Verifica se é um número válido
            if (isNaN(numValue)) {
                console.warn(`Valor inválido para conversão em porcentagem: ${value}`);
                return '0%'; // Valor padrão
            }
            
            // Retorna o valor com símbolo de porcentagem
            return `${numValue}%`;
        };
        
        // Obter elementos das barras de progresso
        const yellowBar = document.getElementById('yellow-bar');
        const greenBar = document.getElementById('green-bar');
        const blueBar = document.getElementById('blue-bar');
        
        // Obter elementos de porcentagem
        const yellowPercentage = document.getElementById('yellow-percentage');
        const greenPercentage = document.getElementById('green-percentage');
        const bluePercentage = document.getElementById('blue-percentage');
        
        // Verificar se os elementos existem
        if (!yellowBar || !greenBar || !blueBar) {
            console.error('Elementos de barra de progresso não encontrados');
            return;
        }
        
        if (!yellowPercentage || !greenPercentage || !bluePercentage) {
            console.error('Elementos de porcentagem não encontrados');
            return;
        }
        
        // Extrair valores dos dados (garantindo que sejam números)
        const yellowValue = data.yellow || data.amarelo || 0;
        const greenValue = data.green || data.verde || 0;
        const blueValue = data.blue || data.azul || 0;
        
        console.log('Valores brutos da API:', { yellowValue, greenValue, blueValue });
        
        // Converter para porcentagens (garantindo que tenham o símbolo %)
        const yellowPercent = toPercentage(yellowValue);
        const greenPercent = toPercentage(greenValue);
        const bluePercent = toPercentage(blueValue);
        
        console.log('Valores convertidos para porcentagens:', { yellowPercent, greenPercent, bluePercent });
        
        // Extrair apenas os números para usar no estilo width
        const yellowNum = parseFloat(yellowPercent);
        const greenNum = parseFloat(greenPercent);
        const blueNum = parseFloat(bluePercent);
        
        // Atualizar largura das barras
        yellowBar.style.width = `${yellowNum}%`;
        greenBar.style.width = `${greenNum}%`;
        blueBar.style.width = `${blueNum}%`;
        
        // Atualizar texto de porcentagem
        yellowPercentage.textContent = yellowPercent;
        greenPercentage.textContent = greenPercent;
        bluePercentage.textContent = bluePercent;
        
        // Adicionar classes de alerta com base na porcentagem
        // Crítico: >= 90%, Aviso: >= 75%
        yellowBar.classList.remove('warning', 'critical');
        greenBar.classList.remove('warning', 'critical');
        blueBar.classList.remove('warning', 'critical');
        
        if (yellowNum >= 90) {
            yellowBar.classList.add('critical');
        } else if (yellowNum >= 75) {
            yellowBar.classList.add('warning');
        }
        
        if (greenNum >= 90) {
            greenBar.classList.add('critical');
        } else if (greenNum >= 75) {
            greenBar.classList.add('warning');
        }
        
        if (blueNum >= 90) {
            blueBar.classList.add('critical');
        } else if (blueNum >= 75) {
            blueBar.classList.add('warning');
        }
        
        // Atualizar cor do texto com base na porcentagem
        yellowPercentage.classList.remove('warning-text', 'critical-text');
        greenPercentage.classList.remove('warning-text', 'critical-text');
        bluePercentage.classList.remove('warning-text', 'critical-text');
        
        if (yellowNum >= 90) {
            yellowPercentage.classList.add('critical-text');
        } else if (yellowNum >= 75) {
            yellowPercentage.classList.add('warning-text');
        }
        
        if (greenNum >= 90) {
            greenPercentage.classList.add('critical-text');
        } else if (greenNum >= 75) {
            greenPercentage.classList.add('warning-text');
        }
        
        if (blueNum >= 90) {
            bluePercentage.classList.add('critical-text');
        } else if (blueNum >= 75) {
            bluePercentage.classList.add('warning-text');
        }
        
        console.log('Barras de progresso atualizadas com sucesso');
    } catch (error) {
        console.error('Erro ao atualizar barras de progresso:', error);
    }
}

// Buscar dados da API
async function fetchData() {
    console.log('Iniciando busca de dados da API...');
    
    try {
        // Construir URL da API
        const apiUrl = `${CONFIG.API_URL}?token=${CONFIG.API_TOKEN}`;
        console.log('URL da API:', apiUrl);
        
        // Buscar dados da API
        const response = await fetch(apiUrl);
        
        // Verificar se a resposta foi bem-sucedida
        if (!response.ok) {
            throw new Error(`Erro na resposta da API: ${response.status} ${response.statusText}`);
        }
        
        // Extrair dados JSON
        const data = await response.json();
        console.log('Dados recebidos da API:', data);
        
        // Verificar se os dados são válidos
        if (!data || typeof data !== 'object') {
            throw new Error('Formato de dados inválido recebido da API');
        }
        
        // Processar os dados recebidos
        // Garantir que os valores sejam numéricos (sem o símbolo %)
        const processedData = {
            yellow: parseFloat(data.yellow || data.amarelo || 0),
            green: parseFloat(data.green || data.verde || 0),
            blue: parseFloat(data.blue || data.azul || 0),
            timestamp: data.timestamp || new Date().toISOString()
        };
        
        console.log('Dados processados:', processedData);
        
        // Atualizar a interface com os dados processados
        updateData(processedData);
        
        console.log('Busca de dados concluída com sucesso');
        return processedData;
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
        
        // Atualizar status de conexão para indicar erro
        updateConnectionStatus(false);
        
        // Retornar dados vazios em caso de erro
        return {
            yellow: 0,
            green: 0,
            blue: 0,
            timestamp: new Date().toISOString()
        };
    }
}

// Exportar fetchData para o escopo global imediatamente após sua definição
window.fetchData = fetchData;
console.log('Função fetchData exportada para o escopo global após sua definição');

// Atualizar status de conexão
function updateConnectionStatus(isConnected) {
    console.log('Atualizando status de conexão:', isConnected ? 'Conectado' : 'Desconectado');
    
    const statusDot = document.getElementById('status-dot');
    const statusText = document.getElementById('status');
    const currentLang = localStorage.getItem('language') || 'pt';

    if (statusDot && statusText) {
        // Atualizar classe do indicador de status
        if (isConnected) {
            statusDot.classList.add('connected');
        } else {
            statusDot.classList.remove('connected');
        }
        
        // Atualizar texto de status
        const statusMessage = isConnected ? 
            translations[currentLang].connected : 
            translations[currentLang].disconnected;
            
        statusText.textContent = statusMessage;
        
        console.log('Status atualizado para:', statusMessage);
    } else {
        console.warn('Elementos de status não encontrados no DOM');
    }
}

// Iniciar atualizações de dados
function startDataUpdate() {
    console.log('Iniciando atualização periódica de dados...');
    
    try {
        // Limpar qualquer intervalo existente
        if (window.dataUpdateInterval) {
            console.log('Limpando intervalo de atualização existente');
            clearInterval(window.dataUpdateInterval);
        }
        
        // Definir intervalo de atualização com base na configuração
        const updateInterval = CONFIG.UPDATE_INTERVAL_CONNECTED;
        console.log(`Configurando atualização a cada ${updateInterval/1000} segundos`);
        
        // Buscar dados imediatamente
        fetchData();
        
        // Configurar atualização periódica
        window.dataUpdateInterval = setInterval(() => {
            console.log('Executando atualização periódica de dados');
            fetchData();
        }, updateInterval);
        
        // Forçar uma atualização após 2 segundos para garantir que os dados sejam carregados
        setTimeout(() => {
            console.log('Forçando atualização após atraso inicial');
            fetchData();
        }, 2000);
        
        // Forçar outra atualização após 5 segundos
        setTimeout(() => {
            console.log('Forçando segunda atualização após atraso');
            fetchData();
        }, 5000);
        
        console.log('Sistema de atualização de dados iniciado com sucesso');
    } catch (error) {
        console.error('Erro ao iniciar atualização de dados:', error);
    }
}

// Atualizar tema do gráfico
async function updateChartTheme(isDark) {
    if (!state.chart) return;
    
    try {
        // Tentar importar o módulo de correção de gráficos
        const { fixCharts } = await import('./charts-fix.js');
        const chartUtils = fixCharts();
        const colors = chartUtils.getChartColors();
        const textColor = isDark ? '#e0e0e0' : '#333';
        const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        
        // Atualizar cores dos datasets
        state.chart.data.datasets[0].borderColor = colors.yellow.stroke;
        state.chart.data.datasets[0].backgroundColor = colors.yellow.fill;
        state.chart.data.datasets[1].borderColor = colors.green.stroke;
        state.chart.data.datasets[1].backgroundColor = colors.green.fill;
        state.chart.data.datasets[2].borderColor = colors.blue.stroke;
        state.chart.data.datasets[2].backgroundColor = colors.blue.fill;
        
        // Atualizar opções do gráfico
        if (state.chart.options.plugins && state.chart.options.plugins.legend) {
            state.chart.options.plugins.legend.labels.color = textColor;
        }
        
        if (state.chart.options.scales) {
            if (state.chart.options.scales.y) {
                if (state.chart.options.scales.y.grid) state.chart.options.scales.y.grid.color = gridColor;
                if (state.chart.options.scales.y.ticks) state.chart.options.scales.y.ticks.color = textColor;
                if (state.chart.options.scales.y.title) state.chart.options.scales.y.title.color = textColor;
            }
            
            if (state.chart.options.scales.x) {
                if (state.chart.options.scales.x.grid) state.chart.options.scales.x.grid.color = gridColor;
                if (state.chart.options.scales.x.ticks) state.chart.options.scales.x.ticks.color = textColor;
                if (state.chart.options.scales.x.title) state.chart.options.scales.x.title.color = textColor;
            }
        }
        
        state.chart.update('none'); // Use 'none' to prevent animation during theme change
    } catch (error) {
        console.error('Erro ao atualizar tema do gráfico:', error);
        
        // Fallback para o método antigo
        const textColor = isDark ? '#fff' : '#333';
        const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        
        if (state.chart.options.plugins && state.chart.options.plugins.legend) {
            state.chart.options.plugins.legend.labels.color = textColor;
        }
        
        if (state.chart.options.scales) {
            if (state.chart.options.scales.y) {
                if (state.chart.options.scales.y.grid) state.chart.options.scales.y.grid.color = gridColor;
                if (state.chart.options.scales.y.ticks) state.chart.options.scales.y.ticks.color = textColor;
            }
            
            if (state.chart.options.scales.x) {
                if (state.chart.options.scales.x.grid) state.chart.options.scales.x.grid.color = gridColor;
                if (state.chart.options.scales.x.ticks) state.chart.options.scales.x.ticks.color = textColor;
            }
        }
        
        state.chart.update('none');
    }
}

// Exportar funções para uso em outros módulos e para o escopo global
export {
    setupEventListeners,
    updateLanguage,
    updateThemeUI,
    fetchData
}; 