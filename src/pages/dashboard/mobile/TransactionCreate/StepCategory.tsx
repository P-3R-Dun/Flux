import { motion, type Variants } from 'framer-motion';
import { icons } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTransactionCreateStore } from '@/store/useTransactionCreateStore'; 
import { useDashboardData } from '@/hooks/useDashboardData';

const DynamicIcon = ({ name, className }: { name: string; className?: string }) => {
    const LucideIcon = icons[name as keyof typeof icons];
    if (!LucideIcon) {
        const FallBackIcon = icons['CircleQuestionMark'];
        return <FallBackIcon className={className}/>;
    }
    
    return <LucideIcon className={className}/>;
}

export const StepCategory = () => {
    const { category_id, amount, name, brand_logo_url, isTemplateMode, nextStep, setField, setStep, editingId } = useTransactionCreateStore();    const transactionType = (amount < 0 || Object.is(amount, -0)) ? 'expense' : 'income';
    const [localCategory, setLocalCategory] = useState(category_id || '');
    const { fetchCategories, isLoadingCategories, categories } = useDashboardData();

    useEffect(() => {
        if (categories.length === 0) {
            fetchCategories();
        }
    }, [categories.length, fetchCategories]);

    const handleSubmit = () => {
        setField('category_id', localCategory);
        if (isTemplateMode) {
            setStep(4);
        } else {
            if (!editingId && name && brand_logo_url !== null) {
                setStep(5);
            } else {
                nextStep();
            }
        }
    }

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } },
        exit: { opacity: 0, transition: { staggerChildren: 0.05, staggerDirection: -1 } }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
        exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
    };

    const categoryGridVariants: Variants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } }
    };

    const categoryKeyVariants: Variants = {
        hidden: { opacity: 0, scale: 0.8, y: 10 },
        show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 400, damping: 20 } }
    };

    return (
        <motion.div 
            className="flex flex-col flex-1 pt-12 px-5 pb-8 h-full"
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit="exit"
        >
            <motion.div variants={itemVariants} className='flex flex-col items-center mb-8 shrink-0'>
                <h1 className='text-2xl font-bold text-white mb-2'>Choose your category</h1>
                <h2 className='text-gray-400 text-center px-4'>Choose which category mostly describe your record</h2>
            </motion.div>
            
            <motion.div 
                key={categories.length}
                variants={categoryGridVariants}
                initial='hidden'
                animate='show'
                className='grid grid-cols-3 gap-3 mb-auto min-h-0 overflow-y-auto scrollbar-hide'
            >
                {categories.filter((category) => category.type === transactionType).map((category) => {
                    const isActive = category.id === localCategory;
                    return (
                        <motion.div
                            key={category.id}
                            variants={categoryKeyVariants}
                            onClick={() => setLocalCategory(category.id)} 
                            whileHover={{ scale: 1.03, backgroundColor: '#3A4368' }}
                            whileTap={{ scale: 0.95 }}
                            className={`relative flex flex-col items-center justify-center p-3 h-28 rounded-2xl cursor-pointer transition-colors duration-200 select-none ${
                                isActive ? 'bg-[#3A4368] border border-[#6B79B5]' : 'bg-[#252836] border border-transparent'
                            }`}
                        >
                            {isActive && (
                                <motion.div 
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="absolute top-2 right-2 text-white"
                                >
                                    <icons.CircleCheck className="w-4 h-4" />
                                </motion.div>
                            )}
                            <DynamicIcon 
                                name={category.icon_name || 'CircleQuestionMark'}
                                className={`w-8 h-8 mb-2 transition-colors ${isActive ? 'text-white' : 'text-[#5C6170]'}`}
                            />
                            <span className={`text-[12px] font-medium text-center leading-tight transition-colors ${isActive ? 'text-white' : 'text-[#5C6170]'}`}>
                                {category.name}
                            </span>
                        </motion.div>
                    );
                })}
            </motion.div>

            <motion.div variants={itemVariants} className="mt-8 shrink-0">
                <motion.button
                    onClick={handleSubmit}
                    disabled={(!localCategory && !isTemplateMode) || isLoadingCategories}
                    whileHover={{ scale: (!localCategory || isLoadingCategories) ? 1 : 1.02 }} 
                    whileTap={{ scale: (!localCategory || isLoadingCategories) ? 1 : 0.98 }} 
                    className={`w-full rounded-2xl p-4 text-lg flex items-center justify-center select-none text-white transition-all duration-300 ${
                        ((!localCategory && !isTemplateMode) || isLoadingCategories) 
                            ? 'bg-button-disabled-gradient cursor-not-allowed' 
                            : 'bg-button-gradient'
                    }`}
                >
                    Continue
                </motion.button>
            </motion.div>
        </motion.div>
    );
}