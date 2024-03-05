import {fetchWithToken } from './apiUtils.js';
import { getToken } from '../utils/storage.js';
import { API_KEY } from '../config.js';

export async function fetchProfile(profileName = '') {
    const accessToken = getToken();
    let url = `https://v2.api.noroff.dev/social/profiles${profileName ? '/' + profileName : ''}`;
    
    return await fetchWithToken(url, { 
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'X-Noroff-API-Key': API_KEY,
        }
    });
}