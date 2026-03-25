import { create } from 'zustand'

interface AuthState {
    isAuthenticated: boolean;
    user: any;
    login: () => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    isAuthenticated: !!(localStorage.getItem('access') || sessionStorage.getItem('access')),
    user: null,
    login: () => {
        set({ isAuthenticated: true })
    },
    logout: () => {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        sessionStorage.removeItem('access');
        sessionStorage.removeItem('refresh');
        set({ isAuthenticated: false, user: null });
    },
}))
