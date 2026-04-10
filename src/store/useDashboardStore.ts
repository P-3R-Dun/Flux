import { create } from 'zustand';
import { dashboardService, type ProfileDT } from '../services/dashboard.service';

interface DashboardState {
    profile: ProfileDT | null;
    isLoading: boolean;
    balance: number;
    error: any | null;
    fetchProfile: (token: string) => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
    profile: null,
    balance: 0,
    isLoading: false,
    error: null,
    fetchProfile: async (token) => {
        set({ isLoading: true, error: null });
        try {
            const profile = await dashboardService.getProfile(token);
            const totalBalance = profile.transactions?.reduce(
                (sum, transaction) => sum + Number(transaction.amount), 
                0
            ) || 0;
            set({ 
                profile, 
                balance: totalBalance,
                isLoading: false 
            });
        } catch (error) {
            set({ error });
        } finally {
            set({ isLoading: false });
        }
    }
}));