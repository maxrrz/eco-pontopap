import { CONFIG } from '../../js/config.js';

// Função para formatar data/hora
export function formatDateTime(date) {
    return new Intl.DateTimeFormat(document.documentElement.lang || 'pt', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).format(date);
}

// Função para calcular média
export function calculateAverage(values) {
    if (!values || values.length === 0) return 0;
    return (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);
}

// Função para encontrar o contentor mais cheio
export function findMostFull(containers) {
    return containers.reduce((prev, current) => 
        (prev.value > current.value) ? prev : current
    );
}

// Função para verificar se um valor está em nível crítico
export function isCriticalLevel(value) {
    return value >= CONFIG.CRITICAL_THRESHOLD;
}

// Função para verificar se um valor está em nível de aviso
export function isWarningLevel(value) {
    return value >= CONFIG.WARNING_THRESHOLD && value < CONFIG.CRITICAL_THRESHOLD;
}

// Função para atualizar o status de conexão na UI
export function updateConnectionStatus(isConnected, translations, currentLanguage) {
    const statusDot = document.getElementById('status-dot');
    const statusText = document.getElementById('status');
    
    if (isConnected) {
        statusDot.classList.add('connected');
        statusText.textContent = translations[currentLanguage].connected;
    } else {
        statusDot.classList.remove('connected');
        statusText.textContent = translations[currentLanguage].disconnected;
    }
}

// Função para mostrar notificação
export function showNotification(message, duration = 5000) {
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

// Função para atualizar barra de progresso
export function updateProgressBar(id, value) {
    const bar = document.getElementById(`${id}-bar`);
    if (!bar) return;

    bar.style.width = `${value}%`;
    bar.classList.remove('warning', 'critical');
    
    if (isCriticalLevel(value)) {
        bar.classList.add('critical');
    } else if (isWarningLevel(value)) {
        bar.classList.add('warning');
    }
}

// Função para gerenciar o tema
export function handleTheme() {
    const isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    return isDark;
}

// Função para carregar tema salvo
export function loadSavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    // If no theme is saved, set it to light by default
    if (!savedTheme) {
        localStorage.setItem('theme', 'light');
        return false; // Not dark mode
    }
    
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        return true; // Is dark mode
    }
    return false; // Light mode
}

// Função para salvar preferência de tema
export function saveThemePreference(isDark) {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// Função para carregar preferência de tema
export function loadThemePreference() {
    const savedTheme = localStorage.getItem('theme');
    // If no theme is saved, set it to light by default
    if (!savedTheme) {
        localStorage.setItem('theme', 'light');
        return false;
    }
    return savedTheme === 'dark';
}

// Função para carregar idioma salvo
export function loadSavedLanguage() {
    return localStorage.getItem('language') || 'pt';
}

// Função para fazer requisição à API com timeout
export async function fetchWithTimeout(url, timeout) {
    return Promise.race([
        fetch(url),
        new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), timeout)
        )
    ]);
} 