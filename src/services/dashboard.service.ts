const IP = import.meta.env.VITE_SERVER_IP;
const API_URL = `http://${IP}:8000/api/finance`;

interface TransactionDT {id: string; amount: string | number; date: string; description: string; category_name: string | null; goal_title: string | null; brand_logo_url: string | null;}
export interface ProfileDT {first_name: string; last_name: string; email: string; username: string; currency: string; financial_period: string; focus_streak: number; profile_picture: string | null; transactions: TransactionDT[];}

export const dashboardService = {
    async getProfile(token: string): Promise<ProfileDT> {
        const response = await fetch(`${API_URL}/profile/me/`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        });
        const result = await response.json();
        if (!response.ok) {
            throw result
        };

        return result;
    }
}