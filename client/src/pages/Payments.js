import React, { useState, useEffect, useCallback } from "react";
import { Download, Search, Plus, X, Loader2, Calendar, IndianRupee, Hash } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Payments() {
    const [invoices, setInvoices] = useState([]);
    const [clients, setClients] = useState([]);
    const [admins, setAdmins] = useState([]); // For Super Admin view
    const [selectedAdmin, setSelectedAdmin] = useState(null); // ID of the admin being viewed
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const isSuperAdmin = user.role === "superadmin";

    const [formData, setFormData] = useState({
        clientId: "",
        amount: "",
        dueDate: "",
        invoiceNumber: `INV-${Math.floor(100000 + Math.random() * 900000)}`,
    });

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            
            if (isSuperAdmin && !selectedAdmin) {
                // Fetch admins for the initial view
                const res = await fetch(`${(process.env.REACT_APP_API_URL || "http://localhost:5000").replace(/\/$/, "")}/api/super-admin/admins-with-revenue`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                const data = await res.json();
                setAdmins(data);
            } else {
                // Fetch invoices (optionally filtered by selected admin)
                const url = (isSuperAdmin && selectedAdmin)
                    ? `${(process.env.REACT_APP_API_URL || "http://localhost:5000").replace(/\/$/, "")}/api/invoices?adminId=${selectedAdmin}`
                    : `${(process.env.REACT_APP_API_URL || "http://localhost:5000").replace(/\/$/, "")}/api/invoices`;
                
                const [invRes, cliRes] = await Promise.all([
                    fetch(url, { headers: { "Authorization": `Bearer ${token}` } }),
                    fetch(`${(process.env.REACT_APP_API_URL || "http://localhost:5000").replace(/\/$/, "")}/api/clients`, {
                        headers: { "Authorization": `Bearer ${token}` }
                    })
                ]);

                const invData = await invRes.json();
                const cliData = await cliRes.json();

                setInvoices(Array.isArray(invData) ? invData : []);
                setClients(Array.isArray(cliData) ? cliData : (cliData.clients || []));
            }
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
        }
    }, [isSuperAdmin, selectedAdmin]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${(process.env.REACT_APP_API_URL || "http://localhost:5000").replace(/\/$/, "")}/api/invoices`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setShowModal(false);
                setFormData({
                    clientId: "",
                    amount: "",
                    dueDate: "",
                    invoiceNumber: `INV-${Math.floor(100000 + Math.random() * 900000)}`,
                });
                fetchData();
            }
        } catch (error) {
            console.error("Failed to create invoice", error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDownload = async (invoice) => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${(process.env.REACT_APP_API_URL || "http://localhost:5000").replace(/\/$/, "")}/api/invoices/download/${invoice._id}`, {
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

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    {isSuperAdmin && selectedAdmin && (
                        <button 
                            onClick={() => setSelectedAdmin(null)}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all text-slate-500"
                        >
                            <X size={24} />
                        </button>
                    )}
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">
                            {isSuperAdmin && !selectedAdmin ? "Admins Revenue Overview" : "Payments & Invoices"}
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                            {isSuperAdmin && !selectedAdmin ? "Select an admin to view their detailed client payments." : "Track transactions and issue new billing requests."}
                        </p>
                    </div>
                </div>
                {!isSuperAdmin && (
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-matisse-600 hover:bg-matisse-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-matisse-600/20"
                    >
                        <Plus size={20} />
                        Create Invoice
                    </button>
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
                                <div className="text-right">
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Revenue</div>
                                    <div className="text-xl font-black text-slate-900 dark:text-white">₹{admin.totalRevenue.toLocaleString()}</div>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{admin.name}</h3>
                                <p className="text-sm text-slate-500">{admin.email}</p>
                            </div>
                            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-white/5 flex justify-between items-center">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{admin.clientCount} Clients</span>
                                <span className="text-matisse-500 text-xs font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                                    View Payments →
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <>
                    <div className="bg-white dark:bg-slate-900/40 p-5 rounded-3xl border border-slate-200 dark:border-white/5 flex flex-col md:flex-row md:items-center gap-4 premium-shadow transition-all duration-300">
                        <div className="flex items-center gap-4 flex-1">
                            <div className="p-2.5 bg-slate-100 dark:bg-white/5 rounded-xl text-slate-400">
                                <Search size={20} />
                            </div>
                            <input
                                type="text"
                                placeholder="Search by invoice # or client..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-transparent border-none text-slate-900 dark:text-white focus:ring-0 flex-1 px-0 placeholder:text-slate-400 dark:placeholder:text-slate-500 font-medium"
                            />
                        </div>
                        <div className="hidden md:block h-8 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>
                        <select 
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-matisse-500 font-medium cursor-pointer w-full md:w-auto"
                        >
                            <option value="all" className="dark:bg-slate-800">All Status</option>
                            <option value="paid" className="dark:bg-slate-800">Paid</option>
                            <option value="unpaid" className="dark:bg-slate-800">Unpaid</option>
                            <option value="overdue" className="dark:bg-slate-800">Overdue</option>
                        </select>
                    </div>

            <div className="bg-white dark:bg-slate-900/40 rounded-[2rem] border border-slate-200 dark:border-white/5 overflow-hidden premium-shadow transition-all duration-300">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] border-b border-slate-100 dark:border-white/5">
                                <th className="px-8 py-6">Invoice #</th>
                                <th className="px-8 py-6">Client</th>
                                <th className="px-8 py-6">Amount</th>
                                <th className="px-8 py-6">Due Date</th>
                                <th className="px-8 py-6">Status</th>
                                <th className="px-8 py-6 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-slate-800">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="py-20 text-center">
                                        <Loader2 className="mx-auto animate-spin text-matisse-500" size={32} />
                                    </td>
                                </tr>
                            ) : invoices.filter(inv => {
                                const matchSearch = inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                                    (inv.clientId?.name || "").toLowerCase().includes(searchTerm.toLowerCase());
                                const matchStatus = statusFilter === "all" || inv.status.toLowerCase() === statusFilter.toLowerCase();
                                return matchSearch && matchStatus;
                            }).length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="py-20 text-center text-slate-500">No invoices found matching criteria.</td>
                                </tr>
                            ) : invoices.filter(inv => {
                                const matchSearch = inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                                    (inv.clientId?.name || "").toLowerCase().includes(searchTerm.toLowerCase());
                                const matchStatus = statusFilter === "all" || inv.status.toLowerCase() === statusFilter.toLowerCase();
                                return matchSearch && matchStatus;
                            }).map((invoice) => (
                                <tr key={invoice._id} className="hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-4 text-slate-900 dark:text-white font-mono text-sm">{invoice.invoiceNumber}</td>
                                    <td className="px-6 py-4">
                                        <div className="text-slate-900 dark:text-white font-medium">{invoice.clientId?.name || "Deleted Client"}</div>
                                        <div className="text-slate-500 dark:text-slate-500 text-xs">{invoice.clientId?.company}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-slate-900 dark:text-white font-bold">₹{(invoice.originalAmount || invoice.amount).toLocaleString()}</span>
                                            {invoice.status !== "paid" && invoice.penaltyAmount > 0 && (
                                                <span className="text-xs font-bold text-rose-500 bg-rose-50 dark:bg-rose-500/10 px-2 py-0.5 rounded-md">
                                                    +₹{invoice.penaltyAmount.toLocaleString()}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                                        {(() => {
                                            const d = new Date(invoice.dueDate);
                                            return `${String(d.getUTCDate()).padStart(2, '0')}/${String(d.getUTCMonth() + 1).padStart(2, '0')}/${d.getUTCFullYear()}`;
                                        })()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${invoice.status === "paid" ? "bg-matisse-500/10 text-matisse-400" :
                                            invoice.status === "overdue" ? "bg-rose-500/10 text-rose-400" : "bg-matisse-500/10 text-matisse-400"
                                            }`}>
                                            {invoice.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button 
                                            onClick={() => handleDownload(invoice)}
                                            className="text-slate-500 hover:text-matisse-600 dark:hover:text-white transition-all p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl"
                                            title="Download PDF"
                                        >
                                            <Download size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

                </>
            )}

            {/* Create Invoice Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setShowModal(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl w-full max-w-md p-8 relative z-50 text-slate-900 dark:text-slate-200"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold flex items-center gap-2">
                                    <Plus className="text-matisse-600 dark:text-matisse-500" />
                                    New Invoice
                                </h3>
                                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white"><X size={24} /></button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="text-sm text-slate-500 dark:text-slate-400 block mb-2">Select Client</label>
                                    <select
                                        required
                                        className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-matisse-500 text-slate-900 dark:text-white"
                                        value={formData.clientId}
                                        onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                                    >
                                        <option value="">Choose a client...</option>
                                        {clients.map(c => (
                                            <option key={c._id} value={c._id}>{c.name} ({c.company})</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="text-sm text-slate-500 dark:text-slate-400 block mb-2">Invoice Number</label>
                                    <div className="relative">
                                        <Hash className="absolute left-3 top-3.5 text-slate-400 dark:text-slate-500" size={18} />
                                        <input
                                            required
                                            className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-matisse-500 text-slate-900 dark:text-white"
                                            value={formData.invoiceNumber}
                                            onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm text-slate-500 dark:text-slate-400 block mb-2">Amount (₹)</label>
                                        <div className="relative">
                                            <IndianRupee className="absolute left-3 top-3.5 text-slate-400 dark:text-slate-500" size={18} />
                                            <input
                                                required
                                                type="number"
                                                className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-matisse-500 text-slate-900 dark:text-white transition-colors"
                                                value={formData.amount}
                                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm text-slate-500 dark:text-slate-400 block mb-2">Due Date</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-3.5 text-slate-400 dark:text-slate-500" size={18} />
                                            <input
                                                required
                                                type="date"
                                                className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-matisse-500 text-slate-900 dark:text-white transition-colors"
                                                value={formData.dueDate}
                                                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full bg-matisse-600 hover:bg-matisse-700 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-blue-900/40 mt-4 flex justify-center items-center gap-2"
                                >
                                    {submitting ? <Loader2 className="animate-spin" size={20} /> : "Generate & Send Invoice"}
                                </button>
                                <p className="text-center text-xs text-slate-500">Client will receive an automatic email notification.</p>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
