import { fetchWithToken } from "./apiUtils.js";
import { getToken } from '../utils/storage.js';
const BASE_URL = 'https://v2.api.noroff.dev';

export async function login(userData) {
    return await fetchWithToken('/auth/login', {
        method: 'POST',
        body: JSON.stringify(userData),
    });
}

export async function register(userData) {
    return await fetchWithToken('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
    });
}

export async function createApiKey(name = "My API key name") {
    const accessToken = getToken();
    const url =  `${BASE_URL}/auth/create-api-key`;


    try {
        const response = await fetch(url,  {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({ name })
        });
        const data = await response.json();

        if (!response.ok) {
            console.error(`API key creation failed with status: ${response.status}`, data);
            throw new Error(data.message || 'Failed to create API key');
        }

        console.log("API key created:", data.data.key);
        return data.data.key;
    } catch (error) {
        console.error("Could not create API key", error);
        throw error;
    }
}