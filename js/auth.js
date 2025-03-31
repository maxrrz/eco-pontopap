// Google OAuth Configuration
const googleClientId = '123456789012-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com'; // Fictício para demonstração

import { setupEventListeners } from './main.js';

// Variável para controlar se o login já foi inicializado
let loginInitialized = false;

// Função para mostrar notificações
function showNotification(message, type = 'info') {
    // Função desativada - não mostrar notificações
    return;
}

// Alternar visibilidade da senha
function togglePasswordVisibility(inputId, buttonEl) {
    const input = document.getElementById(inputId);
    const icon = buttonEl.querySelector('i');
    
    if (input && icon) {
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    }
}

// Atualizar interface após login
function updateUserInterface(userData) {
    // Mostrar elementos específicos do usuário
    document.querySelectorAll('.user-only').forEach(el => {
        el.style.display = 'block';
    });
    
    // Ocultar elementos de convidado
    document.querySelectorAll('.guest-only').forEach(el => {
        el.style.display = 'none';
    });
    
    // Atualizar nome do usuário na mensagem de boas-vindas
    document.querySelectorAll('#userName').forEach(el => {
        el.textContent = userData.name;
    });
}

// Processar login bem-sucedido
function handleSuccessfulLogin(userData) {
    // Armazenar dados do usuário no localStorage
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Ocultar painel de login
    const loginPanel = document.getElementById('loginPanel');
    if (loginPanel) {
        loginPanel.style.display = 'none';
    }
    
    // Atualizar informações do usuário no cabeçalho
    const userInfo = document.getElementById('userInfo');
    if (userInfo) {
        userInfo.innerHTML = `
            <img src="${userData.picture}" alt="${userData.name}" class="user-avatar">
            <span class="user-name">${userData.name}</span>
            <button onclick="signOut()" class="sign-out-button">
                <i class="fas fa-sign-out-alt"></i>
            </button>
        `;
        userInfo.style.display = 'flex';
    }
    
    // Atualizar interface após login bem-sucedido
    updateUserInterface(userData);
    
    // Mostrar notificação de boas-vindas
    showNotification(`Bem-vindo, ${userData.name}!`, 'success');
}

// Processar login com email/senha
function handleEmailPasswordLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe')?.checked || false;
    
    // Validação básica
    if (!email || !password) {
        showNotification('Por favor, preencha todos os campos.', 'error');
        return;
    }
    
    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Por favor, insira um email válido.', 'error');
        return;
    }
    
    // Mostrar estado de carregamento
    const submitButton = document.querySelector('#loginForm .login-btn');
    if (submitButton) {
        const originalButtonText = submitButton.textContent;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> A processar...';
        submitButton.disabled = true;
        
        // Simular chamada de API com timeout
        setTimeout(() => {
            // Simular login bem-sucedido
            const userData = {
                name: email.split('@')[0],
                email: email,
                picture: 'https://ui-avatars.com/api/?name=' + encodeURIComponent(email.split('@')[0]) + '&background=0066cc&color=fff',
                provider: 'email'
            };
            
            // Armazenar preferência de "lembrar de mim"
            if (rememberMe) {
                localStorage.setItem('rememberMe', 'true');
                localStorage.setItem('userEmail', email);
            } else {
                localStorage.removeItem('rememberMe');
                localStorage.removeItem('userEmail');
            }
            
            handleSuccessfulLogin(userData);
            
            // Resetar formulário
            const loginForm = document.getElementById('loginForm');
            if (loginForm) loginForm.reset();
            
            // Resetar botão
            submitButton.innerHTML = originalButtonText;
            submitButton.disabled = false;
        }, 1500);
    }
}

// Função para sair
function signOut() {
    // Limpar dados do usuário
    localStorage.removeItem('user');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('rememberMe');
    
    // Redirecionar para a página de login
    window.location.href = 'login.html';
}

// Verificar se o usuário já está logado
function checkAuthStatus() {
    try {
        const userData = localStorage.getItem('user');
        
        if (userData) {
            const user = JSON.parse(userData);
            if (user && user.name && user.email) {
                // Usuário já está logado, esconder painel de login
                const loginPanel = document.getElementById('loginPanel');
                if (loginPanel) {
                    loginPanel.style.display = 'none';
                }
                
                // Atualizar interface com dados do usuário
                updateUserInterface(user);
                
                // Atualizar informações do usuário no cabeçalho
                const userInfo = document.getElementById('userInfo');
                if (userInfo) {
                    userInfo.innerHTML = `
                        <img src="${user.picture}" alt="${user.name}" class="user-avatar">
                        <span class="user-name">${user.name}</span>
                        <button onclick="signOut()" class="sign-out-button">
                            <i class="fas fa-sign-out-alt"></i>
                        </button>
                    `;
                    userInfo.style.display = 'flex';
                }
                
                return true; // Usuário está logado
            }
        }
        
        // Usuário não está logado, mostrar painel de login
        const loginPanel = document.getElementById('loginPanel');
        if (loginPanel) {
            loginPanel.style.display = 'flex';
            
            // Verificar se "lembrar de mim" estava ativado
            if (localStorage.getItem('rememberMe') === 'true') {
                const email = localStorage.getItem('userEmail');
                if (email) {
                    const loginEmail = document.getElementById('loginEmail');
                    const rememberMe = document.getElementById('rememberMe');
                    
                    if (loginEmail) loginEmail.value = email;
                    if (rememberMe) rememberMe.checked = true;
                }
            }
        }
        
        return false; // Usuário não está logado
    } catch (error) {
        console.error('Erro ao verificar status de autenticação:', error);
        localStorage.removeItem('user'); // Limpar dados corrompidos
        return false;
    }
}

// Configurar alternância entre login e registro
function setupLoginRegisterToggle() {
    const showRegisterBtn = document.getElementById('showRegister');
    const showLoginBtn = document.getElementById('showLogin');
    const backToLoginBtn = document.getElementById('backToLogin');
    
    if (showRegisterBtn) {
        showRegisterBtn.addEventListener('click', function() {
            const loginSide = document.querySelector('.login-side');
            const registerSide = document.querySelector('.register-side');
            
            if (loginSide && registerSide) {
                loginSide.style.display = 'none';
                registerSide.style.display = 'block';
                if (backToLoginBtn) backToLoginBtn.style.display = 'block';
            }
        });
    }
    
    if (showLoginBtn) {
        showLoginBtn.addEventListener('click', function() {
            const loginSide = document.querySelector('.login-side');
            const registerSide = document.querySelector('.register-side');
            
            if (loginSide && registerSide) {
                loginSide.style.display = 'block';
                registerSide.style.display = 'none';
                if (backToLoginBtn) backToLoginBtn.style.display = 'none';
            }
        });
    }
    
    if (backToLoginBtn) {
        backToLoginBtn.addEventListener('click', function() {
            const loginSide = document.querySelector('.login-side');
            const registerSide = document.querySelector('.register-side');
            
            if (loginSide && registerSide) {
                loginSide.style.display = 'block';
                registerSide.style.display = 'none';
                backToLoginBtn.style.display = 'none';
            }
        });
    }
}

// Inicializar autenticação
function initializeAuth() {
    if (loginInitialized) {
        console.log('Login já inicializado, ignorando...');
        return; // Evitar inicialização múltipla
    }
    
    console.log('Inicializando autenticação...');
    loginInitialized = true;
    
    // Verificar se o usuário já está logado
    checkAuthStatus();
    
    // Configurar formulário de login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleEmailPasswordLogin);
    }
    
    // Configurar alternância entre login e registro
    setupLoginRegisterToggle();
}

// Inicializar quando o DOM for carregado
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM carregado, inicializando...');
    
    // Inicializar autenticação
    initializeAuth();
    
    // Configurar eventos do menu
    setupEventListeners();
});

// Tornar funções disponíveis globalmente
window.signOut = signOut;
window.togglePasswordVisibility = togglePasswordVisibility;

// Exportar funções para uso em outros módulos
export {
    signOut,
    togglePasswordVisibility,
    showNotification
}; 