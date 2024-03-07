import { fetchProfile, fetchPostsByProfile } from '../../src/api/profileApi.js';
import { updateUserInformation, displayUserPosts, displayFollowLists, initializeEditProfileForm } from './profileUI.js';

async function loadProfileData() {
    try {
        const profileResponse = await fetchProfile();
        const postsResponse = await fetchPostsByProfile()

        const profileData = profileResponse.data;
        const postsData = postsResponse.data;

        const userName = localStorage.getItem('userName');
        if (!userName) {
            throw new Error('User name is not available');
        }

        console.log('Loaded profile data:', profileData);
        console.log('Loaded posts data:', postsData);

        updateUserInformation(profileData);
        displayUserPosts(postsData || []);
        displayFollowLists(profileData.following || [], profileData.followers || []);
        initializeEditProfileForm(profileData);
        
        displayUserPosts(postsData || []);
    } catch (error) {
        console.error("Failed to load profile data or posts:", error);
    }
}

// Event listener for profile form submission
function setupProfileFormListener() {
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileSubmit);

    }
}

// initial setup to be called when the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    loadProfileData();
    setupProfileFormListener();
});