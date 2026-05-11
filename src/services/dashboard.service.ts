import { customFetch } from "./customFetch";

const IP = import.meta.env.VITE_SERVER_IP;
const API_URL = `http://${IP}:8000/api/finance`;

export interface CategoryDT {
    id: string; 
    name: string; 
    type: 'expense' | 'income'; 
    icon_name: string | null; 
    is_default: boolean;
}

export interface WalletDT {
    id: number;
    name: string;
    currency: string;
    icon_name: string;
    is_active: boolean;
}

export interface TransactionDT {
    id?: number; 
    amount: string | number; 
    date: string;
    name: string; 
    description: string; 
    brand_logo_url: string | null;
    category: string | null;
    goal: string | null; 
    category_name?: string | null; 
    wallet?: number | null;
}

export interface ProfileDT {
    first_name: string; 
    last_name: string; 
    email: string; 
    username: string; 
    focus_streak: number; 
    profile_picture: string | null; 
    transactions: TransactionDT[];
    wallets: WalletDT[];
}

export interface BrandDT {
    name: string;
    domain: string;
    brand_logo_url: string;
}

export interface TemplateDT {
    id: number;
    template_name: string;
    amount: string | number | null;
    category: string | null;
    name: string;
    description: string;
    brand_logo_url: string | null;
    category_name?: string | null;
    wallet?: number | null;
}

export const dashboardService = {
    async getProfile(): Promise<ProfileDT> {
        const response = await customFetch(`${API_URL}/profile/me/`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
        const result = await response.json();
        if (!response.ok) {
            throw result;
        }
        return result;
    },
    async getCategory(): Promise<CategoryDT[]> {
        const response = await customFetch(`${API_URL}/categories/view/`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
        const result = await response.json();
        if (!response.ok) {
            throw result;
        }
        return result;
    },
    async getBrand(query: string): Promise<BrandDT[]> {
        const response = await customFetch(`${API_URL}/brands/search/?query=${query}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
        const result = await response.json();
        if (!response.ok) {
            throw result;
        }
        return result;
    },
    async postTransaction(data: TransactionDT) {
        const response = await customFetch(`${API_URL}/transactions/create/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        if (!response.ok) {
            throw result;
        }
        return result;
    },
    async updateTransaction(id: number, data: TransactionDT) {
        const response = await customFetch(`${API_URL}/transactions/${id}/update/`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        if (!response.ok) {
            throw result;
        }
        return result;
    },
    async deleteTransaction(id: number) {
        const response = await customFetch(`${API_URL}/transactions/${id}/delete/`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) {
            const result = await response.json();
            throw result;
        }
        return true;
    },
    async postTemplate(data: Omit<TransactionDT, "id" | "date" | "amount" | "category"> & { 
        template_name: string; 
        amount: number | string | null; 
        category: string | null; 
    }) {
        const response = await customFetch(`${API_URL}/templates/create/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            const result = await response.json();
            throw result;
        }
        return true;
    },
    async getTemplates(): Promise<TemplateDT[]> {
        const response = await customFetch(`${API_URL}/templates/view/`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
        const result = await response.json();
        if (!response.ok) {
            throw result;
        }
        return result;
    },
    async updateTemplate(id: number, data: Partial<TemplateDT>) {
        const response = await customFetch(`${API_URL}/templates/${id}/update/`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        if (!response.ok) {
            throw result;
        }
        return result;
    },
    async deleteTemplate(id: number) {
        const response = await customFetch(`${API_URL}/templates/${id}/delete/`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) {
            const result = await response.json();
            throw result;
        }
        return true;
    },
    async updateAvatar(file: File) {
        const formData = new FormData();
        formData.append('profile_picture', file); 
        const response = await customFetch(`${API_URL}/profile/me/`, {
            method: 'PATCH',
            body: formData,
        });
        if (!response.ok) throw await response.json();
        return true;
    },
    async createWallet(data: { name: string, currency: string, icon_name: string }) {
        const response = await customFetch(`${API_URL}/wallets/create/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw await response.json();
        return await response.json();
    },
    async updateWallet(id: number, data: Partial<WalletDT>) {
        const response = await customFetch(`${API_URL}/wallets/${id}/update/`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw await response.json();
        return await response.json();
    },
    async deleteWallet(id: number) {
        const response = await customFetch(`${API_URL}/wallets/${id}/delete/`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) {
            const result = await response.json();
            throw result;
        }
        return true;
    },
    async getWallets(): Promise<WalletDT[]> {
        const response = await customFetch(`${API_URL}/wallets/view/`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
        const result = await response.json();
        if (!response.ok) {
            throw result;
        }
        return result;
    },
    async sendFeedback(message: string) {
        const response = await customFetch(`${API_URL}/feedback/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw errorData;
        }
        return await response.json();
    },
    async deleteAccount() {
        const response = await customFetch(`${API_URL}/profile/delete/`, {
            method: 'DELETE'
        });
        if (!response.ok) throw await response.json();
        return true;
    }
};