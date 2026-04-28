import { useState, useCallback } from 'react';
import { dashboardService, type TransactionDT } from '@/services/dashboard.service';

export const usePostTransaction = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<any>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const execute = useCallback(async (data: TransactionDT, token: string) => {
        setIsLoading(true);
        setError(null);
        setIsSuccess(false);

        try {
            const result = data.id 
            ? await dashboardService.updateTransaction(data.id, data, token)
            : await dashboardService.postTransaction(data, token);
            setIsSuccess(true);
            return result;
        } catch (err) {
            setError(err);
            setIsSuccess(false);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { execute, isLoading, error, isSuccess };
};

export const useDeleteTransaction = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<any>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const execute = useCallback(async (transactionId: number, token: string) => {
        setIsLoading(true);
        setError(null);
        setIsSuccess(false);
        try {
            const result = await dashboardService.deleteTransaction(transactionId, token);
            setIsSuccess(true);
            return result;
        } catch (err) {
            setError(err);
            setIsSuccess(false);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { execute, isLoading, error, isSuccess };
};