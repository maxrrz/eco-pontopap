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
    SUPPORTED_LANGUAGES: ['pt', 'es', 'de', 'fr', 'ja']
};

// Traduções para diferentes idiomas
export const translations = {
    pt: {
        // Geral
        appName: 'EcoPonto Inteligente',
        subtitle: 'Monitorização Inteligente',
        loading: 'Carregando...',
        connected: 'Conectado',
        disconnected: 'Desconectado',
        welcomeMessage: 'Bem-vindo ao sistema de monitorização! Aqui você pode acompanhar o enchimento dos ecopontos em tempo real.',
        title: 'EcoPonto Inteligente',
        hello: 'Olá',
        
        // PWA
        'install-app': 'Instalar Aplicação',
        
        // Autenticação
        login: 'Entrar',
        logout: 'Sair',
        email: 'Email',
        emailOrUsername: 'Email ou Nome de Utilizador',
        password: 'Password',
        forgotPassword: 'Esqueceste-te da palavra-passe?',
        rememberMe: 'Guardar sessão',
        createAccount: 'Criar conta',
        
        // Menu
        dashboard: 'Painel de controlo',
        notifications: 'Notificações',
        charts: 'Gráficos',
        ecopointManagement: 'Gestão de Ecopontos',
        userManagement: 'Gestão de Usuários',
        settings: 'Configurações',
        languages: 'Idiomas',
        menu: 'Menu',
        user: 'Utilizador',
        user2: 'Instala o myEcoponto',
        'install-app-button': 'Instalar a aplicação do myEcoponto',
        darkMode: 'Modo Escuro',
        lightMode: 'Modo Claro',
        
        // Ecopontos
        ecopointTypes: {
            yellow: 'Plástico e Metal',
            green: 'Vidro',
            blue: 'Papel e Cartão'
        },
        'yellow-label': 'Plástico e Metal',
        'green-label': 'Vidro',
        'blue-label': 'Papel e Cartão',
        yellowSubtitle: 'Embalagens e recipientes',
        greenSubtitle: 'Garrafas e frascos',
        blueSubtitle: 'Jornais e embalagens',
        ecopointInfoMessage: 'Aqui você pode ver os níveis de enchimento dos ecopontos.',
        
        // Estatísticas
        averageFill: 'Média de Enchimento',
        realTime: 'Em tempo real',
        mostFull: 'Contentor Mais Cheio',
        activeMonitoring: 'Monitorização ativa',
        lastUpdate: 'Última Atualização',
        autoUpdate: 'Atualização automática',
        status: 'Carregando...',
        
        // Gráficos
        'chart-title': 'Histórico de Enchimento',
        last24h: 'Últimas 24h',
        
        // Rodapé
        'footer-text': 'Projeto desenvolvido para a Prova de Aptidão Profissional de Maximilian Guimaro',
        about: 'Sobre',
        docs: 'Documentação'
    },
    
    en: {
        // General
        appName: 'EcoPonto Inteligente',
        subtitle: 'Smart Monitoring',
        loading: 'Loading...',
        connected: 'Connected',
        disconnected: 'Disconnected',
        hello: 'Hello',
        
        // PWA
        'install-app': 'Install App',
        
        // Autenticação
        login: 'Login',
        logout: 'Logout',
        email: 'Email',
        emailOrUsername: 'Email or Username',
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
        languages: 'Languages',
        menu: 'Menu',
        user: 'User',
        user2: 'Install myEcoponto',
        'install-app-button': 'Install myEcoponto application',
        darkMode: 'Dark Mode',
        lightMode: 'Light Mode',
        
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
        appName: 'EcoPonto Inteligente',
        subtitle: 'Monitoreo Inteligente',
        loading: 'Cargando...',
        connected: 'Conectado',
        disconnected: 'Desconectado',
        welcomeMessage: '¡Bienvenido al sistema de monitoreo! Aquí puede seguir el llenado de los ecopuntos en tiempo real.',
        title: 'EcoPonto Inteligente',
        hello: 'Hola',
        
        // PWA
        'install-app': 'Instalar Aplicación',
        
        // Autenticación
        login: 'Iniciar sesión',
        logout: 'Cerrar sesión',
        email: 'Correo electrónico',
        emailOrUsername: 'Correo electrónico o Nombre de usuario',
        password: 'Contraseña',
        forgotPassword: '¿Olvidó su contraseña?',
        rememberMe: 'Recordarme',
        createAccount: 'Crear cuenta',
        
        // Menú
        dashboard: 'Panel de control',
        notifications: 'Notificaciones',
        charts: 'Gráficos',
        ecopointManagement: 'Gestión de Ecopuntos',
        userManagement: 'Gestión de Usuarios',
        settings: 'Configuración',
        languages: 'Idiomas',
        menu: 'Menú',
        user: 'Usuario',
        user2: 'Instalar myEcoponto',
        'install-app-button': 'Instalar la aplicación myEcoponto',
        darkMode: 'Modo Oscuro',
        lightMode: 'Modo Claro',
        
        // Ecopuntos
        ecopointTypes: {
            yellow: 'Plástico y Metal',
            green: 'Vidrio',
            blue: 'Papel y Cartón'
        },
        'yellow-label': 'Plástico y Metal',
        'green-label': 'Vidrio',
        'blue-label': 'Papel y Cartón',
        yellowSubtitle: 'Envases y recipientes',
        greenSubtitle: 'Botellas y frascos',
        blueSubtitle: 'Periódicos y embalajes',
        ecopointInfoMessage: 'Aquí puede ver los niveles de llenado de los ecopuntos.',
        
        // Estadísticas
        averageFill: 'Promedio de Llenado',
        realTime: 'En tiempo real',
        mostFull: 'Contenedor Más Lleno',
        activeMonitoring: 'Monitoreo activo',
        lastUpdate: 'Última Actualización',
        autoUpdate: 'Actualización automática',
        status: 'Cargando...',
        
        // Gráficos
        'chart-title': 'Historial de Llenado',
        last24h: 'Últimas 24h',
        
        // Pie de página
        'footer-text': 'Proyecto desarrollado para la Prueba de Aptitud Profesional de Maximilian Guimaro',
        about: 'Acerca de',
        docs: 'Documentación'
    },
    
    de: {
        // Allgemein
        appName: 'EcoPonto Inteligente',
        subtitle: 'Intelligente Überwachung',
        loading: 'Wird geladen...',
        connected: 'Verbunden',
        disconnected: 'Getrennt',
        welcomeMessage: 'Willkommen beim Überwachungssystem! Hier können Sie die Füllstände der Recyclingbehälter in Echtzeit verfolgen.',
        title: 'EcoPonto Inteligente',
        hello: 'Hallo',
        
        // Authentifizierung
        login: 'Anmelden',
        logout: 'Abmelden',
        email: 'E-Mail',
        emailOrUsername: 'E-Mail oder Benutzername',
        password: 'Passwort',
        forgotPassword: 'Passwort vergessen?',
        rememberMe: 'Angemeldet bleiben',
        createAccount: 'Konto erstellen',
        
        // Menü
        dashboard: 'Dashboard',
        notifications: 'Benachrichtigungen',
        charts: 'Diagramme',
        ecopointManagement: 'Recyclingbehälter-Verwaltung',
        userManagement: 'Benutzerverwaltung',
        settings: 'Einstellungen',
        languages: 'Sprachen',
        menu: 'Menü',
        user: 'Benutzer',
        user2: 'myEcoponto installieren',
        'install-app-button': 'myEcoponto-Anwendung installieren',
        darkMode: 'Dunkler Modus',
        lightMode: 'Heller Modus',
        
        // Recyclingbehälter
        ecopointTypes: {
            yellow: 'Kunststoff und Metall',
            green: 'Glas',
            blue: 'Papier und Karton'
        },
        'yellow-label': 'Kunststoff und Metall',
        'green-label': 'Glas',
        'blue-label': 'Papier und Karton',
        yellowSubtitle: 'Verpackungen und Behälter',
        greenSubtitle: 'Flaschen und Gläser',
        blueSubtitle: 'Zeitungen und Verpackungen',
        ecopointInfoMessage: 'Hier können Sie die Füllstände der Recyclingbehälter sehen.',
        
        // Statistiken
        averageFill: 'Durchschnittliche Füllung',
        realTime: 'Echtzeit',
        mostFull: 'Vollster Behälter',
        activeMonitoring: 'Aktive Überwachung',
        lastUpdate: 'Letzte Aktualisierung',
        autoUpdate: 'Automatische Aktualisierung',
        status: 'Wird geladen...',
        
        // Diagramme
        'chart-title': 'Füllstandsverlauf',
        last24h: 'Letzte 24h',
        
        // Fußzeile
        'footer-text': 'Projekt entwickelt für die Berufliche Eignungsprüfung von Maximilian Guimaro',
        about: 'Über',
        docs: 'Dokumentation',
        
        // PWA
        'install-app': 'App installieren',
        
        // Autenticação
        login: 'Anmelden',
        logout: 'Abmelden',
        email: 'E-Mail',
        emailOrUsername: 'E-Mail oder Benutzername',
        password: 'Passwort',
        forgotPassword: 'Passwort vergessen?',
        rememberMe: 'Angemeldet bleiben',
        createAccount: 'Konto erstellen'
    },
    
    fr: {
        // Général
        appName: 'EcoPonto Inteligente',
        subtitle: 'Surveillance Intelligente',
        loading: 'Chargement...',
        connected: 'Connecté',
        disconnected: 'Déconnecté',
        welcomeMessage: 'Bienvenue dans le système de surveillance! Ici, vous pouvez suivre le remplissage des écopoints en temps réel.',
        title: 'EcoPonto Inteligente',
        hello: 'Bonjour',
        
        // Authentification
        login: 'Connexion',
        logout: 'Déconnexion',
        email: 'Email',
        emailOrUsername: 'Email ou Nom d\'utilisateur',
        password: 'Mot de passe',
        forgotPassword: 'Mot de passe oublié?',
        rememberMe: 'Se souvenir de moi',
        createAccount: 'Créer un compte',
        
        // Menu
        dashboard: 'Tableau de bord',
        notifications: 'Notifications',
        charts: 'Graphiques',
        ecopointManagement: 'Gestion des Écopoints',
        userManagement: 'Gestion des Utilisateurs',
        settings: 'Paramètres',
        languages: 'Langues',
        menu: 'Menu',
        user: 'Utilisateur',
        user2: 'Installer myEcoponto',
        'install-app-button': 'Installer l\'application myEcoponto',
        darkMode: 'Mode Sombre',
        lightMode: 'Mode Clair',
        
        // Écopoints
        ecopointTypes: {
            yellow: 'Plastique et Métal',
            green: 'Verre',
            blue: 'Papier et Carton'
        },
        'yellow-label': 'Plastique et Métal',
        'green-label': 'Verre',
        'blue-label': 'Papier et Carton',
        yellowSubtitle: 'Emballages et récipients',
        greenSubtitle: 'Bouteilles et pots',
        blueSubtitle: 'Journaux et emballages',
        ecopointInfoMessage: 'Ici vous pouvez voir les niveaux de remplissage des écopoints.',
        
        // Statistiques
        averageFill: 'REMPLISSAGE MOYEN',
        realTime: 'En temps réel',
        mostFull: 'CONTENEUR LE PLUS REMPLI',
        activeMonitoring: 'Surveillance active',
        lastUpdate: 'DERNIÈRE MISE À JOUR',
        autoUpdate: 'Mise à jour automatique',
        status: 'Chargement...',
        
        // Graphiques
        'chart-title': 'Historique de Remplissage',
        last24h: 'Dernières 24h',
        
        // Pied de page
        'footer-text': 'Projet développé pour l\'Épreuve d\'Aptitude Professionnelle de Maximilian Guimaro',
        about: 'À propos',
        docs: 'Documentation',
        
        // PWA
        'install-app': 'Installer l\'application',
        
        // Autenticação
        login: 'Connexion',
        logout: 'Déconnexion',
        email: 'Email',
        emailOrUsername: 'Email ou Nom d\'utilisateur',
        password: 'Mot de passe',
        forgotPassword: 'Mot de passe oublié?',
        rememberMe: 'Se souvenir de moi',
        createAccount: 'Créer un compte'
    },
    
    ja: {
        // 一般
        appName: 'エコポント インテリジェント',
        subtitle: 'スマート監視',
        loading: '読み込み中...',
        connected: '接続済み',
        disconnected: '切断済み',
        welcomeMessage: '監視システムへようこそ！ここでは、リアルタイムでエコポイントの充填状況を追跡できます。',
        title: 'エコポント インテリジェント',
        hello: 'こんにちは',
        
        // 認証
        login: 'ログイン',
        logout: 'ログアウト',
        email: 'メール',
        emailOrUsername: 'メールアドレスまたはユーザー名',
        password: 'パスワード',
        forgotPassword: 'パスワードをお忘れですか？',
        rememberMe: '記憶する',
        createAccount: 'アカウント作成',
        
        // メニュー
        dashboard: 'ダッシュボード',
        notifications: '通知',
        charts: 'グラフ',
        ecopointManagement: 'エコポイント管理',
        userManagement: 'ユーザー管理',
        settings: '設定',
        languages: '言語',
        menu: 'メニュー',
        user: 'ユーザー',
        user2: 'myEcopontoをインストール',
        'install-app-button': 'myEcopontoアプリをインストール',
        darkMode: 'ダークモード',
        lightMode: 'ライトモード',
        
        // エコポイント
        ecopointTypes: {
            yellow: 'プラスチックと金属',
            green: 'ガラス',
            blue: '紙とカートン'
        },
        'yellow-label': 'プラスチックと金属',
        'green-label': 'ガラス',
        'blue-label': '紙とカートン',
        yellowSubtitle: '包装と容器',
        greenSubtitle: 'ボトルと瓶',
        blueSubtitle: '新聞と包装',
        ecopointInfoMessage: 'ここではエコポイントの充填レベルを確認できます。',
        
        // 統計
        averageFill: '平均充填率',
        realTime: 'リアルタイム',
        mostFull: '最も充填された容器',
        activeMonitoring: 'アクティブ監視',
        lastUpdate: '最終更新',
        autoUpdate: '自動更新',
        status: '読み込み中...',
        
        // グラフ
        'chart-title': '充填履歴',
        last24h: '過去24時間',
        
        // フッター
        'footer-text': 'マキシミリアン・ギマロの職業適性試験のために開発されたプロジェクト',
        about: '情報',
        docs: 'ドキュメント',
        
        // PWA
        'install-app': 'アプリをインストール',
        
        // Autenticação
        login: 'ログイン',
        logout: 'ログアウト',
        email: 'メール',
        emailOrUsername: 'メールアドレスまたはユーザー名',
        password: 'パスワード',
        forgotPassword: 'パスワードをお忘れですか？',
        rememberMe: '記憶する',
        createAccount: 'アカウント作成'
    }
}; 