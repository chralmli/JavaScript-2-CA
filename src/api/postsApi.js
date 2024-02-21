import { fetchWithToken } from './apiUtils.js';
import { getToken } from '../utils/storage.js';
import { API_KEY } from '../config.js';

export async function fetchPosts() {
    const accessToken = getToken();
    return await fetchWithToken('/social/posts', { 
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'X-Noroff-API-Key': API_KEY,
        }
    });
}

export async function createPost(postData) {
    return await fetchWithToken('/social/posts', { 
        method: 'POST', 
        body: JSON.stringify(postData),
        headers: { 
            'Content-Type': 'application/json',
            'X-Noroff-API-Key': API_KEY,
        }
    });
}

