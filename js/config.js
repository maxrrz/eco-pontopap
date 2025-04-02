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
    SUPPORTED_LANGUAGES: ['pt', 'en', 'de', 'ja', 'zh']
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
        'manage-houses': 'Gerir Ecoponto',
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
        docs: 'Documentação',
        
        // Instruções de instalação
        installAppModalTitle: 'Instalar a aplicação do myEcoponto',
        close: 'Fechar',
        
        // iOS
        installAppIOSTitle: 'Instalar o myEcoPonto no iOS',
        installAppIOSStep1: 'Toque no ícone de compartilhamento na barra de navegação.',
        installAppIOSStep2: 'Role para baixo e toque em "Adicionar à Tela de Início".',
        installAppIOSStep3: 'Confirme tocando em "Adicionar" no canto superior direito.',
        
        // Android
        installAppAndroidTitle: 'Instalar o myEcoPonto no Android',
        installAppAndroidStep1: 'Toque no menu no canto superior direito.',
        installAppAndroidStep2: 'Selecione "Instalar aplicativo" ou "Adicionar à tela inicial".',
        installAppAndroidStep3: 'Confirme tocando em "Instalar".',
        
        // Desktop
        installAppDesktopTitle: 'Instalar o myEcoPonto no Desktop',
        installAppDesktopStep1: 'Clique no ícone de instalação na barra de endereço.',
        installAppDesktopStep2: 'Clique em "Instalar" no prompt que aparece.',
        
        // Firefox
        installAppFirefoxTitle: 'Instalar o myEcoPonto no Firefox',
        installAppFirefoxStep1: 'Clique no menu no canto superior direito.',
        installAppFirefoxStep2: 'Selecione "+ Adicionar à Tela Inicial".',
        installAppFirefoxStep3: 'Confirme clicando em "Adicionar".',
        
        // Genérico
        installAppGenericTitle: 'Instalar o myEcoPonto',
        installAppGenericStep1: 'Abra o site no Chrome, Edge ou Safari.',
        installAppGenericStep2: 'No menu do navegador, procure a opção "Instalar aplicativo" ou "Adicionar à tela inicial".',
        installAppGenericStep3: 'Siga as instruções na tela para completar a instalação.',
        
        // Nota
        installAppNote: 'Nota: Após a instalação, você poderá acessar o myEcoPonto diretamente do seu dispositivo, mesmo quando estiver offline.',
        
        // Notificações
        noNotifications: 'Não há notificações.',
        markAsRead: 'Marcar como lida',
        deleteNotification: 'Excluir',
        markAllAsRead: 'Marcar todas como lidas',
        clearAll: 'Limpar todas'
    },
    
    en: {
        // General
        appName: 'EcoPonto Inteligente',
        subtitle: 'Smart Monitoring',
        loading: 'Loading...',
        connected: 'Connected',
        disconnected: 'Disconnected',
        hello: 'Hello',
        welcomeMessage: 'Welcome to the monitoring system! Here you can track the filling of ecopoints in real time.',
        title: 'EcoPonto Inteligente',
        
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
        'manage-houses': 'Manage Ecopoint',
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
        'yellow-label': 'Plastic and Metal',
        'green-label': 'Glass',
        'blue-label': 'Paper and Cardboard',
        yellowSubtitle: 'Packaging and containers',
        greenSubtitle: 'Bottles and jars',
        blueSubtitle: 'Newspapers and packaging',
        ecopointInfoMessage: 'Here you can see the filling levels of the ecopoints.',
        
        // Statistics
        averageFill: 'Average Fill',
        realTime: 'Real time',
        mostFull: 'Most Filled Container',
        activeMonitoring: 'Active monitoring',
        lastUpdate: 'Last Update',
        autoUpdate: 'Auto update',
        status: 'Loading...',
        
        // Charts
        'chart-title': 'Filling History',
        last24h: 'Last 24h',
        
        // Footer
        'footer-text': 'Project developed for the Professional Aptitude Test of Maximilian Guimaro',
        about: 'About',
        docs: 'Documentation',
        
        // Installation Instructions
        installAppModalTitle: 'Install myEcoponto application',
        close: 'Close',
        
        // iOS
        installAppIOSTitle: 'Install myEcoPonto on iOS',
        installAppIOSStep1: 'Tap the share icon in the navigation bar.',
        installAppIOSStep2: 'Scroll down and tap "Add to Home Screen".',
        installAppIOSStep3: 'Confirm by tapping "Add" in the top right corner.',
        
        // Android
        installAppAndroidTitle: 'Install myEcoPonto on Android',
        installAppAndroidStep1: 'Tap the menu in the top right corner.',
        installAppAndroidStep2: 'Select "Install app" or "Add to home screen".',
        installAppAndroidStep3: 'Confirm by tapping "Install".',
        
        // Desktop
        installAppDesktopTitle: 'Install myEcoPonto on Desktop',
        installAppDesktopStep1: 'Click the installation icon in the address bar.',
        installAppDesktopStep2: 'Click "Install" in the prompt that appears.',
        
        // Firefox
        installAppFirefoxTitle: 'Install myEcoPonto on Firefox',
        installAppFirefoxStep1: 'Click the menu in the top right corner.',
        installAppFirefoxStep2: 'Select "+ Add to Home Screen".',
        installAppFirefoxStep3: 'Confirm by clicking "Add".',
        
        // Generic
        installAppGenericTitle: 'Install myEcoPonto',
        installAppGenericStep1: 'Open the site in Chrome, Edge, or Safari.',
        installAppGenericStep2: 'In the browser menu, look for the "Install app" or "Add to home screen" option.',
        installAppGenericStep3: 'Follow the on-screen instructions to complete the installation.',
        
        // Note
        installAppNote: 'Note: After installation, you can access myEcoPonto directly from your device, even when offline.',
        
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
        'manage-houses': 'Gestionar Ecopunto',
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
        'manage-houses': 'Ecopunkt verwalten',
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
        createAccount: 'Konto erstellen',
        
        // Instruções de instalação
        installAppModalTitle: 'myEcoponto-Anwendung installieren',
        close: 'Schließen',
        
        // iOS
        installAppIOSTitle: 'myEcoPonto auf iOS installieren',
        installAppIOSStep1: 'Tippen Sie auf das Teilen-Symbol in der Navigationsleiste.',
        installAppIOSStep2: 'Scrollen Sie nach unten und tippen Sie auf "Zum Home-Bildschirm hinzufügen".',
        installAppIOSStep3: 'Bestätigen Sie mit "Hinzufügen" in der oberen rechten Ecke.',
        
        // Android
        installAppAndroidTitle: 'myEcoPonto auf Android installieren',
        installAppAndroidStep1: 'Tippen Sie auf das Menü in der oberen rechten Ecke.',
        installAppAndroidStep2: 'Wählen Sie "App installieren" oder "Zum Startbildschirm hinzufügen".',
        installAppAndroidStep3: 'Bestätigen Sie mit "Installieren".',
        
        // Desktop
        installAppDesktopTitle: 'myEcoPonto auf dem Desktop installieren',
        installAppDesktopStep1: 'Klicken Sie auf das Installations-Symbol in der Adressleiste.',
        installAppDesktopStep2: 'Klicken Sie auf "Installieren" im erscheinenden Dialog.',
        
        // Firefox
        installAppFirefoxTitle: 'myEcoPonto in Firefox installieren',
        installAppFirefoxStep1: 'Klicken Sie auf das Menü in der oberen rechten Ecke.',
        installAppFirefoxStep2: 'Wählen Sie "+ Zum Startbildschirm hinzufügen".',
        installAppFirefoxStep3: 'Bestätigen Sie mit "Hinzufügen".',
        
        // Genérico
        installAppGenericTitle: 'myEcoPonto installieren',
        installAppGenericStep1: 'Öffnen Sie die Website in Chrome, Edge oder Safari.',
        installAppGenericStep2: 'Suchen Sie im Browser-Menü nach der Option "App installieren" oder "Zum Startbildschirm hinzufügen".',
        installAppGenericStep3: 'Folgen Sie den Anweisungen auf dem Bildschirm, um die Installation abzuschließen.',
        
        // Nota
        installAppNote: 'Hinweis: Nach der Installation können Sie direkt von Ihrem Gerät auf myEcoPonto zugreifen, auch wenn Sie offline sind.',
        
        // Notificações
        noNotifications: 'Keine Benachrichtigungen',
        markAsRead: 'Als gelesen markieren',
        deleteNotification: 'Löschen',
        markAllAsRead: 'Alle als gelesen markieren',
        clearAll: 'Alle löschen'
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
        'manage-houses': 'Gérer Écopoint',
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
        createAccount: 'Créer un compte',
        
        // Notificações
        noNotifications: 'Não há notificações.',
        markAsRead: 'Marcar como lida',
        deleteNotification: 'Excluir',
        markAllAsRead: 'Marcar todas como lidas',
        clearAll: 'Limpar todas'
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
        'manage-houses': 'エコポイントを管理',
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
        createAccount: 'アカウント作成',
        
        // インストール手順
        installAppModalTitle: 'myEcopontoアプリのインストール',
        close: '閉じる',
        
        // iOS
        installAppIOSTitle: 'iOSにmyEcopontoをインストール',
        installAppIOSStep1: 'ナビゲーションバーの共有アイコンをタップします。',
        installAppIOSStep2: '下にスクロールして「ホーム画面に追加」をタップします。',
        installAppIOSStep3: '右上の「追加」をタップして確認します。',
        
        // Android
        installAppAndroidTitle: 'AndroidにmyEcopontoをインストール',
        installAppAndroidStep1: '右上のメニューをタップします。',
        installAppAndroidStep2: '「アプリをインストール」または「ホーム画面に追加」を選択します。',
        installAppAndroidStep3: '「インストール」をタップして確認します。',
        
        // Desktop
        installAppDesktopTitle: 'デスクトップにmyEcopontoをインストール',
        installAppDesktopStep1: 'アドレスバーのインストールアイコンをクリックします。',
        installAppDesktopStep2: '表示されるプロンプトで「インストール」をクリックします。',
        
        // Firefox
        installAppFirefoxTitle: 'FirefoxにmyEcopontoをインストール',
        installAppFirefoxStep1: '右上のメニューをクリックします。',
        installAppFirefoxStep2: '「+ ホーム画面に追加」を選択します。',
        installAppFirefoxStep3: '「追加」をクリックして確認します。',
        
        // Generic
        installAppGenericTitle: 'myEcopontoをインストール',
        installAppGenericStep1: 'Chrome、Edge、またはSafariでサイトを開きます。',
        installAppGenericStep2: 'ブラウザメニューで「アプリをインストール」または「ホーム画面に追加」オプションを探します。',
        installAppGenericStep3: '画面の指示に従ってインストールを完了します。',
        
        // Note
        installAppNote: '注意：インストール後は、オフラインでもデバイスから直接myEcopontoにアクセスできます。',
        
        // 通知
        noNotifications: '通知はありません',
        markAsRead: '既読にする',
        deleteNotification: '削除',
        markAllAsRead: 'すべて既読にする',
        clearAll: 'すべて消去'
    },
    
    zh: {
        // Geral
        appName: 'EcoPonto 智能',
        subtitle: '智能监控',
        loading: '加载中...',
        connected: '已连接',
        disconnected: '已断开',
        welcomeMessage: '欢迎使用监控系统！在这里，您可以实时跟踪回收点的填充情况。',
        title: 'EcoPonto 智能',
        hello: '您好',
        
        // PWA
        'install-app': '安装应用',
        
        // 认证
        login: '登录',
        logout: '退出',
        email: '电子邮件',
        emailOrUsername: '电子邮件或用户名',
        password: '密码',
        forgotPassword: '忘记密码？',
        rememberMe: '记住我',
        createAccount: '创建账户',
        
        // 菜单
        dashboard: '仪表板',
        notifications: '通知',
        charts: '图表',
        ecopointManagement: '回收点管理',
        'manage-houses': '管理回收点',
        userManagement: '用户管理',
        settings: '设置',
        languages: '语言',
        menu: '菜单',
        user: '用户',
        user2: '安装myEcoponto',
        'install-app-button': '安装myEcoponto应用',
        darkMode: '深色模式',
        lightMode: '浅色模式',
        
        // 回收点
        ecopointTypes: {
            yellow: '塑料和金属',
            green: '玻璃',
            blue: '纸张和纸板'
        },
        'yellow-label': '塑料和金属',
        'green-label': '玻璃',
        'blue-label': '纸张和纸板',
        yellowSubtitle: '包装和容器',
        greenSubtitle: '瓶子和罐子',
        blueSubtitle: '报纸和包装',
        ecopointInfoMessage: '在这里，您可以查看回收点的填充水平。',
        
        // 统计
        averageFill: '平均填充率',
        realTime: '实时',
        mostFull: '最满的容器',
        activeMonitoring: '主动监控',
        lastUpdate: '最后更新',
        autoUpdate: '自动更新',
        status: '加载中...',
        
        // 图表
        'chart-title': '填充历史',
        last24h: '最近24小时',
        
        // 页脚
        'footer-text': '为Maximilian Guimaro的职业能力测试开发的项目',
        about: '关于',
        docs: '文档',
        
        // 安装指南
        installAppModalTitle: '安装myEcoponto应用',
        close: '关闭',
        
        // iOS
        installAppIOSTitle: '在iOS上安装myEcoponto',
        installAppIOSStep1: '点击导航栏中的分享图标。',
        installAppIOSStep2: '向下滚动并点击"添加到主屏幕"。',
        installAppIOSStep3: '点击右上角的"添加"确认。',
        
        // Android
        installAppAndroidTitle: '在Android上安装myEcoponto',
        installAppAndroidStep1: '点击右上角的菜单。',
        installAppAndroidStep2: '选择"安装应用"或"添加到主屏幕"。',
        installAppAndroidStep3: '点击"安装"确认。',
        
        // Desktop
        installAppDesktopTitle: '在桌面上安装myEcoponto',
        installAppDesktopStep1: '点击地址栏中的安装图标。',
        installAppDesktopStep2: '在弹出的提示中点击"安装"。',
        
        // Firefox
        installAppFirefoxTitle: '在Firefox上安装myEcoponto',
        installAppFirefoxStep1: '点击右上角的菜单。',
        installAppFirefoxStep2: '选择"+ 添加到主屏幕"。',
        installAppFirefoxStep3: '点击"添加"确认。',
        
        // Generic
        installAppGenericTitle: '安装myEcoponto',
        installAppGenericStep1: '在Chrome、Edge或Safari中打开网站。',
        installAppGenericStep2: '在浏览器菜单中，查找"安装应用"或"添加到主屏幕"选项。',
        installAppGenericStep3: '按照屏幕上的说明完成安装。',
        
        // Note
        installAppNote: '注意：安装后，即使离线，您也可以直接从设备访问myEcoponto。',
        
        // 通知
        noNotifications: '没有通知',
        markAsRead: '标记为已读',
        deleteNotification: '删除',
        markAllAsRead: '全部标记为已读',
        clearAll: '清除全部'
    }
}; 