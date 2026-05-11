import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { ChevronLeft, Search, SlidersHorizontal, Calendar, DollarSign } from "lucide-react";
import { useNavigate } from "react-router";
import { TransactionItem } from "@/components/ui/mobile/TransactionItem";
import { LoadingPage } from "@/pages/Loading_page";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useDeleteTransaction } from "@/hooks/useTransaction";
import { useEditTransaction } from "@/hooks/useEditTransaction";

export const TransactionsHistoryPage = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('access') || sessionStorage.getItem('access');
    
    const { profile, fetchAllDashboardData, isLoadingProfile } = useDashboardData();
    const { execute: deleteTransaction } = useDeleteTransaction();
    const { startEditing } = useEditTransaction();

    const [expandedId, setExpandedId] = useState<string | null>(null);

    const [searchQuery, setSearchQuery] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [sortBy, setSortBy] = useState<"date_desc" | "date_asc" | "amount_desc" | "amount_asc">("date_desc");
    const [dateFrom, setDateFrom] = useState<string>("");
    const [dateTo, setDateTo] = useState<string>("");

    useEffect(() => {
        if (token && !profile) {
            fetchAllDashboardData(token);
        }
    }, [token, profile, fetchAllDashboardData]);

    const transactions = profile?.transactions || [];

    const uniqueCategories = useMemo(() => {
        const categories = transactions
            .map((t) => t.category_name)
            .filter((value, index, self) => value && self.indexOf(value) === index);
        return ["all", ...categories] as string[];
    }, [transactions]);

    const processedTransactions = useMemo(() => {
        let result = [...transactions];

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(t => 
                t.name?.toLowerCase().includes(query) || 
                t.description?.toLowerCase().includes(query)
            );
        }

        if (selectedCategory !== "all") {
            result = result.filter(t => t.category_name === selectedCategory);
        }

        if (selectedCategory !== "all") {
            result = result.filter(t => t.category_name === selectedCategory);
        }

        if (dateFrom) {
            const fromTime = new Date(dateFrom).getTime();
            result = result.filter(t => new Date(t.date).getTime() >= fromTime);
        }
        if (dateTo) {
            const toTime = new Date(dateTo).setHours(23, 59, 59, 999);
            result = result.filter(t => new Date(t.date).getTime() <= toTime);
        }

        result.sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            const amountA = Number(a.amount);
            const amountB = Number(b.amount);

            switch (sortBy) {
                case "date_desc": return dateB - dateA;
                case "date_asc": return dateA - dateB;
                case "amount_desc": return amountB - amountA;
                case "amount_asc": return amountA - amountB;
                default: return 0;
            }
        });

        return result;
    }, [transactions, searchQuery, selectedCategory, sortBy, dateFrom, dateTo]);

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
    };

    const filterVariants: Variants = {
        hidden: { opacity: 0, height: 0, marginTop: 0 },
        visible: { opacity: 1, height: 'auto', marginTop: 16, transition: { duration: 0.3 } }
    };

    if (isLoadingProfile && !profile) return <LoadingPage />;

    return (
        <motion.div 
            className='flex flex-col w-full gap-5 h-dvh overflow-hidden'
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={itemVariants} className='flex items-center justify-between p-4 pt-6 shrink-0 relative'>
                <motion.button 
                    onClick={() => navigate("/")}
                    whileHover={{ scale: 1.15 }} 
                    whileTap={{ scale: 0.95 }} 
                    className="bg-[#252836] rounded-2xl p-2 w-12 h-12 z-10"
                >
                    <div className="flex items-center justify-center">
                        <ChevronLeft className="w-6 h-6 text-white"/>
                    </div>
                </motion.button>
                <h1 className='text-2xl font-bold absolute left-0 right-0 text-center text-white pointer-events-none'>
                    History
                </h1>
                <div className="w-10 z-10"></div>
            </motion.div>

            <motion.div variants={itemVariants} className="px-4 shrink-0 z-10">
                <div className="flex gap-2">
                    <div className="relative flex items-center flex-1 bg-[#181D27] rounded-2xl px-4 py-3.5 border border-white/5 shadow-inner">
                        <Search className="w-5 h-5 text-gray-500 mr-3 shrink-0" />
                        <input 
                            type="text" 
                            value={searchQuery} 
                            onChange={(e) => setSearchQuery(e.target.value)} 
                            placeholder="Search operations..."
                            className="w-full bg-transparent text-white outline-none placeholder-gray-500 font-medium"
                        />
                    </div>
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowFilters(!showFilters)}
                        className={`p-3.5 rounded-2xl border border-white/5 transition-colors flex items-center justify-center ${
                            showFilters ? 'bg-[#5D73B3] text-white' : 'bg-[#181D27] text-gray-500 hover:text-white'
                        }`}
                    >
                        <SlidersHorizontal className="w-5 h-5" />
                    </motion.button>
                </div>

                <AnimatePresence>
                    {showFilters && (
                        <motion.div 
                            variants={filterVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            className="bg-[#181D27] rounded-2xl p-4 border border-white/5 flex flex-col gap-5 overflow-hidden shadow-lg"
                        >
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-bold mb-3 tracking-wider">Sort By</p>
                                <div className="grid grid-cols-2 gap-2">
                                    <button 
                                        onClick={() => setSortBy(sortBy === "date_desc" ? "date_asc" : "date_desc")}
                                        className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-medium transition-all ${
                                            sortBy.includes('date') ? 'bg-[#5D73B3]/20 text-[#5D73B3] border border-[#5D73B3]/30' : 'bg-[#252836] text-gray-400 border border-transparent'
                                        }`}
                                    >
                                        <Calendar className="w-4 h-4" />
                                        Date {sortBy === "date_desc" ? '↓' : sortBy === "date_asc" ? '↑' : ''}
                                    </button>
                                    <button 
                                        onClick={() => setSortBy(sortBy === "amount_desc" ? "amount_asc" : "amount_desc")}
                                        className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-medium transition-all ${
                                            sortBy.includes('amount') ? 'bg-[#5D73B3]/20 text-[#5D73B3] border border-[#5D73B3]/30' : 'bg-[#252836] text-gray-400 border border-transparent'
                                        }`}
                                    >
                                        <DollarSign className="w-4 h-4" />
                                        Amount {sortBy === "amount_desc" ? '↓' : sortBy === "amount_asc" ? '↑' : ''}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-bold mb-3 tracking-wider">Period</p>
                                <div className="flex gap-2">
                                    <input 
                                        type="date" 
                                        value={dateFrom}
                                        onChange={(e) => setDateFrom(e.target.value)}
                                        className="flex-1 bg-[#252836] text-white p-2.5 rounded-xl text-sm outline-none border border-transparent focus:border-[#5D73B3]/50 transition-colors cursor-pointer"
                                    />
                                    <span className="text-gray-500 flex items-center">-</span>
                                    <input 
                                        type="date" 
                                        value={dateTo}
                                        onChange={(e) => setDateTo(e.target.value)}
                                        className="flex-1 bg-[#252836] text-white p-2.5 rounded-xl text-sm outline-none border border-transparent focus:border-[#5D73B3]/50 transition-colors cursor-pointer"
                                    />
                                </div>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500 uppercase font-bold mb-3 tracking-wider">Category</p>
                                <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
                                    {uniqueCategories.map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => setSelectedCategory(cat)}
                                            className={`whitespace-nowrap py-2 px-4 rounded-xl text-sm font-medium transition-all ${
                                                selectedCategory === cat 
                                                ? 'bg-[#5D73B3] text-white shadow-md' 
                                                : 'bg-[#252836] text-gray-400 hover:text-white'
                                            }`}
                                        >
                                            {cat === "all" ? "All Categories" : cat}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            <motion.div 
                variants={itemVariants} 
                className='flex-1 min-h-0 bg-[#181D27] rounded-t-4xl shadow-2xl flex flex-col overflow-hidden'
            >
                <div className='px-6 pt-6 pb-10 overflow-y-auto flex-1 scrollbar-hide'>
                    <div className='flex flex-col gap-4'>
                        <AnimatePresence mode="popLayout">
                            {processedTransactions.length === 0 ? (
                                <motion.div 
                                    initial={{ opacity: 0 }} 
                                    animate={{ opacity: 1 }} 
                                    exit={{ opacity: 0 }}
                                    className="flex justify-center items-center pt-10 text-gray-500 text-center px-4"
                                >
                                    {searchQuery || selectedCategory !== 'all' 
                                        ? "No transactions match your filters." 
                                        : "Your transaction history is empty."}
                                </motion.div>
                            ) : (
                                processedTransactions.map((transaction) => (
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
                                            if (token && transaction.id) {
                                                try {
                                                    await deleteTransaction(transaction.id, token);
                                                    await fetchAllDashboardData(token);
                                                } catch (error) {
                                                    console.error("Failed to delete transaction", error);
                                                }
                                            }
                                        }}
                                    />
                                ))
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};