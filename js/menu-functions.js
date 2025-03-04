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
        console.log('Mostrando notificações');
        
        // Criar e mostrar o painel de notificações
        const notificationsPanel = document.createElement('div');
        notificationsPanel.className = 'notifications-panel';
        
        // Cabeçalho do painel
        const header = document.createElement('div');
        header.className = 'notifications-header';
        header.innerHTML = `
            <h3>Notificações</h3>
            <button class="close-notifications">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Lista de notificações
        const notificationsList = document.createElement('div');
        notificationsList.className = 'notifications-list';
        
        if (this.notifications.length === 0) {
            notificationsList.innerHTML = '<p class="no-notifications">Não há notificações.</p>';
        } else {
            // Ordenar notificações por data (mais recentes primeiro)
            const sortedNotifications = [...this.notifications].sort((a, b) => 
                new Date(b.timestamp) - new Date(a.timestamp)
            );
            
            sortedNotifications.forEach(notification => {
                const notificationItem = document.createElement('div');
                notificationItem.className = `notification-item ${notification.read ? 'read' : 'unread'} ${notification.type}`;
                
                const date = new Date(notification.timestamp);
                const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
                
                notificationItem.innerHTML = `
                    <div class="notification-icon">
                        <i class="fas ${this.getNotificationIcon(notification.type)}"></i>
                    </div>
                    <div class="notification-content">
                        <div class="notification-title">${notification.title}</div>
                        <div class="notification-message">${notification.message}</div>
                        <div class="notification-time">${formattedDate}</div>
                    </div>
                    <div class="notification-actions">
                        <button class="mark-read" data-id="${notification.id}">
                            <i class="fas ${notification.read ? 'fa-envelope-open' : 'fa-envelope'}"></i>
                        </button>
                        <button class="delete-notification" data-id="${notification.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;
                
                notificationsList.appendChild(notificationItem);
            });
        }
        
        // Rodapé do painel
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
        
        // Adicionar ao corpo do documento
        document.body.appendChild(notificationsPanel);
        
        // Adicionar manipuladores de eventos
        const closeButton = notificationsPanel.querySelector('.close-notifications');
        closeButton.addEventListener('click', () => {
            notificationsPanel.remove();
        });
        
        const markReadButtons = notificationsPanel.querySelectorAll('.mark-read');
        markReadButtons.forEach(button => {
            button.addEventListener('click', () => {
                const id = parseInt(button.getAttribute('data-id'));
                this.markNotificationAsRead(id);
                this.updateNotificationBadge();
                
                // Atualizar ícone
                const icon = button.querySelector('i');
                icon.classList.remove('fa-envelope');
                icon.classList.add('fa-envelope-open');
                
                // Atualizar classe do item
                const notificationItem = button.closest('.notification-item');
                notificationItem.classList.remove('unread');
                notificationItem.classList.add('read');
            });
        });
        
        const deleteButtons = notificationsPanel.querySelectorAll('.delete-notification');
        deleteButtons.forEach(button => {
            button.addEventListener('click', () => {
                const id = parseInt(button.getAttribute('data-id'));
                this.deleteNotification(id);
                
                // Remover item da lista
                const notificationItem = button.closest('.notification-item');
                notificationItem.remove();
                
                // Atualizar badge
                this.updateNotificationBadge();
                
                // Verificar se a lista está vazia
                if (this.notifications.length === 0) {
                    notificationsList.innerHTML = '<p class="no-notifications">Não há notificações.</p>';
                }
            });
        });
        
        const markAllReadButton = notificationsPanel.querySelector('.mark-all-read');
        markAllReadButton.addEventListener('click', () => {
            this.markAllNotificationsAsRead();
            
            // Atualizar UI
            const unreadItems = notificationsPanel.querySelectorAll('.notification-item.unread');
            unreadItems.forEach(item => {
                item.classList.remove('unread');
                item.classList.add('read');
                
                const icon = item.querySelector('.mark-read i');
                if (icon) {
                    icon.classList.remove('fa-envelope');
                    icon.classList.add('fa-envelope-open');
                }
            });
            
            this.updateNotificationBadge();
        });
        
        const clearAllButton = notificationsPanel.querySelector('.clear-all');
        clearAllButton.addEventListener('click', () => {
            this.clearAllNotifications();
            notificationsList.innerHTML = '<p class="no-notifications">Não há notificações.</p>';
            this.updateNotificationBadge();
        });
        
        // Marcar notificações como lidas quando visualizadas
        this.notifications.forEach(notification => {
            if (!notification.read) {
                notification.read = true;
            }
        });
        
        this.updateNotificationBadge();
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
        // Remover notificações existentes
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());
        
        // Criar nova notificação
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 
                           type === 'error' ? 'fa-exclamation-circle' : 
                           'fa-info-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        // Mostrar notificação
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Remover notificação após 3 segundos
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Inicializar o gerenciador de menu quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    const menuManager = new MenuManager();
    menuManager.init();
    
    // Expor o gerenciador globalmente para depuração
    window.menuManager = menuManager;
}); 