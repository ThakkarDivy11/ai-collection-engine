import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    CreditCard,
    BrainCircuit,
    Settings,
    LogOut,
    Mail
} from "lucide-react";
import { motion } from "framer-motion";
import collectAILogo from "../assets/images/collectai-logo.png";

const Sidebar = () => {
    const location = useLocation();

    const menuItems = [
        { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { path: "/clients", icon: Users, label: "Clients" },
        { path: "/payments", icon: CreditCard, label: "Payments" },
        { path: "/ai-insights", icon: BrainCircuit, label: "AI Insights" },
        { path: "/email-logs", icon: Mail, label: "AI Email Logs" },
        { path: "/settings", icon: Settings, label: "Settings" },
    ];

    const logout = () => {
        localStorage.removeItem("token");
        window.location.href = "/";
    };

    return (
        <div className="w-64 h-screen bg-white/70 dark:bg-[#0b1424]/70 backdrop-blur-2xl border-r border-slate-200 dark:border-white/5 text-slate-900 dark:text-white flex flex-col fixed left-0 top-0 hidden md:flex transition-all duration-300 z-40">
            <div className="px-8 py-10 flex items-center">
                <Link to="/dashboard" className="flex items-center gap-3 group cursor-pointer">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-matisse-600 to-matisse-400 flex items-center justify-center shadow-xl shadow-matisse-600/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                        <LayoutDashboard size={24} className="text-white" />
                    </div>
                    <span className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">CollectAI</span>
                </Link>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto custom-scrollbar">
                <div className="px-4 mb-6">
                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.25em] opacity-80">General Overview</p>
                </div>
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link key={item.path} to={item.path}>
                            <motion.div
                                whileHover={{ x: 6, backgroundColor: "rgba(55, 107, 139, 0.05)" }}
                                whileTap={{ scale: 0.97 }}
                                className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all duration-300 group relative ${isActive
                                    ? "bg-matisse-600/10 dark:bg-matisse-500/10 text-matisse-600 dark:text-matisse-400"
                                    : "text-slate-500 dark:text-slate-400 hover:text-matisse-600 dark:hover:text-matisse-400"
                                    }`}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="sidebar-active-pill"
                                        className="absolute left-0 w-1 h-6 bg-matisse-600 dark:bg-matisse-500 rounded-r-full shadow-[0_0_15px_rgba(55,107,139,0.5)]"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                )}
                                <item.icon size={20} className={`${isActive ? "text-matisse-600 dark:text-matisse-400" : "group-hover:text-matisse-500 transition-colors"} stroke-[2.5px]`} />
                                <span className={`font-bold text-sm tracking-tight ${isActive ? "text-matisse-900 dark:text-white" : ""}`}>{item.label}</span>
                                {isActive && (
                                    <motion.div
                                        layoutId="active-dot"
                                        className="ml-auto w-1.5 h-1.5 rounded-full bg-matisse-600 dark:bg-matisse-500 shadow-sm animate-pulse"
                                    />
                                )}
                            </motion.div>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 mt-auto">
                <div className="glass-card rounded-[2rem] p-5 mb-4 border border-slate-200 dark:border-white/10 relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 w-20 h-20 bg-matisse-500/10 rounded-full blur-2xl group-hover:bg-matisse-500/20 transition-colors duration-500" />
                    <p className="text-xs font-black text-slate-900 dark:text-white tracking-tight">Enterprise Edition</p>
                    <p className="text-[10px] text-slate-500 mt-1 font-bold uppercase tracking-wider opacity-70">Scale your business</p>
                    <button className="w-full mt-4 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-slate-900/10 dark:shadow-white/5">View Plans</button>
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
