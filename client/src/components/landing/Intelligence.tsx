import React from "react";
import { motion } from "framer-motion";
import { Sparkles, CheckCircle2, Cpu } from "lucide-react";

const Intelligence: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 pt-40 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
        <div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-matisse-500/10 dark:bg-matisse-300/5 text-matisse-700 dark:text-matisse-300 text-[10px] font-semibold mb-10 uppercase tracking-[0.4em] border border-matisse-500/10 dark:border-matisse-300/10"
          >
            <Sparkles size={12} />
            <span>Neural Intelligence</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-6xl md:text-8xl font-semibold text-slate-900 dark:text-white tracking-tighter leading-tight mb-12"
          >
            Predict. <br />
            Optimize. <br />
            <span className="text-matisse-500 dark:text-matisse-300">Automate.</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-600 dark:text-slate-400 max-w-lg mb-16 leading-relaxed font-normal"
          >
            The Nexus Core leverages proprietary neural networks to simulate 
            thousands of recovery scenarios every second, choosing the 
            optimal path for maximum capital retention.
          </motion.p>

          <div className="space-y-8">
            {["Real-time Sentiment Analysis", "Dynamic Settlement Logic", "Proprietary Risk Scoring"].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-6 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-matisse-500/5 border border-matisse-500/10 flex items-center justify-center text-matisse-500 group-hover:scale-110 transition-transform">
                  <CheckCircle2 size={20} />
                </div>
                <span className="text-slate-900 dark:text-white font-semibold text-xl tracking-tight">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative"
        >
             {/* Visual Preview Elements - No heavy container box */}
             <div className="p-10 rounded-[3rem] bg-white dark:bg-white/[0.02] border border-matisse-100 dark:border-matisse-800/20 shadow-2xl relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-matisse-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[3rem] pointer-events-none" />
                
                <div className="flex items-center gap-4 mb-10 relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-matisse-500/10 flex items-center justify-center text-matisse-600 dark:text-matisse-300 border border-matisse-500/10">
                        <Cpu size={24} />
                    </div>
                    <div>
                        <div className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">Nexus Core Processing</div>
                        <div className="text-[10px] font-bold text-slate-400 dark:text-matisse-500 uppercase tracking-widest">Active Simulation</div>
                    </div>
                    <div className="ml-auto text-matisse-500 font-bold text-xs animate-pulse">LIVE</div>
                </div>

                <div className="flex items-end gap-3 h-64 mb-10 relative z-10">
                    {[40, 70, 50, 95, 60, 85, 45, 75, 55, 90, 65, 80].map((h, i) => (
                        <motion.div
                            key={i}
                            initial={{ scaleY: 0 }}
                            whileInView={{ scaleY: h / 100 }}
                            transition={{ duration: 1.5, delay: 0.5 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                            style={{ transformOrigin: "bottom" }}
                            className="flex-1 h-full bg-gradient-to-t from-matisse-500 to-matisse-500/20 rounded-t-xl"
                        />
                    ))}
                </div>

                <div className="grid grid-cols-3 gap-6 relative z-10">
                    {[
                      { label: "Throughput", value: "840/s" },
                      { label: "Accuracy", value: "99.2%" },
                      { label: "Latency", value: "0.4ms" }
                    ].map((stat, i) => (
                        <div key={i} className="h-24 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-matisse-800/20 p-4 flex flex-col justify-between">
                             <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{stat.label}</div>
                             <div className="text-xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
                        </div>
                    ))}
                </div>
             </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Intelligence;
