import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Users, IndianRupee, Activity, Clock, ArrowUpRight, ArrowDownRight, Loader2, Shield } from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell
} from "recharts";
import AnimatedAnalyticsChart from "../components/AnimatedAnalyticsChart";

const STATUS_COLORS = {
    "Active": "#10b981",
    "Pending": "#f59e0b",
    "Churn-risk": "#e11d48",
};

const generateSparkline = (seed, points = 7, trend = "up") => {
    const data = [];
    let value = 30 + (seed * 13) % 20;
    for (let i = 0; i < points; i++) {
        const delta = trend === "up"
            ? (Math.sin(i + seed) * 8 + 3)
            : (Math.sin(i + seed) * 8 - 3);
        value = Math.max(5, Math.min(95, value + delta));
        data.push({ x: i, v: Math.round(value) });
    }
    return data;
};

const SPARKLINE_COLORS = {
    "bg-matisse-600": { stroke: "#4f95c2", fill: "#4f95c2" },
    "bg-rose-600": { stroke: "#f43f5e", fill: "#f43f5e" },
    "bg-amber-600": { stroke: "#fbbf24", fill: "#fbbf24" },
    "bg-emerald-600": { stroke: "#34d399", fill: "#34d399" },
};

const StatCard = ({ title, value, icon: Icon, trend, trendValue, color, loading, sparkData, chartType = "area" }) => {
    const sparkColor = SPARKLINE_COLORS[color] || { stroke: "#376b8b", fill: "#376b8b" };

    const renderChart = () => {
        if (chartType === "bar") {
            return (
                <BarChart data={sparkData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <Bar 
                        dataKey="v" 
                        fill={sparkColor.fill} 
                        opacity={0.45} 
                        radius={[2, 2, 0, 0]}
                        animationDuration={1500}
                    />
                </BarChart>
            );
        }
        if (chartType === "line") {
            return (
                <LineChart data={sparkData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <Line 
                        type="monotone" 
                        dataKey="v" 
                        stroke={sparkColor.stroke} 
                        strokeWidth={2} 
                        dot={false}
                        animationDuration={1500}
                    />
                </LineChart>
            );
        }
        return (
            <AreaChart data={sparkData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id={`spark-${title.replace(/\s/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={sparkColor.fill} stopOpacity={0.4} />
                        <stop offset="100%" stopColor={sparkColor.fill} stopOpacity={0} />
                    </linearGradient>
                </defs>
                <Area
                    type="monotone"
                    dataKey="v"
                    stroke={sparkColor.stroke}
                    strokeWidth={3}
                    fill={`url(#spark-${title.replace(/\s/g, '')})`}
                    dot={false}
                    isAnimationActive={true}
                    animationDuration={1500}
                />
            </AreaChart>
        );
    };

    return (
        <motion.div
            whileHover={{ y: -6, scale: 1.01 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, cubicBezier: [0.2, 1, 0.3, 1] }}
            className="glass-card p-6 rounded-[2.5rem] premium-shadow-hover transition-all duration-500 overflow-hidden group relative"
        >
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-current opacity-[0.03] rounded-full blur-3xl group-hover:opacity-[0.08] transition-opacity duration-500" />
            
            <div className="flex justify-between items-start mb-5 relative z-10">
                <div className={`p-3.5 rounded-2xl ${color.replace('bg-', 'bg-opacity-10 text-')} dark:bg-opacity-20 flex items-center justify-center shadow-inner`}>
                    <Icon size={22} className="stroke-[2.5px]" />
                </div>
                {!loading && (
                    <div className={`flex items-center gap-1 text-[10px] font-black px-3 py-1.5 rounded-xl ${trend === "up" ? "text-emerald-600 bg-emerald-500/10" : "text-rose-600 bg-rose-500/10"} uppercase tracking-wider`}>
                        {trend === "up" ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                        {trendValue}
                    </div>
                )}
            </div>

            <div className="mb-4 relative z-10">
                <p className="text-slate-400 dark:text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1.5">{title}</p>
                {loading ? (
                    <div className="h-9 w-28 bg-slate-100 dark:bg-white/5 animate-pulse rounded-xl" />
                ) : (
                    <h4 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">
                        {value}
                    </h4>
                )}
            </div>

            {!loading && sparkData && (
                <div className="h-14 -mx-6 -mb-6 mt-4 opacity-90 group-hover:opacity-100 transition-opacity">
                    <ResponsiveContainer width="100%" height="100%">
                        {renderChart()}
                    </ResponsiveContainer>
                </div>
            )}
        </motion.div>
    );
};

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [superStats, setSuperStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState(null);
    const [viewType, setViewType] = useState("monthly");

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const isSuperAdmin = user.role === "superadmin";

    const sparklines = useMemo(() => ({
        clients: generateSparkline(1, 7, "up"),
        revenue: generateSparkline(2, 7, "up"),
        outstanding: generateSparkline(3, 7, "down"),
        churn: generateSparkline(4, 7, "down"),
        admins: generateSparkline(5, 7, "up"),
    }), []);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const baseUrl = (process.env.REACT_APP_API_URL || "http://localhost:5000").replace(/\/$/, "");
            
            // Fetch normal dashboard stats
            const res = await fetch(`${baseUrl}/api/dashboard/stats?type=${viewType}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            setStats(data);

            // Fetch super admin stats if applicable
            if (isSuperAdmin) {
                const superRes = await fetch(`${baseUrl}/api/super-admin/stats`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (superRes.ok) {
                    const superData = await superRes.json();
                    setSuperStats(superData);
                }
            }
        } catch (error) {
            console.error("Failed", error);
        } finally {
            setLoading(false);
        }
    };

    const exportPDF = () => {
        if (!stats) return;
        const doc = new jsPDF();
        doc.setFontSize(22);
        doc.setTextColor(55, 107, 139);
        doc.text("CollectAI", 14, 20);
        doc.setFontSize(14);
        doc.setTextColor(100);
        doc.text("Overview Dashboard Report", 14, 30);
        
        const date = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
        doc.setFontSize(10);
        doc.text(`Generated on: ${date}`, 14, 38);
        doc.line(14, 42, 196, 42);
        
        const summaryData = [
            ["Metric", "Value"],
            ["Total Clients", stats.totalClients || "0"],
            ["Active Revenue", `INR ${(stats.totalRevenue || 0).toLocaleString()}`],
            ["Outstanding", `INR ${(stats.totalOutstanding || 0).toLocaleString()}`],
            ["Churn Risk", stats.churnRiskCount || "0"]
        ];
        
        autoTable(doc, {
            startY: 50,
            head: [summaryData[0]],
            body: summaryData.slice(1),
            theme: 'striped',
            headStyles: { fillColor: [55, 107, 139] }
        });
        
        doc.save("CollectAI_Dashboard_Report.pdf");
    };

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const status = params.get("status");
        if (status === "success") setAlert({ type: "success", message: "Action completed successfully!" });
        else if (status === "cancel") setAlert({ type: "error", message: "Action was cancelled." });
        if (status) window.history.replaceState({}, document.title, window.location.pathname);
    }, []);

    useEffect(() => {
        fetchStats();
    }, [viewType]);

    return (
        <div className="space-y-10 pb-16 animate-reveal">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
                        {isSuperAdmin ? "Super Control Center" : "System Overview"}
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 font-bold uppercase tracking-widest opacity-80">
                        {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: '2-digit', month: 'long' })} • {isSuperAdmin ? "Institutional Root" : "Central Hub"}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-slate-900/10 dark:shadow-white/5">Generate Report</button>
                </div>
            </div>

            {alert && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`p-5 rounded-[2rem] flex items-center gap-4 ${alert.type === "success" ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-600" : "bg-rose-500/10 border border-rose-500/20 text-rose-600"
                    }`}>
                    <div className="w-10 h-10 rounded-xl bg-current/10 flex items-center justify-center">
                        <Activity size={20} />
                    </div>
                    <p className="font-bold text-sm tracking-tight">{alert.message}</p>
                    <button onClick={() => setAlert(null)} className="ml-auto w-8 h-8 rounded-full hover:bg-current/10 flex items-center justify-center text-xl transition-colors">&times;</button>
                </motion.div>
            )}

            {isSuperAdmin && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <StatCard
                        title="Global Admins"
                        value={superStats?.totalAdmins || "0"}
                        icon={Shield}
                        trend="up"
                        trendValue="+1"
                        color="bg-rose-600"
                        loading={loading}
                        sparkData={sparklines.admins}
                        chartType="bar"
                    />
                    <StatCard
                        title="Institutional Revenue"
                        value={`₹${(superStats?.totalRevenue || 0).toLocaleString()}`}
                        icon={IndianRupee}
                        trend="up"
                        trendValue="+15.2%"
                        color="bg-emerald-600"
                        loading={loading}
                        sparkData={sparklines.revenue}
                        chartType="area"
                    />
                    <StatCard
                        title="Active Terminals"
                        value={superStats?.activeClients || "0"}
                        icon={Activity}
                        trend="up"
                        trendValue="+4.1%"
                        color="bg-matisse-600"
                        loading={loading}
                        sparkData={sparklines.clients}
                        chartType="line"
                    />
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Clients"
                    value={stats?.totalClients || "0"}
                    icon={Users}
                    trend="up"
                    trendValue="+12.5%"
                    color="bg-matisse-600"
                    loading={loading}
                    sparkData={sparklines.clients}
                    chartType="bar"
                />
                <StatCard
                    title="Active Revenue"
                    value={`₹${(stats?.totalRevenue || 0).toLocaleString()}`}
                    icon={IndianRupee}
                    trend="up"
                    trendValue="+8.2%"
                    color="bg-matisse-600"
                    loading={loading}
                    sparkData={sparklines.revenue}
                    chartType="area"
                />
                <StatCard
                    title="Outstanding"
                    value={`₹${(stats?.totalOutstanding || 0).toLocaleString()}`}
                    icon={Clock}
                    trend="down"
                    trendValue="-5.1%"
                    color="bg-rose-600"
                    loading={loading}
                    sparkData={sparklines.outstanding}
                    chartType="line"
                />
                <StatCard
                    title="Churn Risk"
                    value={stats?.churnRiskCount || "0"}
                    icon={Activity}
                    trend="down"
                    trendValue="-2.4%"
                    color="bg-amber-600"
                    loading={loading}
                    sparkData={sparklines.churn}
                    chartType="bar"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 glass-card p-10 rounded-[3rem] premium-shadow border-white/40 dark:border-white/5 relative overflow-hidden group">
                    <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-matisse-500/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-matisse-500/10 transition-colors duration-700" />
                    
                    <div className="flex items-center justify-between mb-10 relative z-10">
                        <div>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">Revenue Analytics</h3>
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.25em] mt-2 opacity-70">{viewType} performance trajectory</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <select 
                                value={viewType}
                                onChange={(e) => setViewType(e.target.value)}
                                className="bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 outline-none cursor-pointer hover:bg-slate-200 dark:hover:bg-white/10 transition-all shadow-sm"
                            >
                                <option value="weekly">Weekly View</option>
                                <option value="monthly">Monthly View</option>
                                <option value="yearly">Yearly View</option>
                            </select>
                            <button className="px-5 py-2.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-white/10 transition-all shadow-sm active:scale-95" onClick={exportPDF}>Export</button>
                        </div>
                    </div>
                    <div className="h-80 w-full relative z-10">
                        <AnimatedAnalyticsChart data={stats?.chartData || []} />
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <div className="glass-card p-8 rounded-[3rem] premium-shadow flex flex-col items-center justify-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-b from-matisse-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight mb-8 relative z-10">Status Distribution</h3>
                        <div className="h-48 w-full relative z-10">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={[
                                            { name: "Active", value: stats?.totalClients || 0 },
                                            { name: "Pending", value: 5 },
                                            { name: "Churn-risk", value: stats?.churnRiskCount || 0 },
                                        ]}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={65}
                                        outerRadius={85}
                                        paddingAngle={8}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        <Cell fill={STATUS_COLORS["Active"]} className="hover:opacity-80 transition-opacity cursor-pointer" />
                                        <Cell fill={STATUS_COLORS["Pending"]} className="hover:opacity-80 transition-opacity cursor-pointer" />
                                        <Cell fill={STATUS_COLORS["Churn-risk"]} className="hover:opacity-80 transition-opacity cursor-pointer" />
                                    </Pie>
                                    <Tooltip 
                                        contentStyle={{ 
                                            backgroundColor: "rgba(15, 23, 42, 0.95)", 
                                            border: "none", 
                                            borderRadius: "20px", 
                                            color: "#fff",
                                            fontSize: "12px",
                                            fontWeight: "bold",
                                            backdropFilter: "blur(10px)",
                                            boxShadow: "0 10px 25px -5px rgba(0,0,0,0.3)"
                                        }}
                                        itemStyle={{ color: "#fff" }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex flex-wrap justify-center gap-5 mt-6 relative z-10">
                            {Object.entries(STATUS_COLORS).map(([label, color]) => (
                                <div key={label} className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.1)]" style={{ backgroundColor: color }} />
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass-card p-8 rounded-[3rem] premium-shadow flex flex-col flex-1 relative overflow-hidden group">
                        <div className="flex items-center justify-between mb-8 relative z-10">
                            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">Participants</h3>
                            <button className="text-[10px] font-black text-matisse-600 dark:text-matisse-400 hover:bg-matisse-50 dark:hover:bg-matisse-900/20 px-4 py-2 rounded-xl transition-all uppercase tracking-widest">View All</button>
                        </div>
                        <div className="space-y-5 flex-1 relative z-10">
                            {(stats?.recentClients || []).slice(0, 4).map((client, idx) => (
                                <motion.div 
                                    key={idx} 
                                    whileHover={{ x: 8 }}
                                    className="flex items-center gap-4 group cursor-pointer p-2 rounded-2xl hover:bg-white/50 dark:hover:bg-white/5 transition-all"
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center text-sm font-black text-matisse-600 border border-slate-200 dark:border-white/10 shadow-sm group-hover:rotate-6 transition-all duration-500">
                                        {client.name[0]}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-black text-slate-900 dark:text-white truncate group-hover:text-matisse-600 transition-colors">{client.name}</p>
                                        <p className="text-[10px] text-slate-400 truncate font-bold uppercase tracking-widest mt-1 opacity-70">{client.company}</p>
                                    </div>
                                    <div className={`w-2.5 h-2.5 rounded-full ring-4 ${client.status === "Active" ? "bg-emerald-500 ring-emerald-500/10" : "bg-amber-500 ring-amber-500/10"} shadow-lg`} />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="glass-card rounded-[3rem] overflow-hidden premium-shadow relative group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-matisse-500/5 rounded-full blur-[80px] pointer-events-none group-hover:bg-matisse-500/10 transition-colors duration-700" />
                
                <div className="p-10 border-b border-slate-100 dark:border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-slate-50/30 dark:bg-slate-800/40 relative z-10">
                    <div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">Recent Ledger</h3>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-black uppercase tracking-[0.25em] mt-2">Latest verified billing activities</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-2.5 px-5 py-2.5 bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/10 dark:border-emerald-500/20 rounded-2xl text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                            <span>Live Updates</span>
                        </div>
                        <button className="text-matisse-600 dark:text-matisse-400 hover:bg-matisse-50 dark:hover:bg-matisse-900/20 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-matisse-500/10 hover:border-matisse-500/30">History</button>
                    </div>
                </div>
                <div className="overflow-x-auto relative z-10">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-slate-400 dark:text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] border-b border-slate-100 dark:border-white/5">
                                <th className="px-10 py-8">Entity</th>
                                <th className="px-10 py-8">Status</th>
                                <th className="px-10 py-8 text-right">Volume</th>
                                <th className="px-10 py-8">Timeline</th>
                                <th className="px-10 py-8"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="py-24 text-center">
                                        <Loader2 className="mx-auto animate-spin text-matisse-500" size={40} strokeWidth={3} />
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4">Syncing Ledger Data...</p>
                                    </td>
                                </tr>
                            ) : !stats?.recentClients || stats?.recentClients.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="py-24 text-center text-slate-500 font-black uppercase tracking-[0.2em] opacity-50">Zero active transactions</td>
                                </tr>
                            ) : stats?.recentClients.map((client, idx) => (
                                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-all group cursor-pointer">
                                    <td className="px-10 py-7">
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-matisse-50 to-matisse-100 dark:from-matisse-900/30 dark:to-matisse-900/10 flex items-center justify-center text-xs font-black text-matisse-600 border border-matisse-200/50 dark:border-matisse-900/30 group-hover:scale-110 transition-transform shadow-sm">
                                                {client.name[0]}
                                            </div>
                                            <div>
                                                <div className="font-black text-slate-900 dark:text-white text-sm tracking-tight group-hover:text-matisse-600 transition-colors">{client.name}</div>
                                                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest mt-1">{client.company}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-7">
                                        <span className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border shadow-sm ${client.status === "Active" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
                                            client.status === "Churn-risk" ? "bg-rose-500/10 text-rose-600 border-rose-500/20" : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                                            }`}>
                                            {client.status}
                                        </span>
                                    </td>
                                    <td className="px-10 py-7 font-black text-slate-900 dark:text-white text-right text-base tracking-tighter group-hover:scale-105 transition-transform origin-right">{client.revenue}</td>
                                    <td className="px-10 py-7 text-slate-500 dark:text-slate-400 text-xs font-bold tabular-nums">{client.date}</td>
                                    <td className="px-10 py-7 text-right">
                                        <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all transform hover:rotate-90">&bull;&bull;&bull;</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
