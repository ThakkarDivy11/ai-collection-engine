import React, { useState, useEffect, useCallback } from "react";
import {
    CreditCard,
    Download,
    Search,
    Loader2,
    Calendar,
    IndianRupee,
    CheckCircle2,
    Clock,
    AlertCircle,
    LogOut,
    ArrowRight,
    FileText,
    Layers,
    RefreshCcw
} from "lucide-react";
import { motion } from "framer-motion";
import BackgroundWrapper from "../components/Background";
import ThemeToggle from "../components/ThemeToggle";

export default function CustomerDashboard() {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const [processingId, setProcessingId] = useState(null);
    const [processingAll, setProcessingAll] = useState(false);
    const [alert, setAlert] = useState(null);
    const user = React.useMemo(() => JSON.parse(localStorage.getItem("customer")), []);

    const fetchInvoices = useCallback(async (isManual = false) => {
        if (!user?.id) {
            setLoading(false);
            return;
        }
        
        if (isManual) setRefreshing(true);
        else setLoading(true);
        
        setError(null);
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("Session expired. Please log in again.");
                setLoading(false);
                return;
            }
            const res = await fetch(`${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/invoices/my-invoices`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.message || `Server error ${res.status}`);
            }
            const data = await res.json();
            setInvoices(Array.isArray(data) ? data : []);
            
            if (isManual) {
                setAlert({ type: "success", message: "Your invoices are now up to date!" });
                setTimeout(() => setAlert(null), 3000);
            }
        } catch (error) {
            console.error("Failed to fetch invoices", error);
            setError(error.message || "Failed to load invoices. Please try again.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [user?.id]);

    useEffect(() => {
        if (!user) {
            window.location.href = "/";
            return;
        }
        fetchInvoices();
    }, [fetchInvoices, user]);

    useEffect(() => {
        const verifyPayment = async (sessionId) => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/payments/verify-session/${sessionId}`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.success) {
                    fetchInvoices();
                }
            } catch (error) {
                console.error("Failed to verify payment", error);
            }
        };

        const params = new URLSearchParams(window.location.search);
        const status = params.get("status");
        const sessionId = params.get("session_id");

        if (status === "success") {
            setAlert({ type: "success", message: "Payment completed successfully! Your invoices have been updated." });
            if (sessionId) {
                verifyPayment(sessionId);
            } else {
                fetchInvoices();
            }
        } else if (status === "cancel") {
            setAlert({ type: "error", message: "Payment was cancelled. You can try again whenever you're ready." });
        }

        if (status) {
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, [fetchInvoices]);

    const handlePay = async (invoice) => {
        setProcessingId(invoice._id);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/payments/create-checkout-session`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    clientId: user.id,
                    amount: invoice.amount,
                    invoiceId: invoice._id
                }),
            });
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            }
        } catch (error) {
            console.error("Payment failed", error);
        } finally {
            setProcessingId(null);
        }
    };

    const handlePayAll = async () => {
        setProcessingAll(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/payments/create-bulk-checkout-session`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ clientId: user.id }),
            });
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            }
        } catch (error) {
            console.error("Bulk payment failed", error);
        } finally {
            setProcessingAll(false);
        }
    };

    const handleDownload = async (invoice) => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/invoices/download/${invoice._id}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            
            if (!res.ok) {
                throw new Error("Failed to download invoice");
            }

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `Invoice_${invoice.invoiceNumber}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error("Download failed", error);
            alert("Failed to download invoice. Please try again.");
        }
    };

    const logout = () => {
        localStorage.removeItem("customer");
        localStorage.removeItem("token");
        window.location.href = "/";
    };

    const unpaidCount = invoices.filter(i => i.status === "unpaid" || i.status === "overdue").length;
    const totalDue = invoices.filter(i => i.status === "unpaid" || i.status === "overdue").reduce((acc, curr) => acc + curr.amount, 0);
    const totalBills = invoices.length;

    return (
        <div className="space-y-10 animate-reveal">
            {alert && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`p-6 rounded-[2.5rem] flex items-center gap-5 border shadow-xl ${alert.type === "success"
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600"
                        : "bg-rose-500/10 border-rose-500/20 text-rose-600"
                        }`}
                >
                    <div className="w-12 h-12 rounded-2xl bg-current/10 flex items-center justify-center">
                        {alert.type === "success" ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                    </div>
                    <p className="font-black text-sm tracking-tight">{alert.message}</p>
                    <button onClick={() => setAlert(null)} className="ml-auto w-10 h-10 rounded-full hover:bg-current/10 flex items-center justify-center text-2xl transition-colors">&times;</button>
                </motion.div>
            )}

            {/* Premium Glass Summary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div
                    whileHover={{ y: -6 }}
                    className="glass-card p-8 rounded-[3rem] premium-shadow border-white/40 dark:border-white/5 relative overflow-hidden group"
                >
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-violet-600/10 rounded-full blur-3xl group-hover:bg-violet-600/20 transition-colors" />
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-4 bg-violet-500/10 text-violet-500 rounded-[1.25rem]">
                            <FileText size={26} className="stroke-[2.5px]" />
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] opacity-70">Total Bills</span>
                    </div>
                    <div className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">{totalBills}</div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">All Time Ledger</div>
                </motion.div>

                <motion.div
                    whileHover={{ y: -6 }}
                    className="glass-card p-8 rounded-[3rem] premium-shadow border-white/40 dark:border-white/5 relative overflow-hidden group"
                >
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-matisse-600/10 rounded-full blur-3xl group-hover:bg-matisse-600/20 transition-colors" />
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-4 bg-matisse-600/10 text-matisse-600 rounded-[1.25rem]">
                            <IndianRupee size={26} className="stroke-[2.5px]" />
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] opacity-70">Balance Due</span>
                    </div>
                    <div className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">₹{totalDue.toLocaleString()}</div>
                    <div className="text-[10px] font-black text-matisse-500 uppercase tracking-widest">{unpaidCount} Pending Payments</div>
                </motion.div>

                <motion.div
                    whileHover={{ y: -6 }}
                    className="glass-card p-8 rounded-[3rem] premium-shadow border-white/40 dark:border-white/5 relative overflow-hidden group"
                >
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-600/10 rounded-full blur-3xl group-hover:bg-emerald-600/20 transition-colors" />
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-[1.25rem]">
                            <CheckCircle2 size={26} className="stroke-[2.5px]" />
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] opacity-70">Cleared</span>
                    </div>
                    <div className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">
                        {invoices.filter(i => i.status === "paid").length}
                    </div>
                    <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Invoices Paid</div>
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={`p-8 rounded-[3rem] shadow-2xl relative overflow-hidden group transition-all duration-500 ${
                        unpaidCount > 0
                            ? "bg-gradient-to-tr from-matisse-600 to-matisse-400 text-white shadow-matisse-600/30"
                            : "bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white shadow-emerald-600/30"
                    }`}
                >
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-4 bg-white/20 rounded-[1.25rem] backdrop-blur-xl">
                                <Layers size={26} className="stroke-[2.5px]" />
                            </div>
                            <span className="text-[10px] font-black text-white/80 uppercase tracking-[0.25em]">
                                {unpaidCount > 0 ? "Fast Checkout" : "Status"}
                            </span>
                        </div>
                        {unpaidCount > 0 ? (
                            <>
                                <div className="text-3xl font-black mb-1 tracking-tighter">₹{totalDue.toLocaleString()}</div>
                                <div className="text-[10px] font-black text-white/70 mb-6 uppercase tracking-widest">{unpaidCount} bills outstanding</div>
                                <button
                                    onClick={handlePayAll}
                                    disabled={processingAll}
                                    className="w-full bg-white text-matisse-600 hover:bg-slate-50 disabled:opacity-50 h-14 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-xl active:scale-95"
                                >
                                    {processingAll ? <Loader2 size={18} className="animate-spin" /> : <CreditCard size={18} className="stroke-[2.5px]" />}
                                    Pay All Now
                                </button>
                            </>
                        ) : (
                            <>
                                <div className="text-2xl font-black mb-2 tracking-tighter">No Pending Dues! 🎉</div>
                                <div className="text-[10px] font-black text-white/80 uppercase tracking-widest">All your accounts are settled.</div>
                            </>
                        )}
                    </div>
                    <div className="absolute -right-10 -bottom-10 opacity-20 group-hover:rotate-12 group-hover:scale-110 transition-all duration-700">
                        <Layers size={180} />
                    </div>
                </motion.div>
            </div>

            {/* Billing Ledger Table */}
            <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Billing History</h2>
                        <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.25em] mt-2 opacity-80">Verified Invoice Records</p>
                    </div>
                    <div className="bg-white/50 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 rounded-2xl px-6 py-3.5 flex items-center gap-4 w-80 shadow-sm focus-within:ring-2 focus-within:ring-matisse-500/20 transition-all group">
                        <Search size={16} className="text-slate-400 dark:text-slate-500 group-focus-within:text-matisse-500 transition-colors stroke-[2.5px]" />
                        <input
                            type="text"
                            placeholder="COMMAND SEARCH..."
                            className="bg-transparent border-none text-[10px] font-black text-slate-900 dark:text-white focus:ring-0 placeholder:text-slate-400 dark:placeholder:text-slate-500 w-full uppercase tracking-widest"
                        />
                    </div>
                </div>

                <div className="glass-card rounded-[3rem] overflow-hidden premium-shadow border-white/40 dark:border-white/5 relative group">
                    <div className="overflow-x-auto relative z-10">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-100/50 dark:bg-white/5 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] border-b border-slate-200/50 dark:border-white/10">
                                    <th className="px-10 py-8">Invoice Info</th>
                                    <th className="px-10 py-8">Amount</th>
                                    <th className="px-10 py-8">Due Timeline</th>
                                    <th className="px-10 py-8">Status</th>
                                    <th className="px-10 py-8 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" className="py-28 text-center">
                                            <Loader2 className="mx-auto animate-spin text-matisse-500" size={40} strokeWidth={3} />
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-6">Syncing Payment Ledger...</p>
                                        </td>
                                    </tr>
                                ) : error ? (
                                    <tr>
                                        <td colSpan="5" className="py-28 text-center">
                                            <AlertCircle className="mx-auto text-rose-500 mb-4" size={40} />
                                            <p className="text-rose-500 font-black text-sm tracking-tight">{error}</p>
                                            <button
                                                onClick={fetchInvoices}
                                                className="mt-6 text-matisse-600 dark:text-matisse-400 text-[10px] font-black uppercase tracking-widest hover:underline"
                                            >
                                                Retry Connection
                                            </button>
                                        </td>
                                    </tr>
                                ) : invoices.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="py-28 text-center text-slate-400 font-black uppercase tracking-[0.2em] opacity-50">Zero Invoices Found</td>
                                    </tr>
                                ) : invoices.map((invoice, idx) => (
                                    <motion.tr
                                        key={invoice._id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-all group"
                                    >
                                        <td className="px-10 py-7">
                                            <div className="flex items-center gap-5">
                                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-matisse-50 to-matisse-100 dark:from-matisse-900/30 dark:to-matisse-900/10 flex items-center justify-center text-xs font-black text-matisse-600 border border-matisse-200/50 dark:border-matisse-900/30 group-hover:scale-110 transition-transform shadow-sm">
                                                    <Calendar size={20} className="stroke-[2.5px]" />
                                                </div>
                                                <div>
                                                    <div className="font-black text-slate-900 dark:text-white text-sm tracking-tight group-hover:text-matisse-600 transition-colors uppercase">{invoice.invoiceNumber}</div>
                                                    <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1 opacity-70">SaaS Subscription</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-7">
                                            <div className="flex flex-col">
                                                <div className="text-lg font-black text-slate-900 dark:text-white tracking-tighter">₹{(invoice.originalAmount || invoice.amount).toLocaleString()}</div>
                                                {invoice.status !== "paid" && invoice.penaltyAmount > 0 && (
                                                    <div className="text-[10px] font-black text-rose-500 uppercase tracking-widest mt-1">
                                                        +₹{invoice.penaltyAmount.toLocaleString()} Penalty
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-10 py-7">
                                            <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 text-xs font-bold tabular-nums">
                                                <Clock size={16} className="stroke-[2.5px] opacity-50" />
                                                {(() => {
                                                    const d = new Date(invoice.dueDate);
                                                    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                                                    return `${String(d.getUTCDate()).padStart(2, '0')} ${months[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
                                                })()}
                                            </div>
                                        </td>
                                        <td className="px-10 py-7">
                                            <span className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border shadow-sm ${invoice.status === "paid" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
                                                invoice.status === "overdue" ? "bg-rose-500/10 text-rose-600 border-rose-500/20" : "bg-matisse-500/10 text-matisse-600 border-matisse-500/20"
                                                }`}>
                                                {invoice.status}
                                            </span>
                                        </td>
                                        <td className="px-10 py-7 text-right">
                                            <div className="flex justify-end gap-4">
                                                {invoice.status !== "paid" ? (
                                                    <button
                                                        disabled={processingId === invoice._id}
                                                        onClick={() => handlePay(invoice)}
                                                        className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50 transition-all flex items-center gap-2.5"
                                                    >
                                                        {processingId === invoice._id ? <Loader2 size={16} className="animate-spin" /> : <CreditCard size={16} className="stroke-[2.5px]" />}
                                                        Pay Now
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleDownload(invoice)}
                                                        className="w-12 h-12 flex items-center justify-center bg-white/50 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 rounded-2xl text-slate-600 dark:text-slate-400 hover:bg-matisse-500 hover:text-white transition-all duration-500 shadow-sm active:scale-90 group"
                                                        title="Download Receipt"
                                                    >
                                                        <Download size={20} className="stroke-[2.5px] group-hover:scale-110 transition-transform" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] py-8 opacity-60">
                <p>© 2026 ADMIN SYSTEMS • ENCRYPTED PAYMENTS PORTAL</p>
                <div className="flex items-center gap-10 mt-6 sm:mt-0">
                    <a href="#!" className="hover:text-matisse-600 transition-colors">Compliance</a>
                    <a href="#!" className="hover:text-matisse-600 transition-colors">Data Protocol</a>
                    <a href="#!" className="hover:text-matisse-600 transition-colors">Support Terminal</a>
                </div>
            </div>
        </div>
    );
}
