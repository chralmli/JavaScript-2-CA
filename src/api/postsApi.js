import { fetchWithToken } from './apiUtils.js';
import { getToken } from '../utils/storage.js';
import { API_KEY } from '../config.js';

export async function fetchPosts(tag = '', sort = 'latest', searchQuery = '') {
    const queryParams = new URLSearchParams();
    const accessToken = getToken();

    // Append tag if it exists
    if (tag) queryParams.append('_tag', tag);

    // Append search query if it exists
    if (searchQuery) queryParams.append('q', searchQuery);

    // Handle sorting
    if (sort === 'mostLiked') {
        queryParams.append('_sort', 'likes');
    } else if (sort === 'latest') {
        queryParams.append('_sort', 'latest');
    } else if (sort === 'mostCommented') {
        queryParams.append('_sort', 'comments');
    }

    // Construct URL
    let url = `/social/posts?${queryParams.toString()}`;
    
    return await fetchWithToken(url, { 
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

