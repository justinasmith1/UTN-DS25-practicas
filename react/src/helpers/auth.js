const TOKEN_KEY = 'jwt_token';

export function setToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
    // Disparar evento personalizado para notificar a otros componentes
    window.dispatchEvent(new CustomEvent('tokenUpdated', { detail: { token } }));
}

export function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

export function clearToken() {
    localStorage.removeItem(TOKEN_KEY);
    // Disparar evento personalizado para notificar a otros componentes
    window.dispatchEvent(new CustomEvent('tokenCleared'));
}

export function isAuthenticated() {
    const token = getToken();
    if (!token) return false;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        // Check if token is expired
        const now = Date.now() / 1000;
        return payload.exp > now;
    } catch (error) {
        return false;
    }
}
