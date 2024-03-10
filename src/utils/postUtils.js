import { showEditModal } from "../../profile/js/profileUI.js";
import { deletePost } from "../../src/api/postsApi.js"

export function createPostElement(post, options = { showAuthor: true, isEditable: false }) {
    const avatarUrl = post.avatar?.url || 'https://i.ibb.co/b56xqf9/default-avatar.png';
    const avatarAlt = post.avatar?.alt || 'Default avatar';
    const postImageUrl = post.media?.url || 'https://i.ibb.co/cbMzC91/placeholder-img-ai.png';
    const postImageAlt = post.media?.alt || 'Default post image';

    const authorName = post.author?.name || 'Anonymous';

    const postElement = document.createElement('div');
    postElement.className = 'col-md-4 custom-col-md mb-3';

    // Initialize innerHTML
    postElement.innerHTML = `
        <div class="card post-card cursor-pointer">
            <div class="post-header d-flex align-items-center p-2">
                <img src="${avatarUrl}" class="post-profile-pic rounded-circle me-2" alt="${avatarAlt}">
                <div class="post-user-info">
                ${options.showAuthor ? `<div class="username">${authorName}</div>` : ''}
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
            ${options.isEditable? `
            <div class="card-footer">
                <button class="btn btn-sm btn-primary edit-post" data-post-id="${post.id}">Edit</button>
                <button class="btn btn-sm btn-danger delete-post" data-post-id="${post.id}">Delete</button>
            </div>` : ''}
        </div>
    `;

    // Attach event listeners if buttons are available
    if (options.isEditable) {
        const editButton = postElement.querySelector('.edit-post');
        const deleteButton = postElement.querySelector('.delete-post');

        editButton.addEventListener('click', (event) => {
            event.stopPropagation();
            showEditModal(post.id);
        });
        
        deleteButton.addEventListener('click', (event) => {
            event.stopPropagation();
            deletePost(post.id);
        });
    }
    // Event listeners for viewing post details
    postElement.addEventListener('click', () => {
        showPostDetails(post.id);
    });

    return postElement;
}