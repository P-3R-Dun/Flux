import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTransactionCreateStore } from '@/store/useTransactionCreateStore';
import { usePostTransaction } from '@/hooks/useTransaction';

export const StepDescription = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('access') || sessionStorage.getItem('access');  

    const { editingId, amount, name, description, category_id, date, brand_logo_url, reset, setField } = useTransactionCreateStore();
    const { execute, isLoading } = usePostTransaction();
    
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSubmit = async () => {
        setErrorMessage(null);

        const record = {
            id: editingId,
            amount,
            name: name || "New Record",
            description,
            category: category_id,
            date: date || new Date().toISOString(),
            brand_logo_url,
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

    return (
        <motion.div className='flex flex-col min-h-[80vh]'>            
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
                    disabled={isLoading}
                    whileHover={{ scale: isLoading ? 1 : 1.02 }} 
                    whileTap={{ scale: isLoading ? 1 : 0.96 }}
                    className={`w-full rounded-2xl p-4 text-lg flex items-center justify-center select-none text-white transition-all duration-300 ${
                        isLoading ? 'bg-slate-700 cursor-not-allowed' : 'bg-button-gradient shadow-lg'
                    }`}
                >
                    {isLoading ? (
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        'Confirm'
                    )}
                </motion.button>
            </div>
        </motion.div>
    );
};