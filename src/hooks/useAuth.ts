import { useCallback, useState } from 'react'
import { authService } from '../services/auth.service'
import { useAuthStore } from '../store/useAuthStore';

export const extractErrorMessage = (error: any, defaultMsg: string): string => {
    if (typeof error === 'object' && error !== null) {
        if (error.detail) return error.detail;
        const messages = Object.values(error)
            .flat()
            .filter(item => typeof item === 'string');
        if (messages.length > 0) return messages[0] as string;
    }
    return error?.message || defaultMsg;
};

export const useLogin = () => {
    const setAuth = useAuthStore(state => state.login);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const login = async (username: string, password: string, rememberMe: boolean) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await authService.login({ username, password });
            const storage = rememberMe ? localStorage : sessionStorage;
            storage.setItem('access', data.access);
            storage.setItem('refresh', data.refresh);
            setAuth();
        } catch (error: any) {
            const msg = extractErrorMessage(error, "Login Error");
            setError(msg);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return { isLoading, error, login };
}

export const useRegister = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);
    
    const register = async (email: string, username: string, password: string, confirm_password: string) => {
        setIsLoading(true);
        setError(null);
        
        if (password !== confirm_password) {
            setError('Passwords do not match!');
            setIsLoading(false);
            throw new Error('Passwords do not match!');
        }

        try {
            await authService.register({ email, username, password });
            setIsSuccess(true);
        } catch (error: any) {
            const msg = extractErrorMessage(error, "Registration Error");
            setError(msg);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return { isLoading, error, isSuccess, register };
}

export const useResetSend = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const resetPasswordSend = async (email: string) => {
        setIsLoading(true);
        setError(null);
        try {
            await authService.sendResetLink(email);
            setIsSuccess(true);
        } catch (error: any) {
            const msg = extractErrorMessage(error, "Failed to send reset link");
            setError(msg);
            throw error;
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
        setError(null);
        try {
            await authService.confirmPasswordReset({ new_password, re_new_password, uid, token });
            setIsSuccess(true);
        } catch (error: any) {
            const msg = extractErrorMessage(error, "Failed to reset password");
            setError(msg);
            throw error;
        } finally {
            setIsLoading(false);
        };
    }

    return { isLoading, error, isSuccess, resetPassword }
};

export const useActivateAccount = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const activateAccount = useCallback(async (uid: string, token: string) => {
        setIsLoading(true);
        setError(null);
        try {
            await authService.ActivateAccount({ uid, token });
            setIsSuccess(true);
        } catch (error: any) {
            const msg = extractErrorMessage(error, "Failed to activate account");
            setError(msg);
            throw error;
        } finally {
            setIsLoading(false);
        };
    }, []);

    return { isLoading, isSuccess, error, activateAccount }
};

export const useRecoverAccount = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const recover = async (email: string) => {
        setIsLoading(true);
        setError(null);
        try {
            await authService.RecoverAccount({ email });
            setIsSuccess(true);
        } catch (error: any) {
            const msg = extractErrorMessage(error, "Failed to recover account");
            setError(msg);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }

    return { recover, isLoading, isSuccess, error }; 
}

export const useSetPassword = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const setPassword = async (token: string, current_password: string, new_password: string) => {
        setIsLoading(true);
        setError(null);
        try {
            await authService.setPassword(token, current_password, new_password);
            setIsSuccess(true);
        } catch (error: any) {
            const msg = extractErrorMessage(error, "Failed to change password");
            setError(msg);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }

    return { setPassword, isLoading, isSuccess, error }
}