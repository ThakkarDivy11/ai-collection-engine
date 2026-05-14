import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    CreditCard,
    BrainCircuit,
    Settings,
    LogOut,
    Mail,
    ChevronRight,
    ShieldCheck,
    Briefcase,
    Zap,
    HelpCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Sidebar = () => {
    const location = useLocation();

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const customer = JSON.parse(localStorage.getItem("customer") || "{}");
    
    const isCustomer = !!customer.id;
    const isSuperAdmin = user.role === "superadmin";
    const isAdmin = user.role === "admin" || isSuperAdmin;

    const sections = isCustomer ? [
        {
            title: "Portal Access",
            items: [
                { path: "/customer-dashboard", icon: LayoutDashboard, label: "Overview" },
                { path: "/customer-payments", icon: CreditCard, label: "My Payments" },
            ]
        },
        {
            title: "Support",
            items: [
                { path: "/help", icon: HelpCircle, label: "Help Center" },
            ]
        }
    ] : [
        {
            title: "General Overview",
            items: [
                { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
                { path: "/clients", icon: Users, label: "Clients" },
                { path: "/payments", icon: CreditCard, label: "Payments" },
            ]
        },
        {
            title: "AI & Analytics",
            items: [
                { path: "/ai-insights", icon: BrainCircuit, label: "AI Insights" },
                { path: "/email-logs", icon: Mail, label: "Email Logs" },
            ]
        },
        ...(isSuperAdmin ? [{
            title: "Administration",
            items: [
                { path: "/admin-management", icon: Users, label: "Manage Admins" },
            ]
        }] : []),
    ];

    const accountItems = [
        { path: "/settings", icon: Settings, label: "Settings" },
    ];

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("customer");
        window.location.href = "/";
    };

    return (
        <div className="w-72 h-screen bg-slate-50 dark:bg-[#060b13] border-r border-slate-200 dark:border-white/5 flex flex-col fixed left-0 top-0 hidden md:flex transition-all duration-500 z-40">
            {/* Brand Header */}
            <div className="px-8 py-10">
                <Link to={isCustomer ? "/customer-dashboard" : "/dashboard"} className="flex items-center gap-3 group">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 ${
                        isSuperAdmin ? 'bg-gradient-to-tr from-rose-600 to-rose-400 shadow-rose-600/20' : 
                        isCustomer ? 'bg-gradient-to-tr from-emerald-600 to-emerald-400 shadow-emerald-600/20' :
                        'bg-gradient-to-tr from-matisse-600 to-matisse-400 shadow-matisse-600/20'
                    }`}>
                        <Zap size={24} className="text-white fill-white/20" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white leading-none">CollectAI</span>
                        <span className="text-[9px] font-black text-matisse-500 uppercase tracking-[0.2em] mt-1 opacity-80">
                            {isSuperAdmin ? "Root Terminal" : isCustomer ? "Client Access" : "Admin Console"}
                        </span>
                    </div>
                </Link>
                
                {isSuperAdmin && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 flex items-center gap-3 px-4 py-2.5 bg-rose-500/5 border border-rose-500/10 rounded-2xl"
                    >
                        <ShieldCheck size={14} className="text-rose-500" />
                        <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest">System Overdrive</span>
                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                    </motion.div>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-4 pb-6 overflow-hidden">
                {sections.map((section, sIdx) => (
                    <div key={section.title} className="space-y-0.5">
                        <div className="px-4 mb-1.5">
                            <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] opacity-60">
                                {section.title}
                            </p>
                        </div>
                        {section.items.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link key={item.path} to={item.path}>
                                    <motion.div
                                        whileHover={{ x: 4 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 group relative ${isActive
                                            ? "bg-white dark:bg-white/5 text-matisse-600 dark:text-white shadow-sm border border-slate-200/50 dark:border-white/5"
                                            : "text-slate-500 dark:text-slate-400 hover:text-matisse-600 dark:hover:text-matisse-300"
                                            }`}
                                    >
                                        <div className={`p-1.5 rounded-lg transition-all duration-300 ${isActive ? 'bg-matisse-500/10 text-matisse-600 dark:text-matisse-400' : 'bg-transparent'}`}>
                                            <item.icon size={16} className={`${isActive ? "stroke-[2.5px]" : "stroke-2 group-hover:stroke-[2.5px]"}`} />
                                        </div>
                                        <span className={`font-bold text-[13px] tracking-tight ${isActive ? "text-slate-900 dark:text-white" : ""}`}>{item.label}</span>
                                        
                                        {isActive ? (
                                            <motion.div
                                                layoutId="active-pill"
                                                className="ml-auto"
                                                initial={{ opacity: 0, scale: 0.5 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                            >
                                                <ChevronRight size={12} className="text-matisse-500" />
                                            </motion.div>
                                        ) : (
                                            <ChevronRight size={12} className="ml-auto opacity-0 group-hover:opacity-40 transition-opacity" />
                                        )}
                                    </motion.div>
                                </Link>
                            );
                        })}
                    </div>
                ))}

                <div className="pt-3 border-t border-slate-200/50 dark:border-white/5">
                    <div className="px-4 mb-1.5">
                        <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] opacity-60">System</p>
                    </div>
                    {accountItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link key={item.path} to={item.path}>
                                <motion.div
                                    whileHover={{ x: 4 }}
                                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 group ${isActive ? "bg-white dark:bg-white/5 text-matisse-600 dark:text-white shadow-sm border border-slate-200/50 dark:border-white/5" : "text-slate-500 dark:text-slate-400"}`}
                                >
                                    <div className="p-1.5">
                                        <item.icon size={16} />
                                    </div>
                                    <span className="font-bold text-[13px] tracking-tight">{item.label}</span>
                                </motion.div>
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* Footer / User Profile */}
            <div className="p-4 mt-auto border-t border-slate-200 dark:border-white/5 bg-slate-100/50 dark:bg-white/[0.02]">
                <div className="flex items-center gap-3 px-4 py-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-matisse-600 to-matisse-400 flex items-center justify-center text-white text-xs font-black shadow-lg">
                        {(user.name || customer.name || "A")[0]}
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="text-xs font-black text-slate-900 dark:text-white truncate">
                            {user.name || customer.name || "User"}
                        </span>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider truncate">
                            {isSuperAdmin ? "Super Admin" : isCustomer ? customer.company : "Staff Account"}
                        </span>
                    </div>
                </div>
                
                <button
                    onClick={logout}
                    className="flex items-center gap-3 px-5 py-4 w-full text-slate-500 hover:text-rose-500 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-rose-500/5 rounded-2xl transition-all duration-300 group"
                >
                    <LogOut size={18} className="group-hover:-translate-x-1 transition-transform stroke-[2.5px]" />
                    <span className="font-bold text-sm tracking-tight">Logout System</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;

