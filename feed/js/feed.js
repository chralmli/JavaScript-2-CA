import { fetchPosts } from "../../src/api/postsApi.js";

const renderPosts = (posts) => {
    const postsContainer = document.querySelector('.posts-grid');
    postsContainer.innerHTML = '';

    if (Array.isArray(posts) && posts.length > 0) {
        posts.forEach(post => {
            const avatarUrl = post.avatar && post.avatar.url ? post.avatar.url : 'https://i.ibb.co/b56xqf9/default-avatar.png';
            const avatarAlt = post.avatar && post.avatar.alt ? post.avatar.alt : 'Default avatar';

            const postImageUrl = post.media && post.media.url ? post.media.url : 'https://i.ibb.co/cbMzC91/placeholder-img-ai.png';
            const postImageAlt = post.media && post.media.alt ? post.media.alt : 'Default post image';
            
            const postElement = document.createElement('div');
            postElement.className = 'col-md-4 mb-4';
            postElement.innerHTML = `
                <div class="card">
                    <img src="${avatarUrl}" class="card-img-top" alt="${avatarAlt}">
                    <div class="card-body">
                        <h5 class="card-title">${post.title}</h5>
                        <p class="card-text">${post.content}</p>
                        <img src="${postImageUrl}" class="card-img" alt="${postImageAlt}">
                        <div class="post-meta">
                            <span class="likes"><i class="fas fa-thumbs-up"></i> ${post.likes} Likes</span>
                            <span class="comments"><i class="fas fa-comment"></i> ${post.comments} Comments</span>
                        </div>
                    </div>
                </div>
            `;
            postsContainer.appendChild(postElement);
        });
    } else {
        postsContainer.innerHTML = '<p>No posts available. Create your first post!</p>';
    }
};

export const loadPosts = async () => {
    try {
        const response = await fetchPosts();
        const posts = response.data;
        if (Array.isArray(posts) && posts.length > 0) {
            renderPosts(posts);
        } else {
            console.warn("No posts available.");
        }
    } catch (error) {
        console.error("Failed to load posts:", error);
    }
};

document.addEventListener('DOMContentLoaded', loadPosts);