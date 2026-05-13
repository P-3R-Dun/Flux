const IP = import.meta.env.VITE_SERVER_IP;
const BASE_URL = `http://${IP}:8000/api`;

export const customFetch = async (url: string, options: RequestInit = {}) => {
    let accessToken = localStorage.getItem('access') || sessionStorage.getItem('access');
    const headers = new Headers(options.headers || {});
    if (accessToken) {
        headers.set('Authorization', `Bearer ${accessToken}`);
    }
    let response = await fetch(url, { ...options, headers });
    if (response.status === 401) {
        const refreshToken = localStorage.getItem('refresh') || sessionStorage.getItem('refresh');

        if (refreshToken) {
            try {
                const refreshResponse = await fetch(`${BASE_URL}/auth/jwt/refresh/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ refresh: refreshToken }),
                });

                if (refreshResponse.ok) {
                    const data = await refreshResponse.json();
                    accessToken = data.access;
                    if (localStorage.getItem('refresh')) {
                        localStorage.setItem('access', accessToken!);
                    } else {
                        sessionStorage.setItem('access', accessToken!);
                    }
                    headers.set('Authorization', `Bearer ${accessToken}`);
                    response = await fetch(url, { ...options, headers });
                } else {
                    throw new Error("Refresh token is expired");
                }
            } catch (error) {
                localStorage.clear();
                sessionStorage.clear();
                window.location.href = '/';
                throw error;
            }
        } else {
            localStorage.clear();
            sessionStorage.clear();
            window.location.href = '/';
        }
    }

    return response;
};