/**
 * charts-fix.js
 * Arquivo para corrigir problemas de renderização dos gráficos
 */

// Função para corrigir problemas de renderização dos gráficos
export function fixCharts() {
    // Verificar se o Chart.js está disponível
    if (typeof Chart === 'undefined') {
        console.error('Chart.js não está carregado. Verifique se o script foi incluído corretamente.');
        return;
    }

    // Configurar padrões globais para o Chart.js
    Chart.defaults.font.family = "'Poppins', sans-serif";
    Chart.defaults.responsive = true;
    Chart.defaults.maintainAspectRatio = false;
    
    // Verificar se estamos em modo escuro
    const isDarkMode = document.body.classList.contains('dark-mode') || localStorage.getItem('theme') === 'dark';
    
    // Configurar cores padrão com base no tema
    const textColor = isDarkMode ? '#e0e0e0' : '#333';
    const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    
    // Definir padrões globais para todos os gráficos
    Chart.defaults.color = textColor;
    Chart.defaults.scale.grid.color = gridColor;
    Chart.defaults.scale.ticks.color = textColor;
    
    // Configurar plugins padrão
    Chart.defaults.plugins.legend.labels.color = textColor;
    Chart.defaults.plugins.tooltip.backgroundColor = isDarkMode ? '#2d2d3a' : '#fff';
    Chart.defaults.plugins.tooltip.titleColor = isDarkMode ? '#e0e0e0' : '#333';
    Chart.defaults.plugins.tooltip.bodyColor = isDarkMode ? '#e0e0e0' : '#333';
    Chart.defaults.plugins.tooltip.borderColor = isDarkMode ? '#3a3a48' : '#ddd';
    Chart.defaults.plugins.tooltip.borderWidth = 1;
    Chart.defaults.plugins.tooltip.padding = 10;
    Chart.defaults.plugins.tooltip.cornerRadius = 4;
    
    console.log('Configurações de gráficos corrigidas com sucesso!');
    
    return {
        isDarkMode,
        getChartColors: function() {
            return {
                yellow: {
                    fill: isDarkMode ? 'rgba(255, 193, 7, 0.2)' : 'rgba(255, 193, 7, 0.1)',
                    stroke: '#FFC107'
                },
                green: {
                    fill: isDarkMode ? 'rgba(76, 175, 80, 0.2)' : 'rgba(76, 175, 80, 0.1)',
                    stroke: '#4CAF50'
                },
                blue: {
                    fill: isDarkMode ? 'rgba(33, 150, 243, 0.2)' : 'rgba(33, 150, 243, 0.1)',
                    stroke: '#2196F3'
                }
            };
        },
        getCommonOptions: function() {
            return {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: textColor,
                            font: {
                                family: "'Poppins', sans-serif",
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: isDarkMode ? '#2d2d3a' : '#fff',
                        titleColor: textColor,
                        bodyColor: textColor,
                        borderColor: isDarkMode ? '#3a3a48' : '#ddd',
                        borderWidth: 1
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
                            }
                        }
                    },
                    y: {
                        grid: {
                            color: gridColor
                        },
                        ticks: {
                            color: textColor,
                            font: {
                                family: "'Poppins', sans-serif",
                                size: 11
                            }
                        },
                        min: 0,
                        max: 100
                    }
                },
                animation: {
                    duration: 1000,
                    easing: 'easeOutQuart'
                }
            };
        },
        // Função para gerar dados históricos simulados
        generateHistoricalData: function(timeRange = '24h') {
            const now = new Date();
            const data = {
                yellow: [],
                green: [],
                blue: [],
                timestamps: []
            };
            
            // Determinar número de pontos com base no intervalo de tempo
            let points = 25; // Padrão para 24h
            
            if (timeRange === '7d') {
                points = 28; // 4 pontos por dia
            } else if (timeRange === '30d') {
                points = 30; // 1 ponto por dia
            }
            
            // Valores iniciais aleatórios para cada ecoponto
            let lastYellow = Math.random() * 30 + 20; // Entre 20 e 50
            let lastGreen = Math.random() * 30 + 15;  // Entre 15 e 45
            let lastBlue = Math.random() * 30 + 25;   // Entre 25 e 55
            
            // Gerar dados
            for (let i = points; i >= 0; i--) {
                let timestamp;
                
                if (timeRange === '24h') {
                    timestamp = new Date(now.getTime() - i * 3600000); // Cada hora
                } else if (timeRange === '7d') {
                    timestamp = new Date(now.getTime() - i * 6 * 3600000); // Cada 6 horas
                } else {
                    timestamp = new Date(now.getTime() - i * 24 * 3600000); // Cada dia
                }
                
                // Adicionar variação aleatória para cada ponto
                // Usar uma variação mais significativa para criar dados mais dinâmicos
                const yellowVariation = (Math.random() * 10 - 5) + (Math.sin(i / points * Math.PI * 2) * 3);
                const greenVariation = (Math.random() * 8 - 4) + (Math.cos(i / points * Math.PI * 2) * 3);
                const blueVariation = (Math.random() * 12 - 6) + (Math.sin(i / points * Math.PI * 1.5) * 3);
                
                // Atualizar valores com variação
                lastYellow = Math.max(0, Math.min(100, lastYellow + yellowVariation));
                lastGreen = Math.max(0, Math.min(100, lastGreen + greenVariation));
                lastBlue = Math.max(0, Math.min(100, lastBlue + blueVariation));
                
                // Adicionar valores aos arrays
                data.yellow.push(lastYellow);
                data.green.push(lastGreen);
                data.blue.push(lastBlue);
                
                // Adicionar timestamp
                data.timestamps.push(timestamp);
            }
            
            // Adicionar um pouco de tendência de crescimento para os dados mais recentes
            // para simular enchimento gradual
            for (let i = Math.floor(points * 0.7); i < data.yellow.length; i++) {
                data.yellow[i] += (i - Math.floor(points * 0.7)) * 1.2;
                data.green[i] += (i - Math.floor(points * 0.7)) * 0.8;
                data.blue[i] += (i - Math.floor(points * 0.7)) * 1.0;
                
                // Garantir que os valores não excedam 100%
                data.yellow[i] = Math.min(100, data.yellow[i]);
                data.green[i] = Math.min(100, data.green[i]);
                data.blue[i] = Math.min(100, data.blue[i]);
            }
            
            return data;
        },
        // Função para formatar timestamps
        formatTimestamps: function(timestamps, timeRange = '24h') {
            return timestamps.map(timestamp => {
                const date = new Date(timestamp);
                
                if (timeRange === '24h') {
                    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
                } else if (timeRange === '7d') {
                    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}h`;
                } else {
                    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
                }
            });
        }
    };
} 