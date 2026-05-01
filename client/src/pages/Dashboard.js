// cache bust
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, IndianRupee, Activity, Clock, ArrowUpRight, ArrowDownRight, Loader2 } from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";
import AiActions from "../components/AiActions";
import AiVoiceCalls from "../components/AiVoiceCalls";
import AnimatedAnalyticsChart from "../components/AnimatedAnalyticsChart";



const StatCard = ({ title, value, icon: Icon, trend, trendValue, color, loading }) => (
    <motion.div
        whileHover={{ y: -4, scale: 1.02 }}
        className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-2xl border border-white/40 dark:border-white/10 p-6 rounded-[2.5rem] relative overflow-hidden group transition-all duration-300 shadow-xl shadow-gray-200/50 dark:shadow-none"
    >
        {/* Decorative Glow */}
        <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full blur-3xl opacity-10 transition-opacity group-hover:opacity-20 ${color}`} />

        <div className="flex justify-between items-start mb-5 relative z-10">
            <div className={`p-3.5 rounded-2xl ${color} bg-opacity-10 dark:bg-opacity-20 text-slate-900 dark:text-white backdrop-blur-md border border-white/20 dark:border-white/10 shadow-lg shadow-black/5`}>
                <Icon size={22} className={color.replace('bg-', 'text-').replace('-600', '-500')} />
            </div>
            {!loading && (
                <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full bg-opacity-10 ${trend === "up" ? "text-matisse-600 bg-matisse-500" : "text-rose-600 bg-rose-500"}`}>
                    {trend === "up" ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {trendValue}
                </div>
            )}
        </div>

        <div className="relative z-10">
            <p className="text-slate-500 dark:text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">{title}</p>
            {loading ? (
                <div className="h-8 w-24 bg-gray-100 dark:bg-white/5 animate-pulse rounded-xl" />
            ) : (
                <h4 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tighter">
                    {value}
                </h4>
            )}
        </div>

        {/* Bottom Accent Line */}
        <div className={`absolute bottom-0 left-6 right-6 h-0.5 rounded-full opacity-0 group-hover:opacity-40 transition-all duration-500 ${color}`} />
    </motion.div>
);

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const [alert, setAlert] = useState(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const status = params.get("status");
        if (status === "success") {
            setAlert({ type: "success", message: "Action completed successfully!" });
        } else if (status === "cancel") {
            setAlert({ type: "error", message: "Action was cancelled." });
        }

        // Clear status from URL
        if (status) {
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, []);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/dashboard/stats`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                const data = await res.json();
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="space-y-8">
            <div>
                {alert && (
                    <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${alert.type === "success" ? "bg-matisse-500/10 border border-matisse-500/20 text-matisse-400" : "bg-rose-500/10 border border-rose-500/20 text-rose-400"
                        }`}>
                        <Activity size={20} />
                        <p className="font-medium text-sm">{alert.message}</p>
                        <button onClick={() => setAlert(null)} className="ml-auto text-current opacity-50 hover:opacity-100">&times;</button>
                    </div>
                )}
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Welcome Back, Admin</h1>
                <p className="text-slate-500 dark:text-slate-400">Here's what's happening with your clients today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Clients"
                    value={stats?.totalClients || "0"}
                    icon={Users}
                    trend="up"
                    trendValue="+12%"
                    color="bg-matisse-600"
                    loading={loading}
                />
                <StatCard
                    title="Active Revenue"
                    value={`₹${(stats?.totalRevenue || 0).toLocaleString()}`}
                    icon={IndianRupee}
                    trend="up"
                    trendValue="+8%"
                    color="bg-matisse-600"
                    loading={loading}
                />
                <StatCard
                    title="Outstanding"
                    value={`₹${(stats?.totalOutstanding || 0).toLocaleString()}`}
                    icon={Clock}
                    trend="down"
                    trendValue="-5%"
                    color="bg-rose-600"
                    loading={loading}
                />
                <StatCard
                    title="Churn Risk"
                    value={stats?.churnRiskCount || "0"}
                    icon={Activity}
                    trend="down"
                    trendValue="-2%"
                    color="bg-amber-600"
                    loading={loading}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <motion.div
                    whileHover={{ y: -4 }}
                    className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-2xl border border-white/40 dark:border-white/10 p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/50 dark:shadow-none transition-all duration-300"
                >
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">AI Revenue Analytics</h3>
                    <div className="h-80 w-full">
                        <AnimatedAnalyticsChart data={stats?.chartData || []} />
                    </div>
                </motion.div>

                <motion.div
                    whileHover={{ y: -4 }}
                    className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-2xl border border-white/40 dark:border-white/10 p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/50 dark:shadow-none transition-all duration-300"
                >
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Client Growth Analytics</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats?.chartData || []}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="opacity-10 text-slate-300 dark:text-slate-800" />
                                <XAxis dataKey="name" stroke="#64748b" />
                                <YAxis stroke="#64748b" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: "rgba(255,255,255,0.9)", border: "1px solid #e2e8f0", borderRadius: "12px", color: "#0f172a" }}
                                    itemStyle={{ color: "#0f172a" }}
                                />
                                <Bar dataKey="clients" fill="#2d84ca" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            <motion.div
                whileHover={{ y: -4 }}
                className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-2xl border border-white/40 dark:border-white/10 rounded-[2.5rem] overflow-hidden shadow-xl shadow-gray-200/50 dark:shadow-none transition-all duration-300"
            >
                <div className="p-6 border-b border-gray-200 dark:border-slate-800 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Recent Clients</h3>
                    <button className="text-matisse-400 hover:text-blue-300 text-sm font-medium">View all</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-100/50 dark:bg-slate-800/50 text-gray-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                                <th className="px-8 py-4">Client</th>
                                <th className="px-8 py-4">Status</th>
                                <th className="px-8 py-4">Revenue</th>
                                <th className="px-8 py-4">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-slate-800">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="py-12 text-center">
                                        <Loader2 className="mx-auto animate-spin text-matisse-500" size={32} />
                                    </td>
                                </tr>
                            ) : !stats?.recentClients || stats?.recentClients.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="py-12 text-center text-gray-500 dark:text-slate-500">No clients found.</td>
                                </tr>
                            ) : stats?.recentClients.map((client, idx) => (
                                <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="font-bold text-gray-900 dark:text-white group-hover:text-matisse-500 dark:group-hover:text-matisse-400 transition-colors">{client.name}</div>
                                        <div className="text-gray-500 dark:text-slate-500 text-xs font-medium uppercase tracking-tight">{client.company}</div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${client.status === "Active" ? "bg-matisse-500/10 text-matisse-400" :
                                            client.status === "Churn-risk" ? "bg-rose-500/10 text-rose-400" : "bg-amber-500/10 text-amber-400"
                                            }`}>
                                            {client.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 font-bold text-gray-900 dark:text-white">{client.revenue}</td>
                                    <td className="px-8 py-5 text-gray-500 dark:text-slate-400 text-sm font-medium">{client.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            <AiActions />
            <AiVoiceCalls />
        </div>
    );
}
