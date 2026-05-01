import React from "react";
import { useRive, Layout, Fit, Alignment } from "@rive-app/react-canvas";
import { motion } from "framer-motion";

const InteractiveRiveSection: React.FC = () => {
  const { RiveComponent } = useRive({
    src: "/crypto-concept.riv",
    stateMachines: "State Machine 1", // Standard for many Rive files, might need adjustment if unknown
    autoplay: true,
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center,
    }),
  });

  return (
    <section className="relative py-24 md:py-40 bg-white dark:bg-[#1a2a37] overflow-hidden border-t border-calypso-100 dark:border-calypso-800/20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Text Content */}
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-calypso-600 dark:text-calypso-300 font-semibold text-xs uppercase tracking-[0.4em] mb-6"
          >
            Intelligent Infrastructure
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-semibold text-slate-900 dark:text-white tracking-tighter leading-tight mb-8"
          >
            Real-time <br />
            <span className="text-calypso-500">Autonomous Settlement.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-600 dark:text-slate-400 text-lg md:text-xl leading-relaxed mb-10 max-w-xl"
          >
            Leverage high-fidelity AI models that coordinate global payment nodes. 
            Nexus orchestrates complex recovery flows with millisecond precision, 
            ensuring your capital is always moving in the right direction.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-6"
          >
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tighter">0.5ms</span>
              <span className="text-[10px] uppercase tracking-widest text-slate-500">Processing Latency</span>
            </div>
            <div className="h-10 w-[1px] bg-slate-200 dark:bg-slate-800 hidden sm:block" />
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tighter">99.9%</span>
              <span className="text-[10px] uppercase tracking-widest text-slate-500">Uptime Protocol</span>
            </div>
          </motion.div>
        </div>

        {/* Rive Animation Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotateY: 10 }}
          whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative h-[400px] md:h-[600px] w-full rounded-[3rem] overflow-hidden bg-slate-50/50 dark:bg-white/[0.02] border border-calypso-100 dark:border-calypso-800/10 shadow-2xl shadow-calypso-500/5 group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-calypso-500/5 to-transparent pointer-events-none" />
          <div className="h-full w-full">
            <RiveComponent />
          </div>
          
          {/* Decorative floating labels */}
          <div className="absolute top-10 right-10 p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl shadow-xl hidden md:block">
            <div className="text-[10px] font-bold text-calypso-600 dark:text-calypso-300 uppercase tracking-widest mb-1">NODE STATUS</div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <div className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-tighter leading-tight mb-0">ACTIVE_SETTLEMENT</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default InteractiveRiveSection;
