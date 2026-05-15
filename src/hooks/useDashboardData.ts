import { useState, useCallback, useMemo } from 'react';
import { dashboardService } from '@/services/dashboard.service';
import { useDashboardStore } from '@/store/useDashboardStore';

export const useDashboardData = () => {
    const { profile, categories, setProfile, setCategories } = useDashboardStore();

    const [isLoadingProfile, setIsLoadingProfile] = useState(false);
    const [isLoadingCategories, setIsLoadingCategories] = useState(false);

    const [profileError, setProfileError] = useState<any | null>(null);
    const [categoriesError, setCategoriesError] = useState<any | null>(null);

    const fetchProfile = useCallback(async () => {
        setIsLoadingProfile(true);
        setProfileError(null);
        try {
            const data = await dashboardService.getProfile();
            setProfile(data);
        } catch (error) {
            setProfileError(error);
        } finally {
            setIsLoadingProfile(false);
        }
    }, [setProfile]);

    const fetchCategories = useCallback(async () => {
        setIsLoadingCategories(true);
        setCategoriesError(null);
        try {
            const data = await dashboardService.getCategory();
            setCategories(data);
        } catch (error) {
            setCategoriesError(error);
        } finally {
            setIsLoadingCategories(false);
        }
    }, [setCategories]);

    const fetchAllDashboardData = useCallback(async () => {
        setIsLoadingProfile(true);
        setIsLoadingCategories(true);
        setProfileError(null);
        setCategoriesError(null);
        
        try {
            const [profileData, categoriesData] = await Promise.all([
                dashboardService.getProfile(),
                dashboardService.getCategory()
            ]);
            setProfile(profileData);
            setCategories(categoriesData);
        } catch (error) {
            setProfileError(error);
            setCategoriesError(error);
        } finally {
            setIsLoadingProfile(false);
            setIsLoadingCategories(false);
        }
    }, [setProfile, setCategories]);

    const balance = useMemo(() => {
        if (!profile?.transactions || !profile?.wallets) return 0;
        
        const activeWallet = profile.wallets.find(w => w.is_active);
        if (!activeWallet) return 0;

        return profile.transactions
            .filter(t => t.wallet === activeWallet.id)
            .reduce(
                (sum, transaction) => sum + Number(transaction.amount),
                0
            );
    }, [profile]);

    return {
        profile,
        categories,
        balance,
        isLoadingProfile,
        profileError,
        fetchProfile,
        isLoadingCategories,
        categoriesError,
        fetchCategories,
        fetchAllDashboardData
    };
};