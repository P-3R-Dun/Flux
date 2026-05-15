import { useState } from 'react';
import { dashboardService } from '@/services/dashboard.service';

export const useWallets = () => {
    const [isLoading, setIsLoading] = useState(false);
    const updateWallet = async (id: number, data: any) => {
        setIsLoading(true);
        try {
            await dashboardService.updateWallet(id, data);
            return true;
        } finally {
            setIsLoading(false);
        }
    };

    const createWallet = async (data: any) => {
        setIsLoading(true);
        try {
            await dashboardService.createWallet(data);
            return true;
        } finally {
            setIsLoading(false);
        }
    };

    const deleteWallet = async (id: number) => {
        setIsLoading(true);
        try {
            await dashboardService.deleteWallet(id);
            return true;
        } finally {
            setIsLoading(false);
        }
    };

    return { updateWallet, createWallet, deleteWallet, isLoading };
};