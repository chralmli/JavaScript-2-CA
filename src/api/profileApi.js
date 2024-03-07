import {fetchWithToken } from './apiUtils.js';
import { getToken } from '../utils/storage.js';
import { API_KEY } from '../config.js';

export async function fetchProfile() {
    const accessToken = getToken();
    const userName = localStorage.getItem('userName');
    if (!userName) {
        throw new Error('User name is not available');
    }
    let url = `/social/profiles/${userName}`;
    
    return await fetchWithToken(url, { 
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'X-Noroff-API-Key': API_KEY,
        }
    });
}

export async function fetchPostsByProfile() {
    const userName = localStorage.getItem('userName');
    const url = `/social/profiles/${userName}/posts`;
    return await fetchWithToken(url, {method: 'GET'});
}