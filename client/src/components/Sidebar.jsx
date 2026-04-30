import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    CreditCard,
    BrainCircuit,
    Settings,
    LogOut
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
        { path: "/settings", icon: Settings, label: "Settings" },
    ];

    const logout = () => {
        localStorage.removeItem("token");
        window.location.href = "/";
    };

    return (
        <div className="w-64 h-screen bg-white/70 dark:bg-black/40 backdrop-blur-xl border-r border-gray-200 dark:border-white/10 text-gray-900 dark:text-white flex flex-col fixed left-0 top-0 hidden md:flex transition-colors duration-300">
            <style>{`
                .navbar-brand {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .logo {
                    height: 48px;
                    width: auto;
                    filter: drop-shadow(0 2px 4px rgba(75, 138, 172, 0.2));
                }
                .logo-text {
                    font-size: 20px;
                    font-weight: 700;
                    letter-spacing: -0.5px;
                    text-shadow: 0 1px 2px rgba(75, 138, 172, 0.1);
                }
            `}</style>
            <div className="px-4 py-5 flex items-center navbar-brand">
                <div className="flex items-center gap-3">
                    <img src={collectAILogo} alt="CollectAI" className="logo h-12 w-auto dark:invert" />
                    <span className="logo-text text-xl font-bold text-slate-900 dark:text-white">
                        CollectAI
                    </span>
                </div>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link key={item.path} to={item.path}>
                            <motion.div
                                whileHover={{ x: 5 }}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                    ? "bg-calypso-600 text-white shadow-md shadow-calypso-600/30 dark:shadow-calypso-900/40"
                                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5"
                                    }`}
                            >
                                <item.icon size={20} />
                                <span className="font-medium">{item.label}</span>
                            </motion.div>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-gray-200 dark:border-white/10 mt-auto">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-3 w-full text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors duration-300"
                >
                    <LogOut size={20} />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
