import { useState } from 'react';
import { extractErrorMessage } from './useAuth'
import { dashboardService } from '../services/dashboard.service'
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/useAuthStore';

export const useSetName = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const setName = async (token: string, first_name: string, last_name: string) => {
        setIsLoading(true);
        setError(null);
        try {
            await authService.setName(token, first_name, last_name);
            setIsSuccess(true);
        } catch (error: any) {
            const msg = extractErrorMessage(error, "Failed to change name");
            setError(msg);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }

    return { setName, isLoading, isSuccess, error }
}

export const useSetAvatar = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const setAvatar = async (token: string, file: File) => {
        setIsLoading(true);
        setError(null);
        setIsSuccess(false);

        try {
            await dashboardService.updateAvatar(token, file);
            setIsSuccess(true);
        } catch (err: any) {
            const msg = err?.detail || "Failed to upload avatar";
            setError(msg);
            throw err; 
        } finally {
            setIsLoading(false);
        }
    };

    return { setAvatar, isLoading, isSuccess, error };
};

export const useDeleteAccount = () => {
    const [isLoading, setIsLoading] = useState(false);
    const logout = useAuthStore(state => state.logout);

    const executeDelete = async (token: string) => {
        setIsLoading(true);
        try {
            await dashboardService.deleteAccount(token);
            logout();
            return true;
        } finally {
            setIsLoading(false);
        }
    };

    return { executeDelete, isLoading };
};