import React from "react";
import { useLocation } from "react-router-dom";
import { Search, Bell } from "lucide-react";
import Sidebar from "./Sidebar";
import BackgroundWrapper from "./Background";
import ThemeToggle from "./ThemeToggle";

const pageTitles = {
    "/dashboard": { title: "Dashboard", sub: "Overview of your business metrics" },
    "/clients": { title: "Clients", sub: "Manage your client relationships" },
    "/payments": { title: "Payments", sub: "Track invoices and transactions" },
    "/ai-insights": { title: "AI Insights", sub: "AI-powered revenue analytics" },
    "/settings": { title: "Settings", sub: "Manage your account preferences" },
};

const TopNavbar = () => {
    const location = useLocation();
    const page = pageTitles[location.pathname] || { title: "Dashboard", sub: "" };
    
    // Get real user data from localStorage
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userName = user.name || "Admin";
    const userRole = user.role === "superadmin" ? "System Super Admin" : "System Admin";

    return (
        <header className="sticky top-0 z-30 w-full border-b border-slate-200/50 dark:border-white/5 bg-white/40 dark:bg-[#0b1424]/40 backdrop-blur-2xl transition-all duration-500">
            <div className="flex items-center justify-between px-10 h-24 gap-6">
                {/* Left — page info */}
                <div className="hidden sm:block min-w-0 animate-reveal">
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white truncate tracking-tighter">
                        {page.title}
                    </h2>
                    {page.sub && (
                        <p className="text-[10px] text-slate-500 dark:text-slate-500 truncate mt-1.5 font-black uppercase tracking-[0.2em] opacity-70">{page.sub}</p>
                    )}
                </div>

                {/* Right — actions */}
                <div className="flex items-center gap-5 ml-auto">
                    <div className="hidden md:flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/50 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 text-slate-500 dark:text-slate-400 text-sm w-80 focus-within:ring-2 focus-within:ring-matisse-500/20 transition-all group shadow-sm focus-within:shadow-md focus-within:bg-white/80 dark:focus-within:bg-white/10">
                        <Search size={16} className="shrink-0 group-focus-within:text-matisse-500 transition-colors stroke-[2.5px]" />
                        <input
                            type="text"
                            placeholder="Command search..."
                            className="bg-transparent border-none outline-none text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 w-full font-bold uppercase tracking-wider"
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Notification bell */}
                        <button className="relative p-3 rounded-2xl bg-white/50 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-white/80 dark:hover:bg-white/10 transition-all shadow-sm hover:scale-105 active:scale-95 group">
                            <Bell size={18} className="group-hover:rotate-12 transition-transform stroke-[2.5px]" />
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-matisse-500 ring-2 ring-white dark:ring-slate-900 animate-pulse" />
                        </button>

                        <ThemeToggle />
                    </div>

                    {/* Divider */}
                    <div className="h-10 w-px bg-slate-200/50 dark:bg-white/10 hidden sm:block mx-2" />

                    {/* User avatar */}
                    <div className="flex items-center gap-4 pl-2 group cursor-pointer">
                        <div className="flex flex-col items-end hidden lg:flex">
                            <span className="text-sm font-black text-slate-900 dark:text-white leading-none tracking-tight group-hover:text-matisse-600 transition-colors">
                                {userName}
                            </span>
                            <span className="text-[9px] font-black text-matisse-500 uppercase tracking-[0.2em] mt-1.5 opacity-80">{userRole}</span>
                        </div>
                        <div className="w-12 h-12 rounded-[1.25rem] bg-gradient-to-tr from-matisse-600 to-matisse-400 flex items-center justify-center text-white text-sm font-black shadow-lg shadow-matisse-600/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 ring-4 ring-white dark:ring-slate-900/50">
                            {userName[0]}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

const Layout = ({ children }) => {
    return (
        <BackgroundWrapper>
            <div className="flex min-h-screen relative overflow-hidden text-gray-900 dark:text-white">

                {/* Sidebar */}
                <Sidebar />

                {/* Main */}
                <div className="flex-1 md:ml-64 flex flex-col min-h-screen relative z-10 w-full">
                    <TopNavbar />

                    <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
                        <div className="max-w-7xl mx-auto">
                            {children}
                        </div>
                    </main>
                </div>

            </div>
        </BackgroundWrapper>
    );
};

export default Layout;
