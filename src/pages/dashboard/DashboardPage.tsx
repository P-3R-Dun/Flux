import { useState } from 'react';
import { Avatar } from '../../components/ui/shared/Avatar';
import { Eye, EyeOff, Plus, Folder, Rocket, Zap } from 'lucide-react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';

export const Dashboard = () => {
    const [showBalance, setShowBalance] = useState(true);
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
            },
        },
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
    };

    return (
        <motion.div 
            className='flex flex-col w-full gap-5 h-screen overflow-hidden'
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={itemVariants} className='flex flex-row items-center justify-between p-4 pt-6'>
                <div className='flex flex-row gap-3 items-center'>
                    <motion.div whileHover={{ scale: 1.05 }} className='cursor-pointer'>
                        <Avatar name='Vladyslav Shepitko' />
                    </motion.div>
                    <div className='flex flex-col'>
                        <p className='text-xs text-gray-400 font-medium tracking-wide uppercase'>Welcome back</p>
                        <p className='text-base font-semibold tracking-tight'>Vladyslav Shepitko</p>
                    </div>
                </div>
                <div className='flex items-center gap-1.5 bg-[#FF9B40]/10 px-3 py-1.5 rounded-full border border-[#FF9B40]/20'>
                    <Zap className='w-4 h-4 text-[#FF9B40] fill-[#FF9B40]' />
                    <span className='text-sm font-bold text-[#FF9B40]'>0</span>
                </div>
            </motion.div>

            <motion.div variants={itemVariants} className='flex flex-col items-center justify-center gap-2'> {/*Balance Info*/}
                <p className='text-lg'>Available Balance (UAH)</p>
                <div className='flex flex-row gap-2 items-center'>
                    <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setShowBalance(!showBalance)} 
                        className='cursor-pointer'
                    >
                        { showBalance ? (<Eye />) : (<EyeOff />) }
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
                                {showBalance ? '3,244,230.00' : '••••••••'}
                            </motion.h1>
                        </AnimatePresence>
                    </div>
                </div>
                <div className='flex flex-col items-center justify-center gap-1'>
                    <p className='text-xs'>Daily Cap: None</p>
                    <p className='text-xs'>Goal: None</p>
                </div>
            </motion.div>

            <motion.div variants={itemVariants} className='flex flex-row items-center justify-center gap-10 select-none'> {/*Action Buttons*/}
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className='flex flex-col items-center gap-2 cursor-pointer'>
                    <div className='w-16 h-16 rounded-full bg-[#5D73B3] flex items-center justify-center'><Plus className='w-6 h-6'/></div>
                    <span className="text-sm">Add</span>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className='flex flex-col items-center gap-2 cursor-pointer'>
                    <div className='w-16 h-16 rounded-full bg-[#5D73B3] flex items-center justify-center'><Folder className='w-6 h-6'/></div>
                    <span className="text-sm">Templates</span>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className='flex flex-col items-center gap-2 cursor-pointer'>
                    <div className='w-16 h-16 rounded-full bg-[#5D73B3] flex items-center justify-center'><Rocket className='w-6 h-6'/></div>
                    <span className="text-sm">Boost</span>
                </motion.div>
            </motion.div>

            <motion.div 
                variants={itemVariants} 
                className='flex-1 bg-[#181D27] rounded-t-4xl mt-4 shadow-2xl'
            >
                <div className='flex flex-row items-center justify-between p-6'>
                    <div className='flex flex-row gap-3 items-center'>
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
                <div className='px-6 pb-10'>
                    <div className='flex flex-col items-center justify-center min-h-50 text-gray-400'>
                        <p>No recent activity</p>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}