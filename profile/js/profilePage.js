import { fetchProfile } from "../../src/api/profileApi.js";
import { updateUserInformation, displayUserPosts, displayFollowLists, initializeEditProfileForm, collectProfileFormData } from "./profileUI.js";

// Extract the profile name from the URL
function extractProfileNameFromUrl() {
    const url = new URL(window.location.href);
    const profileName = url.searchParams.get('profile');
    return profileName;
}
// Handle profile update submission
async function handleProfileUpdate(event) {
    event.preventDefault();
    const formData = collectProfileFormData();
    try {
        await updateUserInformation(formData);
        alert("Profile updated successfully.");
        const profileName = extractProfileNameFromUrl();
        loadProfileData(profileName)
    } catch (error) {
        console.error("Failed to update profile:", error);
        alert("Failed to update profile.");
    }
}

const loadProfileData = async (profileName) => {
    try {
        const response = await fetchProfile(profileName);
        const profileData = response.data;
        if (profileData) {
            updateUserInformation(profileData);
            displayUserPosts(profileData.posts || []);
            displayFollowLists(profileData.following || [], profileData.followers || []);
            initializeEditProfileForm(profileData);
        } else {
            console.warn("No profile available.");
        }
    } catch (error) {
        console.error("Failed to load profile:", error);
    }
};

document.addEventListener('DOMContentLoaded', async () => {
    const profileName = extractProfileNameFromUrl();
    loadProfileData(profileName);
    
    document.querySelector('#editProfileForm').addEventListener('submit', handleProfileUpdate);
});
