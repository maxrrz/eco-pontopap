// Google OAuth Configuration
const googleClientId = 'YOUR_GOOGLE_CLIENT_ID'; // Replace with your actual client ID

// Initialize Google Sign-In
function initGoogleAuth() {
    google.accounts.id.initialize({
        client_id: googleClientId,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true
    });
}

// Handle the sign-in response from Google
function handleCredentialResponse(response) {
    if (response.credential) {
        // Decode the credential to get user info
        const decoded = JSON.parse(atob(response.credential.split('.')[1]));
        const userData = {
            name: decoded.name,
            email: decoded.email,
            picture: decoded.picture,
            provider: 'google'
        };
        
        handleSuccessfulLogin(userData);
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
    
    // Here you would implement the logic to authenticate with email/password
    // For example, calling an authentication API
    
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
}

// Handle registration
function handleRegistration(event) {
    event.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Basic validation
    if (!name || !email || !password || !confirmPassword) {
        showNotification('Por favor, preencha todos os campos.', 'error');
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
    
    // Here you would implement the logic to register
    // For example, calling a registration API
    
    // Simulating successful registration
    const userData = {
        name: name,
        email: email,
        picture: 'https://ui-avatars.com/api/?name=' + encodeURIComponent(name),
        provider: 'email'
    };
    
    handleSuccessfulLogin(userData);
    showNotification('Conta criada com sucesso!', 'success');
    
    // Clear the form
    document.getElementById('registerForm').reset();
}

// Handle successful login from any provider
function handleSuccessfulLogin(userData) {
    // Store user data
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Update UI
    updateUserInterface(userData);
    
    // Hide login panel
    document.getElementById('loginPanel').style.display = 'none';
    
    // Show success notification
    showNotification('Login realizado com sucesso!', 'success');
}

// Update UI after successful login
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
    
    if (showRegister) {
        formContainer.classList.add('show-register');
        backButton.style.display = 'block';
    } else {
        formContainer.classList.remove('show-register');
        backButton.style.display = 'none';
    }
}

// Sign out function
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
    
    // If using Google Sign-In
    if (google?.accounts?.id) {
        google.accounts.id.disableAutoSelect();
    }
    
    // Show notification
    showNotification('Você saiu da sua conta', 'info');
}

// Check if user is already logged in
function checkAuthStatus() {
    const userData = localStorage.getItem('user');
    if (userData) {
        updateUserInterface(JSON.parse(userData));
        document.getElementById('loginPanel').style.display = 'none';
    }
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

// Initialize event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Google Sign-In button
    const googleButton = document.getElementById('googleSignInButton');
    if (googleButton) {
        googleButton.addEventListener('click', () => {
            google.accounts.id.prompt();
        });
    }
    
    // Initialize login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleEmailPasswordLogin);
    }
    
    // Initialize register form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegistration);
    }
    
    // Initialize form switching
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
    
    // Initialize password toggles
    const passwordToggles = document.querySelectorAll('.password-toggle');
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            const input = e.target.closest('.password-input-group').querySelector('input');
            togglePasswordVisibility(input.id, toggle);
        });
    });
});

// Export functions
export { initGoogleAuth, signOut, checkAuthStatus }; 