import { create } from 'zustand'

interface AuthState {
    isAuthenticated: boolean;
    isAuthChecking: boolean;
    user: any;
    login: () => void;
    logout: () => void;
    checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    isAuthenticated: false,
    isAuthChecking: true,
    user: null,
    
    login: () => {
        set({ isAuthenticated: true })
    },
    
    logout: () => {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        sessionStorage.removeItem('access');
        sessionStorage.removeItem('refresh');
        set({ isAuthenticated: false, user: null, isAuthChecking: false });
    },
    
    checkAuth: () => {
        const hasAccess = !!(localStorage.getItem('access') || sessionStorage.getItem('access'));
        const hasRefresh = !!(localStorage.getItem('refresh') || sessionStorage.getItem('refresh'));

        if (hasAccess || hasRefresh) {
            set({ isAuthenticated: true, isAuthChecking: false });
            set({ isAuthenticated: false, isAuthChecking: false, user: null });
        }
    },
}))