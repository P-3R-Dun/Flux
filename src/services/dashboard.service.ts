const IP = import.meta.env.VITE_SERVER_IP;
const API_URL = `http://${IP}:8000/api/finance`;

export interface CategoryDT {
    id: string; 
    name: string; 
    type: 'expense' | 'income'; 
    icon_name: string | null; 
    is_default: boolean;
}

export interface TransactionDT {
    id?: string; 
    amount: string | number; 
    date: string;
    name: string; 
    description: string; 
    brand_logo_url: string | null;
    category: string | null;
    goal: string | null; 
    category_name?: string | null; 
}

export interface ProfileDT {
    first_name: string; 
    last_name: string; 
    email: string; 
    username: string; 
    currency: string; 
    financial_period: string; 
    focus_streak: number; 
    profile_picture: string | null; 
    transactions: TransactionDT[];
}

export interface BrandDT {
    name: string;
    domain: string;
    brand_logo_url: string;
}

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
    },
    async getCategory(token: string): Promise<CategoryDT[]> {
        const response = await fetch(`${API_URL}/categories/view/`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        });
        const result = await response.json();
        if (!response.ok) {
            throw result
        };

        return result;
    },
    async getBrand(token: string, query: string): Promise<BrandDT[]> {
        const response = await fetch(`${API_URL}/brands/search/?query=${query}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        });
        const result = await response.json();
        if (!response.ok) {
            throw result
        };

        return result;
    },
    async postTransaction(data: TransactionDT, token: string) {
        const response = await fetch(`${API_URL}/transactions/create/`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
                body: JSON.stringify(data)
        });

        const result = await response.json();
        if (!response.ok) {
            throw result
        };

        return result;
    }
}