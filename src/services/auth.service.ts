import { customFetch } from "./customFetch";

const IP = import.meta.env.VITE_SERVER_IP;
const API_URL = `${IP}/api/auth`;

interface LoginDT { username: string; password: string; }
interface RegisterDT { email: string; username: string; password: string; }
interface ResetConfirmDT { new_password: string; re_new_password: string; uid: string; token: string; }
interface ActivateAccountDT { uid: string; token: string; }
interface RecoverAccountDT { email: string; }

export const authService = {
    async login(data: LoginDT) {
        const response = await fetch(`${API_URL}/jwt/create/`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json',},
                body: JSON.stringify(data)
        });

        const result = await response.json();
        if (!response.ok) {
            throw result
        };

        return result;
    },

    async register(data: RegisterDT) {
        const response = await fetch(`${API_URL}/users/`,{
            method: 'POST',
                headers: {'Content-Type': 'application/json',},
                body: JSON.stringify(data)
        });
        
        const result = await response.json();
        if (!response.ok) {
            throw result
        };

        return result;
    },

    async sendResetLink(email: string) {
        const response = await fetch(`${API_URL}/users/reset_password/`, {
            method:'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });

        if (response.ok) { return true };
        const result = await response.json();
        throw result;
    },

    async confirmPasswordReset(data: ResetConfirmDT) {
        const response = await fetch(`${API_URL}/users/reset_password_confirm/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (response.ok) { return true };
        const result = await response.json();
        throw result;
    },

    async ActivateAccount(data: ActivateAccountDT) {
        const response = await fetch(`${API_URL}/users/activation/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (response.ok) { return true };
        const result = await response.json();
        throw result;
    },

    async RecoverAccount(data: RecoverAccountDT) {
        const response = await fetch(`${API_URL}/recover/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (response.ok) { return true };
        const result = await response.json().catch(() => ({ error: 'No info' }));
        throw result;
    },

    async setPassword(current_password: string, new_password: string) {
        const response = await customFetch(`${API_URL}/users/set_password/`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({current_password, new_password}),
        });

        if (response.ok) { return true }
        const result = await response.json();
        throw result;
    },

    async setName (first_name: string, last_name: string) {
        const response = await customFetch(`${API_URL}/users/me/`, {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({first_name, last_name}),
        });

        if (response.ok) { return true }
        const result = await response.json();
        throw result;
    }
}