import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { Avatar } from '@/components/ui/shared/Avatar';
import { Eye, EyeOff, Plus, Folder, Rocket, Zap } from 'lucide-react';
import { motion, animate, AnimatePresence, type Variants } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';
import { useDashboardData } from '@/hooks/useDashboardData';
import { LoadingPage } from '@/pages/Loading_page';
import { TransactionItem } from '@/components/ui/mobile/TransactionItem';
import { useDeleteTransaction } from '@/hooks/useTransaction';
import { useEditTransaction } from '@/hooks/useEditTransaction';

const AnimatedBalance = ({ balance, showBalance }: { balance: number, showBalance: boolean }) => {
    const nodeRef = useRef<HTMLHeadingElement>(null);
    const prevBalance = useRef(balance);

    useEffect(() => {
        if (!showBalance) {
            if (nodeRef.current) nodeRef.current.textContent = '••••••••';
            return;
        }

        const controls = animate(prevBalance.current, balance, {
            duration: 0.6,
            ease: "easeOut",
            onUpdate(value) {
                if (nodeRef.current) {
                    nodeRef.current.textContent = new Intl.NumberFormat('en-US', { 
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2 
                    }).format(value);
                }
            }
        });

        prevBalance.current = balance;
        return () => controls.stop();
    }, [balance, showBalance]);

    return <motion.h1 ref={nodeRef} className='text-5xl' />;
};

export const Dashboard = () => {
    const token = localStorage.getItem('access') || sessionStorage.getItem('access');
    const { startEditing } = useEditTransaction();
    const { execute } = useDeleteTransaction();
    const { isAuthChecking } = useAuthStore();
    const { profile, isLoadingProfile, balance, fetchAllDashboardData } = useDashboardData();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthChecking && token) {
            fetchAllDashboardData(token);
        }
    }, [isAuthChecking, fetchAllDashboardData]);

    const [showBalance, setShowBalance] = useState(true);
    const [expandedId, setExpandedId] = useState<string | null>(null);

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

    if (isAuthChecking || (isLoadingProfile && !profile)) {
        return <LoadingPage />;
    }

    return (
        <motion.div 
            className='flex flex-col w-full gap-5 h-dvh overflow-hidden'
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={itemVariants} className='flex items-center justify-between p-4 pt-6 shrink-0'>
                <div className='flex gap-3 items-center'>
                    <motion.button whileHover={{ scale: 1.05 }} onClick={() => {navigate("/settings")}} className='cursor-pointer'>
                        <Avatar name={displayName} />
                    </motion.button>
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

            <motion.div variants={itemVariants} className='flex flex-col items-center gap-2 shrink-0'>
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
                        <AnimatePresence mode="wait">
                            <motion.div 
                                key={showBalance ? 'visible' : 'hidden'}
                                initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                                transition={{ duration: 0.2 }}
                            >
                                <AnimatedBalance balance={balance} showBalance={showBalance} />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
                <div className='flex flex-col items-center gap-1'>
                    <p className='text-xs'>Goal: None</p>
                </div>
            </motion.div>

            <motion.div variants={itemVariants} className='flex items-center justify-center gap-10 select-none shrink-0'>
                <motion.button whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.95 }} onClick={() => navigate("/add-transaction")} className='flex flex-col items-center gap-2 cursor-pointer'>
                    <div className='w-16 h-16 rounded-3xl bg-[#252836] flex items-center justify-center'><Plus className='w-6 h-6'/></div>
                    <span className="text-sm">Add</span>
                </motion.button>
                <motion.button whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.95 }} onClick={() => navigate("/templates")} className='flex flex-col items-center gap-2 cursor-pointer'>
                    <div className='w-16 h-16 rounded-3xl bg-[#252836] flex items-center justify-center'><Folder className='w-6 h-6'/></div>
                    <span className="text-sm">Templates</span>
                </motion.button>
                <motion.button onClick={() => {}} whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.95 }} className='flex flex-col items-center gap-2 cursor-pointer'>
                    <div className='w-16 h-16 rounded-3xl bg-[#252836] flex items-center justify-center'><Rocket className='w-6 h-6'/></div>
                    <span className="text-sm">Boost</span>
                </motion.button>
            </motion.div>

            <motion.div 
                variants={itemVariants} 
                className='flex-1 min-h-0 bg-[#181D27] rounded-t-4xl shadow-2xl flex flex-col overflow-hidden'
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

                <div className='px-6 pb-24 overflow-y-auto flex-1 scrollbar-hide'>
                    <div className='flex flex-col gap-4'>
                        {!profile?.transactions || profile.transactions.length === 0 ? (
                            <div className="flex justify-center items-center pt-10 text-gray-500">No transactions yet</div>
                        ) : (
                            profile.transactions
                                .slice()
                                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                .slice(0, 4)
                                .map((transaction: any) => (
                                <TransactionItem 
                                    key={transaction.id} 
                                    transaction={transaction} 
                                    expandedId={expandedId} 
                                    setExpandedId={setExpandedId} 
                                    onEdit={() => {
                                        startEditing(transaction);
                                        navigate("/add-transaction");
                                    }}
                                    onDelete={async () => {
                                        await execute(transaction.id, token || '');
                                        await fetchAllDashboardData(token || '');
                                    }}
                                />
                            ))
                        )}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};