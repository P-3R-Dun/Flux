const IP = import.meta.env.VITE_SERVER_IP;
const API_URL = `http://${IP}:8000/api/dashboard/summary`;

export const dashboardService = {
    async getSummary() {
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include', // Включаем куки для аутентификации
        });
        return response.json();
    }
}