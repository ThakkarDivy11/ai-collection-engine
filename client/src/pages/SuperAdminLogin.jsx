import { useState } from "react";
import { Loader2, Lock, Mail, ChevronRight, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { GridScan } from "../components/ui/GridScan";
import { Link } from "react-router-dom";

export default function SuperAdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const baseUrl = (process.env.REACT_APP_API_URL || "http://localhost:5000").replace(/\/$/, "");
            const res = await fetch(`${baseUrl}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                if (data.role !== "superadmin") {
                    setError("Unauthorized: This portal is for Super Admins only.");
                    setLoading(false);
                    return;
                }
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data));
                window.location.href = "/dashboard";
            } else {
                setError(data.message || "Invalid credentials");
            }
        } catch (err) {
            setError("Unable to connect to server");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#020617]">
            <div className="absolute inset-0 z-0">
                <GridScan
                    sensitivity={0.55}
                    lineThickness={1}
                    linesColor="#1e293b"
                    gridScale={0.1}
                    scanColor="#ef4444"
                    scanOpacity={0.4}
                    enablePost
                    bloomIntensity={0.6}
                    chromaticAberration={0.002}
                    noiseIntensity={0.01}
                />
            </div>

            <div className="min-h-screen flex flex-col items-center justify-center px-4 relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12 text-center"
                >
                    <Link to="/">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <ShieldCheck className="text-rose-500 w-12 h-12" />
                            <span className="text-3xl font-black text-white tracking-tighter">SUPER PORTAL</span>
                        </div>
                    </Link>
                    <div className="h-px w-12 bg-rose-500/50 mx-auto" />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-slate-950/60 backdrop-blur-3xl border border-rose-500/20 p-10 rounded-[2.5rem] w-full max-w-[480px] shadow-[0_0_80px_rgba(244,63,94,0.15)]"
                >
                    <div className="mb-10 text-center">
                        <h2 className="text-white text-3xl font-semibold tracking-tighter mb-3">
                            Super Admin Access
                        </h2>
                        <p className="text-slate-400 text-sm font-normal leading-relaxed">
                            Authorized personnel only. Higher clearance required.
                        </p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-rose-500/10 border border-rose-500/20 text-rose-400 py-4 px-5 rounded-2xl text-xs font-semibold mb-8 flex items-center gap-3"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                <Mail className="text-slate-500 group-focus-within:text-rose-400 transition-colors" size={18} />
                            </div>
                            <input
                                type="email"
                                required
                                placeholder="Admin ID"
                                className="w-full bg-slate-900/50 border border-white/5 rounded-2xl py-5 pl-14 pr-5 text-white outline-none focus:border-rose-500/50 focus:ring-4 focus:ring-rose-500/10 transition-all placeholder:text-slate-600 text-sm"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                <Lock className="text-slate-500 group-focus-within:text-rose-400 transition-colors" size={18} />
                            </div>
                            <input
                                type="password"
                                required
                                placeholder="Root Access Key"
                                className="w-full bg-slate-900/50 border border-white/5 rounded-2xl py-5 pl-14 pr-5 text-white outline-none focus:border-rose-500/50 focus:ring-4 focus:ring-rose-500/10 transition-all placeholder:text-slate-600 text-sm"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-5 mt-4 rounded-2xl text-white font-bold bg-rose-600 hover:bg-rose-500 transition-all flex justify-center items-center gap-3 shadow-lg shadow-rose-600/20 group"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>
                                    <span>Gain Root Control</span>
                                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-10 pt-8 border-t border-white/5 flex flex-col gap-4">
                        <p className="text-center text-slate-600 text-[10px] font-bold uppercase tracking-[0.2em]">
                            Restricted Area 51 Security Protocol
                        </p>
                    </div>
                </motion.div>

                <p className="mt-12 text-slate-600 text-[10px] font-semibold uppercase tracking-[0.3em]">
                    © 2026 CollectAI Advanced Systems
                </p>
            </div>
        </div>
    );
}
