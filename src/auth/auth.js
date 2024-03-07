import { handleLogin, handleRegistration } from '../formHandler.js'
import { clearSessionData } from '../utils/storage.js'

function setupAuthEventListeners() {
    const registrationForm = document.getElementById('registration-form');
    const loginForm = document.getElementById('login-form');
    const logoutButton = document.getElementById('logoutButton');

    if (registrationForm) {
        registrationForm.addEventListener('submit', handleRegistration);
    }
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    if (logoutButton) {
        logoutButton.addEventListener('click', handleLogout);
    }
}

function handleLogout() {
    clearSessionData();
    window.location.href = '/index.html';
}

export { setupAuthEventListeners };