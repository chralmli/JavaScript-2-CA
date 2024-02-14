import { getToken } from '../utils/storage.js';

const BASE_URL = 'https://v2.api.noroff.dev';

export async function fetchWithToken(endpoint, options) {
    const url = `${BASE_URL}${endpoint}`;
    const accessToken = getToken();
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': accessToken ? `Bearer ${accessToken}` : '',
        ...options.headers,
    };

    try {
        const response = await fetch(url, { ...options, headers });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'An unexpected error occurred');
        }
        return data;
    } catch (error) {
        console.error(`API call to ${endpoint} failed:`, error);
        throw error;
    }
}