import { fetchProfile } from '../../src/api/profileApi.js';
import { updateUserInformation, displayUserPosts, displayFollowLists, initializeEditProfileForm } from './profileUI.js';

async function loadProfileData() {
    try {
        const response = await fetchProfile();
        const profileData = response.data;

        updateUserInformation(profileData);
        displayUserPosts(profileData.posts || []);
        displayFollowLists(profileData.following || [], profileData.followers || []);
        initializeEditProfileForm(profileData);
    } catch (error) {
        console.error("Failed to load profile data:", error);
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