import { useState, useMemo } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowUp, icons } from "lucide-react";
import { useNavigate } from "react-router";
import { useDashboardData } from "@/hooks/useDashboardData";
import { LoadingPage } from "@/pages/Loading_page";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DynamicIcon = ({ name, className }: { name: string; className?: string }) => {
    const LucideIcon = icons[name as keyof typeof icons];
    if (!LucideIcon) {
        const FallBackIcon = icons['CircleQuestionMark'];
        return <FallBackIcon className={className}/>;
    }
    
    return <LucideIcon className={className}/>;
}

const categoryIconNames: Record<string, string> = {
    "Groceries": "ShoppingCart",
    "Dining Out": "Coffee",
    "Housing & Utilities": "Building2",
    "Transportation": "Van",
    "Health & Medical": "ScanHeart",
    "Subscriptions & Services": "Pointer",
    "Shopping & Personal Care": "Handbag",
    "Entertainment & Hobbies": "Gamepad2",
    "Other": "Ellipsis",
    "Salary": "CircleDollarSign",
    "Freelance": "Coins",
    "Investments": "Bitcoin",
    "Rental Income": "HousePlus",
    "Cashback": "BanknoteArrowDown",
    "Gifts": "Gift",
    "Benefits": "Landmark",
    "Business Profit": "BriefcaseBusiness",
};

export const AnalyticsPage = () => {
    const navigate = useNavigate();
    const { profile, isLoadingProfile } = useDashboardData();

    const [viewDate, setViewDate] = useState(new Date());
    const [touchStart, setTouchStart] = useState<{ x: number, y: number } | null>(null);
    const [touchEnd, setTouchEnd] = useState<{ x: number, y: number } | null>(null);

    const analyticsData = useMemo(() => {
        const transactions = profile?.transactions || [];
        const targetMonth = viewDate.getMonth();
        const targetYear = viewDate.getFullYear();

        const prevMonthDate = new Date(targetYear, targetMonth - 1, 1);
        const prevMonth = prevMonthDate.getMonth();
        const prevYear = prevMonthDate.getFullYear();

        let currentMonthSpendings = 0;
        let previousMonthSpendings = 0;
        
        const spendingsByCategory: Record<string, number> = {};
        const pendingByCategory: Record<string, number> = {};
        
        const chartDataArray = [0, 0, 0, 0];

        transactions.forEach((t) => {
            const date = new Date(t.date);
            const amount = Number(t.amount);
            
            const isTargetMonth = date.getMonth() === targetMonth && date.getFullYear() === targetYear;
            const isPrevMonth = date.getMonth() === prevMonth && date.getFullYear() === prevYear;

            if (isTargetMonth) {
                if (amount < 0) {
                    currentMonthSpendings += Math.abs(amount);
                    
                    const day = date.getDate();
                    if (day <= 7) chartDataArray[0] += Math.abs(amount) / 1000;
                    else if (day <= 15) chartDataArray[1] += Math.abs(amount) / 1000;
                    else if (day <= 23) chartDataArray[2] += Math.abs(amount) / 1000;
                    else chartDataArray[3] += Math.abs(amount) / 1000;

                    const catName = t.category_name || "Other";
                    spendingsByCategory[catName] = (spendingsByCategory[catName] || 0) + Math.abs(amount);
                } else {
                    const catName = t.category_name || "Other";
                    pendingByCategory[catName] = (pendingByCategory[catName] || 0) + amount;
                }
            } else if (isPrevMonth && amount < 0) {
                previousMonthSpendings += Math.abs(amount);
            }
        });

        const difference = currentMonthSpendings - previousMonthSpendings;

        const topSpendings = Object.entries(spendingsByCategory)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3);
            
        const topPending = Object.entries(pendingByCategory)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3);

        return {
            currentMonthSpendings,
            difference,
            chartDataArray,
            topSpendings,
            topPending,
            monthName: viewDate.toLocaleString('en-US', { month: 'long' }),
            year: targetYear,
            prevMonthName: prevMonthDate.toLocaleString('en-US', { month: 'long' })
        };
    }, [profile, viewDate]);

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart({ x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY });
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd({ x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY });
    };

    const onTouchEndHandler = () => {
        if (!touchStart || !touchEnd) return;
        const distanceX = touchStart.x - touchEnd.x;
        const distanceY = touchStart.y - touchEnd.y;
        
        if (Math.abs(distanceX) > Math.abs(distanceY) && Math.abs(distanceX) > 50) {
            if (distanceX > 0) setViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
            else setViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
        }
    };

    const chartData = {
        labels: ["1-7", "8-15", "16-23", "24-31"],
        datasets: [{
            data: analyticsData.chartDataArray,
            backgroundColor: "#778EE0",
            borderRadius: 8,
            barThickness: 32,
        }],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: "#252836",
                titleColor: "#fff",
                bodyColor: "#A0AEC0",
                padding: 10,
                displayColors: false,
                callbacks: { label: (context: any) => `${context.parsed.y}k UAH` }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: "rgba(255, 255, 255, 0.05)", tickLength: 0 },
                border: { dash: [4, 4] },
                ticks: { color: "#A0AEC0", font: { size: 10 }, maxTicksLimit: 4 },
            },
            x: {
                grid: { display: false },
                ticks: { color: "#A0AEC0", font: { size: 10 } },
            },
        },
    };

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
    };

    if (isLoadingProfile && !profile) return <LoadingPage />;

    return (
        <motion.div
            className="flex flex-col w-full h-dvh overflow-hidden bg-[#0D1117]"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={itemVariants} className="flex items-center justify-between p-4 pt-6 shrink-0 relative">
                <motion.button
                    onClick={() => navigate(-1)}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-[#252836] rounded-2xl p-2 w-12 h-12 z-10 flex items-center justify-center"
                >
                    <ChevronLeft className="w-6 h-6 text-white" />
                </motion.button>
                <h1 className="text-2xl font-bold absolute left-0 right-0 text-center text-white pointer-events-none">
                    Analytics
                </h1>
                <div className="w-12 z-10"></div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex justify-between items-center px-6 mb-2 shrink-0">
                <button 
                    onClick={() => setViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
                    className="p-2 bg-[#181D27] rounded-full border border-white/5 text-gray-400 hover:text-white transition-colors"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <p className="text-white font-bold text-lg tracking-wide">
                    {analyticsData.monthName} <span className="text-[#778EE0]">{analyticsData.year}</span>
                </p>
                <button 
                    onClick={() => setViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
                    className="p-2 bg-[#181D27] rounded-full border border-white/5 text-gray-400 hover:text-white transition-colors"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </motion.div>

            <div 
                className="flex-1 min-h-0 overflow-y-auto px-4 scrollbar-hide relative"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEndHandler}
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={viewDate.toISOString()}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-col gap-4 pb-36 pt-2"
                    >
                        <div className="bg-[#181D27] rounded-[24px] p-5 shadow-lg border border-white/5">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <p className="text-sm font-semibold text-white mb-1">Total spendings</p>
                                    <p className="text-xl font-bold text-gray-300">
                                        -{analyticsData.currentMonthSpendings.toLocaleString("en-US", { minimumFractionDigits: 2 })} UAH
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-white mb-1">
                                        {analyticsData.difference > 0 ? "Higher" : "Lower"} than {analyticsData.prevMonthName}
                                    </p>
                                    <p className={`text-sm font-bold flex items-center justify-end gap-1 ${analyticsData.difference > 0 ? 'text-[#FF4D4D]' : 'text-[#4CAF50]'}`}>
                                        {analyticsData.difference > 0 && <ArrowUp className="w-3 h-3" />}
                                        {Math.abs(analyticsData.difference).toLocaleString("en-US", { minimumFractionDigits: 2 })} UAH
                                    </p>
                                </div>
                            </div>
                            <div className="h-40 w-full relative">
                                <p className="text-[10px] text-gray-500 absolute -top-4 left-0">Thousands</p>
                                <Bar data={chartData} options={chartOptions} />
                            </div>
                        </div>

                        <div className="bg-[#181D27] rounded-[24px] p-5 shadow-lg border border-white/5">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-base font-bold text-white">Spendings Categories</h3>
                                    <p className="text-xs text-gray-500">What categories was spend by this month</p>
                                </div>
                                <button className="text-sm text-[#778EE0] font-medium hover:opacity-80">View</button>
                            </div>
                            <div className="flex gap-6 mt-6">
                                {analyticsData.topSpendings.length > 0 ? (
                                    analyticsData.topSpendings.map(([name, amount], index) => {
                                        const iconName = categoryIconNames[name] || 'Ellipsis';
                                        return (
                                            <div key={index} className="flex flex-col items-center gap-3">
                                                <div className="w-14 h-14 rounded-full bg-[#252836] flex items-center justify-center shrink-0">
                                                    <DynamicIcon name={iconName} className="w-6 h-6 text-gray-400" />
                                                </div>
                                                <p className="text-sm font-semibold text-[#FF4D4D]">
                                                    {Number(amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                                                </p>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <p className="text-sm text-gray-500">No spendings this month</p>
                                )}
                            </div>
                        </div>

                        <div className="bg-[#181D27] rounded-[24px] p-5 shadow-lg border border-white/5">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-base font-bold text-white">Pending Categories</h3>
                                    <p className="text-xs text-gray-500">What categories was pend by this month</p>
                                </div>
                                <button className="text-sm text-[#778EE0] font-medium hover:opacity-80">View</button>
                            </div>
                            <div className="flex gap-6 mt-6">
                                {analyticsData.topPending.length > 0 ? (
                                    analyticsData.topPending.map(([name, amount], index) => {
                                        const iconName = categoryIconNames[name] || 'Ellipsis';
                                        return (
                                            <div key={index} className="flex flex-col items-center gap-3">
                                                <div className="w-14 h-14 rounded-full bg-[#252836] flex items-center justify-center shrink-0">
                                                    <DynamicIcon name={iconName} className="w-6 h-6 text-gray-400" />
                                                </div>
                                                <p className="text-sm font-semibold text-[#4CAF50]">
                                                    +{Number(amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                                                </p>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <p className="text-sm text-gray-500">No pending income this month</p>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </motion.div>
    );
};