// Update the user information
export function updateUserInformation(profile) {
    document.querySelector('.profile-image').src = profile.avatarUrl || 'https://cdn.pixabay.com/photo/2015/0';
    document.querySelector('.profile-image').alt = profile.avatarAlt || 'Default avatar';
    document.querySelector('.username').textContent = profile.username || 'John Doe';
    document.querySelector('.user-bio').textContent = profile.bio || 'Bio not provided';
}

// Display the user's posts
export function displayUserPosts(posts) {
    const postsContainer = document.querySelector('.user-posts .row');
    postsContainer.innerHTML = '';

    if (posts.length === 0) {
        const noPostsMessage = document.createElement('div');
        noPostsMessage.textContent = 'You have no posts yet!';
        noPostsMessage.className = 'alert alert-info';
        postsContainer.appendChild(noPostsMessage);
    } else {
        posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.className = 'col-md-4 mb-3';
            postElement.innerHTML = `
                <div class="card post-card">
                    <img src="${post.mediaUrl}" class="card-img-top" alt="${post.mediaAlt}">
                    <div class="card-body">
                        <h5 class="card-title">${post.title}</h5>
                        <p class="card-text">${post.body}</p>
                        <div class="post-meta">
                            <div class="username">${post.username || 'Anonymous'}</div>
                            <small class="text-muted">Posted on ${new Date(post.date).toLocaleDateString()}</small>
                        </div>
                    </div>
                </div>
                `;
            postsContainer.appendChild(postElement);
        });
    }
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