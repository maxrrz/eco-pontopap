/**
 * charts-module.js
 * Módulo para gerenciar e exibir gráficos de histórico de enchimento dos ecopontos
 */

import { CONFIG, translations } from './config.js';

// Classe para gerenciar os gráficos
export class ChartsManager {
    constructor() {
        this.charts = {};
        this.currentLanguage = localStorage.getItem('language') || 'pt';
        this.isDarkMode = localStorage.getItem('theme') === 'dark';
        this.timeRange = '24h'; // Padrão: últimas 24 horas
        this.historicalData = {
            yellow: [],
            green: [],
            blue: [],
            timestamps: []
        };
    }

    // Inicializar o gerenciador de gráficos
    init() {
        // Carregar dados históricos (simulados ou da API)
        this.loadHistoricalData();
    }

    // Carregar dados históricos
    loadHistoricalData() {
        // Simular dados históricos para demonstração
        const now = new Date();
        const data = {
            yellow: [],
            green: [],
            blue: [],
            timestamps: []
        };

        // Gerar dados para as últimas 24 horas (um ponto por hora)
        for (let i = 24; i >= 0; i--) {
            const timestamp = new Date(now.getTime() - i * 3600000);
            
            // Simular valores com alguma variação realista
            // Padrão de enchimento gradual com algumas flutuações
            const hourOfDay = timestamp.getHours();
            const baseValue = Math.min(85, i * 3.5); // Enchimento gradual até ~85%
            
            // Adicionar variação baseada na hora do dia
            const hourVariation = Math.sin(hourOfDay / 24 * Math.PI) * 10;
            
            // Valores diferentes para cada tipo de ecoponto
            data.yellow.push(Math.max(0, Math.min(100, baseValue + hourVariation + Math.random() * 5)));
            data.green.push(Math.max(0, Math.min(100, baseValue * 0.8 + hourVariation + Math.random() * 5)));
            data.blue.push(Math.max(0, Math.min(100, baseValue * 0.9 + hourVariation + Math.random() * 5)));
            
            // Formatar timestamp
            data.timestamps.push(timestamp);
        }

        this.historicalData = data;
    }

    // Mostrar painel de gráficos
    showChartsPanel() {
        // Criar e mostrar o painel de gráficos
        const chartsPanel = document.createElement('div');
        chartsPanel.className = 'charts-panel';
        
        // Cabeçalho do painel
        const header = document.createElement('div');
        header.className = 'charts-header';
        header.innerHTML = `
            <h3>Histórico de Enchimento</h3>
            <div class="charts-actions">
                <select id="time-range-selector">
                    <option value="24h" selected>Últimas 24 horas</option>
                    <option value="7d">Últimos 7 dias</option>
                    <option value="30d">Últimos 30 dias</option>
                </select>
                <button class="close-charts">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        // Conteúdo do painel
        const content = document.createElement('div');
        content.className = 'charts-content';
        
        // Área do gráfico principal
        const mainChartContainer = document.createElement('div');
        mainChartContainer.className = 'main-chart-container';
        mainChartContainer.innerHTML = `
            <canvas id="main-history-chart"></canvas>
        `;
        
        // Estatísticas resumidas
        const statsContainer = document.createElement('div');
        statsContainer.className = 'charts-stats-container';
        
        // Calcular estatísticas
        const yellowAvg = this.calculateAverage(this.historicalData.yellow);
        const greenAvg = this.calculateAverage(this.historicalData.green);
        const blueAvg = this.calculateAverage(this.historicalData.blue);
        const totalAvg = (yellowAvg + greenAvg + blueAvg) / 3;
        
        const yellowMax = Math.max(...this.historicalData.yellow);
        const greenMax = Math.max(...this.historicalData.green);
        const blueMax = Math.max(...this.historicalData.blue);
        
        // Determinar qual ecoponto enche mais rápido (maior inclinação)
        const yellowRate = this.calculateFillingRate(this.historicalData.yellow);
        const greenRate = this.calculateFillingRate(this.historicalData.green);
        const blueRate = this.calculateFillingRate(this.historicalData.blue);
        
        let fastestFilling = 'yellow';
        let fastestRate = yellowRate;
        
        if (greenRate > fastestRate) {
            fastestFilling = 'green';
            fastestRate = greenRate;
        }
        
        if (blueRate > fastestRate) {
            fastestFilling = 'blue';
        }
        
        // Traduzir o nome do ecoponto mais rápido
        const fastestFillingName = this.getEcopointName(fastestFilling);
        
        statsContainer.innerHTML = `
            <div class="chart-stat-card">
                <div class="chart-stat-title">Média de Enchimento</div>
                <div class="chart-stat-value">${totalAvg.toFixed(1)}%</div>
                <div class="chart-stat-details">
                    <div class="stat-detail yellow">
                        <span class="color-indicator"></span>
                        <span class="detail-label">Plástico/Metal:</span>
                        <span class="detail-value">${yellowAvg.toFixed(1)}%</span>
                    </div>
                    <div class="stat-detail green">
                        <span class="color-indicator"></span>
                        <span class="detail-label">Vidro:</span>
                        <span class="detail-value">${greenAvg.toFixed(1)}%</span>
                    </div>
                    <div class="stat-detail blue">
                        <span class="color-indicator"></span>
                        <span class="detail-label">Papel/Cartão:</span>
                        <span class="detail-value">${blueAvg.toFixed(1)}%</span>
                    </div>
                </div>
            </div>
            
            <div class="chart-stat-card">
                <div class="chart-stat-title">Pico de Enchimento</div>
                <div class="chart-stat-value">${Math.max(yellowMax, greenMax, blueMax).toFixed(1)}%</div>
                <div class="chart-stat-details">
                    <div class="stat-detail yellow">
                        <span class="color-indicator"></span>
                        <span class="detail-label">Plástico/Metal:</span>
                        <span class="detail-value">${yellowMax.toFixed(1)}%</span>
                    </div>
                    <div class="stat-detail green">
                        <span class="color-indicator"></span>
                        <span class="detail-label">Vidro:</span>
                        <span class="detail-value">${greenMax.toFixed(1)}%</span>
                    </div>
                    <div class="stat-detail blue">
                        <span class="color-indicator"></span>
                        <span class="detail-label">Papel/Cartão:</span>
                        <span class="detail-value">${blueMax.toFixed(1)}%</span>
                    </div>
                </div>
            </div>
            
            <div class="chart-stat-card">
                <div class="chart-stat-title">Enchimento Mais Rápido</div>
                <div class="chart-stat-value">${fastestFillingName}</div>
                <div class="chart-stat-info">
                    <i class="fas fa-info-circle"></i>
                    <span>Este ecoponto enche mais rapidamente e pode precisar de coletas mais frequentes.</span>
                </div>
            </div>
        `;
        
        // Área de gráficos individuais
        const individualChartsContainer = document.createElement('div');
        individualChartsContainer.className = 'individual-charts-container';
        individualChartsContainer.innerHTML = `
            <div class="individual-chart-wrapper">
                <h4>Plástico e Metal</h4>
                <canvas id="yellow-history-chart"></canvas>
            </div>
            <div class="individual-chart-wrapper">
                <h4>Vidro</h4>
                <canvas id="green-history-chart"></canvas>
            </div>
            <div class="individual-chart-wrapper">
                <h4>Papel e Cartão</h4>
                <canvas id="blue-history-chart"></canvas>
            </div>
        `;
        
        // Montar o painel
        content.appendChild(mainChartContainer);
        content.appendChild(statsContainer);
        content.appendChild(individualChartsContainer);
        
        chartsPanel.appendChild(header);
        chartsPanel.appendChild(content);
        
        // Adicionar ao corpo do documento
        document.body.appendChild(chartsPanel);
        
        // Renderizar gráficos
        this.renderMainChart();
        this.renderIndividualCharts();
        
        // Adicionar manipuladores de eventos
        const closeButton = chartsPanel.querySelector('.close-charts');
        closeButton.addEventListener('click', () => {
            // Destruir gráficos antes de remover o painel
            Object.values(this.charts).forEach(chart => {
                if (chart) chart.destroy();
            });
            
            chartsPanel.remove();
        });
        
        const timeRangeSelector = document.getElementById('time-range-selector');
        timeRangeSelector.addEventListener('change', () => {
            this.timeRange = timeRangeSelector.value;
            
            // Recarregar dados com base no novo intervalo de tempo
            this.loadHistoricalData();
            
            // Atualizar gráficos
            this.updateCharts();
        });
    }

    // Renderizar o gráfico principal
    renderMainChart() {
        const ctx = document.getElementById('main-history-chart').getContext('2d');
        
        // Formatar timestamps para exibição
        const labels = this.formatTimestamps(this.historicalData.timestamps);
        
        // Configurar cores com base no modo (claro/escuro)
        const gridColor = this.isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        const textColor = this.isDarkMode ? '#cccccc' : '#666666';
        
        this.charts.main = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Plástico e Metal',
                        data: this.historicalData.yellow,
                        borderColor: '#FFC107',
                        backgroundColor: 'rgba(255, 193, 7, 0.1)',
                        borderWidth: 2,
                        tension: 0.3,
                        pointRadius: 3,
                        pointHoverRadius: 5
                    },
                    {
                        label: 'Vidro',
                        data: this.historicalData.green,
                        borderColor: '#4CAF50',
                        backgroundColor: 'rgba(76, 175, 80, 0.1)',
                        borderWidth: 2,
                        tension: 0.3,
                        pointRadius: 3,
                        pointHoverRadius: 5
                    },
                    {
                        label: 'Papel e Cartão',
                        data: this.historicalData.blue,
                        borderColor: '#2196F3',
                        backgroundColor: 'rgba(33, 150, 243, 0.1)',
                        borderWidth: 2,
                        tension: 0.3,
                        pointRadius: 3,
                        pointHoverRadius: 5
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: false
                    },
                    legend: {
                        position: 'top',
                        labels: {
                            color: textColor,
                            font: {
                                family: "'Poppins', sans-serif",
                                size: 12
                            },
                            boxWidth: 15,
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: this.isDarkMode ? '#333333' : '#ffffff',
                        titleColor: this.isDarkMode ? '#ffffff' : '#333333',
                        bodyColor: this.isDarkMode ? '#cccccc' : '#666666',
                        borderColor: this.isDarkMode ? '#444444' : '#e0e0e0',
                        borderWidth: 1,
                        padding: 10,
                        boxPadding: 5,
                        cornerRadius: 4,
                        titleFont: {
                            family: "'Poppins', sans-serif",
                            size: 13,
                            weight: 'bold'
                        },
                        bodyFont: {
                            family: "'Poppins', sans-serif",
                            size: 12
                        },
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: ${context.parsed.y.toFixed(1)}%`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: gridColor
                        },
                        ticks: {
                            color: textColor,
                            font: {
                                family: "'Poppins', sans-serif",
                                size: 11
                            },
                            maxRotation: 45,
                            minRotation: 45
                        }
                    },
                    y: {
                        beginAtZero: true,
                        max: 100,
                        grid: {
                            color: gridColor
                        },
                        ticks: {
                            color: textColor,
                            font: {
                                family: "'Poppins', sans-serif",
                                size: 11
                            },
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                },
                animation: {
                    duration: 1000,
                    easing: 'easeOutQuart'
                }
            }
        });
    }

    // Renderizar gráficos individuais
    renderIndividualCharts() {
        // Formatar timestamps para exibição
        const labels = this.formatTimestamps(this.historicalData.timestamps);
        
        // Configurar cores com base no modo (claro/escuro)
        const gridColor = this.isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        const textColor = this.isDarkMode ? '#cccccc' : '#666666';
        
        // Configurações comuns para os gráficos individuais
        const commonOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: this.isDarkMode ? '#333333' : '#ffffff',
                    titleColor: this.isDarkMode ? '#ffffff' : '#333333',
                    bodyColor: this.isDarkMode ? '#cccccc' : '#666666',
                    borderColor: this.isDarkMode ? '#444444' : '#e0e0e0',
                    borderWidth: 1,
                    padding: 8,
                    cornerRadius: 4,
                    callbacks: {
                        label: function(context) {
                            return `${context.parsed.y.toFixed(1)}%`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    display: true,
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: textColor,
                        font: {
                            family: "'Poppins', sans-serif",
                            size: 10
                        },
                        maxRotation: 45,
                        minRotation: 45,
                        maxTicksLimit: 6
                    }
                },
                y: {
                    beginAtZero: true,
                    max: 100,
                    grid: {
                        color: gridColor
                    },
                    ticks: {
                        color: textColor,
                        font: {
                            family: "'Poppins', sans-serif",
                            size: 10
                        },
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            },
            animation: {
                duration: 1000,
                easing: 'easeOutQuart'
            }
        };
        
        // Gráfico para Plástico e Metal (amarelo)
        const yellowCtx = document.getElementById('yellow-history-chart').getContext('2d');
        this.charts.yellow = new Chart(yellowCtx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    data: this.historicalData.yellow,
                    borderColor: '#FFC107',
                    backgroundColor: 'rgba(255, 193, 7, 0.2)',
                    borderWidth: 2,
                    tension: 0.3,
                    pointRadius: 2,
                    pointHoverRadius: 4,
                    fill: true
                }]
            },
            options: commonOptions
        });
        
        // Gráfico para Vidro (verde)
        const greenCtx = document.getElementById('green-history-chart').getContext('2d');
        this.charts.green = new Chart(greenCtx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    data: this.historicalData.green,
                    borderColor: '#4CAF50',
                    backgroundColor: 'rgba(76, 175, 80, 0.2)',
                    borderWidth: 2,
                    tension: 0.3,
                    pointRadius: 2,
                    pointHoverRadius: 4,
                    fill: true
                }]
            },
            options: commonOptions
        });
        
        // Gráfico para Papel e Cartão (azul)
        const blueCtx = document.getElementById('blue-history-chart').getContext('2d');
        this.charts.blue = new Chart(blueCtx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    data: this.historicalData.blue,
                    borderColor: '#2196F3',
                    backgroundColor: 'rgba(33, 150, 243, 0.2)',
                    borderWidth: 2,
                    tension: 0.3,
                    pointRadius: 2,
                    pointHoverRadius: 4,
                    fill: true
                }]
            },
            options: commonOptions
        });
    }

    // Atualizar todos os gráficos
    updateCharts() {
        // Formatar timestamps para exibição
        const labels = this.formatTimestamps(this.historicalData.timestamps);
        
        // Atualizar gráfico principal
        if (this.charts.main) {
            this.charts.main.data.labels = labels;
            this.charts.main.data.datasets[0].data = this.historicalData.yellow;
            this.charts.main.data.datasets[1].data = this.historicalData.green;
            this.charts.main.data.datasets[2].data = this.historicalData.blue;
            this.charts.main.update();
        }
        
        // Atualizar gráficos individuais
        if (this.charts.yellow) {
            this.charts.yellow.data.labels = labels;
            this.charts.yellow.data.datasets[0].data = this.historicalData.yellow;
            this.charts.yellow.update();
        }
        
        if (this.charts.green) {
            this.charts.green.data.labels = labels;
            this.charts.green.data.datasets[0].data = this.historicalData.green;
            this.charts.green.update();
        }
        
        if (this.charts.blue) {
            this.charts.blue.data.labels = labels;
            this.charts.blue.data.datasets[0].data = this.historicalData.blue;
            this.charts.blue.update();
        }
        
        // Atualizar estatísticas
        this.updateStatistics();
    }

    // Atualizar estatísticas
    updateStatistics() {
        // Calcular estatísticas
        const yellowAvg = this.calculateAverage(this.historicalData.yellow);
        const greenAvg = this.calculateAverage(this.historicalData.green);
        const blueAvg = this.calculateAverage(this.historicalData.blue);
        const totalAvg = (yellowAvg + greenAvg + blueAvg) / 3;
        
        const yellowMax = Math.max(...this.historicalData.yellow);
        const greenMax = Math.max(...this.historicalData.green);
        const blueMax = Math.max(...this.historicalData.blue);
        
        // Determinar qual ecoponto enche mais rápido
        const yellowRate = this.calculateFillingRate(this.historicalData.yellow);
        const greenRate = this.calculateFillingRate(this.historicalData.green);
        const blueRate = this.calculateFillingRate(this.historicalData.blue);
        
        let fastestFilling = 'yellow';
        let fastestRate = yellowRate;
        
        if (greenRate > fastestRate) {
            fastestFilling = 'green';
            fastestRate = greenRate;
        }
        
        if (blueRate > fastestRate) {
            fastestFilling = 'blue';
        }
        
        // Traduzir o nome do ecoponto mais rápido
        const fastestFillingName = this.getEcopointName(fastestFilling);
        
        // Atualizar valores no DOM
        const avgValueElement = document.querySelector('.chart-stat-card:nth-child(1) .chart-stat-value');
        if (avgValueElement) {
            avgValueElement.textContent = `${totalAvg.toFixed(1)}%`;
        }
        
        const yellowAvgElement = document.querySelector('.chart-stat-card:nth-child(1) .stat-detail.yellow .detail-value');
        if (yellowAvgElement) {
            yellowAvgElement.textContent = `${yellowAvg.toFixed(1)}%`;
        }
        
        const greenAvgElement = document.querySelector('.chart-stat-card:nth-child(1) .stat-detail.green .detail-value');
        if (greenAvgElement) {
            greenAvgElement.textContent = `${greenAvg.toFixed(1)}%`;
        }
        
        const blueAvgElement = document.querySelector('.chart-stat-card:nth-child(1) .stat-detail.blue .detail-value');
        if (blueAvgElement) {
            blueAvgElement.textContent = `${blueAvg.toFixed(1)}%`;
        }
        
        const maxValueElement = document.querySelector('.chart-stat-card:nth-child(2) .chart-stat-value');
        if (maxValueElement) {
            maxValueElement.textContent = `${Math.max(yellowMax, greenMax, blueMax).toFixed(1)}%`;
        }
        
        const yellowMaxElement = document.querySelector('.chart-stat-card:nth-child(2) .stat-detail.yellow .detail-value');
        if (yellowMaxElement) {
            yellowMaxElement.textContent = `${yellowMax.toFixed(1)}%`;
        }
        
        const greenMaxElement = document.querySelector('.chart-stat-card:nth-child(2) .stat-detail.green .detail-value');
        if (greenMaxElement) {
            greenMaxElement.textContent = `${greenMax.toFixed(1)}%`;
        }
        
        const blueMaxElement = document.querySelector('.chart-stat-card:nth-child(2) .stat-detail.blue .detail-value');
        if (blueMaxElement) {
            blueMaxElement.textContent = `${blueMax.toFixed(1)}%`;
        }
        
        const fastestElement = document.querySelector('.chart-stat-card:nth-child(3) .chart-stat-value');
        if (fastestElement) {
            fastestElement.textContent = fastestFillingName;
        }
    }

    // Calcular média de um array
    calculateAverage(arr) {
        if (!arr.length) return 0;
        return arr.reduce((sum, val) => sum + val, 0) / arr.length;
    }

    // Calcular taxa de enchimento (inclinação da curva)
    calculateFillingRate(arr) {
        if (arr.length < 2) return 0;
        
        // Calcular a taxa média de aumento por ponto de dados
        let totalRate = 0;
        let count = 0;
        
        for (let i = 1; i < arr.length; i++) {
            if (arr[i] > arr[i-1]) {
                totalRate += (arr[i] - arr[i-1]);
                count++;
            }
        }
        
        return count > 0 ? totalRate / count : 0;
    }

    // Formatar timestamps para exibição
    formatTimestamps(timestamps) {
        if (!timestamps.length) return [];
        
        // Formatar com base no intervalo de tempo selecionado
        switch (this.timeRange) {
            case '24h':
                // Formato: "HH:MM"
                return timestamps.map(ts => {
                    const date = new Date(ts);
                    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
                });
            
            case '7d':
                // Formato: "DD/MM HH:MM"
                return timestamps.map(ts => {
                    const date = new Date(ts);
                    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
                });
            
            case '30d':
                // Formato: "DD/MM"
                return timestamps.map(ts => {
                    const date = new Date(ts);
                    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
                });
            
            default:
                return timestamps.map(ts => new Date(ts).toLocaleTimeString());
        }
    }

    // Obter nome traduzido do ecoponto
    getEcopointName(type) {
        switch (type) {
            case 'yellow':
                return 'Plástico e Metal';
            case 'green':
                return 'Vidro';
            case 'blue':
                return 'Papel e Cartão';
            default:
                return '';
        }
    }
}

// Inicializar o gerenciador de gráficos quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    const chartsManager = new ChartsManager();
    chartsManager.init();
    
    // Expor o gerenciador globalmente para depuração
    window.chartsManager = chartsManager;
}); 