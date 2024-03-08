import { getToken } from '../../src/utils/storage.js';
import { API_BASE, API_POSTS, API_KEY } from '../../src/config.js';
import { fetchPosts } from '../../src/api/postsApi.js';
import { loadPosts } from './feed.js';

export const postForm = document.getElementById('newPostForm');

export const handlePostSubmit = async (event) => {
    event.preventDefault();

    const title = document.getElementById('postTitle').value;
    const body = document.getElementById('postContent').value;
    const imageUrl = document.getElementById('postImage').value;
    const selectedOptions = document.getElementById('postTagsSelect').selectedOptions;
    const tags = Array.from(selectedOptions).map(option => option.value);
    
    const postData = {
        title: title,
        body: body,
        tags: tags,
    };

    if (imageUrl) {
        postData.media = {
            url: imageUrl,
            alt: ""
        };
    }
    
    try {
        const response = await fetch(`${API_BASE}${API_POSTS}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${getToken()}`,
                'X-Noroff-API-Key': API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData),
        });

        if (!response.ok) {
            const errorResponse = await response.text();
            throw new Error(errorResponse || 'Failed to create post');
        }

        const result = await response.json();
        console.log(result);

        const postModal = new bootstrap.Modal(document.getElementById('newPostModal'));
        postModal.hide();
        await loadPosts();
        postForm.reset();

    } catch(error) {
        console.error('Failed to create post:', error);
    }
};

if (postForm) {
    postForm.addEventListener('submit', handlePostSubmit);
}