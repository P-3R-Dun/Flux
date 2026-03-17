import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface RegisterState {
    step: number;
    email: string;
    username: string;
    password: string;
    setCurrentStep: (step: number) => void;
    setEmail: (email: string) => void;
    setUsername: (username: string) => void;
    setPassword: (password: string) => void;    
}

export const useRegisterStore = create<RegisterState>()(
    persist(
        (set) => ({
            step: 1,
            email: '',
            username: '',
            password: '',
            setCurrentStep: (step) => set({ step }),
            setEmail: (email) => set({ email }),
            setUsername: (username) => set({ username }),
            setPassword: (password) => set({ password }),
        }),
        {
            name: 'register-storage',
            partialize: (state) => ({
                step: state.step,
                email: state.email,
                username: state.username
            }),
        }
    )
)