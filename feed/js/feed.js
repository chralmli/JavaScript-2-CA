import { fetchPosts } from "../../src/api/postsApi.js";

const availableTags = ['Nutrition', 'Workouts', 'Motivation', 'Progress', 'Equipment', 'Supplements'];

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
            postElement.className = 'col-md-4 custom-col-md mb-3';
            postElement.innerHTML = `
                <div class="card post-card">
                    <div class="post-header d-flex align-items-center p-2">
                        <img src="${avatarUrl}" class="post-profile-pic rounded-circle me-2" alt="${avatarAlt}">
                        <div class="post-user-info">
                            <div class="username">${post.author || 'Anonymous'}</div>
                            <small class="text-muted">Posted on ${new Date(post.created).toLocaleDateString()}</small>
                        </div>
                    </div>
                    <div class="post-img-container">
                        <img src="${postImageUrl}" class="post-img" alt="${postImageAlt}">
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">${post.title}</h5>
                        <p class="card-text">${post.body}</p>
                        <div class="post-meta d-flex justify-content-between align-items-center">
                            <span><i class="bi bi-hand-thumbs-up"></i> ${post._count && post._count.reactions ? post._count.reactions : 0} Likes</span>
                            <span><i class="bi bi-chat"></i> ${post._count && post._count.comments ? post._count.comments : 0} Comments</span>
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

export const loadPosts = async (tag = '', sort = 'latest', searchQuery = '') => {
    try {
        const response = await fetchPosts(tag, sort, searchQuery);
        let posts = response.data;

        if (Array.isArray(posts) && posts.length > 0) {
            const sortOption = document.getElementById('sortOptions').value;
            posts = applyFilter(sortOption, posts);
            renderPosts(posts);
        } else {
            console.warn("No posts available.");
            document.querySelector('.posts-grid').innerHTML = `<p class="text-center">No posts available for "${tag}" tag.</p>`;
        }
    } catch (error) {
        console.error("Failed to load posts:", error);
        document.querySelector('.posts-grid').innerHTML = `<p class="text-center text-danger">An error occurred while loading posts.</p>`;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const tagFiltersDiv  = document.getElementById('tagFilters');
    availableTags.forEach(tag => {
        const button = document.createElement('button');
        button.classList.add('btn', 'btn-outline-primary', 'btn-sm', 'tag-chip');
        button.textContent = tag;
        button.onclick = () => loadPosts(tag);
        tagFiltersDiv.appendChild(button);
    });

    loadPosts();
});

const applyFilter = (filterCriteria, posts) => {
    switch (filterCriteria) {
        case 'mostLiked':
            return posts.sort((a, b) => (b._count.reactions || 0) - (a._count.reactions || 0));
            default:
                return posts;
    }
}

document.addEventListener('DOMContentLoaded', loadPosts);