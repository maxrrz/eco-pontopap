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
    API_TOKEN: '', // Token vazio como padrão
    API_TIMEOUT: 5000, // 5 segundos
    
    // Configurações de autenticação
    AUTH_TOKEN_KEY: 'ecoponto_auth_token',
    USER_DATA_KEY: 'ecoponto_user_data',
    
    // Configurações de ecopontos
    ECOPOINT_TYPES: {
        YELLOW: 'yellow',
        GREEN: 'green',
        BLUE: 'blue'
    },
    
    // Configurações de idioma
    DEFAULT_LANGUAGE: 'pt',
    SUPPORTED_LANGUAGES: ['pt', 'es', 'de', 'fr', 'ja'],
    
    // Configurações de tema
    DEFAULT_THEME: 'light',
    
    // Configurações de atualização
    UPDATE_INTERVAL_CONNECTED: 10000, // 10 segundos quando conectado
    UPDATE_INTERVAL_DISCONNECTED: 30000, // 30 segundos quando desconectado
    MAX_CONSECUTIVE_FAILURES: 3, // Número máximo de falhas consecutivas antes de reduzir a frequência
    RETRY_DELAY: 60000, // 1 minuto de espera após falhas consecutivas
    
    // Configurações de gráfico
    CHART_COLORS: {
        YELLOW: 'rgba(255, 193, 7, 0.8)',
        GREEN: 'rgba(40, 167, 69, 0.8)',
        BLUE: 'rgba(0, 123, 255, 0.8)'
    },
    CHART_BORDER_COLORS: {
        YELLOW: 'rgb(255, 193, 7)',
        GREEN: 'rgb(40, 167, 69)',
        BLUE: 'rgb(0, 123, 255)'
    }
};

// Traduções para diferentes idiomas
export const translations = {
    // Português (Portugal/Brasil)
    pt: {
        // Geral
        appName: 'Ecoponto Inteligente',
        subtitle: 'Monitorização Inteligente',
        welcome: 'Olá',
        welcomeMessage: 'Bem-vindo ao sistema de monitorização! Aqui você pode acompanhar o enchimento dos ecopontos em tempo real.',
        loading: 'Carregando...',
        connected: 'Conectado',
        disconnected: 'Desconectado',
        server_unavailable: 'Servidor indisponível',
        
        // Menu
        dashboard: 'Painel de controlo',
        notifications: 'Notificações',
        charts: 'Gráficos',
        settings: 'Configurações',
        language: 'Idiomas',
        user: 'Utilizador',
        logout: 'Sair',
        darkMode: 'Modo Escuro',
        
        // Estatísticas
        averageFill: 'Média de Enchimento',
        mostFull: 'Contentor Mais Cheio',
        lastUpdate: 'Última Atualização',
        realTime: 'Em tempo real',
        monitoring: 'Monitorização ativa',
        autoUpdate: 'Atualização automática',
        
        // Ecopontos
        ecopontoInfoMessage: 'Aqui você pode ver os níveis de enchimento dos ecopontos.',
        ecopointTypes: {
            yellow: 'Plástico e Metal',
            green: 'Vidro',
            blue: 'Papel e Cartão'
        },
        yellowSubtitle: 'Embalagens e recipientes',
        greenSubtitle: 'Garrafas e frascos',
        blueSubtitle: 'Jornais e embalagens',
        
        // Gráficos
        chartsTitle: 'Histórico de Enchimento',
        fillLevel: 'Nível de Enchimento (%)',
        time: 'Tempo',
        timeRanges: {
            '24h': 'Últimas 24h',
            '7d': 'Últimos 7 dias',
            '30d': 'Últimos 30 dias'
        },
        
        // Páginas
        about: 'Sobre',
        contact: 'Contato',
        documentation: 'Documentação',
        
        // Footer
        footerText: 'Projeto desenvolvido para a Prova de Aptidão Profissional de Maximilian Guimaro',
        
        // Página Sobre
        aboutSubtitle: 'Conheça mais sobre o projeto EcoPonto',
        aboutProject: 'Sobre o Projeto',
        aboutProjectText: 'O EcoPonto é um sistema de monitorização inteligente que permite acompanhar em tempo real o nível de enchimento dos ecopontos. Desenvolvido como parte de um projeto de conclusão de curso, o sistema utiliza sensores IoT para coletar dados e apresentá-los de forma intuitiva.',
        technologies: 'Tecnologias Utilizadas',
        objectives: 'Objetivos',
        objective1: 'Monitorizar em tempo real o nível de enchimento dos ecopontos',
        objective2: 'Otimizar as rotas de recolha de resíduos',
        objective3: 'Reduzir custos operacionais e impacto ambiental',
        objective4: 'Promover a reciclagem e a sustentabilidade',
        team: 'Equipe',
        
        // Página de Contato
        contactSubtitle: 'Entre em contato conosco',
        name: 'Nome',
        email: 'Email',
        message: 'Mensagem',
        send: 'Enviar',
        emailUs: 'Envie-nos um email',
        callUs: 'Ligue para nós',
        visitUs: 'Visite-nos',
        
        // Página de Documentação
        docsSubtitle: 'Documentação técnica do projeto',
        gettingStarted: 'Primeiros Passos',
        installation: 'Instalação',
        usage: 'Utilização',
        api: 'API',
        examples: 'Exemplos',
        docsSection1Title: 'Introdução',
        docsSection1Text: 'Esta documentação fornece informações detalhadas sobre como utilizar o sistema EcoPonto.',
        docsSection2Title: 'Instalação',
        docsSection2Text: 'Siga os passos abaixo para instalar o sistema EcoPonto em seu ambiente.',
        
        // Página de Gráficos
        chartsSubtitle: 'Visualize o histórico de enchimento dos ecopontos',
        averageFilling: 'Média de Enchimento',
        peakFilling: 'Pico de Enchimento',
        fastestFilling: 'Enchimento Mais Rápido'
    },
    
    // Español
    es: {
        // General
        appName: 'Ecoponto Inteligente',
        subtitle: 'Monitorización Inteligente',
        welcome: 'Hola',
        welcomeMessage: '¡Bienvenido al sistema de monitorización! Aquí puede seguir el llenado de los contenedores de reciclaje en tiempo real.',
        loading: 'Cargando...',
        connected: 'Conectado',
        disconnected: 'Desconectado',
        server_unavailable: 'Servidor no disponible',
        
        // Menú
        dashboard: 'Panel de control',
        notifications: 'Notificaciones',
        charts: 'Gráficos',
        settings: 'Configuración',
        language: 'Idiomas',
        user: 'Usuario',
        logout: 'Salir',
        darkMode: 'Modo Oscuro',
        
        // Estadísticas
        averageFill: 'Llenado Promedio',
        mostFull: 'Contenedor Más Lleno',
        lastUpdate: 'Última Actualización',
        realTime: 'En tiempo real',
        monitoring: 'Monitorización activa',
        autoUpdate: 'Actualización automática',
        
        // Contenedores
        ecopontoInfoMessage: 'Aquí puede ver los niveles de llenado de los contenedores de reciclaje.',
        ecopointTypes: {
            yellow: 'Plástico y Metal',
            green: 'Vidrio',
            blue: 'Papel y Cartón'
        },
        yellowSubtitle: 'Envases y recipientes',
        greenSubtitle: 'Botellas y frascos',
        blueSubtitle: 'Periódicos y embalajes',
        
        // Gráficos
        chartsTitle: 'Historial de Llenado',
        fillLevel: 'Nivel de Llenado (%)',
        time: 'Tiempo',
        timeRanges: {
            '24h': 'Últimas 24h',
            '7d': 'Últimos 7 días',
            '30d': 'Últimos 30 días'
        },
        
        // Páginas
        about: 'Acerca de',
        contact: 'Contacto',
        documentation: 'Documentación',
        
        // Pie de página
        footerText: 'Proyecto desarrollado para la Prueba de Aptitud Profesional de Maximilian Guimaro',
        
        // Página Acerca de
        aboutSubtitle: 'Conozca más sobre el proyecto EcoPunto',
        aboutProject: 'Sobre el Proyecto',
        aboutProjectText: 'EcoPunto es un sistema de monitorización inteligente que permite seguir en tiempo real el nivel de llenado de los contenedores de reciclaje. Desarrollado como parte de un proyecto de fin de curso, el sistema utiliza sensores IoT para recopilar datos y presentarlos de forma intuitiva.',
        technologies: 'Tecnologías Utilizadas',
        objectives: 'Objetivos',
        objective1: 'Monitorizar en tiempo real el nivel de llenado de los contenedores',
        objective2: 'Optimizar las rutas de recogida de residuos',
        objective3: 'Reducir costes operativos e impacto ambiental',
        objective4: 'Promover el reciclaje y la sostenibilidad',
        team: 'Equipo',
        
        // Página de Contacto
        contactSubtitle: 'Póngase en contacto con nosotros',
        name: 'Nombre',
        email: 'Correo electrónico',
        message: 'Mensaje',
        send: 'Enviar',
        emailUs: 'Envíenos un correo',
        callUs: 'Llámenos',
        visitUs: 'Visítenos',
        
        // Página de Documentación
        docsSubtitle: 'Documentación técnica del proyecto',
        gettingStarted: 'Primeros Pasos',
        installation: 'Instalación',
        usage: 'Uso',
        api: 'API',
        examples: 'Ejemplos',
        docsSection1Title: 'Introducción',
        docsSection1Text: 'Esta documentación proporciona información detallada sobre cómo utilizar el sistema EcoPunto.',
        docsSection2Title: 'Instalación',
        docsSection2Text: 'Siga los pasos a continuación para instalar el sistema EcoPunto en su entorno.',
        
        // Página de Gráficos
        chartsSubtitle: 'Visualice el historial de llenado de los contenedores',
        averageFilling: 'Llenado Promedio',
        peakFilling: 'Pico de Llenado',
        fastestFilling: 'Llenado Más Rápido'
    },
    
    // Deutsch
    de: {
        // Allgemein
        appName: 'Ecoponto Inteligente',
        subtitle: 'Intelligente Überwachung',
        welcome: 'Hallo',
        welcomeMessage: 'Willkommen beim Überwachungssystem! Hier können Sie die Füllstände der Recyclingbehälter in Echtzeit verfolgen.',
        loading: 'Wird geladen...',
        connected: 'Verbunden',
        disconnected: 'Getrennt',
        server_unavailable: 'Server nicht verfügbar',
        
        // Menü
        dashboard: 'Kontrollpanel',
        notifications: 'Benachrichtigungen',
        charts: 'Diagramme',
        settings: 'Einstellungen',
        language: 'Sprachen',
        user: 'Benutzer',
        logout: 'Abmelden',
        darkMode: 'Dunkelmodus',
        
        // Statistiken
        averageFill: 'Durchschnittliche Füllung',
        mostFull: 'Vollster Behälter',
        lastUpdate: 'Letzte Aktualisierung',
        realTime: 'In Echtzeit',
        monitoring: 'Aktive Überwachung',
        autoUpdate: 'Automatische Aktualisierung',
        
        // Behälter
        ecopontoInfoMessage: 'Hier können Sie die Füllstände der Recyclingbehälter sehen.',
        ecopointTypes: {
            yellow: 'Kunststoff und Metall',
            green: 'Glas',
            blue: 'Papier und Karton'
        },
        yellowSubtitle: 'Verpackungen und Behälter',
        greenSubtitle: 'Flaschen und Gläser',
        blueSubtitle: 'Zeitungen und Verpackungen',
        
        // Diagramme
        chartsTitle: 'Füllstandsverlauf',
        fillLevel: 'Füllstand (%)',
        time: 'Zeit',
        timeRanges: {
            '24h': 'Letzte 24h',
            '7d': 'Letzte 7 Tage',
            '30d': 'Letzte 30 Tage'
        },
        
        // Seiten
        about: 'Über uns',
        contact: 'Kontakt',
        documentation: 'Dokumentation',
        
        // Fußzeile
        footerText: 'Projekt entwickelt für die berufliche Eignungsprüfung von Maximilian Guimaro',
        
        // Über uns Seite
        aboutSubtitle: 'Erfahren Sie mehr über das EcoPunkt-Projekt',
        aboutProject: 'Über das Projekt',
        aboutProjectText: 'EcoPunkt ist ein intelligentes Überwachungssystem, das es ermöglicht, den Füllstand von Recyclingbehältern in Echtzeit zu verfolgen. Das System wurde als Teil eines Abschlussprojekts entwickelt und verwendet IoT-Sensoren, um Daten zu sammeln und intuitiv darzustellen.',
        technologies: 'Verwendete Technologien',
        objectives: 'Ziele',
        objective1: 'Echtzeitüberwachung des Füllstands der Recyclingbehälter',
        objective2: 'Optimierung der Abfallsammelrouten',
        objective3: 'Reduzierung der Betriebskosten und Umweltauswirkungen',
        objective4: 'Förderung von Recycling und Nachhaltigkeit',
        team: 'Team',
        
        // Kontaktseite
        contactSubtitle: 'Kontaktieren Sie uns',
        name: 'Name',
        email: 'E-Mail',
        message: 'Nachricht',
        send: 'Senden',
        emailUs: 'Schreiben Sie uns',
        callUs: 'Rufen Sie uns an',
        visitUs: 'Besuchen Sie uns',
        
        // Dokumentationsseite
        docsSubtitle: 'Technische Dokumentation des Projekts',
        gettingStarted: 'Erste Schritte',
        installation: 'Installation',
        usage: 'Verwendung',
        api: 'API',
        examples: 'Beispiele',
        docsSection1Title: 'Einführung',
        docsSection1Text: 'Diese Dokumentation bietet detaillierte Informationen zur Verwendung des EcoPunkt-Systems.',
        docsSection2Title: 'Installation',
        docsSection2Text: 'Folgen Sie den nachstehenden Schritten, um das EcoPunkt-System in Ihrer Umgebung zu installieren.',
        
        // Diagrammseite
        chartsSubtitle: 'Visualisieren Sie den Füllstandsverlauf der Recyclingbehälter',
        averageFilling: 'Durchschnittliche Füllung',
        peakFilling: 'Spitzenfüllung',
        fastestFilling: 'Schnellste Füllung'
    },
    
    // Français
    fr: {
        // Général
        appName: 'ÉcoPoint',
        subtitle: 'Surveillance Intelligente',
        welcome: 'Bonjour',
        welcomeMessage: 'Bienvenue dans le système de surveillance ! Ici, vous pouvez suivre le remplissage des conteneurs de recyclage en temps réel.',
        loading: 'Chargement...',
        connected: 'Connecté',
        disconnected: 'Déconnecté',
        server_unavailable: 'Serveur indisponible',
        
        // Menu
        dashboard: 'Tableau de bord',
        notifications: 'Notifications',
        charts: 'Graphiques',
        settings: 'Paramètres',
        language: 'Langues',
        user: 'Utilisateur',
        logout: 'Déconnexion',
        darkMode: 'Mode Sombre',
        
        // Statistiques
        averageFill: 'Remplissage Moyen',
        mostFull: 'Conteneur le Plus Plein',
        lastUpdate: 'Dernière Mise à Jour',
        realTime: 'En temps réel',
        monitoring: 'Surveillance active',
        autoUpdate: 'Mise à jour automatique',
        
        // Conteneurs
        ecopontoInfoMessage: 'Ici, vous pouvez voir les niveaux de remplissage des conteneurs de recyclage.',
        ecopointTypes: {
            yellow: 'Plastique et Métal',
            green: 'Verre',
            blue: 'Papier et Carton'
        },
        yellowSubtitle: 'Emballages et récipients',
        greenSubtitle: 'Bouteilles et flacons',
        blueSubtitle: 'Journaux et emballages',
        
        // Graphiques
        chartsTitle: 'Historique de Remplissage',
        fillLevel: 'Niveau de Remplissage (%)',
        time: 'Temps',
        timeRanges: {
            '24h': 'Dernières 24h',
            '7d': 'Derniers 7 jours',
            '30d': 'Derniers 30 jours'
        },
        
        // Pages
        about: 'À propos',
        contact: 'Contact',
        documentation: 'Documentation',
        
        // Pied de page
        footerText: 'Projet développé pour l\'Épreuve d\'Aptitude Professionnelle de Maximilian Guimaro',
        
        // Page À propos
        aboutSubtitle: 'En savoir plus sur le projet ÉcoPoint',
        aboutProject: 'À propos du Projet',
        aboutProjectText: 'ÉcoPoint est un système de surveillance intelligent qui permet de suivre en temps réel le niveau de remplissage des conteneurs de recyclage. Développé dans le cadre d\'un projet de fin d\'études, le système utilise des capteurs IoT pour collecter des données et les présenter de manière intuitive.',
        technologies: 'Technologies Utilisées',
        objectives: 'Objectifs',
        objective1: 'Surveiller en temps réel le niveau de remplissage des conteneurs',
        objective2: 'Optimiser les itinéraires de collecte des déchets',
        objective3: 'Réduire les coûts opérationnels et l\'impact environnemental',
        objective4: 'Promouvoir le recyclage et la durabilité',
        team: 'Équipe',
        
        // Page de Contact
        contactSubtitle: 'Contactez-nous',
        name: 'Nom',
        email: 'Email',
        message: 'Message',
        send: 'Envoyer',
        emailUs: 'Envoyez-nous un email',
        callUs: 'Appelez-nous',
        visitUs: 'Visitez-nous',
        
        // Page de Documentation
        docsSubtitle: 'Documentation technique du projet',
        gettingStarted: 'Premiers Pas',
        installation: 'Installation',
        usage: 'Utilisation',
        api: 'API',
        examples: 'Exemples',
        docsSection1Title: 'Introduction',
        docsSection1Text: 'Cette documentation fournit des informations détaillées sur l\'utilisation du système ÉcoPoint.',
        docsSection2Title: 'Installation',
        docsSection2Text: 'Suivez les étapes ci-dessous pour installer le système ÉcoPoint dans votre environnement.',
        
        // Page de Graphiques
        chartsSubtitle: 'Visualisez l\'historique de remplissage des conteneurs',
        averageFilling: 'Remplissage Moyen',
        peakFilling: 'Pic de Remplissage',
        fastestFilling: 'Remplissage le Plus Rapide'
    },
    
    // 日本語
    ja: {
        // 一般
        appName: 'エコポイント',
        subtitle: 'インテリジェント監視',
        welcome: 'こんにちは',
        welcomeMessage: '監視システムへようこそ！ここでは、リサイクル容器の充填状況をリアルタイムで追跡できます。',
        loading: '読み込み中...',
        connected: '接続済み',
        disconnected: '切断',
        server_unavailable: 'サーバーが利用できません',
        
        // メニュー
        dashboard: 'ダッシュボード',
        notifications: '通知',
        charts: 'グラフ',
        settings: '設定',
        language: '言語',
        user: 'ユーザー',
        logout: 'ログアウト',
        darkMode: 'ダークモード',
        
        // 統計
        averageFill: '平均充填率',
        mostFull: '最も満杯のコンテナ',
        lastUpdate: '最終更新',
        realTime: 'リアルタイム',
        monitoring: 'アクティブ監視',
        autoUpdate: '自動更新',
        
        // コンテナ
        ecopontoInfoMessage: 'ここでは、リサイクル容器の充填状況を確認できます。',
        ecopointTypes: {
            yellow: 'プラスチックと金属',
            green: 'ガラス',
            blue: '紙とカートン'
        },
        yellowSubtitle: '包装と容器',
        greenSubtitle: 'ボトルとフラスコ',
        blueSubtitle: '新聞と包装',
        
        // グラフ
        chartsTitle: '充填履歴',
        fillLevel: '充填レベル（％）',
        time: '時間',
        timeRanges: {
            '24h': '過去24時間',
            '7d': '過去7日間',
            '30d': '過去30日間'
        },
        
        // ページ
        about: '概要',
        contact: 'お問い合わせ',
        documentation: 'ドキュメント',
        
        // フッター
        footerText: 'マキシミリアン・ギマロの専門適性試験のために開発されたプロジェクト',
        
        // 概要ページ
        aboutSubtitle: 'エコポイントプロジェクトについて詳しく知る',
        aboutProject: 'プロジェクトについて',
        aboutProjectText: 'エコポイントは、リサイクル容器の充填状況をリアルタイムで追跡できるインテリジェント監視システムです。卒業プロジェクトの一環として開発されたこのシステムは、IoTセンサーを使用してデータを収集し、直感的に表示します。',
        technologies: '使用技術',
        objectives: '目標',
        objective1: 'リサイクル容器の充填状況をリアルタイムで監視する',
        objective2: '廃棄物収集ルートを最適化する',
        objective3: '運用コストと環境への影響を削減する',
        objective4: 'リサイクルと持続可能性を促進する',
        team: 'チーム',
        
        // お問い合わせページ
        contactSubtitle: 'お問い合わせ',
        name: '名前',
        email: 'メール',
        message: 'メッセージ',
        send: '送信',
        emailUs: 'メールを送る',
        callUs: 'お電話ください',
        visitUs: 'お越しください',
        
        // ドキュメントページ
        docsSubtitle: 'プロジェクトの技術ドキュメント',
        gettingStarted: '始めに',
        installation: 'インストール',
        usage: '使用方法',
        api: 'API',
        examples: '例',
        docsSection1Title: '導入',
        docsSection1Text: 'このドキュメントでは、エコポイントシステムの使用方法に関する詳細情報を提供します。',
        docsSection2Title: 'インストール',
        docsSection2Text: '以下の手順に従って、お使いの環境にエコポイントシステムをインストールしてください。',
        
        // グラフページ
        chartsSubtitle: 'コンテナの充填履歴を視覚化する',
        averageFilling: '平均充填率',
        peakFilling: '最大充填率',
        fastestFilling: '最速充填'
    }
}; 