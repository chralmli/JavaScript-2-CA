export function setToken(accessToken) {
    localStorage.setItem('jwtToken', accessToken);
}

export function getToken() {
    return localStorage.getItem('jwtToken');
}

export const getProfileData = () => {
    const profileData = localStorage.getItem('profileData');
    return profileData ? JSON.parse(profileData) : null;
};

export const setProfileData = (data) => {
    localStorage.setItem('profileData', JSON.stringify(data));
};

export function setSessionData(accessToken, userData) {
    setToken(accessToken);
    setProfileData(userData);
}

export function clearSessionData() {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('profileData');
    localStorage.removeItem('userName');
}