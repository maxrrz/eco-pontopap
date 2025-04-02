/**
 * menu-functions.js
 * Implementação das funcionalidades do menu lateral do EcoPonto
 * Inclui gerenciamento de permissões de usuário e acesso às diferentes funcionalidades
 */

import { CONFIG, translations } from './config.js';
import * as helpers from '../src/utils/helpers.js';

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
            case 'install-app':
                this.showInstallInstructions();
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
        // Obter o idioma atual
        const currentLanguage = window.languageState?.currentLanguage || 
                               localStorage.getItem('language') || 
                               'pt';
                               
        // Definir notificações de acordo com o idioma selecionado
        const notificationsContent = {
            pt: [
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
            ],
            en: [
                {
                    id: 1,
                    title: 'Yellow Ecopoint',
                    message: 'The yellow ecopoint is almost full (85%).',
                    type: 'warning',
                    timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
                    read: false
                },
                {
                    id: 2,
                    title: 'Scheduled Maintenance',
                    message: 'Maintenance scheduled for tomorrow at 10:00.',
                    type: 'info',
                    timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
                    read: false
                },
                {
                    id: 3,
                    title: 'Collection Completed',
                    message: 'Green ecopoint collection successfully completed.',
                    type: 'success',
                    timestamp: new Date(Date.now() - 24 * 3600000).toISOString(),
                    read: true
                }
            ],
            de: [
                {
                    id: 1,
                    title: 'Gelber Recyclingbehälter',
                    message: 'Der gelbe Recyclingbehälter ist fast voll (85%).',
                    type: 'warning',
                    timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
                    read: false
                },
                {
                    id: 2,
                    title: 'Geplante Wartung',
                    message: 'Wartung für morgen um 10:00 Uhr geplant.',
                    type: 'info',
                    timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
                    read: false
                },
                {
                    id: 3,
                    title: 'Sammlung Abgeschlossen',
                    message: 'Sammlung des grünen Recyclingbehälters erfolgreich abgeschlossen.',
                    type: 'success',
                    timestamp: new Date(Date.now() - 24 * 3600000).toISOString(),
                    read: true
                }
            ],
            ja: [
                {
                    id: 1,
                    title: '黄色のエコポイント',
                    message: '黄色のエコポイントがほぼ満杯です（85％）。',
                    type: 'warning',
                    timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
                    read: false
                },
                {
                    id: 2,
                    title: '予定されたメンテナンス',
                    message: '明日の10時にメンテナンスが予定されています。',
                    type: 'info',
                    timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
                    read: false
                },
                {
                    id: 3,
                    title: '収集完了',
                    message: '緑のエコポイントの収集が正常に完了しました。',
                    type: 'success',
                    timestamp: new Date(Date.now() - 24 * 3600000).toISOString(),
                    read: true
                }
            ],
            zh: [
                {
                    id: 1,
                    title: '黄色回收点',
                    message: '黄色回收点几乎已满（85％）。',
                    type: 'warning',
                    timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
                    read: false
                },
                {
                    id: 2,
                    title: '计划维护',
                    message: '明天10:00计划进行维护。',
                    type: 'info',
                    timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
                    read: false
                },
                {
                    id: 3,
                    title: '收集完成',
                    message: '绿色回收点收集成功完成。',
                    type: 'success',
                    timestamp: new Date(Date.now() - 24 * 3600000).toISOString(),
                    read: true
                }
            ]
        };
        
        // Usar notificações do idioma atual ou cair para português se o idioma não tiver traduções
        this.notifications = notificationsContent[currentLanguage] || notificationsContent.pt;
        
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
            // Obter o idioma atual
            const currentLanguage = window.languageState?.currentLanguage || 
                                   localStorage.getItem('language') || 
                                   'pt';
            
            // Função para obter texto traduzido
            const getTranslatedText = (key, defaultText) => {
                if (window.translations && window.translations[currentLanguage] && window.translations[currentLanguage][key]) {
                    return window.translations[currentLanguage][key];
                }
                return defaultText;
            };
            
            // Textos traduzidos
            const texts = {
                notificationsTitle: getTranslatedText('notifications', 'Notificações'),
                noNotifications: getTranslatedText('noNotifications', 'Não há notificações.'),
                markAsRead: getTranslatedText('markAsRead', 'Marcar como lida'),
                deleteNotification: getTranslatedText('deleteNotification', 'Excluir'),
                markAllAsRead: getTranslatedText('markAllAsRead', 'Marcar todas como lidas'),
                clearAll: getTranslatedText('clearAll', 'Limpar todas')
            };
            
            // Criar painel de notificações
            const notificationsPanel = document.createElement('div');
            notificationsPanel.className = 'notifications-panel';
            
            // Criar cabeçalho
            const header = document.createElement('div');
            header.className = 'notifications-header';
            header.innerHTML = `
                <h3>${texts.notificationsTitle}</h3>
                <button class="close-notifications">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            // Criar lista de notificações
            const notificationsList = document.createElement('div');
            notificationsList.className = 'notifications-list';
            
            if (this.notifications.length === 0) {
                notificationsList.innerHTML = `<p class="no-notifications">${texts.noNotifications}</p>`;
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
                    
                    // Format the timestamp using the helper function
                    const formattedDate = helpers.formatDateTime(new Date(notification.timestamp));
                    
                    notificationItem.innerHTML = `
                        <div class="notification-icon ${notification.type}">
                            <i class="${iconClass}"></i>
                        </div>
                        <div class="notification-content">
                            <div class="notification-title">${notification.title}</div>
                            <div class="notification-message">${notification.message}</div>
                            <div class="notification-date">${formattedDate}</div>
                        </div>
                        <div class="notification-actions">
                            ${!notification.read ? `<button class="mark-read" title="${texts.markAsRead}"><i class="fas fa-check"></i></button>` : ''}
                            <button class="delete-notification" title="${texts.deleteNotification}"><i class="fas fa-trash"></i></button>
                        </div>
                    `;
                    
                    notificationsList.appendChild(notificationItem);
                });
            }
            
            // Criar rodapé
            const footer = document.createElement('div');
            footer.className = 'notifications-footer';
            footer.innerHTML = `
                <button class="mark-all-read">${texts.markAllAsRead}</button>
                <button class="clear-all">${texts.clearAll}</button>
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
                    const notificationItem = button.closest('.notification-item');
                    const id = parseInt(notificationItem.getAttribute('data-id'));
                    
                    // Atualizar o objeto de notificação
                    const notification = this.notifications.find(n => n.id === id);
                    if (notification) {
                        notification.read = true;
                    }
                    
                    // Atualizar UI
                    notificationItem.classList.remove('unread');
                    notificationItem.classList.add('read');
                    button.remove();
                    
                    // Atualizar o badge
                    this.updateNotificationBadge();
                });
            });
            
            // Adicionar event listeners para excluir
            const deleteButtons = notificationsPanel.querySelectorAll('.delete-notification');
            deleteButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    const notificationItem = button.closest('.notification-item');
                    const id = parseInt(notificationItem.getAttribute('data-id'));
                    
                    // Atualizar o array de notificações
                    this.notifications = this.notifications.filter(n => n.id !== id);
                    
                    // Remover visualmente
                    notificationItem.classList.add('removing');
                    setTimeout(() => {
                        notificationItem.remove();
                        
                        // Verificar se ainda há notificações
                        if (this.notifications.length === 0) {
                            notificationsList.innerHTML = `<p class="no-notifications">${texts.noNotifications}</p>`;
                        }
                        
                        // Atualizar o badge
                        this.updateNotificationBadge();
                    }, 300);
                });
            });
            
            // Adicionar event listener para marcar todas como lidas
            const markAllReadButton = notificationsPanel.querySelector('.mark-all-read');
            markAllReadButton.addEventListener('click', () => {
                // Atualizar todos os objetos
                this.notifications.forEach(notification => {
                    notification.read = true;
                });
                
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
                
                // Atualizar o badge
                this.updateNotificationBadge();
            });
            
            // Adicionar event listener para limpar todas
            const clearAllButton = notificationsPanel.querySelector('.clear-all');
            clearAllButton.addEventListener('click', () => {
                // Limpar array
                this.notifications = [];
                
                // Atualizar UI
                notificationsList.innerHTML = `<p class="no-notifications">${texts.noNotifications}</p>`;
                
                // Atualizar o badge
                this.updateNotificationBadge();
            });
        } catch (error) {
            console.error('Erro ao mostrar notificações:', error);
            this.showNotification('Ocorreu um erro ao mostrar as notificações. Por favor, tente novamente.', 'error');
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

    // Mostrar gráficos
    showCharts() {
        console.log('Abrindo página de gráficos');
        this.showNotification('Abrindo página de gráficos...', 'info');
        
        // Obter o idioma atual
        const currentLanguage = window.languageState?.currentLanguage || 
                               localStorage.getItem('language') || 
                               'pt';
        
        // Abrir a página de gráficos preservando o idioma atual
        window.location.href = `charts.html?lang=${currentLanguage}`;
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
                        <option value="de" ${this.currentLanguage === 'de' ? 'selected' : ''}>Deutsch</option>
                        <option value="ja" ${this.currentLanguage === 'ja' ? 'selected' : ''}>日本語</option>
                        <option value="zh" ${this.currentLanguage === 'zh' ? 'selected' : ''}>中文</option>
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
        console.log('Mostrando perfil do usuário');
        
        try {
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
            
            // Remover painel de perfil anterior se existir
            let existingPanel = document.querySelector('.user-profile-panel');
            if (existingPanel) {
                existingPanel.remove();
            }
            
            // Remover overlay anterior se existir
            let existingOverlay = document.querySelector('.user-profile-overlay');
            if (existingOverlay) {
                existingOverlay.remove();
            }
            
            // Criar overlay
            const overlay = document.createElement('div');
            overlay.className = 'user-profile-overlay';
            document.body.appendChild(overlay);
            
            // Obter dados do usuário do localStorage
            let userData = {
                name: 'Max',
                email: 'tgei@exemplo.com',
                picture: null,
                role: 'viewer'
            };
            
            try {
                const storedUserData = localStorage.getItem('ecoponto_user_data');
                if (storedUserData) {
                    const parsedData = JSON.parse(storedUserData);
                    userData = { ...userData, ...parsedData };
                }
            } catch (e) {
                console.error('Erro ao carregar dados do usuário:', e);
            }
            
            // Criar painel de perfil
            const profilePanel = document.createElement('div');
            profilePanel.className = 'user-profile-panel';
            
            // Adicionar classe para tema escuro se aplicável
            if (localStorage.getItem('theme') === 'dark') {
                profilePanel.classList.add('dark-mode');
            }
            
            // Criar cabeçalho do perfil
            const header = document.createElement('div');
            header.className = 'user-profile-header';
            
            // Criar imagem de perfil
            const pictureContainer = document.createElement('div');
            pictureContainer.className = 'user-profile-picture-container';
            
            const picture = document.createElement('img');
            picture.className = 'user-profile-picture';
            picture.src = userData.picture || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(userData.name) + '&background=random';
            picture.alt = 'Foto de Perfil';
            pictureContainer.appendChild(picture);
            
            // Adicionar botão para editar foto
            const editPictureBtn = document.createElement('button');
            editPictureBtn.className = 'edit-profile-picture-btn';
            editPictureBtn.innerHTML = '<i class="fas fa-camera"></i>';
            pictureContainer.appendChild(editPictureBtn);
            
            // Adicionar evento para editar foto
            editPictureBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this._showProfilePictureUpload();
            });
            
            // Criar informações do usuário
            const userInfo = document.createElement('div');
            userInfo.className = 'user-profile-info';
            userInfo.innerHTML = `
                <h3>${userData.name}</h3>
                <p>${userData.email}</p>
                <span class="user-role">${this._getRoleName(userData.role)}</span>
            `;
            
            // Adicionar elementos ao cabeçalho
            header.appendChild(pictureContainer);
            header.appendChild(userInfo);
            
            // Botão para fechar
            const closeButton = document.createElement('button');
            closeButton.className = 'close-profile-btn';
            closeButton.innerHTML = '<i class="fas fa-times"></i>';
            header.appendChild(closeButton);
            
            // Criar conteúdo do perfil
            const content = document.createElement('div');
            content.className = 'user-profile-content';
            
            // Opções do perfil
            const optionsList = document.createElement('div');
            optionsList.className = 'profile-options-list';
            
            // Definir opções
            const options = [
                { id: 'edit-info', icon: 'fa-user-edit', text: 'Editar informações pessoais' },
                { id: 'change-password', icon: 'fa-key', text: 'Alterar palavra-passe' },
                { id: 'export-data', icon: 'fa-download', text: 'Exportar os meus dados' },
                { id: 'preferences', icon: 'fa-sliders-h', text: 'Preferências' },
                { id: 'logout', icon: 'fa-sign-out-alt', text: 'Terminar sessão' }
            ];
            
            // Adicionar opções à lista
            options.forEach(option => {
                const optionItem = document.createElement('div');
                optionItem.className = 'profile-option-item';
                optionItem.dataset.optionId = option.id;
                optionItem.innerHTML = `
                    <div class="option-icon">
                        <i class="fas ${option.icon}"></i>
                    </div>
                    <div class="option-text">${option.text}</div>
                    <div class="option-arrow">
                        <i class="fas fa-chevron-right"></i>
                    </div>
                `;
                optionsList.appendChild(optionItem);
                
                // Adicionar evento de clique
                optionItem.addEventListener('click', () => {
                    this._handleProfileOptionClick(option.id);
                });
            });
            
            // Adicionar lista de opções ao conteúdo
            content.appendChild(optionsList);
            
            // Adicionar versão do aplicativo
            const versionInfo = document.createElement('div');
            versionInfo.className = 'version-info';
            versionInfo.textContent = 'Versão 1.0.0';
            content.appendChild(versionInfo);
            
            // Montar o painel
            profilePanel.appendChild(header);
            profilePanel.appendChild(content);
            
            // Adicionar o painel ao DOM
            document.body.appendChild(profilePanel);
            
            // Adicionar estilos CSS programaticamente
            this._addUserProfileStyles();
            
            // Adicionar event listeners
            closeButton.addEventListener('click', () => {
                profilePanel.classList.add('closing');
                overlay.classList.add('closing');
                
                setTimeout(() => {
                    profilePanel.remove();
                    overlay.remove();
                }, 300);
            });
            
            overlay.addEventListener('click', () => {
                profilePanel.classList.add('closing');
                overlay.classList.add('closing');
                
                setTimeout(() => {
                    profilePanel.remove();
                    overlay.remove();
                }, 300);
            });
            
            // Animar a entrada do painel
            setTimeout(() => {
                profilePanel.classList.add('active');
                overlay.classList.add('active');
            }, 10);
            
            console.log('Perfil do usuário apresentado com sucesso');
        } catch (error) {
            console.error('Erro ao mostrar perfil do usuário:', error);
            alert('Ocorreu um erro ao mostrar o perfil do usuário. Por favor, tente novamente.');
        }
    }
    
    // Método auxiliar para obter o nome do papel/função do usuário
    _getRoleName(role) {
        const roleNames = {
            'viewer': 'Visualizador',
            'operator': 'Operador',
            'municipality': 'Município',
            'admin': 'Administrador'
        };
        
        return roleNames[role] || 'Utilizador';
    }
    
    // Método para lidar com cliques nas opções do perfil
    _handleProfileOptionClick(optionId) {
        console.log(`Opção de perfil clicada: ${optionId}`);
        
        switch (optionId) {
            case 'edit-info':
                alert('Funcionalidade de editar informações em desenvolvimento');
                break;
            case 'change-password':
                alert('Funcionalidade de alterar palavra-passe em desenvolvimento');
                break;
            case 'export-data':
                alert('Funcionalidade de exportar dados em desenvolvimento');
                break;
            case 'preferences':
                this.showSettings();
                // Fechar o painel de perfil
                const profilePanel = document.querySelector('.user-profile-panel');
                const overlay = document.querySelector('.user-profile-overlay');
                if (profilePanel && overlay) {
                    profilePanel.remove();
                    overlay.remove();
                }
                break;
            case 'logout':
                if (confirm('Tem certeza que deseja terminar a sessão?')) {
                    this.logout();
                    // Fechar o painel de perfil
                    const profilePanel = document.querySelector('.user-profile-panel');
                    const overlay = document.querySelector('.user-profile-overlay');
                    if (profilePanel && overlay) {
                        profilePanel.remove();
                        overlay.remove();
                    }
                }
                break;
            default:
                alert('Funcionalidade em desenvolvimento');
        }
    }
    
    // Método para adicionar estilos CSS do perfil de usuário
    _addUserProfileStyles() {
        // Remover estilos existentes se houver
        const existingStyles = document.getElementById('user-profile-styles');
        if (existingStyles) {
            existingStyles.remove();
        }
        
        // Criar elemento de estilo
        const styleElement = document.createElement('style');
        styleElement.id = 'user-profile-styles';
        
        // Definir os estilos CSS
        styleElement.textContent = `
            .user-profile-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                z-index: 1000;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .user-profile-overlay.active {
                opacity: 1;
            }
            
            .user-profile-overlay.closing {
                opacity: 0;
            }
            
            .user-profile-panel {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) scale(0.9);
                width: 90%;
                max-width: 400px;
                background-color: #fff;
                border-radius: 12px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
                z-index: 1001;
                overflow: hidden;
                opacity: 0;
                transition: all 0.3s ease;
            }
            
            .user-profile-panel.active {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1);
            }
            
            .user-profile-panel.closing {
                opacity: 0;
                transform: translate(-50%, -50%) scale(0.9);
            }
            
            .user-profile-panel.dark-mode {
                background-color: #222;
                color: #fff;
            }
            
            .user-profile-header {
                padding: 20px;
                display: flex;
                align-items: center;
                position: relative;
                border-bottom: 1px solid rgba(0, 0, 0, 0.1);
            }
            
            .dark-mode .user-profile-header {
                border-bottom-color: rgba(255, 255, 255, 0.1);
            }
            
            .user-profile-picture-container {
                position: relative;
                width: 70px;
                height: 70px;
                margin-right: 15px;
                border-radius: 50%;
                overflow: hidden;
                background-color: #f0f0f0;
                border: 3px solid #fff;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                aspect-ratio: 1/1;
            }
            
            .user-profile-picture {
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: 50%;
            }
            
            .edit-profile-picture-btn {
                position: absolute;
                bottom: 0;
                right: 0;
                width: 28px;
                height: 28px;
                background-color: #0066cc;
                color: white;
                border: none;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
            }
            
            .user-profile-info {
                flex: 1;
            }
            
            .user-profile-info h3 {
                margin: 0 0 5px 0;
                font-size: 1.2rem;
                font-weight: 600;
            }
            
            .user-profile-info p {
                margin: 0 0 5px 0;
                font-size: 0.9rem;
                color: #666;
                word-break: break-all;
            }
            
            .dark-mode .user-profile-info p {
                color: #aaa;
            }
            
            .user-role {
                display: inline-block;
                font-size: 0.8rem;
                padding: 2px 8px;
                background-color: #e6f2ff;
                color: #0066cc;
                border-radius: 20px;
            }
            
            .dark-mode .user-role {
                background-color: #0d3b66;
                color: #a3d5ff;
            }
            
            .close-profile-btn {
                position: absolute;
                top: 15px;
                right: 15px;
                width: 30px;
                height: 30px;
                background: none;
                border: none;
                color: #666;
                font-size: 1.2rem;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: background-color 0.2s;
            }
            
            .close-profile-btn:hover {
                background-color: rgba(0, 0, 0, 0.05);
            }
            
            .dark-mode .close-profile-btn {
                color: #ddd;
            }
            
            .dark-mode .close-profile-btn:hover {
                background-color: rgba(255, 255, 255, 0.1);
            }
            
            .user-profile-content {
                padding: 15px;
            }
            
            .profile-options-list {
                margin-bottom: 20px;
            }
            
            .profile-option-item {
                display: flex;
                align-items: center;
                padding: 12px 10px;
                border-radius: 8px;
                cursor: pointer;
                transition: background-color 0.2s;
            }
            
            .profile-option-item:hover {
                background-color: rgba(0, 0, 0, 0.05);
            }
            
            .dark-mode .profile-option-item:hover {
                background-color: rgba(255, 255, 255, 0.1);
            }
            
            .option-icon {
                width: 36px;
                height: 36px;
                border-radius: 8px;
                background-color: #e6f2ff;
                color: #0066cc;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 15px;
            }
            
            .dark-mode .option-icon {
                background-color: #0d3b66;
                color: #a3d5ff;
            }
            
            .option-text {
                flex: 1;
                font-size: 0.95rem;
            }
            
            .option-arrow {
                color: #ccc;
                font-size: 0.8rem;
            }
            
            .dark-mode .option-arrow {
                color: #666;
            }
            
            .version-info {
                text-align: center;
                font-size: 0.8rem;
                color: #999;
                margin-top: 20px;
            }
            
            .dark-mode .version-info {
                color: #666;
            }
            
            @media (max-width: 480px) {
                .user-profile-panel {
                    width: 100%;
                    max-width: none;
                    height: 100%;
                    border-radius: 0;
                    top: 0;
                    left: 0;
                    transform: translateY(100%);
                }
                
                .user-profile-panel.active {
                    transform: translateY(0);
                }
                
                .user-profile-panel.closing {
                    transform: translateY(100%);
                }
                
                .user-profile-content {
                    height: calc(100% - 110px);
                    overflow-y: auto;
                }
            }
        `;
        
        // Adicionar estilos ao head do documento
        document.head.appendChild(styleElement);
        
        console.log('Estilos CSS para o perfil de usuário adicionados com sucesso');
    }
    
    // Método para mostrar upload de foto de perfil
    _showProfilePictureUpload() {
        console.log('Mostrando upload de foto de perfil');
        
        // Criar overlay para o upload
        const uploadOverlay = document.createElement('div');
        uploadOverlay.className = 'profile-picture-upload-overlay';
        
        // Criar formulário de upload
        const uploadForm = document.createElement('div');
        uploadForm.className = 'profile-picture-upload-form';
        
        // Adicionar classe para tema escuro se aplicável
        if (localStorage.getItem('theme') === 'dark') {
            uploadForm.classList.add('dark-mode');
        }
        
        // Criar cabeçalho
        const formHeader = document.createElement('div');
        formHeader.className = 'upload-form-header';
        formHeader.innerHTML = '<h3>Alterar Foto de Perfil</h3>';
        
        // Criar área de preview
        const previewArea = document.createElement('div');
        previewArea.className = 'picture-preview-area';
        
        // Buscar foto atual do usuário
        let currentPicture = 'https://ui-avatars.com/api/?name=User&background=random';
        try {
            const storedUserData = localStorage.getItem('ecoponto_user_data');
            if (storedUserData) {
                const userData = JSON.parse(storedUserData);
                if (userData.picture) {
                    currentPicture = userData.picture;
                } else if (userData.name) {
                    currentPicture = `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=random`;
                }
            }
        } catch (e) {
            console.error('Erro ao obter foto atual:', e);
        }
        
        // Criar imagem para preview
        const previewImage = document.createElement('img');
        previewImage.className = 'picture-preview';
        previewImage.src = currentPicture;
        previewImage.alt = 'Preview da foto de perfil';
        previewArea.appendChild(previewImage);
        
        // Criar input para upload de arquivo
        const fileInputLabel = document.createElement('label');
        fileInputLabel.className = 'file-input-label';
        fileInputLabel.htmlFor = 'profile-picture-file';
        fileInputLabel.innerHTML = '<i class="fas fa-camera"></i> Selecionar imagem';
        
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.id = 'profile-picture-file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';
        
        // Criar área de botões
        const buttonArea = document.createElement('div');
        buttonArea.className = 'upload-button-area';
        
        // Botão de cancelar
        const cancelButton = document.createElement('button');
        cancelButton.className = 'cancel-upload-btn';
        cancelButton.textContent = 'Cancelar';
        
        // Botão de salvar
        const saveButton = document.createElement('button');
        saveButton.className = 'save-picture-btn';
        saveButton.textContent = 'Salvar';
        saveButton.disabled = true; // Inicialmente desativado
        
        // Adicionar elementos ao formulário
        buttonArea.appendChild(cancelButton);
        buttonArea.appendChild(saveButton);
        
        uploadForm.appendChild(formHeader);
        uploadForm.appendChild(previewArea);
        uploadForm.appendChild(fileInputLabel);
        uploadForm.appendChild(fileInput);
        uploadForm.appendChild(buttonArea);
        
        // Adicionar elementos ao DOM
        uploadOverlay.appendChild(uploadForm);
        document.body.appendChild(uploadOverlay);
        
        // Variável para armazenar a nova imagem
        let newImageData = null;
        
        // Adicionar event listeners
        fileInput.addEventListener('change', (e) => {
            if (e.target.files && e.target.files[0]) {
                const reader = new FileReader();
                
                reader.onload = (e) => {
                    // Atualizar preview
                    previewImage.src = e.target.result;
                    
                    // Armazenar dados da imagem
                    newImageData = e.target.result;
                    
                    // Habilitar botão de salvar
                    saveButton.disabled = false;
                };
                
                reader.readAsDataURL(e.target.files[0]);
            }
        });
        
        // Evento para cancelar upload
        cancelButton.addEventListener('click', () => {
            uploadOverlay.remove();
        });
        
        // Evento para salvar nova foto
        saveButton.addEventListener('click', () => {
            if (newImageData) {
                // Salvar nova foto no localStorage
                try {
                    const storedUserData = localStorage.getItem('ecoponto_user_data');
                    let userData = {};
                    
                    if (storedUserData) {
                        userData = JSON.parse(storedUserData);
                    }
                    
                    // Atualizar foto
                    userData.picture = newImageData;
                    
                    // Salvar dados atualizados
                    localStorage.setItem('ecoponto_user_data', JSON.stringify(userData));
                    
                    // Atualizar foto no painel de perfil
                    const profilePicture = document.querySelector('.user-profile-picture');
                    if (profilePicture) {
                        profilePicture.src = newImageData;
                    }
                    
                    console.log('Foto de perfil atualizada com sucesso');
                } catch (e) {
                    console.error('Erro ao salvar nova foto:', e);
                    alert('Ocorreu um erro ao salvar a foto. Por favor, tente novamente.');
                }
            }
            
            // Fechar overlay
            uploadOverlay.remove();
        });
        
        // Evento para fechar ao clicar fora do formulário
        uploadOverlay.addEventListener('click', (e) => {
            if (e.target === uploadOverlay) {
                uploadOverlay.remove();
            }
        });
        
        // Impedir propagação de cliques no formulário
        uploadForm.addEventListener('click', (e) => {
            e.stopPropagation();
        });
        
        // Adicionar estilos CSS
        const styleElement = document.createElement('style');
        styleElement.id = 'profile-picture-upload-styles';
        styleElement.textContent = `
            .profile-picture-upload-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.7);
                z-index: 1100;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .profile-picture-upload-form {
                width: 90%;
                max-width: 350px;
                background-color: #fff;
                border-radius: 12px;
                padding: 20px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
            }
            
            .profile-picture-upload-form.dark-mode {
                background-color: #222;
                color: #fff;
            }
            
            .upload-form-header {
                text-align: center;
                margin-bottom: 20px;
            }
            
            .upload-form-header h3 {
                margin: 0;
                font-size: 1.2rem;
                font-weight: 600;
            }
            
            .picture-preview-area {
                width: 150px;
                height: 150px;
                margin: 0 auto 20px;
                border-radius: 50%;
                overflow: hidden;
                border: 3px solid #fff;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                background-color: #f0f0f0;
            }
            
            .picture-preview {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
            
            .file-input-label {
                display: block;
                background-color: #e6f2ff;
                color: #0066cc;
                padding: 10px;
                text-align: center;
                border-radius: 8px;
                margin-bottom: 20px;
                cursor: pointer;
                transition: background-color 0.2s;
            }
            
            .dark-mode .file-input-label {
                background-color: #0d3b66;
                color: #a3d5ff;
            }
            
            .file-input-label:hover {
                background-color: #d1e8ff;
            }
            
            .dark-mode .file-input-label:hover {
                background-color: #164b7e;
            }
            
            .upload-button-area {
                display: flex;
                justify-content: space-between;
                gap: 10px;
            }
            
            .cancel-upload-btn, .save-picture-btn {
                flex: 1;
                padding: 10px;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 500;
                transition: background-color 0.2s;
            }
            
            .cancel-upload-btn {
                background-color: #f2f2f2;
                color: #666;
            }
            
            .dark-mode .cancel-upload-btn {
                background-color: #333;
                color: #ddd;
            }
            
            .save-picture-btn {
                background-color: #0066cc;
                color: white;
            }
            
            .save-picture-btn:disabled {
                background-color: #99bfe0;
                cursor: not-allowed;
            }
            
            .dark-mode .save-picture-btn:disabled {
                background-color: #2a4c6d;
            }
            
            .cancel-upload-btn:hover {
                background-color: #e6e6e6;
            }
            
            .dark-mode .cancel-upload-btn:hover {
                background-color: #444;
            }
            
            .save-picture-btn:hover:not(:disabled) {
                background-color: #0055aa;
            }
        `;
        
        // Adicionar estilos ao head do documento
        document.head.appendChild(styleElement);
        
        console.log('Upload de foto de perfil mostrado com sucesso');
    }

    // Mostrar instruções de instalação
    showInstallInstructions() {
        console.log('Mostrando instruções de instalação do myEcoponto');
        
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
        
        // Remover painel de instalação anterior se existir
        let existingPanel = document.querySelector('.install-panel');
        if (existingPanel) {
            existingPanel.remove();
        }
        
        // Remover overlay anterior se existir
        let existingOverlay = document.querySelector('.install-overlay');
        if (existingOverlay) {
            existingOverlay.remove();
        }
        
        // Obter o idioma atual
        const currentLanguage = window.languageState?.currentLanguage || 
                                localStorage.getItem('language') || 
                                'pt';
        
        // Função para obter texto traduzido
        const getTranslatedText = (key, defaultText) => {
            if (window.translations && window.translations[currentLanguage] && window.translations[currentLanguage][key]) {
                return window.translations[currentLanguage][key];
            }
            return defaultText;
        };
        
        // Detecção de dispositivo e navegador mais precisa
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        
        // Verificar se é iOS (iPhone ou iPad)
        const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
        
        // Verificar se é Android
        const isAndroid = /android/i.test(userAgent);
        
        // Verificar se é navegador Safari no iOS
        const isSafari = isIOS && /Safari/i.test(userAgent) && !/CriOS/i.test(userAgent) && !/FxiOS/i.test(userAgent);
        
        // Verificar se é Chrome
        const isChrome = /Chrome/i.test(userAgent) && !isIOS && !/Edge/i.test(userAgent);
        
        // Determinar qual conjunto de instruções mostrar
        let browserName = 'Google Chrome';
        let deviceType = 'desktop';
        
        if (isIOS) {
            browserName = 'Safari';
            deviceType = 'ios';
        } else if (isAndroid) {
            browserName = 'Chrome';
            deviceType = 'android';
        }
        
        // Obter textos traduzidos
        const texts = {
            modalTitle: getTranslatedText('installAppModalTitle', 'Instalar a aplicação do myEcoponto'),
            description: getTranslatedText('installAppNote', 'Os seus dados de monitorização favoritos na ponta dos seus dedos. Acesso rápido. Notificações instantâneas. Tudo o que adora, ainda melhor.'),
            
            // iOS
            iosStep1: getTranslatedText('installAppIOSStep1', 'Abra o myEcoponto no navegador Safari do teu iPhone.'),
            iosStep2: getTranslatedText('installAppIOSStep2', 'Toque no botão "Partilhar" na barra de navegação.'),
            iosStep3: getTranslatedText('installAppIOSStep3', 'Deslize para baixo e pressione em "Adicionar ao Ecrã Inicial".'),
            
            // Android
            androidStep1: getTranslatedText('installAppAndroidStep1', 'Abra o myEcoponto no navegador Chrome no seu dispositivo Android.'),
            androidStep2: getTranslatedText('installAppAndroidStep2', 'Toque no menu (três pontos) no canto superior direito.'),
            androidStep3: getTranslatedText('installAppAndroidStep3', 'Selecione "Adicionar à tela inicial" ou "Instalar aplicação".'),
            androidStep4: getTranslatedText('installAppAndroidStep3', 'Confirme a instalação tocando em "Adicionar" ou "Instalar".'),
            
            // Desktop
            desktopStep1: getTranslatedText('installAppGenericStep1', 'Abra o myEcoponto no navegador Chrome.'),
            desktopStep2: getTranslatedText('installAppDesktopStep1', 'Clique no ícone de instalação na barra de endereço.'),
            desktopStep3: getTranslatedText('installAppDesktopStep2', 'Confirme a instalação clicando em "Instalar".')
        };
        
        // Criar overlay
        const overlay = document.createElement('div');
        overlay.className = 'install-overlay';
        document.body.appendChild(overlay);
        
        // Criar painel de instalação
        const installPanel = document.createElement('div');
        installPanel.className = 'install-panel';
        
        // Criar cabeçalho
        const header = document.createElement('div');
        header.className = 'install-header';
        header.innerHTML = `
            <h3>${texts.modalTitle}</h3>
            <button class="close-install">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Criar conteúdo
        const content = document.createElement('div');
        content.className = 'install-content';
        
        // Descrição
        const description = document.createElement('div');
        description.className = 'install-description';
        description.innerHTML = texts.description;
        
        // Título do browser
        const browserTitle = document.createElement('h3');
        browserTitle.style.textAlign = 'center';
        browserTitle.style.margin = '20px 0 10px';
        browserTitle.textContent = browserName;
        
        // Passos de instalação
        const steps = document.createElement('div');
        steps.className = 'install-steps';
        
        if (deviceType === 'ios') {
            steps.innerHTML = `
                <div class="install-step">
                    <div class="step-number">1</div>
                    <div class="step-content">
                        <div class="step-instruction">${texts.iosStep1}</div>
                        <div class="step-image-container">
                            <img src="int/ios/1.png" alt="Instruções de instalação iOS - Passo 1" class="step-image">
                        </div>
                    </div>
                </div>
                
                <div class="install-step">
                    <div class="step-number">2</div>
                    <div class="step-content">
                        <div class="step-instruction">${texts.iosStep2}</div>
                        <div class="step-image-container">
                            <img src="int/ios/2.png" alt="Instruções de instalação iOS - Passo 2" class="step-image">
                        </div>
                    </div>
                </div>
                
                <div class="install-step">
                    <div class="step-number">3</div>
                    <div class="step-content">
                        <div class="step-instruction">${texts.iosStep3}</div>
                        <div class="step-image-container">
                            <img src="int/ios/3.png" alt="Instruções de instalação iOS - Passo 3" class="step-image">
                        </div>
                    </div>
                </div>
            `;
        } else if (deviceType === 'android') {
            steps.innerHTML = `
                <div class="install-step">
                    <div class="step-number">1</div>
                    <div class="step-content">
                        <div class="step-instruction">${texts.androidStep1}</div>
                        <div class="step-image-container">
                            <img src="int/android/1.png" alt="Instruções de instalação Android - Passo 1" class="step-image">
                        </div>
                    </div>
                </div>
                
                <div class="install-step">
                    <div class="step-number">2</div>
                    <div class="step-content">
                        <div class="step-instruction">${texts.androidStep2}</div>
                        <div class="step-image-container">
                            <img src="int/android/2.png" alt="Instruções de instalação Android - Passo 2" class="step-image">
                        </div>
                    </div>
                </div>
                
                <div class="install-step">
                    <div class="step-number">3</div>
                    <div class="step-content">
                        <div class="step-instruction">${texts.androidStep3}</div>
                        <div class="step-image-container">
                            <img src="int/android/3.png" alt="Instruções de instalação Android - Passo 3" class="step-image">
                        </div>
                    </div>
                </div>
                
                <div class="install-step">
                    <div class="step-number">4</div>
                    <div class="step-content">
                        <div class="step-instruction">${texts.androidStep4}</div>
                    </div>
                </div>
            `;
        } else {
            steps.innerHTML = `
                <div class="install-step">
                    <div class="step-number">1</div>
                    <div class="step-content">
                        <div class="step-instruction">${texts.desktopStep1}</div>
                        <div class="step-image-container">
                            <img src="int/win/1.png" alt="Instruções de instalação - Passo 1" class="step-image">
                        </div>
                    </div>
                </div>
                
                <div class="install-step">
                    <div class="step-number">2</div>
                    <div class="step-content">
                        <div class="step-instruction">${texts.desktopStep2}</div>
                        <div class="step-image-container">
                            <img src="int/win/2.png" alt="Instruções de instalação - Passo 2" class="step-image">
                        </div>
                    </div>
                </div>
                
                <div class="install-step">
                    <div class="step-number">3</div>
                    <div class="step-content">
                        <div class="step-instruction">${texts.desktopStep3}</div>
                    </div>
                </div>
            `;
        }
        
        // Montar o painel
        content.appendChild(description);
        content.appendChild(browserTitle);
        content.appendChild(steps);
        
        installPanel.appendChild(header);
        installPanel.appendChild(content);
        
        // Adicionar o painel ao DOM
        document.body.appendChild(installPanel);
        
        // Adicionar event listener para fechar o painel
        const closeButton = installPanel.querySelector('.close-install');
        closeButton.addEventListener('click', () => {
            installPanel.remove();
            overlay.remove();
        });
        
        // Adicionar event listener para fechar ao clicar no overlay
        overlay.addEventListener('click', () => {
            installPanel.remove();
            overlay.remove();
        });
    }

    // Atualizar idioma das notificações quando o idioma é alterado
    updateNotificationsLanguage() {
        this.setupNotifications();
    }
}

// Inicializar o gerenciador de menu quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    const menuManager = new MenuManager();
    menuManager.init();
    
    // Expor o gerenciador globalmente para depuração
    window.menuManager = menuManager;
}); 