import { useEffect, useState, useCallback } from "react";
import {
    Search,
    Plus,
    Mail,
    Building2,
    X,
    Loader2,
    Trash2,
    Edit2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Clients() {
    const [clients, setClients] = useState([]);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editClient, setEditClient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        company: "",
        password: "",
        status: "active"
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const isSuperAdmin = user.role === "superadmin";

    const fetchClients = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/clients?search=${search}&page=${currentPage}&limit=8`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            setClients(data.clients || []);
            setTotalPages(data.totalPages || 1);
        } catch (error) {
            console.error("Failed to fetch", error);
        } finally {
            setLoading(false);
        }
    }, [currentPage, search]);

    useEffect(() => {
        fetchClients();
    }, [fetchClients]);

    const handleSave = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        const method = editClient ? "PUT" : "POST";
        const url = editClient
            ? `${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/clients/${editClient._id}`
            : `${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/clients`;

        try {
            await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData),
            });
            setShowModal(false);
            fetchClients();
        } catch (error) {
            console.error("Save failed", error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this client?")) return;
        const token = localStorage.getItem("token");
        try {
            await fetch(`${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/clients/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            fetchClients();
        } catch (error) {
            console.error("Delete failed", error);
        }
    };

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Client Management</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                        {isSuperAdmin ? "Monitor all client portfolios across the platform." : "Add, edit and monitor your client portfolio."}
                    </p>
                </div>
                {!isSuperAdmin && (
                    <button
                        onClick={() => {
                            setEditClient(null);
                            setFormData({ name: "", email: "", company: "", password: "", status: "active" });
                            setShowModal(true);
                        }}
                        className="bg-matisse-600 hover:bg-matisse-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-matisse-600/20"
                    >
                        <Plus size={20} />
                        Add Client
                    </button>
                )}
            </div>

            <div className="bg-white dark:bg-slate-900/40 p-5 rounded-3xl border border-slate-200 dark:border-white/5 flex items-center gap-4 premium-shadow transition-all duration-300">
                <div className="p-2.5 bg-slate-100 dark:bg-white/5 rounded-xl text-slate-400">
                    <Search size={20} />
                </div>
                <input
                    type="text"
                    placeholder="Search by name, company or email..."
                    className="bg-transparent border-none text-slate-900 dark:text-white focus:ring-0 flex-1 px-0 placeholder:text-slate-400 dark:placeholder:text-slate-500 font-medium"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="bg-white dark:bg-slate-900/40 rounded-[2rem] border border-slate-200 dark:border-white/5 overflow-hidden premium-shadow transition-all duration-300">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] border-b border-slate-100 dark:border-white/5">
                                <th className="px-8 py-6">Client</th>
                                <th className="px-8 py-6">Company</th>
                                {isSuperAdmin && <th className="px-8 py-6">Managed By</th>}
                                <th className="px-8 py-6">Status</th>
                                <th className="px-8 py-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-slate-800">
                            {loading ? (
                                <tr>
                                    <td colSpan={isSuperAdmin ? "5" : "4"} className="py-20 text-center">
                                        <Loader2 className="mx-auto animate-spin text-matisse-500" size={32} />
                                    </td>
                                </tr>
                            ) : clients.map((client) => (
                                <tr key={client._id} className="hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-matisse-600 dark:text-matisse-400 font-bold border border-gray-200 dark:border-slate-700">
                                                {client.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-medium text-slate-900 dark:text-white">{client.name}</div>
                                                <div className="text-slate-500 dark:text-slate-500 text-sm flex items-center gap-1">
                                                    <Mail size={12} /> {client.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                                            <Building2 size={16} className="text-slate-400 dark:text-slate-500" />
                                            {client.company}
                                        </div>
                                    </td>
                                    {isSuperAdmin && (
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-md bg-rose-500/10 flex items-center justify-center text-[10px] font-bold text-rose-500 border border-rose-500/20">
                                                    {(client.createdBy?.name || "A")[0]}
                                                </div>
                                                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                                    {client.createdBy?.name || "System"}
                                                </span>
                                            </div>
                                        </td>
                                    )}
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${client.status === "active" ? "bg-matisse-500/10 text-matisse-400" :
                                            client.status === "churn-risk" ? "bg-rose-500/10 text-rose-400" : "bg-slate-500/10 text-slate-400"
                                            }`}>
                                            {client.status?.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => {
                                                    setEditClient(client);
                                                    setFormData(client);
                                                    setShowModal(true);
                                                }}
                                                className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-all"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(client._id)}
                                                className="p-2 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-all"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center gap-2 mt-4">
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`w-10 h-10 rounded-xl font-medium transition-all ${currentPage === i + 1 ? "bg-matisse-600 text-white" : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 border border-gray-200 dark:border-slate-800"
                            }`}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>

            {/* Modal */}
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
                                <h3 className="text-2xl font-bold">{editClient ? "Edit Client" : "Add New Client"}</h3>
                                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white"><X size={24} /></button>
                            </div>

                            <form onSubmit={handleSave} className="space-y-4">
                                <div>
                                    <label className="text-sm text-slate-500 dark:text-slate-400 block mb-2">Full Name</label>
                                    <input
                                        required
                                        className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-matisse-500 text-slate-900 dark:text-white transition-colors"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-slate-500 dark:text-slate-400 block mb-2">Email Address</label>
                                    <input
                                        required
                                        type="email"
                                        className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-matisse-500 text-slate-900 dark:text-white transition-colors"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-slate-500 dark:text-slate-400 block mb-2">Company Name</label>
                                    <input
                                        required
                                        className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-matisse-500 text-slate-900 dark:text-white transition-colors"
                                        value={formData.company}
                                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                    />
                                </div>
                                {!editClient && (
                                    <div>
                                        <label className="text-sm text-slate-500 dark:text-slate-400 block mb-2">Assign Password</label>
                                        <input
                                            required
                                            type="password"
                                            className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-matisse-500 text-slate-900 dark:text-white transition-colors"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        />
                                    </div>
                                )}
                                <div>
                                    <label className="text-sm text-slate-500 dark:text-slate-400 block mb-2">Initial Status</label>
                                    <select
                                        className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-matisse-500 text-slate-900 dark:text-white"
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                        <option value="churn-risk">Churn Risk</option>
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-matisse-600 hover:bg-matisse-700 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-blue-900/40 mt-4"
                                >
                                    {editClient ? "Update Client Details" : "Create Client Account"}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
