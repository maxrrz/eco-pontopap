/**
 * menu-functions.js
 * Implementação das funcionalidades do menu lateral do EcoPonto
 * Inclui gerenciamento de permissões de usuário e acesso às diferentes funcionalidades
 */

import { CONFIG, translations } from './config.js';

// Tipos de permissões de usuário
const USER_ROLES = {
    VIEWER: 'viewer',           // Apenas visualização
    OPERATOR: 'operator',       // Operador (pode gerenciar coletas)
    ADMIN: 'admin',             // Administrador (acesso total)
    MUNICIPALITY: 'municipality' // Representante do município
};

// Mapeamento de funcionalidades por tipo de usuário
const ROLE_PERMISSIONS = {
    [USER_ROLES.VIEWER]: {
        canViewDashboard: true,
        canViewNotifications: true,
        canViewCharts: true,
        canManageEcopoints: false,
        canEditSettings: false,
        canManageUsers: false,
        canExportData: false,
        canScheduleCollections: false
    },
    [USER_ROLES.OPERATOR]: {
        canViewDashboard: true,
        canViewNotifications: true,
        canViewCharts: true,
        canManageEcopoints: true,
        canEditSettings: false,
        canManageUsers: false,
        canExportData: true,
        canScheduleCollections: true
    },
    [USER_ROLES.ADMIN]: {
        canViewDashboard: true,
        canViewNotifications: true,
        canViewCharts: true,
        canManageEcopoints: true,
        canEditSettings: true,
        canManageUsers: true,
        canExportData: true,
        canScheduleCollections: true
    },
    [USER_ROLES.MUNICIPALITY]: {
        canViewDashboard: true,
        canViewNotifications: true,
        canViewCharts: true,
        canManageEcopoints: false,
        canEditSettings: false,
        canManageUsers: false,
        canExportData: true,
        canScheduleCollections: false
    }
};

// Classe para gerenciar as funcionalidades do menu
export class MenuManager {
    constructor() {
        this.currentUser = null;
        this.notifications = [];
        this.unreadNotifications = 0;
        this.currentLanguage = localStorage.getItem('language') || 'pt';
        this.isDarkMode = localStorage.getItem('theme') === 'dark';
    }

    // Inicializar o gerenciador de menu
    init() {
        this.loadUserData();
        this.setupMenuItems();
        this.setupNotifications();
        this.updateUIBasedOnPermissions();
    }

    // Carregar dados do usuário do localStorage
    loadUserData() {
        try {
            const userData = localStorage.getItem('user');
            if (userData) {
                this.currentUser = JSON.parse(userData);
                
                // Se o usuário não tiver um papel definido, atribuir o papel padrão (viewer)
                if (!this.currentUser.role) {
                    this.currentUser.role = USER_ROLES.VIEWER;
                    this.saveUserData();
                }
            }
        } catch (error) {
            console.error('Erro ao carregar dados do usuário:', error);
            this.currentUser = null;
        }
    }

    // Salvar dados do usuário no localStorage
    saveUserData() {
        if (this.currentUser) {
            localStorage.setItem('user', JSON.stringify(this.currentUser));
        }
    }

    // Configurar itens do menu com base nas permissões do usuário
    setupMenuItems() {
        const menuItems = document.querySelectorAll('.menu-item');
        
        if (!menuItems.length) return;
        
        // Adicionar manipuladores de eventos para cada item do menu
        menuItems.forEach(item => {
            const itemId = item.getAttribute('data-menu-id');
            if (!itemId) return;
            
            // Adicionar evento de clique
            item.addEventListener('click', (e) => {
                if (itemId === 'language-menu-item') return; // Tratado separadamente
                
                e.preventDefault();
                this.handleMenuItemClick(itemId);
            });
        });
    }

    // Manipular clique em item do menu
    handleMenuItemClick(itemId) {
        switch (itemId) {
            case 'dashboard':
                this.showDashboard();
                break;
            case 'notifications':
                this.showNotifications();
                break;
            case 'charts':
                this.showCharts();
                break;
            case 'user-management':
                this.showUserManagement();
                break;
            case 'ecopoint-management':
                this.showEcopointManagement();
                break;
            case 'user':
                this.showUserProfile();
                break;
            case 'user2':
                this.showSecondUser();
                break;
            case 'settings':
                this.showSettings();
                break;
            case 'logout':
                this.logout();
                break;
            default:
                console.warn(`Item de menu não implementado: ${itemId}`);
        }
    }

    // Configurar notificações
    setupNotifications() {
        // Simular algumas notificações para demonstração
        this.notifications = [
            {
                id: 1,
                title: 'Ecoponto Amarelo',
                message: 'O ecoponto amarelo está quase cheio (85%).',
                type: 'warning',
                timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
                read: false
            },
            {
                id: 2,
                title: 'Manutenção Programada',
                message: 'Manutenção programada para amanhã às 10:00.',
                type: 'info',
                timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
                read: false
            },
            {
                id: 3,
                title: 'Coleta Realizada',
                message: 'Coleta do ecoponto verde realizada com sucesso.',
                type: 'success',
                timestamp: new Date(Date.now() - 24 * 3600000).toISOString(),
                read: true
            }
        ];
        
        this.updateNotificationBadge();
    }

    // Atualizar badge de notificações
    updateNotificationBadge() {
        this.unreadNotifications = this.notifications.filter(n => !n.read).length;
        
        const notificationBadge = document.querySelector('.notification-badge');
        if (notificationBadge) {
            if (this.unreadNotifications > 0) {
                notificationBadge.textContent = this.unreadNotifications;
                notificationBadge.style.display = 'flex';
            } else {
                notificationBadge.style.display = 'none';
            }
        }
    }

    // Atualizar UI com base nas permissões do usuário
    updateUIBasedOnPermissions() {
        if (!this.currentUser) return;
        
        const userRole = this.currentUser.role;
        const permissions = ROLE_PERMISSIONS[userRole] || ROLE_PERMISSIONS[USER_ROLES.VIEWER];
        
        // Atualizar visibilidade dos itens do menu
        const menuItems = {
            'dashboard': permissions.canViewDashboard,
            'notifications': permissions.canViewNotifications,
            'charts': permissions.canViewCharts,
            'user-management': permissions.canManageUsers,
            'ecopoint-management': permissions.canManageEcopoints,
            'settings': permissions.canEditSettings
        };
        
        // Atualizar visibilidade de cada item
        Object.entries(menuItems).forEach(([itemId, isVisible]) => {
            const menuItem = document.querySelector(`[data-menu-id="${itemId}"]`);
            if (menuItem) {
                menuItem.style.display = isVisible ? 'flex' : 'none';
            }
        });
        
        // Atualizar informações do usuário no menu
        this.updateUserInfoInMenu();
    }

    // Atualizar informações do usuário no menu
    updateUserInfoInMenu() {
        if (!this.currentUser) return;
        
        const userRoleElement = document.getElementById('user-role');
        if (userRoleElement) {
            let roleText = '';
            
            switch (this.currentUser.role) {
                case USER_ROLES.ADMIN:
                    roleText = 'Administrador';
                    break;
                case USER_ROLES.OPERATOR:
                    roleText = 'Operador';
                    break;
                case USER_ROLES.MUNICIPALITY:
                    roleText = 'Município';
                    break;
                case USER_ROLES.VIEWER:
                default:
                    roleText = 'Visualizador';
            }
            
            userRoleElement.textContent = roleText;
        }
    }

    // Mostrar painel de controle
    showDashboard() {
        console.log('Mostrando painel de controle');
        this.showNotification('Painel de controle carregado', 'info');
        // Implementação real: mostrar o painel principal
    }

    // Mostrar notificações
    showNotifications() {
        console.log('Mostrando painel de notificações');
        
        // Verificar permissões
        if (!this.permissions.canViewNotifications) {
            this.showNotification('Você não tem permissão para acessar esta função.', 'error');
            return;
        }
        
        try {
            // Criar painel de notificações
            const notificationsPanel = document.createElement('div');
            notificationsPanel.className = 'notifications-panel';
            
            // Criar cabeçalho
            const header = document.createElement('div');
            header.className = 'notifications-header';
            header.innerHTML = `
                <h3>Notificações</h3>
                <button class="close-notifications">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            // Criar lista de notificações
            const notificationsList = document.createElement('div');
            notificationsList.className = 'notifications-list';
            
            if (this.notifications.length === 0) {
                notificationsList.innerHTML = '<p class="no-notifications">Não há notificações.</p>';
            } else {
                // Ordenar notificações por data (mais recentes primeiro)
                const sortedNotifications = [...this.notifications].sort((a, b) =>
                    new Date(b.timestamp) - new Date(a.timestamp)
                );
                
                // Adicionar cada notificação à lista
                sortedNotifications.forEach(notification => {
                    const notificationItem = document.createElement('div');
                    notificationItem.className = `notification-item ${notification.read ? 'read' : 'unread'}`;
                    notificationItem.setAttribute('data-id', notification.id);
                    
                    const iconClass = this.getNotificationIcon(notification.type);
                    
                    notificationItem.innerHTML = `
                        <div class="notification-icon ${notification.type}">
                            <i class="${iconClass}"></i>
                        </div>
                        <div class="notification-content">
                            <div class="notification-title">${notification.title}</div>
                            <div class="notification-message">${notification.message}</div>
                            <div class="notification-date">${notification.timestamp}</div>
                        </div>
                        <div class="notification-actions">
                            ${!notification.read ? '<button class="mark-read" title="Marcar como lida"><i class="fas fa-check"></i></button>' : ''}
                            <button class="delete-notification" title="Excluir"><i class="fas fa-trash"></i></button>
                        </div>
                    `;
                    
                    notificationsList.appendChild(notificationItem);
                });
            }
            
            // Criar rodapé
            const footer = document.createElement('div');
            footer.className = 'notifications-footer';
            footer.innerHTML = `
                <button class="mark-all-read">Marcar todas como lidas</button>
                <button class="clear-all">Limpar todas</button>
            `;
            
            // Montar o painel
            notificationsPanel.appendChild(header);
            notificationsPanel.appendChild(notificationsList);
            notificationsPanel.appendChild(footer);
            
            // Adicionar o painel ao DOM
            document.body.appendChild(notificationsPanel);
            
            // Adicionar event listener para fechar o painel
            const closeButton = notificationsPanel.querySelector('.close-notifications');
            closeButton.addEventListener('click', () => {
                notificationsPanel.remove();
            });
            
            // Adicionar event listeners para marcar como lida
            const markReadButtons = notificationsPanel.querySelectorAll('.mark-read');
            markReadButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const notificationItem = button.closest('.notification-item');
                    const id = parseInt(notificationItem.getAttribute('data-id'));
                    
                    this.markNotificationAsRead(id);
                    
                    // Atualizar UI
                    notificationItem.classList.remove('unread');
                    notificationItem.classList.add('read');
                    button.remove();
                    
                    this.updateNotificationBadge();
                });
            });
            
            // Adicionar event listeners para excluir
            const deleteButtons = notificationsPanel.querySelectorAll('.delete-notification');
            deleteButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const notificationItem = button.closest('.notification-item');
                    const id = parseInt(notificationItem.getAttribute('data-id'));
                    
                    this.deleteNotification(id);
                    
                    // Atualizar UI
                    notificationItem.classList.add('deleting');
                    setTimeout(() => {
                        notificationItem.remove();
                        if (this.notifications.length === 0) {
                            notificationsList.innerHTML = '<p class="no-notifications">Não há notificações.</p>';
                        }
                        this.updateNotificationBadge();
                    }, 300);
                });
            });
            
            // Adicionar event listener para marcar todas como lidas
            const markAllReadButton = notificationsPanel.querySelector('.mark-all-read');
            markAllReadButton.addEventListener('click', () => {
                this.markAllNotificationsAsRead();
                
                // Atualizar UI
                const unreadItems = notificationsPanel.querySelectorAll('.notification-item.unread');
                unreadItems.forEach(item => {
                    item.classList.remove('unread');
                    item.classList.add('read');
                    const markReadButton = item.querySelector('.mark-read');
                    if (markReadButton) {
                        markReadButton.remove();
                    }
                });
                
                this.updateNotificationBadge();
            });
            
            // Adicionar event listener para limpar todas
            const clearAllButton = notificationsPanel.querySelector('.clear-all');
            clearAllButton.addEventListener('click', () => {
                this.clearAllNotifications();
                notificationsList.innerHTML = '<p class="no-notifications">Não há notificações.</p>';
                this.updateNotificationBadge();
            });
            
            // Se estamos aqui, a função foi bem-sucedida
            return true;
        } catch (error) {
            console.error('Erro ao mostrar notificações:', error);
            this.showNotification('Ocorreu um erro ao mostrar as notificações. Por favor, tente novamente.', 'error');
            return false;
        }
    }

    // Obter ícone para tipo de notificação
    getNotificationIcon(type) {
        switch (type) {
            case 'warning':
                return 'fa-exclamation-triangle';
            case 'success':
                return 'fa-check-circle';
            case 'error':
                return 'fa-times-circle';
            case 'info':
            default:
                return 'fa-info-circle';
        }
    }

    // Marcar notificação como lida
    markNotificationAsRead(id) {
        const notification = this.notifications.find(n => n.id === id);
        if (notification) {
            notification.read = true;
        }
    }

    // Excluir notificação
    deleteNotification(id) {
        this.notifications = this.notifications.filter(n => n.id !== id);
    }

    // Marcar todas as notificações como lidas
    markAllNotificationsAsRead() {
        this.notifications.forEach(notification => {
            notification.read = true;
        });
    }

    // Limpar todas as notificações
    clearAllNotifications() {
        this.notifications = [];
    }

    // Mostrar gráficos
    showCharts() {
        console.log('Abrindo página de gráficos');
        this.showNotification('Abrindo página de gráficos...', 'info');
        
        // Abrir a página de gráficos
        window.location.href = 'charts.html';
    }

    // Mostrar gerenciamento de usuários (apenas para administradores)
    showUserManagement() {
        if (!this.currentUser || !ROLE_PERMISSIONS[this.currentUser.role]?.canManageUsers) {
            this.showNotification('Você não tem permissão para acessar esta funcionalidade.', 'error');
            return;
        }
        
        console.log('Mostrando gerenciamento de usuários');
        this.showNotification('Carregando gerenciamento de usuários...', 'info');
        
        // Aqui seria implementada a interface de gerenciamento de usuários
    }

    // Mostrar gerenciamento de ecopontos
    showEcopointManagement() {
        if (!this.currentUser || !ROLE_PERMISSIONS[this.currentUser.role]?.canManageEcopoints) {
            this.showNotification('Você não tem permissão para gerenciar ecopontos.', 'error');
            return;
        }
        
        console.log('Mostrando gerenciamento de ecopontos');
        this.showNotification('Carregando gerenciamento de ecopontos...', 'info');
        
        // Aqui seria implementada a interface de gerenciamento de ecopontos
    }

    // Mostrar configurações
    showSettings() {
        console.log('Mostrando configurações');
        
        // Criar e mostrar o painel de configurações
        const settingsPanel = document.createElement('div');
        settingsPanel.className = 'settings-panel';
        
        // Cabeçalho do painel
        const header = document.createElement('div');
        header.className = 'settings-header';
        header.innerHTML = `
            <h3>Configurações</h3>
            <button class="close-settings">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Conteúdo do painel
        const content = document.createElement('div');
        content.className = 'settings-content';
        
        // Seção de perfil
        const profileSection = document.createElement('div');
        profileSection.className = 'settings-section';
        profileSection.innerHTML = `
            <h4>Perfil de Usuário</h4>
            <div class="settings-form">
                <div class="form-group">
                    <label for="settings-name">Nome</label>
                    <input type="text" id="settings-name" value="${this.currentUser?.name || ''}" ${!ROLE_PERMISSIONS[this.currentUser?.role]?.canEditSettings ? 'disabled' : ''}>
                </div>
                <div class="form-group">
                    <label for="settings-email">Email</label>
                    <input type="email" id="settings-email" value="${this.currentUser?.email || ''}" disabled>
                </div>
                <div class="form-group">
                    <label for="settings-role">Função</label>
                    <select id="settings-role" ${!ROLE_PERMISSIONS[this.currentUser?.role]?.canManageUsers ? 'disabled' : ''}>
                        <option value="${USER_ROLES.VIEWER}" ${this.currentUser?.role === USER_ROLES.VIEWER ? 'selected' : ''}>Visualizador</option>
                        <option value="${USER_ROLES.OPERATOR}" ${this.currentUser?.role === USER_ROLES.OPERATOR ? 'selected' : ''}>Operador</option>
                        <option value="${USER_ROLES.MUNICIPALITY}" ${this.currentUser?.role === USER_ROLES.MUNICIPALITY ? 'selected' : ''}>Município</option>
                        <option value="${USER_ROLES.ADMIN}" ${this.currentUser?.role === USER_ROLES.ADMIN ? 'selected' : ''}>Administrador</option>
                    </select>
                </div>
            </div>
        `;
        
        // Seção de notificações
        const notificationsSection = document.createElement('div');
        notificationsSection.className = 'settings-section';
        notificationsSection.innerHTML = `
            <h4>Preferências de Notificação</h4>
            <div class="settings-form">
                <div class="form-group checkbox">
                    <input type="checkbox" id="notify-email" checked>
                    <label for="notify-email">Receber notificações por email</label>
                </div>
                <div class="form-group checkbox">
                    <input type="checkbox" id="notify-browser" checked>
                    <label for="notify-browser">Receber notificações no navegador</label>
                </div>
                <div class="form-group checkbox">
                    <input type="checkbox" id="notify-critical" checked>
                    <label for="notify-critical">Apenas notificações críticas</label>
                </div>
            </div>
        `;
        
        // Seção de aparência
        const appearanceSection = document.createElement('div');
        appearanceSection.className = 'settings-section';
        appearanceSection.innerHTML = `
            <h4>Aparência</h4>
            <div class="settings-form">
                <div class="form-group">
                    <label for="settings-language">Idioma</label>
                    <select id="settings-language">
                        <option value="pt" ${this.currentLanguage === 'pt' ? 'selected' : ''}>Português</option>
                        <option value="es" ${this.currentLanguage === 'es' ? 'selected' : ''}>Español</option>
                        <option value="de" ${this.currentLanguage === 'de' ? 'selected' : ''}>Deutsch</option>
                        <option value="fr" ${this.currentLanguage === 'fr' ? 'selected' : ''}>Français</option>
                        <option value="ja" ${this.currentLanguage === 'ja' ? 'selected' : ''}>日本語</option>
                    </select>
                </div>
                <div class="form-group checkbox">
                    <input type="checkbox" id="settings-dark-mode" ${this.isDarkMode ? 'checked' : ''}>
                    <label for="settings-dark-mode">Modo Escuro</label>
                </div>
            </div>
        `;
        
        // Botões de ação
        const actions = document.createElement('div');
        actions.className = 'settings-actions';
        actions.innerHTML = `
            <button class="cancel-settings">Cancelar</button>
            <button class="save-settings">Salvar Alterações</button>
        `;
        
        // Montar o painel
        content.appendChild(profileSection);
        content.appendChild(notificationsSection);
        content.appendChild(appearanceSection);
        
        settingsPanel.appendChild(header);
        settingsPanel.appendChild(content);
        settingsPanel.appendChild(actions);
        
        // Adicionar ao corpo do documento
        document.body.appendChild(settingsPanel);
        
        // Adicionar manipuladores de eventos
        const closeButton = settingsPanel.querySelector('.close-settings');
        closeButton.addEventListener('click', () => {
            settingsPanel.remove();
        });
        
        const cancelButton = settingsPanel.querySelector('.cancel-settings');
        cancelButton.addEventListener('click', () => {
            settingsPanel.remove();
        });
        
        const saveButton = settingsPanel.querySelector('.save-settings');
        saveButton.addEventListener('click', () => {
            // Salvar alterações
            if (ROLE_PERMISSIONS[this.currentUser?.role]?.canEditSettings) {
                const nameInput = document.getElementById('settings-name');
                if (nameInput && this.currentUser) {
                    this.currentUser.name = nameInput.value;
                }
            }
            
            if (ROLE_PERMISSIONS[this.currentUser?.role]?.canManageUsers) {
                const roleSelect = document.getElementById('settings-role');
                if (roleSelect && this.currentUser) {
                    this.currentUser.role = roleSelect.value;
                }
            }
            
            // Salvar preferências de idioma
            const languageSelect = document.getElementById('settings-language');
            if (languageSelect) {
                this.currentLanguage = languageSelect.value;
                localStorage.setItem('language', this.currentLanguage);
            }
            
            // Salvar preferência de tema
            const darkModeCheckbox = document.getElementById('settings-dark-mode');
            if (darkModeCheckbox) {
                this.isDarkMode = darkModeCheckbox.checked;
                localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
                
                // Atualizar tema
                document.body.classList.toggle('dark-mode', this.isDarkMode);
                
                // Atualizar checkbox no menu
                const themeToggle = document.getElementById('theme-toggle');
                if (themeToggle) {
                    themeToggle.checked = this.isDarkMode;
                }
                
                // Atualizar imagem do tema
                const themeImage = document.getElementById('theme-image');
                if (themeImage) {
                    themeImage.src = this.isDarkMode ? 'photos/tgeiescuro.png' : 'photos/tgeiclaro.png';
                }
            }
            
            // Salvar dados do usuário
            this.saveUserData();
            
            // Atualizar UI
            this.updateUIBasedOnPermissions();
            
            // Fechar painel
            settingsPanel.remove();
            
            // Mostrar notificação
            this.showNotification('Configurações salvas com sucesso!', 'success');
        });
    }

    // Fazer logout
    logout() {
        console.log('Fazendo logout');
        
        // Limpar dados do usuário
        localStorage.removeItem('user');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('rememberMe');
        
        // Redirecionar para a página de login ou recarregar a página
        window.location.reload();
    }

    // Mostrar notificação
    showNotification(message, type = 'info') {
        // Função desativada - não mostrar notificações
        return;
    }

    // Mostrar perfil do usuário
    showUserProfile() {
        console.log('Mostrando perfil do usuário primário');
        
        // Fechar o menu lateral
        const menuPanel = document.querySelector('.menu-panel');
        const menuButton = document.querySelector('.menu-button');
        const menuOverlay = document.querySelector('.menu-overlay');
        
        if (menuPanel && menuButton && menuOverlay) {
            menuButton.classList.remove('active');
            menuPanel.classList.remove('active');
            menuOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
        
        // Simular ação de perfil do usuário
        setTimeout(() => {
            alert('Perfil de utilizador - Funcionalidade em desenvolvimento');
        }, 300);
    }
    
    // Mostrar a funcionalidade do instalador do myEcoponto
    showSecondUser() {
        console.log('Iniciando o processo de instalação do myEcoponto');
        
        // Fechar o menu lateral
        const menuPanel = document.querySelector('.menu-panel');
        const menuButton = document.querySelector('.menu-button');
        const menuOverlay = document.querySelector('.menu-overlay');
        
        if (menuPanel) menuPanel.classList.remove('active');
        if (menuButton) menuButton.classList.remove('active');
        if (menuOverlay) menuOverlay.classList.remove('active');
        
        // Detectar dispositivo
        const userAgent = navigator.userAgent;
        const isIOS = /iPad|iPhone|iPod/.test(userAgent) || 
                     (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
        const isAndroid = /Android/.test(userAgent);
        
        console.log('Detecção de dispositivo:', { 
            userAgent: userAgent, 
            isIOS: isIOS, 
            isAndroid: isAndroid,
            platform: navigator.platform
        });
        
        // Remover painéis existentes
        let existingPanel = document.querySelector('.install-panel');
        if (existingPanel) existingPanel.remove();
        
        let existingOverlay = document.querySelector('.install-overlay');
        if (existingOverlay) existingOverlay.remove();
        
        // Primeiro criar HTML básico do painel
        let panelHTML = `
            <div class="install-overlay"></div>
            <div class="install-panel">
                <div class="install-header">
                    <h3>Instalar a aplicação do myEcoponto</h3>
                    <button class="close-install" id="closeInstallBtn">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="install-content">
                    <p class="install-description">
                        Os seus dados de monitorização favoritos na ponta dos seus dedos. 
                        Acesso rápido. Notificações instantâneas. 
                        Tudo o que adora, ainda melhor.
                    </p>
        `;
        
        // Adicionar o conteúdo específico do dispositivo
        if (isIOS) {
            panelHTML += `
                <div class="install-section">
                    <h4>Safari</h4>
                    <div class="install-steps">
                        <div class="install-step">
                            <span class="step-number">1.</span>
                            <span class="step-text">Abra o myEcoponto no navegador Safari do teu iPhone.</span>
                        </div>
                        <div class="browser-mockup">
                            <img src="int/ios/1.png" alt="Passo 1 da instalação iOS" class="install-image">
                        </div>
                        <div class="install-step">
                            <span class="step-number">2.</span>
                            <span class="step-text">Toque no botão "Partilhar" na barra de navegação.</span>
                        </div>
                        <div class="browser-mockup">
                            <img src="int/ios/2.png" alt="Passo 2 da instalação iOS" class="install-image">
                        </div>
                        <div class="install-step">
                            <span class="step-number">3.</span>
                            <span class="step-text">Deslize para baixo e pressione em "Adicionar ao Ecrã Inicial".</span>
                        </div>
                        <div class="browser-mockup">
                            <img src="int/ios/3.png" alt="Passo 3 da instalação iOS" class="install-image">
                        </div>
                    </div>
                </div>
            `;
        } else if (isAndroid) {
            panelHTML += `
                <div class="install-section">
                    <h4>Google Chrome</h4>
                    <div class="install-steps">
                        <div class="install-step">
                            <span class="step-number">1.</span>
                            <span class="step-text">Abra o myEcoponto no navegador Chrome do seu Android.</span>
                        </div>
                        <div class="browser-mockup">
                            <img src="int/android/1.png" alt="Passo 1 da instalação Android" class="install-image">
                        </div>
                        <div class="install-step">
                            <span class="step-number">2.</span>
                            <span class="step-text">Toque no menu (três pontos) no canto superior direito.</span>
                        </div>
                        <div class="browser-mockup">
                            <img src="int/android/2.png" alt="Passo 2 da instalação Android" class="install-image">
                        </div>
                        <div class="install-step">
                            <span class="step-number">3.</span>
                            <span class="step-text">Selecione "Adicionar à tela inicial".</span>
                        </div>
                        <div class="browser-mockup">
                            <img src="int/android/3.png" alt="Passo 3 da instalação Android" class="install-image">
                        </div>
                    </div>
                </div>
            `;
        } else {
            panelHTML += `
                <div class="install-section">
                    <h4>Google Chrome</h4>
                    <div class="install-steps">
                        <div class="install-step">
                            <span class="step-number">1.</span>
                            <span class="step-text">Abra o myEcoponto no navegador Chrome.</span>
                        </div>
                        <div class="browser-mockup">
                            <img src="int/win/1.png" alt="Passo 1 da instalação" class="install-image">
                        </div>
                        <div class="install-step">
                            <span class="step-number">2.</span>
                            <span class="step-text">Clique no ícone de instalação na barra de endereço.</span>
                        </div>
                        <div class="browser-mockup">
                            <img src="int/win/2.png" alt="Passo 2 da instalação" class="install-image">
                        </div>
                        <div class="install-step">
                            <span class="step-number">3.</span>
                            <span class="step-text">Confirme a instalação clicando em "Instalar".</span>
                        </div>
                    </div>
                </div>
            `;
        }
        
        // Fechar HTML do painel
        panelHTML += `
                </div>
            </div>
        `;
        
        // Inserir o HTML no DOM
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = panelHTML;
        while (tempDiv.firstChild) {
            document.body.appendChild(tempDiv.firstChild);
        }
        
        // Bloquear o scroll do background
        document.body.classList.add('body-no-scroll');
        
        // Adicionar eventos com uma abordagem de eventos delegados
        document.addEventListener('click', function handler(e) {
            // Botão de fechar
            if (e.target.closest('.close-install') || e.target.classList.contains('close-install')) {
                console.log('Botão fechar clicado');
                closeInstallPanel();
            }
            
            // Clique no overlay
            if (e.target.classList.contains('install-overlay')) {
                console.log('Overlay clicado');
                closeInstallPanel();
            }
        });
        
        // Adicionar evento de toque para iOS
        document.addEventListener('touchend', function handler(e) {
            if (e.target.closest('.close-install') || e.target.classList.contains('close-install')) {
                console.log('Botão fechar tocado');
                e.preventDefault();
                closeInstallPanel();
            }
            
            if (e.target.classList.contains('install-overlay')) {
                console.log('Overlay tocado');
                e.preventDefault();
                closeInstallPanel();
            }
        }, {passive: false});
        
        // Tecla ESC
        const escKeyHandler = function(e) {
            if (e.key === 'Escape') {
                console.log('Tecla ESC pressionada');
                closeInstallPanel();
            }
        };
        document.addEventListener('keydown', escKeyHandler);
        
        // Função para fechar o painel
        function closeInstallPanel() {
            console.log('Fechando painel de instalação');
            
            const overlay = document.querySelector('.install-overlay');
            const panel = document.querySelector('.install-panel');
            
            if (overlay) overlay.classList.add('closing');
            if (panel) panel.classList.add('closing');
            
            document.body.classList.remove('body-no-scroll');
            
            // Remover eventos
            document.removeEventListener('keydown', escKeyHandler);
            
            setTimeout(() => {
                if (overlay && overlay.parentNode) overlay.remove();
                if (panel && panel.parentNode) panel.remove();
            }, 300);
        }
        
        // Animação de entrada
        setTimeout(() => {
            const overlay = document.querySelector('.install-overlay');
            const panel = document.querySelector('.install-panel');
            
            if (overlay) overlay.classList.add('active');
            if (panel) panel.classList.add('active');
        }, 10);
    }
}

// Inicializar o gerenciador de menu quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    const menuManager = new MenuManager();
    menuManager.init();
    
    // Expor o gerenciador globalmente para depuração
    window.menuManager = menuManager;
}); 