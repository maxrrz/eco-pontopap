// Funções globais para autenticação
let isAuthInitialized = false;

// Inicializar autenticação
function initAuth() {
    if (isAuthInitialized) return;
    
    // Verificar se o usuário está logado
    const userData = localStorage.getItem('user');
    if (userData) {
        // Usuário logado, ocultar painel de login
        updateUserInterface(JSON.parse(userData));
        document.getElementById('loginPanel').style.display = 'none';
    } else {
        // Usuário não logado, exibir painel de login
        document.getElementById('loginPanel').style.display = 'flex';
    }
    
    // Adicionar event listeners
    setupEventListeners();
    
    isAuthInitialized = true;
}

// Configurar event listeners
function setupEventListeners() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleEmailPasswordLogin);
    }
    
    // Register form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegistration);
    }
    
    // Form switching
    const showRegisterBtn = document.getElementById('showRegister');
    const showLoginBtn = document.getElementById('showLogin');
    const backToLoginBtn = document.getElementById('backToLogin');
    
    if (showRegisterBtn) {
        showRegisterBtn.addEventListener('click', () => switchForm(true));
    }
    if (showLoginBtn) {
        showLoginBtn.addEventListener('click', () => switchForm(false));
    }
    if (backToLoginBtn) {
        backToLoginBtn.addEventListener('click', () => switchForm(false));
    }
}

// Handle email/password login
function handleEmailPasswordLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Basic validation
    if (!email || !password) {
        showNotification('Por favor, preencha todos os campos.', 'error');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Por favor, insira um email válido.', 'error');
        return;
    }
    
    // Show loading state
    const submitButton = document.querySelector('#loginForm .login-btn');
    const originalButtonText = submitButton.textContent;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Entrando...';
    submitButton.disabled = true;
    
    // Simulate API call with timeout
    setTimeout(() => {
        // Simulating successful login
        const userData = {
            name: email.split('@')[0],
            email: email,
            picture: 'https://ui-avatars.com/api/?name=' + encodeURIComponent(email.split('@')[0]),
            provider: 'email'
        };
        
        handleSuccessfulLogin(userData);
        
        // Clear the form
        document.getElementById('loginForm').reset();
        
        // Reset button
        submitButton.innerHTML = originalButtonText;
        submitButton.disabled = false;
    }, 1000);
}

// Handle registration
function handleRegistration(event) {
    event.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const houseId = document.getElementById('houseId').value;
    const termsAccepted = document.getElementById('termsCheckbox').checked;
    
    // Basic validation
    if (!name || !email || !password || !confirmPassword || !houseId) {
        showNotification('Por favor, preencha todos os campos.', 'error');
        return;
    }
    
    // Name validation
    if (name.trim().length < 3) {
        showNotification('O nome deve ter pelo menos 3 caracteres.', 'error');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Por favor, insira um email válido.', 'error');
        return;
    }
    
    if (password.length < 8) {
        showNotification('A senha deve ter pelo menos 8 caracteres', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification('As senhas não coincidem', 'error');
        return;
    }
    
    // Validate house ID format
    const houseIdRegex = /^\d{4}$/;
    if (!houseIdRegex.test(houseId)) {
        showNotification('O ID da casa deve ser um número de 4 dígitos.', 'error');
        return;
    }
    
    // Validate house ID
    if (houseId !== '1234') {
        showNotification('ID da casa inválido. Use 1234 para teste.', 'error');
        return;
    }
    
    // Validate terms acceptance
    if (!termsAccepted) {
        showNotification('Você precisa aceitar os termos de uso e política de privacidade.', 'error');
        return;
    }
    
    // Show loading state
    const submitButton = document.querySelector('#registerForm .login-btn');
    const originalButtonText = submitButton.textContent;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';
    submitButton.disabled = true;
    
    // Simulate API call with timeout
    setTimeout(() => {
        // Simulating successful registration
        const userData = {
            name: name,
            email: email,
            picture: 'https://ui-avatars.com/api/?name=' + encodeURIComponent(name),
            provider: 'email',
            houseId: houseId
        };
        
        handleSuccessfulLogin(userData);
        showNotification('Conta criada com sucesso! Bem-vindo ao EcoPonto.', 'success');
        
        // Clear the form
        document.getElementById('registerForm').reset();
        
        // Reset button
        submitButton.innerHTML = originalButtonText;
        submitButton.disabled = false;
    }, 1500);
}

// Handle successful login
function handleSuccessfulLogin(userData) {
    // Store user data
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Update UI
    updateUserInterface(userData);
    
    // Hide login panel
    document.getElementById('loginPanel').style.display = 'none';
    
    // Update welcome message
    const welcomeMessageElement = document.querySelector('.welcome-message h2');
    if (welcomeMessageElement) {
        welcomeMessageElement.innerHTML = `Olá, <span id="userName">${userData.name}</span>!`;
    }
    
    // Show success notification
    showNotification(`Bem-vindo, ${userData.name}!`, 'success');
}

// Update UI after login
function updateUserInterface(userData) {
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
}

// Toggle password visibility
function togglePasswordVisibility(inputId, buttonEl) {
    const input = document.getElementById(inputId);
    const icon = buttonEl.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        icon.className = 'fas fa-eye';
    }
}

// Switch between login and register forms
function switchForm(showRegister = false) {
    const formContainer = document.querySelector('.form-container');
    const backButton = document.getElementById('backToLogin');
    const loginSide = document.querySelector('.login-side');
    const registerSide = document.querySelector('.register-side');
    
    if (showRegister) {
        formContainer.classList.add('show-register');
        backButton.style.display = 'block';
        loginSide.style.display = 'none';
        registerSide.style.display = 'block';
    } else {
        formContainer.classList.remove('show-register');
        backButton.style.display = 'none';
        loginSide.style.display = 'block';
        registerSide.style.display = 'none';
    }
}

// Sign out
function signOut() {
    // Clear local storage
    localStorage.removeItem('user');
    
    // Reset UI
    document.getElementById('loginPanel').style.display = 'flex';
    document.getElementById('userInfo').style.display = 'none';
    
    // Reset forms
    document.getElementById('loginForm').reset();
    document.getElementById('registerForm').reset();
    switchForm(false);
    
    // Show notification
    showNotification('Você saiu da sua conta', 'info');
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 
                       type === 'error' ? 'fa-exclamation-circle' : 
                       'fa-info-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initAuth);

// Make functions available globally
window.togglePasswordVisibility = togglePasswordVisibility;
window.signOut = signOut; 