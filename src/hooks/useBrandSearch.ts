import { dashboardService, type BrandDT } from '@/services/dashboard.service';
import { useState, useEffect } from 'react';

export const useBrandSearch = (token: string, query: string) => {
    const [results, setResults] = useState<BrandDT[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (query.length < 2) {
            return
        }
        const timer = setTimeout(async () => {
            setIsLoading(true);
            try {
                const data = await dashboardService.getBrand(token, query);
                setResults(data);
            } catch (error) {
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, [query, token]);

    return { results, isLoading };
}