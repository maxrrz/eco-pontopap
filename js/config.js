/**
 * config.js
 * Arquivo de configuração com constantes e traduções para o projeto
 */

// Configurações gerais do sistema
export const CONFIG = {
    // Configurações de ambiente
    IS_LOCAL_DEV: false, // Definir como false para usar dados reais da API
    
    // Configurações de API
    API_URL: 'https://ecopontos-server.onrender.com/dados',
    //API_TOKEN: 'seu-token-aqui', // Adicione seu token de API se necessário
    API_TIMEOUT: 5000, // 5 segundos
    
    // Configurações de autenticação
    AUTH_TOKEN_KEY: 'ecoponto_auth_token',
    USER_DATA_KEY: 'ecoponto_user_data',
    
    // Configurações de ecopontos
    ECOPOINT_TYPES: {
        YELLOW: 'yellow', // Plástico e Metal
        GREEN: 'green',   // Vidro
        BLUE: 'blue'      // Papel e Cartão
    },
    
    // Limites de alerta (em porcentagem)
    ALERT_THRESHOLDS: {
        WARNING: 75,  // Aviso quando o ecoponto está 75% cheio
        CRITICAL: 90  // Alerta crítico quando o ecoponto está 90% cheio
    },
    
    // Configurações de atualização
    UPDATE_INTERVAL_CONNECTED: 5000, // 5 segundos em milissegundos
    UPDATE_INTERVAL_LOCAL: 5000, // 5 segundos em milissegundos para desenvolvimento local
    CHART_HISTORY_SIZE: 10, // Número de pontos a manter no histórico do gráfico
    
    // Configurações de tema
    THEME_KEY: 'theme',
    DEFAULT_THEME: 'light',
    
    // Configurações de idioma
    LANGUAGE_KEY: 'language',
    DEFAULT_LANGUAGE: 'pt',
    SUPPORTED_LANGUAGES: ['pt', 'en', 'es']
};

// Traduções para diferentes idiomas
export const translations = {
    pt: {
        // Geral
        appName: 'EcoPonto',
        subtitle: 'Monitorização Inteligente',
        loading: 'Carregando...',
        connected: 'Conectado',
        disconnected: 'Desconectado',
        
        // Autenticação
        login: 'Entrar',
        logout: 'Sair',
        email: 'Email',
        password: 'Senha',
        forgotPassword: 'Esqueceu a senha?',
        rememberMe: 'Lembrar-me',
        createAccount: 'Criar conta',
        
        // Menu
        dashboard: 'Painel',
        notifications: 'Notificações',
        charts: 'Gráfico',
        ecopointManagement: 'Gestão de Ecopontos',
        userManagement: 'Gestão de Usuários',
        settings: 'Configurações',
        
        // Ecopontos
        ecopointTypes: {
            yellow: 'Plástico e Metal',
            green: 'Vidro',
            blue: 'Papel e Cartão'
        },
        
        // Gráficos
        chartsTitle: 'Histórico de Enchimento',
        timeRanges: {
            '24h': 'Últimas 24 horas',
            '7d': 'Últimos 7 dias',
            '30d': 'Últimos 30 dias'
        },
        averageFilling: 'Média de Enchimento',
        peakFilling: 'Pico de Enchimento',
        fastestFilling: 'Enchimento Mais Rápido',
        fastestFillingInfo: 'Este ecoponto enche mais rapidamente e pode precisar de coletas mais frequentes.',
        
        // Notificações
        noNotifications: 'Não há notificações',
        markAsRead: 'Marcar como lida',
        deleteNotification: 'Excluir',
        markAllAsRead: 'Marcar todas como lidas',
        clearAll: 'Limpar todas',
        
        // Configurações
        generalSettings: 'Configurações Gerais',
        accountSettings: 'Configurações da Conta',
        notificationSettings: 'Configurações de Notificações',
        language: 'Idioma',
        theme: 'Tema',
        darkMode: 'Modo Escuro',
        lightMode: 'Modo Claro',
        save: 'Salvar',
        cancel: 'Cancelar'
    },
    
    en: {
        // General
        appName: 'EcoPonto',
        subtitle: 'Smart Monitoring',
        loading: 'Loading...',
        connected: 'Connected',
        disconnected: 'Disconnected',
        
        // Autenticação
        login: 'Login',
        logout: 'Logout',
        email: 'Email',
        password: 'Password',
        forgotPassword: 'Forgot password?',
        rememberMe: 'Remember me',
        createAccount: 'Create account',
        
        // Menu
        dashboard: 'Dashboard',
        notifications: 'Notifications',
        charts: 'Charts',
        ecopointManagement: 'Ecopoint Management',
        userManagement: 'User Management',
        settings: 'Settings',
        
        // Ecopoints
        ecopointTypes: {
            yellow: 'Plastic and Metal',
            green: 'Glass',
            blue: 'Paper and Cardboard'
        },
        
        // Charts
        chartsTitle: 'Filling History',
        timeRanges: {
            '24h': 'Last 24 hours',
            '7d': 'Last 7 days',
            '30d': 'Last 30 days'
        },
        averageFilling: 'Average Filling',
        peakFilling: 'Peak Filling',
        fastestFilling: 'Fastest Filling',
        fastestFillingInfo: 'This ecopoint fills up faster and may need more frequent collections.',
        
        // Notifications
        noNotifications: 'No notifications',
        markAsRead: 'Mark as read',
        deleteNotification: 'Delete',
        markAllAsRead: 'Mark all as read',
        clearAll: 'Clear all',
        
        // Settings
        generalSettings: 'General Settings',
        accountSettings: 'Account Settings',
        notificationSettings: 'Notification Settings',
        language: 'Language',
        theme: 'Theme',
        darkMode: 'Dark Mode',
        lightMode: 'Light Mode',
        save: 'Save',
        cancel: 'Cancel'
    },
    
    es: {
        // General
        appName: 'EcoPonto',
        subtitle: 'Monitoreo Inteligente',
        loading: 'Cargando...',
        connected: 'Conectado',
        disconnected: 'Desconectado',
        
        // Autenticación
        login: 'Iniciar sesión',
        logout: 'Cerrar sesión',
        email: 'Correo electrónico',
        password: 'Contraseña',
        forgotPassword: '¿Olvidó su contraseña?',
        rememberMe: 'Recordarme',
        createAccount: 'Crear cuenta',
        
        // Menú
        dashboard: 'Panel',
        notifications: 'Notificaciones',
        charts: 'Gráficos',
        ecopointManagement: 'Gestión de Ecopuntos',
        userManagement: 'Gestión de Usuarios',
        settings: 'Configuración',
        
        // Ecopuntos
        ecopointTypes: {
            yellow: 'Plástico y Metal',
            green: 'Vidrio',
            blue: 'Papel y Cartón'
        },
        
        // Gráficos
        chartsTitle: 'Historial de Llenado',
        timeRanges: {
            '24h': 'Últimas 24 horas',
            '7d': 'Últimos 7 días',
            '30d': 'Últimos 30 días'
        },
        averageFilling: 'Llenado Promedio',
        peakFilling: 'Pico de Llenado',
        fastestFilling: 'Llenado Más Rápido',
        fastestFillingInfo: 'Este ecopunto se llena más rápido y puede necesitar recolecciones más frecuentes.',
        
        // Notificaciones
        noNotifications: 'No hay notificaciones',
        markAsRead: 'Marcar como leída',
        deleteNotification: 'Eliminar',
        markAllAsRead: 'Marcar todas como leídas',
        clearAll: 'Borrar todas',
        
        // Configuración
        generalSettings: 'Configuración General',
        accountSettings: 'Configuración de la Cuenta',
        notificationSettings: 'Configuración de Notificaciones',
        language: 'Idioma',
        theme: 'Tema',
        darkMode: 'Modo Oscuro',
        lightMode: 'Modo Claro',
        save: 'Guardar',
        cancel: 'Cancelar'
    }
}; 