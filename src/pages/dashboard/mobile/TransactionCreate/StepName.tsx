import { motion, type Variants } from 'framer-motion';
import { useTransactionCreateStore } from '@/store/useTransactionCreateStore';
import { useBrandSearch } from '@/hooks/useBrandSearch';
import { LoadingSpinner } from '@/components/ui/shared/LoadingSpinner';
import { Search } from 'lucide-react';

export const StepName = () => {
    const token = localStorage.getItem('access') || sessionStorage.getItem('access');   
    const { name, brand_logo_url, setField, nextStep } = useTransactionCreateStore(); 
    const { results, isLoading } = useBrandSearch(token || '', name);

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        },
        exit: { 
            opacity: 0, 
            transition: { staggerChildren: 0.05, staggerDirection: -1 }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        show: { 
            opacity: 1, 
            y: 0, 
            transition: { type: 'spring', stiffness: 300, damping: 24 } 
        },
        exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
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
                <h1 className='text-[22px] font-semibold text-white mb-2'>The name</h1>
                <h2 className='text-slate-400 text-sm text-center px-4'>Tell us what company or person was in this transaction</h2>    
            </motion.div>

            <motion.div variants={itemVariants} className="relative w-full mb-8 shrink-0">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                    value={name}
                    onChange={(e) => setField('name', e.target.value)}
                    placeholder="Search..."
                    className="w-full bg-[#252836] text-white rounded-2xl py-4 pl-12 pr-4 outline-none placeholder-gray-500 transition-colors focus:bg-[#2A314A] shadow-inner"
                />
            </motion.div>

            <motion.div variants={itemVariants} className="flex-1 min-h-0">
                {isLoading ? (
                    <div className="flex justify-center pt-10">
                        <LoadingSpinner />
                    </div>
                ) : (
                    results.length > 0 && (
                        <div className="flex gap-5 overflow-x-auto scrollbar-hide py-2 px-1">
                            {results.map((brand, index) => {
                                const isActive = brand.brand_logo_url === brand_logo_url;
                                
                                return (
                                    <motion.div
                                        key={`${brand.domain}-${index}`}
                                        onClick={() => setField('brand_logo_url', brand.brand_logo_url)}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="flex flex-col items-center gap-2 cursor-pointer w-20 shrink-0"
                                    >
                                        <div 
                                            className={`w-16 h-16 rounded-full flex items-center justify-center overflow-hidden transition-all duration-200 ${
                                                isActive 
                                                    ? 'border-[3px] border-[#6B79B5] shadow-lg shadow-[#6B79B5]/20' 
                                                    : 'border-[3px] border-transparent bg-[#252836]'
                                            }`}
                                        >
                                            {brand.brand_logo_url ? (
                                                <img 
                                                    src={brand.brand_logo_url} 
                                                    alt={brand.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-xl font-bold text-white uppercase">
                                                    {brand.name.charAt(0)}
                                                </span>
                                            )}
                                        </div>
                                        
                                        <div className="flex flex-col items-center text-center w-full">
                                            <span className={`text-[13px] font-semibold truncate w-full transition-colors ${
                                                isActive ? 'text-[#6B79B5]' : 'text-white'
                                            }`}>
                                                {brand.name}
                                            </span>
                                            <span className={`text-[10px] truncate w-full transition-colors ${
                                                isActive ? 'text-[#6B79B5]/80' : 'text-gray-500'
                                            }`}>
                                                ({brand.domain || 'default'})
                                            </span>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )
                )}
            </motion.div>

            <motion.div variants={itemVariants} className="mt-auto pt-8 shrink-0">
                <motion.button
                    onClick={nextStep}
                    disabled={!name.trim() || brand_logo_url === ''}
                    whileHover={{ scale: !name.trim() || brand_logo_url === '' ? 1 : 1.02 }} 
                    whileTap={{ scale: !name.trim() || brand_logo_url === '' ? 1 : 0.98 }} 
                    className={`w-full rounded-2xl p-4 text-lg flex items-center justify-center select-none text-white transition-all duration-300 ${
                        !name.trim() || brand_logo_url === '' 
                            ? 'bg-button-disabled-gradient cursor-not-allowed' 
                            : 'bg-button-gradient'
                    }`}
                >
                    Continue
                </motion.button>
            </motion.div>
        </motion.div>
    );
};