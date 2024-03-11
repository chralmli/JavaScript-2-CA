import { fetchWithToken } from './apiUtils.js';
import { getToken } from '../utils/storage.js';
import { API_KEY } from '../config.js';
import { loadPosts } from '../../feed/js/feed.js';

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

    try {
        const response = await fetchWithToken(url, { 
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                'X-Noroff-API-Key': API_KEY,
            }
        });
        return response || { data: [] };
    } catch (error) {
        console.error('Error fetching posts', error);
        throw error;
    }
}

export async function fetchPostById(postId) {
    const url = `/social/posts/${postId}`;
    const accessToken = getToken();

    try {
        const jsonResponse = await fetchWithToken(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                'X-Noroff-API-Key': API_KEY,
            }
        });

        return jsonResponse.data;
    } catch (error) {
        console.error(`API call to ${url} failed:`, error);
        throw error;
    }
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

export async function updatePost(postId, postData) {
    const url = `/social/posts/${postId}`;
    const accessToken = getToken();

    try {
        const data = await fetchWithToken(url, {
            method: 'PUT',
            body: JSON.stringify(postData),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'X-Noroff-API-Key': API_KEY,
            },
        });

        // console.log('Updated post:', data);
        return data;
    } catch (error) {
        console.error(`Failed to update post: ${error.message}`, error);
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
        if (response === null) {
            console.log('Post deleted successfully');
            loadPosts();
        } else {
            if (response.status !== 204 && response.headers.get("Content-Length") !== "0") {
                const errorData = await response.json();
                console.error('Failed to delete post:', errorData);
                alert('Failed to delete post');
            } else {
                console.error('Failed to delete post: No response from server');
                alert('Failed to delete post');
            }
        }
    } catch (error) {
        console.error('Failed to delete post:', error);
        alert('Failed to delete post');
    }
}

export function openEditModal(postData) {
    // Fill the modal with the post data
    document.getElementById('editPostId').value = postData.id;
    document.getElementById('editPostTitle').value = postData.title;
    document.getElementById('editPostContent').value = postData.body;
    document.getElementById('editPostImage').value = postData.media ? postData.media.url : '';

    // Show the modal
    const editModal = new bootstrap.Modal(document.getElementById('editModal'));
    editModal.show();
}

