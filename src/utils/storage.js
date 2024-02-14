export function setToken(accessToken) {
    localStorage.setItem('jwtToken', accessToken);
}

export function getToken() {
    return localStorage.getItem('jwtToken');
}

export function getStoredApiKey() {
    return localStorage.getItem('apiKey');
}

// export function setStoredApiKey(apiKey) {
//     localStorage.setItem('apiKey', apiKey);
// }

export function clearToken() {
    localStorage.removeItem('jwtToken');
}