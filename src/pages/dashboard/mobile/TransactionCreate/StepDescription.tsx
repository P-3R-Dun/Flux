import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { useTransactionCreateStore } from '@/store/useTransactionCreateStore';
import { usePostTransaction, usePostTemplate } from '@/hooks/useTransaction';
import { TemplateModal } from '@/components/ui/shared/TemplateModal';

export const StepDescription = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('access') || sessionStorage.getItem('access');  

    const { editingId, amount, name, description, category_id, date, brand_logo_url, isTemplateMode, reset, setField } = useTransactionCreateStore();
    const { execute, isLoading } = usePostTransaction();
    const { execute: executeTemplate, isLoading: isTemplateLoading } = usePostTemplate();
    
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSubmit = async () => {
        setErrorMessage(null);

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
        
        const record = {
            id: editingId,
            amount,
            name: name || "New Record",
            description,
            category: category_id || null,
            date: date || new Date().toISOString(),
            brand_logo_url: brand_logo_url || null,
            goal: null,
            category_name: null
        };

        try {
            await execute(record, token || '');
            reset();
            navigate('/');
        } catch (error: any) {
            setErrorMessage(error?.message || "Something went wrong. Please try again.");
        }
    };

    const handleTemplateSave = async (modalTemplateName: string) => {
        setErrorMessage(null);

        const templateData = {
            template_name: modalTemplateName,
            amount: amount, 
            category: category_id || null,
            name: name || "New Record",
            description: description,
            brand_logo_url: brand_logo_url || null,
            goal: null,
            category_name: null
        }
        
        try {
            await executeTemplate(templateData, token || '');
            setIsModalOpen(false);
            reset();
            navigate('/templates'); 
        } catch (error: any) {
            setErrorMessage(error?.message || "Failed to save template. Please try again.");
        }
    }

    const isCurrentLoading = isTemplateMode ? isTemplateLoading : isLoading;

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
                    isLoading={isTemplateLoading}
                />,
                document.body
            )}
        </motion.div>
    );
};