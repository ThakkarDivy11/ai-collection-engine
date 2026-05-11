import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, UserPlus, Trash2, Shield, Search, RefreshCw } from "lucide-react";

const AdminManagement = () => {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const fetchAdmins = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const baseUrl = (process.env.REACT_APP_API_URL || "http://localhost:5000").replace(/\/$/, "");
            const res = await fetch(`${baseUrl}/api/super-admin/admins`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                setAdmins(data);
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError("Failed to fetch admins");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdmins();
    }, []);

    const deleteAdmin = async (id) => {
        if (!window.confirm("Are you sure you want to remove this admin?")) return;
        
        try {
            const token = localStorage.getItem("token");
            const baseUrl = (process.env.REACT_APP_API_URL || "http://localhost:5000").replace(/\/$/, "");
            const res = await fetch(`${baseUrl}/api/super-admin/admins/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                setAdmins(admins.filter(a => a._id !== id));
            } else {
                const data = await res.json();
                alert(data.message);
            }
        } catch (err) {
            alert("Failed to delete admin");
        }
    };

    const filteredAdmins = admins.filter(admin => 
        admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8">
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Admin Control Center</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Manage institutional access and permissions.</p>
                </div>
                <div className="flex gap-4">
                    <button 
                        onClick={fetchAdmins}
                        className="p-3 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 rounded-2xl hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
                    >
                        <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3.5 bg-matisse-600 text-white rounded-2xl font-bold hover:scale-[1.02] transition-all shadow-lg shadow-matisse-600/20">
                        <UserPlus size={18} />
                        <span>Provision New Admin</span>
                    </button>
                </div>
            </div>

            <div className="glass-card rounded-[2.5rem] border border-slate-200 dark:border-white/5 overflow-hidden">
                <div className="p-6 border-b border-slate-200 dark:border-white/5 flex items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search by name or email..." 
                            className="w-full bg-slate-100 dark:bg-white/5 border-none rounded-xl py-3 pl-12 pr-4 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-matisse-500/50 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-white/2 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-200 dark:border-white/5">
                                <th className="px-8 py-5">Admin Identity</th>
                                <th className="px-8 py-5">Role Clearance</th>
                                <th className="px-8 py-5">System Status</th>
                                <th className="px-8 py-5 text-right">Operational Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                            {filteredAdmins.map((admin) => (
                                <motion.tr 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    key={admin._id} 
                                    className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors"
                                >
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-2xl ${admin.role === 'superadmin' ? 'bg-rose-500/10 text-rose-500' : 'bg-matisse-500/10 text-matisse-500'} flex items-center justify-center font-black text-lg`}>
                                                {admin.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 dark:text-white">{admin.name}</p>
                                                <p className="text-xs text-slate-500 font-medium">{admin.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${admin.role === 'superadmin' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' : 'bg-matisse-500/10 text-matisse-500 border border-matisse-500/20'}`}>
                                            {admin.role}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Active Terminal</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button className="p-2.5 text-slate-400 hover:text-matisse-500 hover:bg-matisse-500/10 rounded-xl transition-all">
                                                <Shield size={18} />
                                            </button>
                                            <button 
                                                onClick={() => deleteAdmin(admin._id)}
                                                className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminManagement;
