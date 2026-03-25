import { motion } from "framer-motion";
import { NavLink } from "react-router";
import { House, Goal, ChartLine, History, type LucideIcon } from 'lucide-react';

interface MobileNavigationProps {
    path: string;
    title: string;
    icon: LucideIcon;
}

const navItems: MobileNavigationProps[] = [
    { path: "/dashboard", title: "Home", icon: House },
    { path: "/history", title: "History", icon: Goal },
    { path: "/analytics", title: "Analytics", icon: ChartLine },
    { path: "/goals", title: "Goals", icon: History },
]

export const MobileNavigation = () => {
    return (
        <motion.div
        initial={{ y: "100%" }} 
        animate={{ y: 0 }} 
        transition={{ 
            type: "spring", 
            stiffness: 260, 
            damping: 25, 
            delay: 0.2
        }} 
        className="flex flex-row items-center justify-around w-full bg-[#1E2329] absolute bottom-0 left-0 rounded-t-2xl overflow-hidden h-[calc(7rem+env(safe-area-inset-bottom))] z-50 pb-[env(safe-area-inset-bottom)]">
            {navItems.map((item) => (
                <NavLink aria-label={item.title} to={item.path} key={item.title} replace={true}
                className={"h-20 flex-1"}>
                    {({ isActive }) => (
                        <div className="flex flex-col items-center gap-4">
                        {isActive ? (
                            <motion.hr 
                            layoutId="nav-indicator"
                            transition={{ type: "spring", stiffness: 350, damping: 30 }}
                            className={`h-1 w-12 ${isActive ? "bg-[#6379B8] border-none rounded-full" : "opacity-0"}`}/>
                        ) : (<div className="h-1 w-12 opacity-0" />)}
                        <div className="flex flex-col items-center gap-1">
                            {item.icon && <item.icon className={`w-6 h-6 transition-colors duration-300 ${isActive ? "text-[#6379B8]" : "text-[#565C64]"}`}/> }
                            <h3 className={`transition-colors duration-300 ${isActive ? "text-[#6379B8]" : "text-[#565C64]"}`}>{item.title}</h3>
                        </div>
                        </div>
                    )}
                </NavLink>))}
        </motion.div>
    );
}