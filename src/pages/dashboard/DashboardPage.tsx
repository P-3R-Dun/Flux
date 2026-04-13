import { useState, useEffect } from 'react';
import { Avatar } from '../../components/ui/shared/Avatar';
import { Eye, EyeOff, Plus, Folder, Rocket, Zap } from 'lucide-react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { useAuthStore } from '../../store/useAuthStore';
import { useDashboardStore } from '../../store/useDashboardStore';
import { LoadingPage } from '../Loading_page';

export const Dashboard = () => {
    const { isAuthChecking } = useAuthStore();
    const { profile, isLoading, balance, fetchProfile } = useDashboardStore();

    useEffect(() => {
        const token = localStorage.getItem('access') || sessionStorage.getItem('access');
        if (!isAuthChecking && !profile && token) {
            fetchProfile(token);
        }
    }, [isAuthChecking, profile, fetchProfile]);

    const [showBalance, setShowBalance] = useState(true);

    const displayName = profile?.first_name 
        ? `${profile.first_name} ${profile.last_name || ''}`.trim() 
        : profile?.username || '';

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 },
        },
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
    };

    if (isAuthChecking || (isLoading && !profile)) {
        return <LoadingPage />;
    }

    return (
        <motion.div 
            className='flex flex-col w-full gap-5 h-dvh overflow-hidden'
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={itemVariants} className='flex items-center justify-between p-4 pt-6'>
                <div className='flex gap-3 items-center'>
                    <motion.div whileHover={{ scale: 1.05 }} className='cursor-pointer'>
                        <Avatar name={displayName} />
                    </motion.div>
                    <div className='flex flex-col'>
                        <p className='text-xs text-gray-400 font-medium tracking-wide uppercase'>Welcome back</p>
                        <p className='text-base font-semibold tracking-tight'>{displayName}</p>
                    </div>
                </div>
                <div className='flex items-center gap-1.5 bg-[#FF9B40]/10 px-3 py-1.5 rounded-full border border-[#FF9B40]/20'>
                    <Zap className='w-4 h-4 text-[#FF9B40] fill-[#FF9B40]' />
                    <span className='text-sm font-bold text-[#FF9B40]'>{profile?.focus_streak ?? 0}</span>
                </div>
            </motion.div>

            <motion.div variants={itemVariants} className='flex flex-col items-center gap-2'>
                <p className='text-lg'>Available Balance ({profile?.currency})</p>
                <div className='flex gap-2 items-center'>
                    <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setShowBalance(!showBalance)} 
                        className='cursor-pointer'
                    >
                        {showBalance ? <Eye /> : <EyeOff />}
                    </motion.button>
                    
                    <div className='flex min-w-36 items-center justify-center overflow-hidden h-14'>
                        <AnimatePresence mode="popLayout">
                            <motion.h1 
                                key={showBalance ? 'visible' : 'hidden'}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.2 }}
                                className='text-5xl'
                            >
                                {showBalance ? new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(balance) : '••••••••'}
                            </motion.h1>
                        </AnimatePresence>
                    </div>
                </div>
                <div className='flex flex-col items-center gap-1'>
                    <p className='text-xs'>Financial Period: {profile?.financial_period || 'None'}</p>
                    <p className='text-xs'>Goal: None</p>
                </div>
            </motion.div>

            <motion.div variants={itemVariants} className='flex items-center justify-center gap-10 select-none'>
                <motion.div whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.95 }} className='flex flex-col items-center gap-2 cursor-pointer'>
                    <div className='w-16 h-16 rounded-3xl bg-[#5D73B3] flex items-center justify-center'><Plus className='w-6 h-6'/></div>
                    <span className="text-sm">Add</span>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.95 }} className='flex flex-col items-center gap-2 cursor-pointer'>
                    <div className='w-16 h-16 rounded-3xl bg-[#5D73B3] flex items-center justify-center'><Folder className='w-6 h-6'/></div>
                    <span className="text-sm">Templates</span>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.95 }} className='flex flex-col items-center gap-2 cursor-pointer'>
                    <div className='w-16 h-16 rounded-3xl bg-[#5D73B3] flex items-center justify-center'><Rocket className='w-6 h-6'/></div>
                    <span className="text-sm">Boost</span>
                </motion.div>
            </motion.div>

            <motion.div 
                variants={itemVariants} 
                className='flex-1 bg-[#181D27] rounded-t-4xl shadow-2xl flex flex-col overflow-hidden min-h-0'
            >
                <div className='flex items-center justify-between p-6 shrink-0'>
                    <div className='flex gap-3 items-center'>
                        <h2 className='text-2xl font-bold text-white'>Recent Activity</h2>
                    </div>
                    <motion.button 
                        whileHover={{ scale: 1.05 }} 
                        whileTap={{ scale: 0.95 }} 
                        className='text-sm font-medium text-[#5D73B3]'
                    >
                        View All
                    </motion.button>
                </div>
                <div className='px-6 pb-32 overflow-y-auto flex-1'>
                    <div className='flex flex-col gap-4'>
                        {profile?.transactions?.length === 0 ? 'No transactions yet' : profile?.transactions?.map((transaction) => (
                            <motion.div key={transaction.id} className='rounded-3xl bg-[#202632] py-2 px-4 flex items-center justify-between w-full'>
                                <div className='flex gap-4'>
                                    <div className='w-12 h-12 rounded-full bg-[#2A314A] flex items-center justify-center overflow-hidden shrink-0'>
                                        {transaction.brand_logo_url ? (
                                            <img src={transaction.brand_logo_url} 
                                                alt={transaction.description} 
                                                className='w-full h-full object-cover'
                                            />
                                        ) : (
                                            <span className='text-lg text-white font-bold uppercase'>
                                                {transaction.description ? transaction.description[0] : 'T'}
                                            </span>
                                        )}
                                    </div>
                                    <div className='pt-1.5'>
                                        <h3 className='text-md'>{transaction.description}</h3>
                                        <p className='text-xs text-gray-500'>{transaction.category_name || transaction.goal_title}</p>
                                    </div>
                                </div>
                                <div className='flex flex-col items-end'>
                                    <p className={`text-md px-4 ${Number(transaction.amount) >= 0 ? 'text-[#86CF78]' : 'text-[#FF5C5C]'}`}>
                                        {Number(transaction.amount) >= 0 ? '+' : ''}{transaction.amount}
                                    </p>
                                    <p className='text-xs px-4 text-gray-500'>{new Date(transaction.date).toLocaleDateString()}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};