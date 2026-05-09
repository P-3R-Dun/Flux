import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { useTransactionCreateStore } from '@/store/useTransactionCreateStore';
import { usePostTransaction, usePostTemplate } from '@/hooks/useTransaction';
import { TemplateModal } from '@/components/ui/shared/TemplateModal';
import { useTemplates } from '@/hooks/useTemplates'; 
import { useDashboardStore } from '@/store/useDashboardStore';

export const StepDescription = () => {
    const navigate = useNavigate();
    // Убираем получение токена отсюда, чтобы избежать "старого" состояния React
    
    const { editingId, amount, name, description, category_id, date, brand_logo_url, isTemplateMode, reset, setField } = useTransactionCreateStore();
    const { execute, isLoading } = usePostTransaction();
    const { execute: executeTemplate, isLoading: isTemplateLoading } = usePostTemplate();
    const { updateTemplate, isMutating: isTemplateUpdating } = useTemplates();
    const profile = useDashboardStore((state) => state.profile);
    
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSubmit = async () => {
        setErrorMessage(null);

        // 1. Берем самый свежий токен прямо в момент клика (как в консоли)
        const currentToken = localStorage.getItem('access') || sessionStorage.getItem('access');
        
        if (!currentToken) {
            setErrorMessage("Authorization error: Please log in again.");
            return;
        }

        if (isTemplateMode) {
            const hasAnyData = 
                (amount !== 0 && amount !== null && amount !== undefined) || 
                (category_id && String(category_id).trim() !== '') || 
                (name && String(name).trim() !== '') || 
                (description && String(description).trim() !== '');

            if (!hasAnyData) {
                setErrorMessage("Template cannot be empty. Fill at least one field.");
                return;
            }

            setIsModalOpen(true);
            return;
        }
        
        // 2. Строго находим активный счет
        const activeWallet = profile?.wallets?.find(w => w.is_active) || profile?.wallets?.[0];
        
        if (!activeWallet) {
            setErrorMessage("Error: No active wallet found to assign this transaction.");
            return;
        }

        const record = {
            id: editingId,
            amount,
            name: name || "New Record",
            description,
            category: category_id || null,
            date: date || new Date().toISOString(),
            brand_logo_url: brand_logo_url || null,
            goal: null,
            category_name: null,
            wallet: activeWallet.id, // Гарантированно передаем ID
        };

        try {
            // Передаем свежий токен
            await execute(record, currentToken.trim());
            reset();
            navigate('/');
        } catch (error: any) {
            console.error("API Error:", error);
            setErrorMessage(error?.detail || error?.message || "Something went wrong. Please try again.");
        }
    };

    const handleTemplateSave = async (modalTemplateName: string) => {
        setErrorMessage(null);
        
        const currentToken = localStorage.getItem('access') || sessionStorage.getItem('access');
        if (!currentToken) {
            setErrorMessage("Authorization error: Please log in again.");
            return;
        }

        const activeWallet = profile?.wallets?.find(w => w.is_active) || profile?.wallets?.[0];

        const templateData = {
            template_name: modalTemplateName,
            amount: amount, 
            category: category_id || null,
            name: name || "New Record",
            description: description,
            brand_logo_url: brand_logo_url || null,
            goal: null,
            category_name: null,
            wallet: activeWallet?.id || null,
        }
        
        try {
            if (editingId) {
                await updateTemplate(editingId, templateData, currentToken.trim());
            } else {
                await executeTemplate(templateData, currentToken.trim());
            }
            
            setIsModalOpen(false);
            reset();
            navigate('/templates'); 
        } catch (error: any) {
            console.error("Template Save Error:", error);
            setErrorMessage(error?.detail || error?.message || "Failed to save template.");
        }
    }

    const isCurrentLoading = isTemplateMode ? (isTemplateLoading || isTemplateUpdating) : isLoading;
    const isModalLoading = isTemplateLoading || isTemplateUpdating;

    return (
        <motion.div className='flex flex-col min-h-[80vh] relative'>            
            <div className='flex flex-col items-center mb-10'>
                <h1 className='text-[22px] font-semibold text-white mb-1'>The Description (optional)</h1>
                <h2 className='text-slate-400 text-sm'>Shortly describe your record if you want</h2>    
            </div>
            
            <AnimatePresence>
                {errorMessage && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-xl text-center text-sm"
                    >
                        {errorMessage}
                    </motion.div>
                )}
            </AnimatePresence>
            
            <div className='flex-1 flex items-center justify-center'>
                <textarea 
                    value={description}
                    onChange={(e) => setField('description', e.target.value)}
                    placeholder="Type here"
                    className='w-full bg-transparent text-center text-2xl text-white outline-none resize-none placeholder:text-slate-600'
                    rows={4} 
                    autoFocus
                />
            </div>

            <div className="mt-8 px-4 pb-8 flex flex-col gap-4">
                <motion.button 
                    onClick={handleSubmit}
                    disabled={isCurrentLoading}
                    whileHover={{ scale: isCurrentLoading ? 1 : 1.02 }} 
                    whileTap={{ scale: isCurrentLoading ? 1 : 0.96 }}
                    className={`w-full rounded-2xl p-4 text-lg flex items-center justify-center select-none text-white transition-all duration-300 ${
                        isCurrentLoading ? 'bg-slate-700 cursor-not-allowed' : 'bg-button-gradient shadow-lg'
                    }`}
                >
                    {isCurrentLoading ? (
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        isTemplateMode ? 'Continue' : 'Confirm'
                    )}
                </motion.button>
            </div>

            {document.body && createPortal(
                <TemplateModal 
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleTemplateSave}
                    isLoading={isModalLoading}
                />,
                document.body
            )}
        </motion.div>
    );
};