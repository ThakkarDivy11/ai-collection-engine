import React from "react";
import { motion } from "framer-motion";
import { Sparkles, CheckCircle2, Cpu } from "lucide-react";

const Intelligence: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-40">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
        <div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/10 dark:bg-[#00ff7f]/5 text-green-700 dark:text-[#00ff7f] text-[10px] font-semibold mb-10 uppercase tracking-[0.4em] border border-green-500/10 dark:border-[#00ff7f]/10"
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
            <span className="text-[#16a34a] dark:text-[#00ff7f]">Automate.</span>
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
                <div className="w-12 h-12 rounded-2xl bg-green-500/5 dark:bg-[#00ff7f]/5 border border-green-500/10 dark:border-[#00ff7f]/10 flex items-center justify-center text-[#16a34a] dark:text-[#00ff7f] group-hover:scale-110 transition-transform">
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
             <div className="p-10 rounded-[3rem] bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 shadow-xl">
                <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 rounded-2xl bg-green-500/10 dark:bg-[#00ff7f]/10 flex items-center justify-center text-green-700 dark:text-[#00ff7f] border border-green-500/10 dark:border-[#00ff7f]/10">
                        <Cpu size={24} />
                    </div>
                    <div>
                        <div className="text-sm font-semibold text-slate-900 dark:text-white tracking-tight">Nexus Core Processing</div>
                        <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Active Simulation</div>
                    </div>
                </div>

                <div className="flex items-end gap-3 h-64 mb-8">
                    {[40, 70, 50, 95, 60, 85, 45, 75, 55, 90, 65, 80].map((h, i) => (
                        <motion.div
                            key={i}
                            initial={{ scaleY: 0 }}
                            whileInView={{ scaleY: h / 100 }}
                            transition={{ duration: 1.5, delay: 0.5 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                            style={{ transformOrigin: "bottom" }}
                            className="flex-1 h-full bg-gradient-to-t from-[#16a34a]/40 dark:from-[#00ff7f]/40 to-[#16a34a]/5 dark:to-[#00ff7f]/5 rounded-t-xl"
                        />
                    ))}
                </div>

                <div className="grid grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-20 rounded-2xl bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 p-4">
                             <div className="w-8 h-1 bg-slate-200 dark:bg-white/10 rounded-full mb-3" />
                             <div className="w-full h-1 bg-slate-100 dark:bg-white/5 rounded-full" />
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
