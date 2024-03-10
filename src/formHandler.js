import * as authApi from './api/authApi.js';
import { validateRegistrationForm, validateLoginForm } from './validation/validation.js';
import { showFeedback } from './feedback/feedback.js';
import { createApiKey } from './api/authApi.js';
import { fetchProfile } from '../src/api/profileApi.js';
import { setToken } from './utils/storage.js';
import { setSessionData } from './utils/storage.js';


// Handle registration
export async function handleRegistration(event) {
    event.preventDefault();
    const form = event.target;
    const userData = {
        name: document.getElementById('registerUsername').value,
        email: document.getElementById('registerEmail').value,
        password: document.getElementById('registerPassword').value
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

            // Switch to login tab after successful registration
            const loginTabElement = document.querySelector('#login-tab');
            if (loginTabElement) {
                const loginTab = new bootstrap.Tab(loginTabElement);
                loginTab.show();
            } else {
                console.error("Login tab element not found.");
            }
            document.getElementById('registration-form').reset();
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

        if (response.ok) {
            const authResponse = await response.json();
            console.log(`Access Token: ${authResponse.accessToken}`);
            if (authResponse && authResponse.accessToken) {
                setToken(authResponse.accessToken);
                localStorage.setItem('userName', authResponse.name);
    
                const profileResponse = await fetchProfile();
                if (!profileResponse.ok) {
                    throw new Error('Failed to fetch profile data.');
                }
                const profileData = await profileResponse.json();
                console.log("Profile response:", profileData);
    
                setSessionData(authResponse.accessToken, profileData);
                showFeedback(`Welcome ${profileData.name}`, 'success');
    
    
                const apiKey = await createApiKey();
                console.log(`API Key: ${apiKey}`);
    
                window.location.href = '/feed/index.html'
            }
        } else {
            const errorResponse = await response.json();
            const errorMessage = errorResponse.message || 'Login failed with an unexpected error.';
            console.error(`Login failed: ${errorMessage}`);
            showFeedback(`Login failed: ${errorMessage}', 'error`);
        }
    } catch (error) {
        console.error('Login error:', error);
        showFeedback('An error occurred during login:'+ (error.message || 'Unknown error'), 'error');
    }
}

