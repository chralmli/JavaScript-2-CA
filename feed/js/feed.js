/**
 * Imports fetchPosts and fetchPostById functions from postsApi module.
 */
import { fetchPosts, fetchPostById } from "../../src/api/postsApi.js";

// List of available tags for posts filtering
const availableTags = ['Nutrition', 'Workouts', 'Motivation', 'Progress', 'Equipment', 'Supplements'];
let selectedTag = '';

const tagFiltersDiv = document.getElementById('tagFilters');

/**
 * Displays the modal with details for a given post.
 * @param {number} postId - The ID of the post to fetch details for.
 */
async function showPostDetailsModal(postId) {
    try {
        const postResponse = await fetchPostById(postId);
        const postData = await postResponse.data;

        // Populate modal with post data
        document.getElementById('modalPostTitle').textContent = postData.title;
        document.getElementById('modalPostBody').textContent = postData.body;

        // Show the modal
        let modal = new bootstrap.Modal(document.getElementById('postDetailsModal'), {});
        modal.show();
    } catch (error) {
        console.error('Error fetching post details', error);
        document.querySelector('.posts-grid').innerHTML = `<p class="text-center text-danger">An error occurred while fetching post details.</p>`;
    }
}

/**
 * Creates an HTML element representing a single post.
 * @param {Object} post - The post data to create an element for.
 * @param {Object} options - Options for post element creation.
 * @param {boolean} options.showAuthor - Determines if the author's name should be shown.
 * @returns {HTMLElement} The created post element.
 */
function createPostElement({ id, avatar, media, author, created, title, body, _count }) {
  const avatarUrl = avatar?.url || 'https://i.ibb.co/b56xqf9/default-avatar.png';
  const avatarAlt = avatar?.alt || 'Default avatar';
  const postImageUrl = media?.url || 'https://i.ibb.co/cbMzC91/placeholder-img-ai.png';
  const postImageAlt = media?.alt || 'Default post image';

  const authorName = author?.name || 'Anonymous';

  const postElement = document.createElement('div');
  postElement.className = 'col-md-4 custom-col-md mb-3';
  postElement.innerHTML = `
    <div class="card post-card cursor-pointer">
      <div class="post-header d-flex align-items-center p-2">
        <img src="${avatarUrl}" class="post-profile-pic rounded-circle me-2" alt="${avatarAlt}">
        <div class="post-user-info">
          <div class="username">${authorName}</div>
          <small class="text-muted">Posted on ${new Date(created).toLocaleDateString()}</small>
        </div>
      </div>
      <div class="post-img-container">
        <img src="${postImageUrl}" class="post-img" alt="${postImageAlt}">
      </div>
      <div class="card-body">
        <h5 class="card-title">${title}</h5>
        <p class="card-text">${body}</p>
        <div class="post-meta d-flex justify-content-between align-items-center">
          <span><i class="bi bi-hand-thumbs-up"></i> ${_count && _count.reactions ? _count.reactions : 0} Likes</span>
          <span><i class="bi bi-chat"></i> ${_count && _count.comments ? _count.comments : 0} Comments</span>
        </div>
      </div>
    </div>
  `;
  postElement.addEventListener('click', () => showPostDetailsModal(id));
  return postElement;
}

/**
 * Renders all given posts into the DOM.
 * @param {Array} posts - An array of post objects to render.
 */
function renderPosts(posts) {
  const postsContainer = document.querySelector('.posts-grid');
  postsContainer.innerHTML = '';

  if (Array.isArray(posts) && posts.length > 0) {
    posts.forEach(post => postsContainer.appendChild(createPostElement(post)));
  } else {
    postsContainer.innerHTML = '<p>No posts available. Create your first post!</p>';
  }
}

/**
 * Loads posts based on specified criteria and renders them.
 * @param {string} tag - The tag to filter posts by.
 * @param {string} sort - The sorting criteria for posts.
 * @param {string} searchQuery - The query string to search posts by.
 */
export async function loadPosts(tag = '', sort = 'latest', searchQuery = '') {
  try {
    const response = await fetchPosts(tag, sort, searchQuery);
    const posts = response.data;

    if (Array.isArray(posts) && posts.length > 0) {
      const sortOption = document.getElementById('sortOptions').value;
      const filteredPosts = applyFilter(sortOption, posts);
      renderPosts(filteredPosts);
    } else {
      document.querySelector('.posts-grid').innerHTML = `<p class="text-center">No posts available for "${tag}" tag.</p>`;
    }
  } catch (error) {
    document.querySelector('.posts-grid').innerHTML = `<p class="text-center text-danger">An error occurred while loading posts.</p>`;
  }
}

/**
 * Applies a filter to an array of posts based on a given criterion.
 * @param {string} filterCriteria - The criterion to filter posts by.
 * @param {Array} posts - The posts to apply the filter to.
 * @returns {Array} The filtered array of posts.
 */
function applyFilter(filterCriteria, posts) {
  switch (filterCriteria) {
    case 'mostLiked':
      return posts.sort((a, b) => (b._count.reactions || 0) - (a._count.reactions || 0));
    case 'mostCommented':
      return posts.sort((a, b) => (b._count.comments || 0) - (a._count.comments || 0));
    default:
      return posts;
  }
}

/**
 * Initializes tag chips for filtering posts by tags.
 */
function initializeTagChips() {
    availableTags.forEach(tag => {
        const chip = document.createElement('span');
        chip.classList.add('badge', 'd-flex', 'align-items-center', 'me-2','bg-secondary', 'cursor-pointer');
        chip.textContent = tag;

        chip.addEventListener('click', function() {
            // Toggle selected tag
            if (selectedTag === tag) {
                selectedTag = '';
                this.classList.remove('bg-primary');
                this.classList.add('bg-secondary');
            } else {
                const previouslySelectedChip = document.querySelector('.tags-container .bg-primary');
                if (previouslySelectedChip) {
                    previouslySelectedChip.classList.remove('bg-primary');
                    previouslySelectedChip.classList.add('bg-secondary');
                }
                // Mark current chip as selected
                selectedTag = tag;
                this.classList.remove('bg-secondary');
                this.classList.add('bg-primary');
            }
            loadPosts(selectedTag);
        });

        tagFiltersDiv.appendChild(chip);
    });
}

// Event listeners and initial load logic
document.addEventListener('DOMContentLoaded', () => {
    // Listener for sortOptions dropdown changes
    const sortOptionsDropdown = document.getElementById('sortOptions');
    sortOptionsDropdown.addEventListener('change', () => {
        const selectedTag = document.querySelector('.tag-chip.btn-primary')?.textContent;
        const sortOption = document.getElementById('sortOptions').value;
        loadPosts(selectedTag, sortOption);
    });

    // Search functionality
    const searchInput = document.querySelector('.search-form input[type="text"]');
    searchInput.addEventListener('input', () => {
        const searchQuery = searchInput.value;
        const sortOption = document.getElementById('sortOptions').value;
        loadPosts(selectedTag, sortOption, searchQuery);
    });

    initializeTagChips();
    loadPosts();
});

document.addEventListener('DOMContentLoaded', loadPosts);

