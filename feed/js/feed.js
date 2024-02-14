const renderPosts = (posts) => {
    const postsContainer = document.querySelector('.posts-grid');
    postsContainer.innerHTML = '';

    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'col-md-4 mb-4';
        postElement.innerHTML = `
            <div class="card">
                <img src="${post.avatar.url}" class="card-img-top" alt="${post.avatar.alt}">
                <div class="card-body">
                    <h5 class="card-title">${post.title}</h5>
                    <p class="card-text">${post.content}</p>
                    <div class="post-meta">
                        <span class="likes"><i class="fas fa-thumbs-up"></i> ${post.likes} Likes</span>
                        <span class="comments"><i class="fas fa-comment"></i> ${post.comments} Comments</span>
                    </div>
                </div>
            </div>
        `;
        postsContainer.appendChild(postElement);
    });
};

const loadPosts = async () => {
    try {
        const posts = await fetchPosts();
        renderPosts(posts);
    } catch (error) {
        console.error("Failed to load posts:", error);
    }
};

document.addEventListener('DOMContentLoaded', loadPosts);