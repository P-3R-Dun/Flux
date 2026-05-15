import { useState } from 'react';
import { dashboardService } from '@/services/dashboard.service';

export const useWallets = () => {
    const [isLoading, setIsLoading] = useState(false);
    const updateWallet = async (id: number, data: any, token: string) => {
        setIsLoading(true);
        try {
            await dashboardService.updateWallet(id, data, token);
            return true;
        } finally {
            setIsLoading(false);
        }
    };

    const createWallet = async (data: any, token: string) => {
        setIsLoading(true);
        try {
            await dashboardService.createWallet(data, token);
            return true;
        } finally {
            setIsLoading(false);
        }
    };

    const deleteWallet = async (id: number, token: string) => {
        setIsLoading(true);
        try {
            await dashboardService.deleteWallet(id, token);
            return true;
        } finally {
            setIsLoading(false);
        }
    };

    return { updateWallet, createWallet, deleteWallet, isLoading };
};