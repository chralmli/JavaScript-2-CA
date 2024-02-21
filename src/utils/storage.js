export function setToken(accessToken) {
    localStorage.setItem('jwtToken', accessToken);
}

export function getToken() {
    return localStorage.getItem('jwtToken');
}


export function clearToken() {
    localStorage.removeItem('jwtToken');
}