import { fetchWithToken } from './apiUtils.js';

export async function fetchPosts() {
    return await fetchWithToken('/social/posts', { method: 'GET' });
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

