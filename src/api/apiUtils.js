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
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API call failed with status: ${response.status} and error: ${errorText}`);
        }

        // Check if response has content and is of type JSON before parsing
        const contentType = response.headers.get('Content-Type');
        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            return data
        }
        return null;
    } catch (error) {
        console.error(`API call to ${endpoint} failed:`, error);
        throw error;
    }
}