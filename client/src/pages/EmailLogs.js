import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Mail, CheckCircle2, XCircle, Calendar, ChevronLeft, ChevronRight, Loader2, RefreshCw } from "lucide-react";

const EmailLogs = () => {
    const [logs, setLogs] = useState([]);
    const [admins, setAdmins] = useState([]); // For Super Admin view
    const [selectedAdmin, setSelectedAdmin] = useState(null); // ID of the admin being viewed
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const isSuperAdmin = user.role === "superadmin";
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (isSuperAdmin && !selectedAdmin) {
            fetchAdmins();
        } else {
            fetchLogs();
        }
    }, [page, statusFilter, selectedAdmin]);

    const fetchAdmins = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${(process.env.REACT_APP_API_URL || "http://localhost:5000").replace(/\/$/, "")}/api/super-admin/admins-with-revenue`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            setAdmins(data);
        } catch (error) {
            console.error("Failed to fetch admins", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchLogs = async (isManual = false) => {
        if (isManual) setRefreshing(true);
        else setLoading(true);
        try {
            const baseUrl = (process.env.REACT_APP_API_URL || "http://localhost:5000").replace(/\/$/, "");
            const url = selectedAdmin
                ? `${baseUrl}/api/email-logs?page=${page}&limit=10&adminId=${selectedAdmin}${statusFilter !== 'all' ? `&status=${statusFilter}` : ''}`
                : `${baseUrl}/api/email-logs?page=${page}&limit=10${statusFilter !== 'all' ? `&status=${statusFilter}` : ''}`;
            
            const res = await fetch(url, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await res.json();
            if (res.ok) {
                setLogs(data.logs);
                setTotalPages(data.totalPages || data.pages);
            }
        } catch (error) {
            console.error("Error fetching logs:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const filteredLogs = logs.filter(log => 
        log.recipientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    {isSuperAdmin && selectedAdmin && (
                        <button 
                            onClick={() => setSelectedAdmin(null)}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all text-slate-500"
                        >
                            <XCircle size={24} />
                        </button>
                    )}
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">
                            {isSuperAdmin && !selectedAdmin ? "Admins Automation Overview" : "AI Automation Logs"}
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                            {isSuperAdmin && !selectedAdmin 
                                ? "Select an admin to view their automated communication history." 
                                : "Track all AI-generated recovery communications"}
                        </p>
                    </div>
                </div>
                
                {(!isSuperAdmin || selectedAdmin) && (
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => fetchLogs(true)}
                            disabled={refreshing || loading}
                            className={`p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all premium-shadow ${refreshing ? 'animate-spin' : ''}`}
                            title="Refresh Logs"
                        >
                            <RefreshCw size={18} className="text-slate-500" />
                        </button>

                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search recipient..."
                                className="pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl outline-none focus:ring-2 focus:ring-matisse-500/20 focus:border-matisse-500/50 transition-all w-64 text-sm font-medium"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        
                        <select
                            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-matisse-500/20 focus:border-matisse-500/50 text-sm font-bold uppercase tracking-wider"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="sent">Sent</option>
                            <option value="failed">Failed</option>
                        </select>
                    </div>
                )}
            </div>

            {isSuperAdmin && !selectedAdmin ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        <div className="col-span-full py-20 text-center">
                            <Loader2 className="mx-auto animate-spin text-matisse-500" size={32} />
                        </div>
                    ) : admins.length === 0 ? (
                        <div className="col-span-full py-20 text-center text-slate-500">No admins found.</div>
                    ) : admins.map((admin) => (
                        <motion.div
                            key={admin._id}
                            whileHover={{ y: -5 }}
                            onClick={() => setSelectedAdmin(admin._id)}
                            className="bg-white dark:bg-slate-900/40 p-6 rounded-[2rem] border border-slate-200 dark:border-white/5 premium-shadow cursor-pointer group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500 font-bold text-xl group-hover:bg-rose-500 group-hover:text-white transition-all">
                                    {admin.name[0]}
                                </div>
                                <div className="text-right text-rose-500">
                                    <Mail size={20} />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{admin.name}</h3>
                                <p className="text-sm text-slate-500">{admin.email}</p>
                            </div>
                            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-white/5 flex justify-between items-center">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{admin.clientCount} Clients</span>
                                <span className="text-matisse-500 text-xs font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                                    View Logs →
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="bg-white dark:bg-slate-900/40 rounded-[2rem] border border-slate-200 dark:border-white/5 overflow-hidden premium-shadow transition-all duration-300">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] border-b border-slate-100 dark:border-white/5">
                                    <th className="px-8 py-6">Recipient</th>
                                    <th className="px-8 py-6">Subject</th>
                                    <th className="px-8 py-6">Status</th>
                                    <th className="px-8 py-6">Sent Date</th>
                                    <th className="px-8 py-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-white/10">
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center gap-3 text-gray-500">
                                                <Loader2 className="animate-spin text-matisse-500" size={32} />
                                                <span>Loading logs...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredLogs.length > 0 ? (
                                    filteredLogs.map((log) => (
                                        <motion.tr 
                                            key={log._id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-gray-900 dark:text-white">{log.recipientEmail}</span>
                                                    <span className="text-xs text-gray-500">INV: {log.invoiceId?.invoiceNumber || "N/A"}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Mail size={14} className="text-gray-400" />
                                                    <span className="text-sm text-gray-700 dark:text-gray-300 max-w-xs truncate">{log.subject}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {log.status === "sent" ? (
                                                    <div className="flex items-center gap-1.5 text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full w-fit">
                                                        <CheckCircle2 size={14} />
                                                        <span className="text-xs font-bold uppercase tracking-wider">Sent</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-1.5 text-rose-500 bg-rose-500/10 px-2.5 py-1 rounded-full w-fit">
                                                        <XCircle size={14} />
                                                        <span className="text-xs font-bold uppercase tracking-wider">Failed</span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                                    <Calendar size={14} />
                                                    {formatDate(log.sentAt)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button 
                                                    className="text-matisse-500 hover:text-matisse-600 font-semibold text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity"
                                                    onClick={() => alert(log.content)}
                                                >
                                                    View Content
                                                </button>
                                            </td>
                                        </motion.tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                            No logs found matching your criteria.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="px-6 py-4 border-t border-gray-200 dark:border-white/10 flex items-center justify-between bg-gray-50 dark:bg-white/5">
                        <p className="text-xs text-gray-500 font-medium">
                            Showing page {page} of {totalPages}
                        </p>
                        <div className="flex gap-2">
                            <button
                                disabled={page === 1}
                                onClick={() => setPage(prev => prev - 1)}
                                className="p-2 border border-gray-200 dark:border-white/10 rounded-lg hover:bg-white dark:hover:bg-slate-800 disabled:opacity-50 transition-all"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <button
                                disabled={page === totalPages}
                                onClick={() => setPage(prev => prev + 1)}
                                className="p-2 border border-gray-200 dark:border-white/10 rounded-lg hover:bg-white dark:hover:bg-slate-800 disabled:opacity-50 transition-all"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmailLogs;
