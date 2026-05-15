import { motion, type Variants } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { Delete } from 'lucide-react';
import { useDashboardStore } from '@/store/useDashboardStore';
import { useTransactionCreateStore } from '@/store/useTransactionCreateStore';
import { useDashboardData } from '@/hooks/useDashboardData';

export const StepAmount = () => {
    const { amount, category_id, name, brand_logo_url, isTemplateMode, setField, setStep, nextStep, editingId } = useTransactionCreateStore();
    const { profile } = useDashboardStore();
    const { categories, fetchCategories } = useDashboardData();
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('access') || sessionStorage.getItem('access');
        if (categories.length === 0 && token) {
            fetchCategories(token);
        }
    }, [categories.length, fetchCategories]);

    const selectedCategory = categories.find(c => c.id === category_id);
    const isLocked = !!category_id && !!selectedCategory;
    const lockedType = selectedCategory?.type || (amount < 0 ? 'expense' : 'income');

    const [localType, setLocalType] = useState(amount < 0 ? 'expense' : 'income');
    const [amountStr, setAmountStr] = useState(Math.abs(amount).toString() || '0');

    useEffect(() => {
        if (isLocked) {
            setLocalType(lockedType);
        }
    }, [isLocked, lockedType]);

    const handleKeyClick = (keyVal: string) => {
        if (keyVal === 'delete') {
            setAmountStr(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
            return;
        }
        if (amountStr.length >= 13) return; 
        
        if (keyVal === '.') {
            if (!amountStr.includes('.')) setAmountStr(prev => prev + '.');
            return;
        }
        setAmountStr((prev) => {
            if (prev === '0') return keyVal;
            if (prev.includes('.') && prev.split('.')[1].length >= 2) return prev;
            return prev + keyVal;
        });
    };

    const handleTimerStart = () => {
        timerRef.current = setTimeout(() => {
            setAmountStr('0');
        }, 300)
    };

    const handleTimerClear = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    };

    const DisplayFormat = (amountStr: string) => {
        const [integer_part, decimal_part] = amountStr.split('.');
        const formatted_integer = Number(integer_part).toLocaleString('en-US');
        if (decimal_part === undefined) return formatted_integer;
        return `${formatted_integer}.${decimal_part}`;
    }

    const handleSubmit = () => {
        const numericValue = parseFloat(amountStr);
        if ((isNaN(numericValue) || numericValue === 0) && !isTemplateMode) return;
        const finalAmount = localType === 'expense' ? -Math.abs(numericValue) : Math.abs(numericValue);
        setField('amount', finalAmount);

        if (!isTemplateMode && !editingId) {
            if (category_id && name && brand_logo_url !== null) {
                setStep(5);
            } else if (category_id) {
                setStep(3);
            } else {
                nextStep();
            }
        } else {
            nextStep();
        }
    };

    const keys = [
        { id: '1', label: '1' }, { id: '2', label: '2' }, { id: '3', label: '3' },
        { id: '4', label: '4' }, { id: '5', label: '5' }, { id: '6', label: '6' },
        { id: '7', label: '7' }, { id: '8', label: '8' }, { id: '9', label: '9' },
        { id: '.', label: '.' }, { id: '0', label: '0' }, 
        { id: 'delete', label: <Delete className="w-6 h-6" /> }
    ];

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } },
        exit: { opacity: 0, transition: { staggerChildren: 0.05, staggerDirection: -1 } }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
        exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
    };

    const numpadVariants: Variants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.04, delayChildren: 0.15 } },
        exit: { opacity: 0, transition: { duration: 0.2 } }
    };

    const keyVariants: Variants = {
        hidden: { opacity: 0, scale: 0.8 },
        show: { opacity: 1, scale: 1, transition: { type: 'spring' as const, stiffness: 400, damping: 20 } },
        exit: { opacity: 0, scale: 0.9, transition: { duration: 0.15 } }
    };

    const activeWallet = profile?.wallets?.find(w => w.is_active) || profile?.wallets?.[0];

    return (
        <motion.div 
            className="flex flex-col gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit="exit"
        >
            <motion.div variants={itemVariants} className='flex gap-5 justify-center p-2'>
                <motion.button 
                    onClick={() => { if (!isLocked) setLocalType('income'); }} 
                    disabled={isLocked && localType !== 'income'}
                    whileHover={{ scale: isLocked && localType !== 'income' ? 1 : 1.05 }} 
                    whileTap={{ scale: isLocked && localType !== 'income' ? 1 : 0.95 }} 
                    className={`px-6 py-1 rounded-xl transition-colors ${
                        localType === 'income' ? 'bg-[#86CF78] text-white' : 'bg-[#374056] text-gray-400'
                    } ${isLocked && localType !== 'income' ? 'opacity-40 cursor-not-allowed' : ''}`}
                >
                    Income
                </motion.button>
                    
                <motion.button 
                    onClick={() => { if (!isLocked) setLocalType('expense'); }} 
                    disabled={isLocked && localType !== 'expense'}
                    whileHover={{ scale: isLocked && localType !== 'expense' ? 1 : 1.05 }} 
                    whileTap={{ scale: isLocked && localType !== 'expense' ? 1 : 0.95 }} 
                    className={`px-6 py-1 rounded-xl transition-colors ${
                        localType === 'expense' ? 'bg-[#FF5C5C] text-white' : 'bg-[#252836] text-gray-400'
                    } ${isLocked && localType !== 'expense' ? 'opacity-40 cursor-not-allowed' : ''}`}
                >
                    Expense
                </motion.button>
            </motion.div>

            <motion.div variants={itemVariants} className='flex flex-col items-center'>
                <h1 className='text-2xl font-bold'>Write your amount</h1>
                <h2 className='text-gray-400'>Write the amount you want to add</h2>
            </motion.div>

            <motion.div variants={itemVariants} className='flex justify-center'>
                <motion.h1 
                    key={amountStr + localType} 
                    initial={{ scale: 0.95, opacity: 0.5 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="text-5xl"
                >
                    <span className={localType === 'income' ? 'text-[#86CF78]' : 'text-[#FF5C5C]'}>
                        {localType === 'income' ? '+' : '-'}
                    </span>
                    {DisplayFormat(amountStr)} <span className="text-lg text-gray-300">{activeWallet?.currency || ''}</span>
                </motion.h1>
            </motion.div>

            <motion.div variants={numpadVariants} className="grid grid-cols-3 gap-3 p-4">
                {keys.map((key) => (
                    <motion.button 
                        key={key.id}
                        variants={keyVariants}
                        onClick={() => {handleKeyClick(key.id as string)}}
                        onMouseDown={key.id === 'delete' ? handleTimerStart : undefined}
                        onMouseUp={key.id === 'delete' ? handleTimerClear : undefined}
                        onTouchStart={key.id === 'delete' ? handleTimerStart : undefined}
                        onTouchEnd={key.id === 'delete' ? handleTimerClear : undefined}
                        whileHover={{ scale: 1.02, backgroundColor: '#47526D' }} 
                        whileTap={{ scale: 0.95 }} 
                        className="bg-[#252836] rounded-2xl p-4 text-lg flex items-center justify-center select-none"
                    >
                        {key.label}
                    </motion.button>
                ))}
            </motion.div>

            <motion.div variants={itemVariants} className="px-4">
                <motion.button 
                    onClick={handleSubmit}
                    disabled={(amountStr === '0' && !isTemplateMode)}
                    whileHover={{ scale: amountStr === '0' ? 1 : 1.03 }} 
                    whileTap={{ scale: amountStr === '0' ? 1 : 0.95 }} 
                    className={`w-full rounded-2xl p-4 text-lg flex items-center justify-center select-none ${(Number(amountStr) === 0 && !isTemplateMode) ? 'bg-button-disabled-gradient cursor-not-allowed' : 'bg-button-gradient'}`}
                >
                    Continue
                </motion.button>
            </motion.div>
        </motion.div>
    )
}