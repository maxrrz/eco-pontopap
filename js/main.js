import { CONFIG, translations } from './config.js';
import * as helpers from '../src/utils/helpers.js';
import { MenuManager } from './menu-functions.js';
import * as LanguageSystem from './language-system.js';

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
    },
    currentLanguage: LanguageSystem.getLanguageFromUrl() || 'pt' // Idioma padrão
};

// Função principal para inicializar a aplicação
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded: Inicializando aplicação');
    
    // Inicializar o sistema de idiomas
    LanguageSystem.initializeLanguageSystem();
    
    // Configurar os event listeners dos idiomas
    LanguageSystem.setupLanguageEventListeners();
    
    // Resto da inicialização da aplicação...
    setupEventListeners();
    
    // Inicializar o gráfico
    if (typeof initChart === 'function') {
        initChart();
    }
    
    // Iniciar a atualização periódica dos dados
    if (typeof startDataUpdate === 'function') {
        startDataUpdate();
    }
    
    // Verificar o tema atual e atualizar a UI
    const savedTheme = localStorage.getItem('theme');
    // First visit always uses light theme, otherwise use saved preference
    const isDark = savedTheme === 'dark';
    
    // Set theme in localStorage if it's the first visit
    if (!savedTheme) {
        localStorage.setItem('theme', 'light');
    }
    
    if (typeof updateThemeUI === 'function') {
        updateThemeUI(isDark);
    }
    
    // Atualizar o tema do gráfico
    if (typeof updateChartTheme === 'function') {
        updateChartTheme(isDark);
    }
    
    // Mostrar animação de carregamento
    showLoadingAnimation();
    
    // Esconder animação de carregamento após 2 segundos
    setTimeout(hideLoadingAnimation, 2000);
    
    console.log('Aplicação inicializada com sucesso!');
});

// Adicionar evento para quando a página for atualizada
window.addEventListener('beforeunload', function() {
    showLoadingAnimation();
});

// Função para mostrar animação de carregamento
function showLoadingAnimation() {
    const ecopontos = document.querySelectorAll('.ecoponto');
    const bars = document.querySelectorAll('.bar');
    const percentages = document.querySelectorAll('.ecoponto-percentage');
    
    // Adicionar classe de carregamento aos ecopontos
    ecopontos.forEach(ecoponto => {
        ecoponto.classList.add('ecoponto-loading');
        ecoponto.classList.remove('loaded');
    });
    
    // Adicionar classe de carregamento às barras
    bars.forEach(bar => {
        bar.classList.add('loading');
        bar.style.width = '0%';
    });
    
    // Adicionar classe de carregamento aos percentuais
    percentages.forEach(percentage => {
        percentage.classList.add('loading');
        percentage.textContent = '0%';
    });
}

// Função para esconder animação de carregamento
function hideLoadingAnimation() {
    const ecopontos = document.querySelectorAll('.ecoponto');
    const bars = document.querySelectorAll('.bar');
    const percentages = document.querySelectorAll('.ecoponto-percentage');
    
    // Remover classe de carregamento dos ecopontos
    ecopontos.forEach((ecoponto, index) => {
        setTimeout(() => {
            ecoponto.classList.remove('ecoponto-loading');
            ecoponto.classList.add('loaded');
        }, 100 * index);
    });
    
    // Remover classe de carregamento das barras
    bars.forEach(bar => {
        bar.classList.remove('loading');
    });
    
    // Remover classe de carregamento dos percentuais
    percentages.forEach(percentage => {
        percentage.classList.remove('loading');
        percentage.classList.add('animate');
        
        // Remover a classe de animação após a conclusão
        setTimeout(() => {
            percentage.classList.remove('animate');
        }, 500);
    });
}

// Exportar as funções para uso em outros módulos
export {
    setupEventListeners,
    updateLanguage,
    updateThemeUI,
    fetchData,
    showLoadingAnimation,
    hideLoadingAnimation,
    LanguageSystem
}; 