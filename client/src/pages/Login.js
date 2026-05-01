import { useState } from "react";
import { Loader2, Lock, Mail, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import BackgroundWrapper from "../components/Background";
import collectAILogo from "../assets/images/collectai-logo.png";
import { Link } from "react-router-dom";

export default function Login() {
    const [activeTab, setActiveTab] = useState("admin");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const endpoint = activeTab === "admin" ? "/api/auth/login" : "/api/clients/login";

        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL || "http://localhost:5000"}${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem("token", data.token);
                if (activeTab === "admin") {
                    localStorage.setItem("user", JSON.stringify(data));
                    window.location.href = "/dashboard";
                } else {
                    localStorage.setItem("customer", JSON.stringify(data.client));
                    window.location.href = "/customer-dashboard";
                }
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
        <BackgroundWrapper>
            <div className="min-h-screen flex flex-col items-center justify-center px-4 relative">
                
                {/* Branding Top */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12 text-center"
                >
                    <Link to="/">
                        <img src="/logo.png" alt="CollectAI" className="h-16 w-auto mx-auto mb-4 hover:scale-105 transition-transform" />
                    </Link>
                    <div className="h-px w-12 bg-matisse-500/50 mx-auto" />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-[#0f172a]/80 backdrop-blur-3xl border border-white/5 p-10 rounded-[2.5rem] w-full max-w-[480px] shadow-[0_0_50px_rgba(0,0,0,0.5)] relative z-10"
                >
                    {/* Tab Switcher */}
                    <div className="flex bg-slate-900/50 rounded-2xl p-1.5 mb-10 border border-white/5">
                        {["admin", "customer"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === tab
                                    ? "bg-matisse-600 text-white shadow-lg shadow-matisse-600/20"
                                    : "text-slate-500 hover:text-slate-300"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="mb-10">
                        <h2 className="text-white text-3xl font-semibold tracking-tighter mb-3">
                            {activeTab === "admin" ? "Enterprise Login" : "Client Portal"}
                        </h2>
                        <p className="text-slate-400 text-sm font-normal leading-relaxed">
                            {activeTab === "admin" 
                                ? "Secure terminal for autonomous collection management." 
                                : "Access your institutional recovery dashboard and insights."}
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
                                <Mail className="text-slate-500 group-focus-within:text-matisse-400 transition-colors" size={18} />
                            </div>
                            <input
                                type="email"
                                required
                                placeholder="Corporate Email"
                                className="w-full bg-slate-900/50 border border-white/5 rounded-2xl py-5 pl-14 pr-5 text-white outline-none focus:border-matisse-500/50 focus:ring-4 focus:ring-matisse-500/10 transition-all placeholder:text-slate-600 text-sm"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                <Lock className="text-slate-500 group-focus-within:text-matisse-400 transition-colors" size={18} />
                            </div>
                            <input
                                type="password"
                                required
                                placeholder="Access Key"
                                className="w-full bg-slate-900/50 border border-white/5 rounded-2xl py-5 pl-14 pr-5 text-white outline-none focus:border-matisse-500/50 focus:ring-4 focus:ring-matisse-500/10 transition-all placeholder:text-slate-600 text-sm"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-5 mt-4 rounded-2xl text-white font-bold bg-white/5 hover:bg-matisse-600 transition-all flex justify-center items-center gap-3 border border-white/10 hover:border-transparent group"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>
                                    <span>Establish Connection</span>
                                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-10 pt-8 border-t border-white/5 flex flex-col gap-4">
                        <p className="text-center text-slate-600 text-[10px] font-bold uppercase tracking-[0.2em]">
                            Institutional Grade Security Protocol
                        </p>
                        <div className="flex justify-center gap-6 text-[10px] text-slate-500 font-semibold uppercase tracking-widest">
                            <a href="#!" className="hover:text-matisse-400 transition-colors">Privacy</a>
                            <a href="#!" className="hover:text-matisse-400 transition-colors">Security</a>
                            <a href="#!" className="hover:text-matisse-400 transition-colors">Contact</a>
                        </div>
                    </div>
                </motion.div>

                <p className="mt-12 text-slate-600 text-[10px] font-semibold uppercase tracking-[0.3em]">
                    © 2026 CollectAI Network Systems
                </p>
            </div>
        </BackgroundWrapper>
    );
}
