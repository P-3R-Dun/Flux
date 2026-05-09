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
    async getProfile(token: string): Promise<ProfileDT> {
        const response = await fetch(`${API_URL}/profile/me/`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token.trim()}` },
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
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token.trim()}` },
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
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token.trim()}` },
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
                headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token.trim()}`},
                body: JSON.stringify(data)
        });

        const result = await response.json();
        if (!response.ok) {
            throw result
        };

        return result;
    },
    async updateTransaction(id: number, data: TransactionDT, token: string) {
        const response = await fetch(`${API_URL}/transactions/${id}/update/`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token.trim()}`},
                body: JSON.stringify(data)
        });

        const result = await response.json();
        if (!response.ok) {
            throw result
        };

        return result;
    },

    async deleteTransaction(id: number, token: string) {
        const response = await fetch(`${API_URL}/transactions/${id}/delete/`, {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token.trim()}`},
        });

        if (!response.ok) {
            const result = await response.json();
            throw result
        };

        return true;
    },

    async postTemplate(data: Omit<TransactionDT, "id" | "date" | "amount" | "category"> & { 
        template_name: string; 
        amount: number | string | null; 
        category: string | null; 
    }, token: string) {
        const response = await fetch(`${API_URL}/templates/create/`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token.trim()}`},
                body: JSON.stringify(data)
        });

        if (!response.ok) {
            const result = await response.json();
            throw result
        };

        return true;
    },

    async getTemplates(token: string): Promise<TemplateDT[]> {
        const response = await fetch(`${API_URL}/templates/view/`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token.trim()}` },
        });
    
        const result = await response.json();
        if (!response.ok) {
            throw result;
        }
        return result;
    },

    async updateTemplate(id: number, data: Partial<TemplateDT>, token: string) {
        const response = await fetch(`${API_URL}/templates/${id}/update/`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token.trim()}` },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (!response.ok) {
            throw result;
        }

        return result;
    },

    async deleteTemplate(id: number, token: string) {
        const response = await fetch(`${API_URL}/templates/${id}/delete/`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token.trim()}` },
        });

        if (!response.ok) {
            const result = await response.json();
            throw result;
        }

        return true;
    },

    async updateAvatar(token: string, file: File) {
        const formData = new FormData();
        formData.append('profile_picture', file); 

        const response = await fetch(`${API_URL}/profile/me/`, {
            method: 'PATCH',
            headers: {'Authorization': `Bearer ${token.trim()}`},
            body: formData,
        });

        if (!response.ok) throw await response.json();
        return true;
    },

    async createWallet(data: { name: string, currency: string, icon_name: string }, token: string) {
        const response = await fetch(`${API_URL}/wallets/create/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token.trim()}` },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw await response.json();
        return await response.json();
    },

    async updateWallet(id: number, data: Partial<WalletDT>, token: string) {
        const response = await fetch(`${API_URL}/wallets/${id}/update/`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token.trim()}` },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw await response.json();
        return await response.json();
    },

    async deleteWallet(id: number, token: string) {
        const response = await fetch(`${API_URL}/wallets/${id}/delete/`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token.trim()}` },
        });

        if (!response.ok) {
            const result = await response.json();
            throw result;
        }

        return true;
    },

    async getWallets(token: string): Promise<WalletDT[]> {
        const response = await fetch(`${API_URL}/wallets/view/`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token.trim()}` },
        });

        const result = await response.json();
        if (!response.ok) {
            throw result;
        }
        return result;
    },

    async sendFeedback(message: string, token: string) {
    const response = await fetch(`${API_URL}/feedback/`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token.trim()}`},
            body: JSON.stringify({ message })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw errorData;
        }

        return await response.json();
    }
}