import { create } from 'zustand'

interface AuthState {
    isAuthenticated: boolean;
    user: any;
    login: () => void;
    logout: () => void;
}

const hasToken = !!(
    localStorage.getItem('access') || 
    sessionStorage.getItem('access') || 
    localStorage.getItem('refresh') || 
    sessionStorage.getItem('refresh')
);

export const useAuthStore = create<AuthState>((set) => ({
    isAuthenticated: hasToken,
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
    }
}))