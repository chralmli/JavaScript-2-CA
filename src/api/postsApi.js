import { fetchWithToken } from './apiUtils.js';
import { getToken } from '../utils/storage.js';
import { API_KEY } from '../config.js';
import { loadPosts } from "../../feed/js/feed.js"

export async function fetchPosts(tag = '', sort = 'latest', searchQuery = '', includeAuthor = true) {
    const queryParams = new URLSearchParams();
    const accessToken = getToken();

    // Append tag if it exists
    if (tag) queryParams.append('_tag', tag);

    // Append search query if it exists
    if (searchQuery) queryParams.append('q', searchQuery);

    // Request author data
    if (includeAuthor) queryParams.append('_author', 'true');

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

export async function fetchPostsById(postId) {
    const accessToken = getToken();
    let url = `/social/posts/${postId}`;

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

// Update a post
export async function updatePost(postId, postData) {
    const accessToken = getToken();
    const url = `/social/posts/${postId}`;
    console.log('Updating post with id:', postId);

    try {
        const response = await fetchWithToken(url, {
            method: 'PUT',
            body: JSON.stringify(postData),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'X-Noroff-API-Key': API_KEY,
            }
        });

        console.log('Response status:', response.status);

        // check if response was successful
        if (!response.ok) {
            throw new Error(`API call failed with status: ${response.status}`);
        }

        console.log('Post updated successfully');
        alert('Post updated successfully');

        // Fetch updated post data after successful update
        const updatedPost = await fetchAndUpdatePostUI(postId);
        console.log('Updated post data:', updatedPost);

    } catch (error) {
        console.error('Failed to update post:', error.message || error);
        throw error;
    }
}

// Delete a post
export async function deletePost(postId) {
    const accessToken = getToken();

    try {
        const response = await fetchWithToken(`/social/posts/${postId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'X-Noroff-API-Key': API_KEY,
            }
        });

        // Check if response was successful
        if (response.ok) {
            console.log('Post deleted successfully');
            loadPosts();
        } else {
            const errorData = await response.json();
            console.error('Failed to delete post:', errorData);
            alert('Failed to delete post');
        }
    } catch (error) {
        console.error('Failed to delete post:', error);
        alert('Failed to delete post');
    }
}

