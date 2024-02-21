import { setupAuthEventListeners } from "./auth/auth.js";
import { loadPosts } from "../feed/js/feed.js";
import { handlePostSubmit, postForm } from "../feed/js/createPost.js";

document.addEventListener('DOMContentLoaded', () => {
    setupAuthEventListeners();
    loadPosts();
    if (postForm) {
        postForm.addEventListener('submit', handlePostSubmit);
    }
})