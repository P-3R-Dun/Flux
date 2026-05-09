import { useState } from 'react';
import { dashboardService } from '@/services/dashboard.service';

export const useFeedback = () => {
    const [isLoading, setIsLoading] = useState(false);

    const postFeedback = async (message: string, token: string) => {
        setIsLoading(true);
        try {
            await dashboardService.sendFeedback(message, token);
            return true;
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return { postFeedback, isLoading };
};