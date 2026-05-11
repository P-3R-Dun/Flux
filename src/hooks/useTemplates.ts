import { useState, useCallback } from 'react';
import { dashboardService, type TemplateDT } from '@/services/dashboard.service'; 

export const useTemplates = () => {
    const [templates, setTemplates] = useState<TemplateDT[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isMutating, setIsMutating] = useState(false); 
    const [error, setError] = useState<any | null>(null);

    const fetchTemplates = useCallback(async (token: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await dashboardService.getTemplates(token);
            setTemplates(data);
        } catch (err) {
            setError(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const updateTemplate = useCallback(async (id: number, data: Partial<TemplateDT>, token: string) => {
        setIsMutating(true);
        setError(null);
        try {
            const updatedTemplate = await dashboardService.updateTemplate(id, data, token);
            setTemplates(prev => prev.map(t => t.id === id ? { ...t, ...updatedTemplate } : t));
            return updatedTemplate;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setIsMutating(false);
        }
    }, []);

    const deleteTemplate = useCallback(async (id: number, token: string) => {
        setIsMutating(true);
        setError(null);
        try {
            await dashboardService.deleteTemplate(id, token);
            setTemplates(prev => prev.filter(t => t.id !== id));
            return true;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setIsMutating(false);
        }
    }, []);

    return {
        templates,
        isLoading,
        isMutating,
        error,
        fetchTemplates,
        updateTemplate,
        deleteTemplate
    };
};