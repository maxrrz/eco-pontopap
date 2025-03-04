// Formatar data e hora
export function formatDateTime(date) {
    return date.toLocaleTimeString();
}

// Calcular média
export function calculateAverage(values) {
    return Math.round(values.reduce((a, b) => a + b) / values.length);
}

// Encontrar contentor mais cheio
export function findMostFull(containers) {
    return containers.reduce((prev, current) => 
        (current.value > prev.value) ? current : prev
    );
}

// Verificar nível crítico
export function isCriticalLevel(value) {
    return value >= 90;
}

// Mostrar notificação
export function showNotification(message) {
    // Função desativada - não mostrar notificações
    return;
}

// Carregar idioma salvo
export function loadSavedLanguage() {
    return localStorage.getItem('language') || 'pt';
}

// Fetch com timeout
export async function fetchWithTimeout(url, timeout) {
    return fetch(url, {
        signal: AbortSignal.timeout(timeout)
    });
}

// Atualizar barra de progresso
export function updateProgressBar(color, value) {
    const bar = document.getElementById(`${color}-bar`);
    if (bar) {
        bar.style.width = `${value}%`;
        bar.classList.toggle('warning', value >= 75 && value < 90);
        bar.classList.toggle('critical', value >= 90);
    }
} 