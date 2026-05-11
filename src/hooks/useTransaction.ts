import { useState, useCallback } from 'react';
import { dashboardService, type TransactionDT } from '@/services/dashboard.service';

export const usePostTransaction = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<any>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const execute = useCallback(async (data: TransactionDT) => {
        setIsLoading(true);
        setError(null);
        setIsSuccess(false);

        try {
            const result = data.id 
            ? await dashboardService.updateTransaction(data.id, data)
            : await dashboardService.postTransaction(data);
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

    const execute = useCallback(async (transactionId: number) => {
        setIsLoading(true);
        setError(null);
        setIsSuccess(false);
        try {
            const result = await dashboardService.deleteTransaction(transactionId);
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

export const usePostTemplate = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<any>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const execute = useCallback(async (data: Omit<TransactionDT, "id" | "date" | "amount" | "category"> & { 
        template_name: string;
        amount: number | string| null;
        category: string | null;
     }) => {
        setIsLoading(true);
        setError(null);
        setIsSuccess(false);
        try {
            const result = await dashboardService.postTemplate(data);
            setIsSuccess(true);
            return result;
        } catch (err) {
            setError(err);
            setIsSuccess(false);
            throw err;
        } finally {
            setIsLoading(false);
        }   }, []);

    return { execute, isLoading, error, isSuccess };
};