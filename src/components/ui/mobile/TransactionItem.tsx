import { useState, useRef } from 'react';
import { AnimatePresence, motion, useAnimation } from 'framer-motion';
import { Trash2, Edit3, AlertTriangle, X } from 'lucide-react';

export const TransactionItem = ({ 
    transaction, 
    expandedId, 
    setExpandedId,
    onEdit,
    onDelete
}: any) => {
    const isExpanded = expandedId === transaction.id;
    
    const [showActionMenu, setShowActionMenu] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    
    const dragControls = useAnimation();

    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isLongPress = useRef(false);
    const isDragging = useRef(false);

    const handleDragStart = () => {
        isDragging.current = true;
        if (timerRef.current) clearTimeout(timerRef.current);
    };

    const handleDragEnd = (event: any, info: any) => {
        if (info.offset.x < -50) {
            setShowDeleteConfirm(true);
        }
        dragControls.start({ x: 0 });
        
        setTimeout(() => {
            isDragging.current = false;
        }, 150);
    };

    const handlePointerDown = () => {
        isLongPress.current = false;
        timerRef.current = setTimeout(() => {
            if (!isDragging.current) {
                isLongPress.current = true;
                setShowActionMenu(true);
                if (window.navigator && window.navigator.vibrate) {
                    window.navigator.vibrate(50);
                }
            }
        }, 500); 
    };

    const handlePointerUp = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
    };

    const handleClick = (e: any) => {
        if (isDragging.current || isLongPress.current) {
            e.preventDefault();
            return;
        }
        setExpandedId(isExpanded ? null : transaction.id);
    };

    const handleDeleteConfirm = () => {
        setShowDeleteConfirm(false);
        if (onDelete) onDelete(transaction.id);
    };

    return (
        <div className="relative w-full shrink-0">
            <div className="absolute inset-px bg-[#FF5C5C] rounded-3xl flex justify-end items-center px-6">
                <Trash2 className="w-6 h-6 text-white" />
            </div>

            <motion.div 
                layout
                drag="x"
                dragConstraints={{ left: 0, right: 0 }} 
                dragElastic={{ left: 0.4, right: 0 }} 
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                animate={dragControls}
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                onPointerLeave={handlePointerUp}
                onClick={handleClick}
                
                className='relative z-10 rounded-3xl bg-[#202632] py-2 px-4 flex flex-col w-full cursor-pointer overflow-hidden select-none touch-manipulation'
            >
                <div className="flex items-center justify-between w-full pointer-events-none">
                    <div className='flex gap-4'>
                        <div className='w-12 h-12 rounded-full bg-[#2A314A] flex items-center justify-center overflow-hidden shrink-0'>
                            {transaction.brand_logo_url ? (
                                <img src={transaction.brand_logo_url} 
                                    alt={transaction.name} 
                                    className='w-full h-full object-contain'
                                />
                            ) : (
                                <span className='text-lg text-white font-bold uppercase'>
                                    {transaction.name ? transaction.name[0] : 'T'}
                                </span>
                            )}
                        </div>
                        <div className='pt-1.5'>
                            <h3 className='text-md'>{transaction.name}</h3>
                            <p className='text-xs text-gray-500'>{transaction.category_name || transaction.goal_title}</p>
                        </div>
                    </div>
                    <div className='flex flex-col items-end'>
                        <p className={`text-md px-4 ${Number(transaction.amount) >= 0 ? 'text-[#86CF78]' : 'text-[#FF5C5C]'}`}>
                            {Number(transaction.amount) >= 0 ? '+' : ''}{transaction.amount}
                        </p>
                        <p className='text-xs px-4 text-gray-500'>{new Date(transaction.date).toLocaleDateString()}</p>
                    </div>
                </div>

                <AnimatePresence initial={false}>
                    {isExpanded && (
                        <motion.div 
                            initial={{ height: 0, opacity: 0 }} 
                            animate={{ height: "auto", opacity: 1 }} 
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                            <div className="pt-3 pb-1 text-sm text-gray-400">
                                <p className='text-white font-semibold'>Description: </p>
                                {transaction.description || "Description is missing!"}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            <AnimatePresence>
                {showActionMenu && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex justify-center items-center bg-black/60 backdrop-blur-sm p-4"
                        onClick={() => setShowActionMenu(false)} 
                    >
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()} 
                            className="bg-[#202632] w-full max-w-sm rounded-3xl p-2 flex flex-col gap-1 shadow-2xl border border-white/5"
                        >
                            <div className="flex justify-between items-center px-4 py-3 border-b border-white/5">
                                <span className="text-sm font-medium text-gray-400">Manage Transaction</span>
                                <button onClick={() => setShowActionMenu(false)} className="p-1 rounded-full hover:bg-white/10 text-gray-400 transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            
                            <button 
                                onClick={() => {
                                    setShowActionMenu(false);
                                    if (onEdit) onEdit(transaction);
                                }}
                                className="flex items-center gap-3 w-full p-4 rounded-2xl hover:bg-[#2A314A] transition-colors text-left text-white mt-1"
                            >
                                <Edit3 className="w-5 h-5 text-[#5D73B3]" />
                                <span className="font-medium text-lg">Edit</span>
                            </button>
                            
                            <motion.button 
                                onClick={() => {
                                    setShowActionMenu(false);
                                    setShowDeleteConfirm(true);
                                }}
                                className="flex items-center gap-3 w-full p-4 rounded-2xl hover:bg-[#FF5C5C]/10 transition-colors text-left text-[#FF5C5C]"
                            >
                                <Trash2 className="w-5 h-5" />
                                <span className="font-medium text-lg">Delete</span>
                            </motion.button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showDeleteConfirm && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-60 flex justify-center items-center bg-black/70 backdrop-blur-sm p-4"
                    >
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-[#202632] w-full max-w-xs rounded-3xl p-6 flex flex-col items-center text-center shadow-2xl border border-white/5"
                        >
                            <div className="w-16 h-16 rounded-full bg-[#FF5C5C]/20 flex items-center justify-center mb-4">
                                <AlertTriangle className="w-8 h-8 text-[#FF5C5C]" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Delete Transaction?</h3>
                            <p className="text-sm text-gray-400 mb-6">
                                Are you sure you want to delete this transaction? This action cannot be undone.
                            </p>
                            
                            <div className="flex w-full gap-3">
                                <button 
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="flex-1 py-3 rounded-2xl bg-[#2A314A] text-white font-medium hover:bg-[#374056] transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleDeleteConfirm}
                                    className="flex-1 py-3 rounded-2xl bg-[#FF5C5C] text-white font-medium shadow-lg shadow-[#FF5C5C]/20 hover:bg-[#ff4444] transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};