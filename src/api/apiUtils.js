import { getToken } from '../utils/storage.js';

const BASE_URL = 'https://v2.api.noroff.dev';

export async function fetchWithToken(endpoint, options) {
    const url = `${BASE_URL}${endpoint}`;
    const accessToken = getToken();
    const API_KEY = '4d4cfe37-b1f6-4b35-affc-19f38c4b3436';
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': accessToken ? `Bearer ${accessToken}` : '',
        'X-Noroff-API-Key': API_KEY,
        ...options.headers,
    };

    try {
        const response = await fetch(url, { ...options, headers });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(`API call failed with status: ${response.status}`);
        }

        return data;
    } catch (error) {
        console.error(`API call to ${endpoint} failed:`, error);
        throw error;
    }
}