import { create } from 'zustand'
import { authService } from '../services/auth.service';
interface AuthState {
    isAuthenticated: boolean;
    isAuthChecking: boolean;
    user: any;
    login: () => void;
    logout: () => void;
    checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
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
    checkAuth: async () => {
        const token = localStorage.getItem('access') || sessionStorage.getItem('access');
        if (!token) {
            set({ isAuthenticated: false, isAuthChecking: false, user: null });
            return;
        }
        try {
            await authService.verifyToken(token);
            set({ isAuthenticated: true, isAuthChecking: false });
        } catch (error) {
            get().logout();
        }
    },
}))
