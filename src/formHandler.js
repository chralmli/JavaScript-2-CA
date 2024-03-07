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
        const authResponse = await authApi.login(loginData);
        console.log("Login response:", authResponse);

        if (authResponse.data && authResponse.data.accessToken) {
            console.log(`Access Token: ${authResponse.data.accessToken}`)
            setToken(authResponse.data.accessToken);

            localStorage.setItem('userName', authResponse.data.name);

            const profileResponse = await fetchProfile();
            console.log("Profile response:", profileResponse);
            setSessionData(authResponse.data.accessToken, profileResponse.data);
            showFeedback(`Welcome ${profileResponse.data.name}`, 'success');


            const apiKey = await createApiKey();
            console.log(`API Key: ${apiKey}`);

            window.location.href = '/feed/index.html'
        } else {
            const errorMessage = authResponse.data.message || 'Unexpected error';
            showFeedback(`Login failed: ${errorMessage}', 'error`);
        }
    } catch (error) {
        showFeedback('An error occurred during login: ' + (error.message || 'Unknown error'), 'error');
        console.error('Login error:', error);
        showFeedback('An error occurred while fetching profile data: ' + (error.message || 'Unknown error' ), 'error');
        console.error('Fetching profile data error: ', error);
    }
}

