import { createPostElement } from "../../src/utils/postUtils.js";
import { updatePost, fetchPostById, openEditModal } from "../../src/api/postsApi.js";
import { loadPosts } from "../../feed/js/feed.js";

// Update the user information
export function updateUserInformation(profile) {
    document.querySelector('.username').textContent = profile.name || 'John Doe';
    document.querySelector('.user-bio').textContent = profile.bio || 'Bio not provided';
    document.querySelector('.profile-image').src = profile.avatar.url || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png';
    document.querySelector('.profile-image').alt = profile.avatarAlt || 'Default avatar';
}

// Display the user's posts
export function displayUserPosts(posts) {
    const postsContainer = document.querySelector('.posts-grid');
    postsContainer.innerHTML = '';

    if (posts.length === 0) {
        const noPostsMessage = document.createElement('div');
        noPostsMessage.textContent = 'You have no posts yet!';
        noPostsMessage.className = 'alert alert-info';
        postsContainer.appendChild(noPostsMessage);
    } else {
        posts.forEach(post => {
            const postElement = createPostElement(post, { showAuthor: false });
            postsContainer.appendChild(postElement);
        });
    }

    // add click listeners to edit buttons
    document.querySelectorAll('.edit-post-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            event.stopPropagation();

            const postId = event.target.getAttribute('data-post-id');
            const foundPostData = posts.find(post => post.id.toString() === postId);

            if (foundPostData) {
                openEditModal(foundPostData);
            } else {
                fetchPostById(postId).then(fetchedPostData => {
                    if (fetchedPostData) {
                        openEditModal(fetchedPostData);
                    }
                }).catch(error => console.error('Error fetching post data:', error));
            }
        });
    });
}

// Display followers and following
export function displayFollowLists(following, followers) {
    const followingList = document.querySelector('.following-list');
    const followersList = document.querySelector('.followers-list');

    followingList.innerHTML = '';
    followersList.innerHTML = '';

    if (following.length === 0) {
        followingList.innerHTML = '<li class="list-group-item">No following users.</li>';
    } else {
        following.forEach(user => {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item';
            listItem.textContent = user.name;
            followingList.appendChild(listItem);
        });
    }

    if (followers.length === 0) {
        followersList.innerHTML = '<li class="list-group-item">No followers.</li>';
    } else {
        followers.forEach(user => {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item';
            listItem.textContent = user.name;
            followersList.appendChild(listItem);
        });
    }
}

// Initialize event listeners for the edit post form
function setupEditPostForm() {
    const editPostForm = document.getElementById('editPostForm');

    editPostForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const postId = document.getElementById('editPostId').value;
        const title = document.getElementById('editPostTitle').value;
        const body = document.getElementById('editPostContent').value;
        const mediaUrl = document.getElementById('editPostImage').value;

        const postData = {
            title,
            body,
            ...(mediaUrl && {media: { url: mediaUrl }}),
        };


        try {
            await updatePost(postId, postData);

            alert('Post updated successfully');

            // Close the modal
            const editModal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
            editModal.hide();

            // Refresh post list and display the updated post
            loadPosts();
        } catch (error) {
            console.error('Error updating post:', error);
            alert('Failed to update post');
        }
    });
}

setupEditPostForm();


// Initialize edit profile form with user data
export function initializeEditProfileForm(profile) {
    document.getElementById('bio').value = profile.bio || '';
    document.getElementById('avatar_url').value = profile.avatarUrl || 'https://cdn.pixabay.com/photo/';
    document.getElementById('avatar_alt').value = profile.avatarAlt || 'Default avatar';
    document.getElementById('banner_url').value = profile.bannerUrl || 'https://cdn.pixabay.com/photo/';
    document.getElementById('banner_alt').value = profile.bannerAlt || 'Default banner';
}

// Collect data from the form and prepare it for an API call
export function collectFormData(form) {
    return {
        bio: document.getElementById('bio').value,
        avatar: {
            url: document.getElementById('avatar_url').value,
            alt: document.getElementById('avatar_alt').value
        },
        banner: {
            url: document.getElementById('banner_url').value,
            alt: document.getElementById('banner_alt').value
        },
    };
}

