import { dashboardService, type BrandDT } from '@/services/dashboard.service';
import { useState, useEffect } from 'react';

export const useBrandSearch = (query: string) => {
    const [results, setResults] = useState<BrandDT[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (query.length < 2) {
            return
        }
        const timer = setTimeout(async () => {
            setIsLoading(true);
            try {
                const data = await dashboardService.getBrand(query);
                setResults(data);
            } catch (error) {
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, [query]);

    return { results, isLoading };
}