export function createPostElement(post, { showAuthor = true }) {
    const avatarUrl = post.avatar?.url || 'https://i.ibb.co/b56xqf9/default-avatar.png';
    const avatarAlt = post.avatar?.alt || 'Default avatar';
    const postImageUrl = post.media?.url || 'https://i.ibb.co/cbMzC91/placeholder-img-ai.png';
    const postImageAlt = post.media?.alt || 'Default post image';

    const authorName = post.author?.name || 'Anonymous';

    const postElement = document.createElement('div');
    postElement.className = 'col-md-4 custom-col-md mb-3';
    postElement.innerHTML = `
        <div class="card post-card cursor-pointer">
        <div class="post-header d-flex align-items-center p-2">
            <img src="${avatarUrl}" class="post-profile-pic rounded-circle me-2" alt="${avatarAlt}">
            <div class="post-user-info">
            ${showAuthor ? `<div class="username">${authorName}</div>` : ''}
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
    postElement.addEventListener('click', () => showPostDetailsModal(post.id));
    return postElement;
}