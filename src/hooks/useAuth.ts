import { useState } from 'react'
import { authService } from '../services/auth.service'
import { useAuthStore } from '../store/useAuthStore';

export const useLogin = () => {
    const setAuth = useAuthStore(state => state.login);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const login = async (username: string, password: string, rememberMe: boolean) => {
        setIsLoading(true);
        try {
            const data = await authService.login({username, password});
            const storage = rememberMe ? localStorage : sessionStorage;
            storage.setItem('access', data.access);
            storage.setItem('refresh', data.refresh);
            setAuth();
            }
            catch (error: any) {
                setError("Login Error: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return { isLoading, error, login };
}

export const useRegister = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const register = async (email: string, username: string, password: string, confirm_password: string) => {
        setIsLoading(true);
        if (password !== confirm_password) {
            setError('Password is not identical!');
            setIsLoading(false)
            return;
        }

        try {
            await authService.register({email, username, password});
        } catch (error: any) {
            setError("Registration Error: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return { isLoading, error, register };
}

export const useResetSend = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const resetPasswordSend = async (email: string) => {
        setIsLoading(true);
        try {
            await authService.sendResetLink(email);
            setIsSuccess(true);
        } catch (error: any) {
            setError('Reset Password Error: ' + error.message)
        } finally {
            setIsLoading(false);
        };
    };

    return { resetPasswordSend, isLoading, error, isSuccess };
};

export const useReset = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const resetPassword = async (new_password: string, re_new_password: string, uid: string, token: string) => {
        setIsLoading(true);
        try {
            await authService.confirmPasswordReset({new_password, re_new_password, uid, token });
            setIsSuccess(true);
            } catch (error: any) {
                setError('Change Password Error: ' + error.message)
            } finally {
                setIsLoading(false);
        };
    }

    return { isLoading, error, isSuccess, resetPassword }
};