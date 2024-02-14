import * as authApi from './api/authApi.js';
import { validateRegistrationForm, validateLoginForm } from './validation/validation.js';
import { showFeedback } from './feedback/feedback.js';
import { createApiKey } from './api/authApi.js'
import { setToken } from './utils/storage.js'

// Handle registration
export async function handleRegistration(event) {
    event.preventDefault();
    const form = event.target;
    const userData = {
        name: document.getElementById('registerUsername').value,
        email: document.getElementById('registerEmail').value,
        password: document.getElementById('registerPassword').value,
        bio: document.getElementById('bio').value,
        avatar: {
            url: document.getElementById('avatar_url').value || undefined,
            alt: document.getElementById('avatar_alt').value || undefined,
        },
        banner: {
            url: document.getElementById('banner_url').value || undefined,
            alt: document.getElementById('banner_alt').text || undefined,
        }
    };
    const validationResult = validateRegistrationForm(userData);
    if (!validationResult.valid) {
        showFeedback(validationResult.message, 'error');
        return;
    }

    try {
        const response = await authApi.register(userData);
        if (response.data && response.data.email) {
            console.log(response.data.name);
            console.log(response.data.email);
            showFeedback('Registration successful!', 'success');
        } else {
            console.error("Unexpected response structure:", response);
            const errorMessage = response?.error?.message || response?.message || "Registration failed with an unexpected error.";
            showFeedback(errorMessage, 'error');
        }
    } catch (error) {
        console.error("Error during registration", error);
        showFeedback(`An error occurred during registration: ${error.toString()}`, 'error');
    }
}

// Handle login
export async function handleLogin(event) {
    event.preventDefault();
    const loginData = {
        email: document.getElementById('loginEmail').value,
        password: document.getElementById('loginPassword').value,
    };

    const validationResult = validateLoginForm(loginData);
    if (!validationResult.valid) {
        showFeedback(validationResult.message, 'error');
        return;
    }

    try {
        const response = await authApi.login(loginData);
        console.log("Login response:", response);

        if (response.data && response.data.accessToken) {
            console.log(`Access Token: ${response.data.accessToken}`);
            setToken(response.data.accessToken);
            showFeedback('Login successful!', 'success');

            const apiKey = await createApiKey();
            console.log(`API Key: ${apiKey}`);

            window.location.href = '/feed/index.html'
        } else {
            const errorMessage = response.data.message || 'Unexpected error';
            showFeedback(`Login failed: ${errorMessage}', 'error`);
        }
    } catch (error) {
        showFeedback('An error occurred during login: ' + (error.message || 'Unknown error'), 'error');
        console.error('Login error:', error);
    }
}

