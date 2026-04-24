import React from "react";
import { motion } from "framer-motion";
import { BrainCircuit, Sparkles, Globe, Zap, Twitter, Github, Linkedin, Mail } from "lucide-react";

export const Stats: React.FC = () => {
  const stats = [
    { label: "Revenue Recovered", val: "₹250Cr+" },
    { label: "AI Predictions", val: "2.4M+" },
    { label: "Collection Rate", val: "94.2%" },
    { label: "Default Reduced", val: "68%" },
  ];

  return (
    <section className="py-24 px-6 border-y border-slate-100 dark:border-white/5 bg-white dark:bg-[#020617]">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-between gap-12 lg:gap-8">
        {stats.map((s, i) => (
          <motion.div 
            key={i} 
            className="flex flex-col items-center sm:items-start"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="text-4xl md:text-6xl font-semibold text-slate-900 dark:text-white tracking-tighter mb-2">{s.val}</div>
            <div className="text-[#16a34a] dark:text-[#00ff7f] font-semibold text-[10px] uppercase tracking-[0.3em]">{s.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export const HowItWorks: React.FC = () => {
  const steps = [
    { title: "Data Integration", desc: "Sync your existing invoices and client history.", icon: <BrainCircuit size={24} /> },
    { title: "Risk Analysis", desc: "AI predicts churn risk and default probability.", icon: <Sparkles size={24} /> },
    { title: "Auto Recovery", desc: "Neural negotiators begin recovery flows.", icon: <Globe size={24} /> },
    { title: "Capital Reclaimed", desc: "Payments are settled and revenue is secured.", icon: <Zap size={24} /> },
  ];

  return (
    <section id="how-it-works" className="py-40 px-6 bg-slate-50 dark:bg-white/[0.01]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-32">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-[#16a34a] dark:text-[#00ff7f] font-semibold text-xs uppercase tracking-[0.4em] mb-6"
          >
            Operation
          </motion.div>
          <h2 className="text-5xl md:text-7xl font-semibold text-slate-900 dark:text-white tracking-tighter leading-tight">
            How Nexus <br />
            <span className="text-slate-400 dark:text-slate-500">Orchestrates Capital.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {steps.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group"
            >
              <div className="w-16 h-16 rounded-[1.5rem] bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 flex items-center justify-center text-[#16a34a] dark:text-[#00ff7f] mb-8 group-hover:scale-110 group-hover:bg-[#16a34a]/10 dark:group-hover:bg-[#00ff7f]/10 group-hover:border-green-500/20 dark:group-hover:border-[#00ff7f]/20 transition-all duration-500 shadow-sm">
                {s.icon}
              </div>
              <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4 tracking-tight group-hover:text-[#16a34a] dark:group-hover:text-[#00ff7f] transition-colors">
                <span className="text-slate-300 dark:text-slate-800 mr-2">0{i + 1}</span> {s.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 font-normal leading-relaxed">
                {s.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const CTA: React.FC = () => {
  return (
    <section className="py-32 px-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto rounded-[3.5rem] bg-slate-950 dark:bg-slate-900 p-12 md:p-24 text-center relative overflow-hidden shadow-2xl border border-white/5"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] pointer-events-none" />
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-green-500/10 dark:bg-[#00ff7f]/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="relative z-10">
          <h2 className="text-5xl md:text-8xl font-semibold text-white tracking-tighter leading-none mb-12">
            Ready to <br />
            Scale?
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
            <button className="px-12 py-6 bg-[#16a34a] dark:bg-[#00ff7f] text-white dark:text-black font-semibold rounded-3xl transition-all hover:scale-105 active:scale-95 shadow-2xl text-lg">
              Start Free Trial
            </button>
            <button className="px-12 py-6 bg-transparent text-white font-semibold rounded-3xl border border-white/30 transition-all hover:bg-white/10 backdrop-blur-xl text-lg">
              Contact Nexus Eng
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export const Footer: React.FC = () => {
  return (
    <footer className="py-24 px-6 bg-white dark:bg-[#020617] border-t border-slate-100 dark:border-white/5 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
          <div className="col-span-1 md:col-span-2">
            <div className="text-3xl font-semibold text-slate-900 dark:text-white mb-8 tracking-tighter">CollectAI</div>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed font-normal">
              Architecting the world's most sophisticated autonomous financial infrastructure.
            </p>
          </div>
          <div>
            <div className="text-slate-900 dark:text-white font-semibold text-xs uppercase tracking-widest mb-8">Protocol</div>
            <div className="space-y-4">
              {["Features", "Nexus Core", "Intelligence", "Pricing"].map(link => (
                <a key={link} href="#" className="block text-slate-500 hover:text-[#16a34a] dark:hover:text-[#00ff7f] transition-colors font-normal">{link}</a>
              ))}
            </div>
          </div>
          <div>
            <div className="text-slate-900 dark:text-white font-semibold text-xs uppercase tracking-widest mb-8">Connect</div>
            <div className="flex gap-6">
              {[Twitter, Github, Linkedin, Mail].map((Icon, i) => (
                <a key={i} href="#" className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="pt-12 border-t border-slate-100 dark:border-white/5 flex flex-col md:flex-row justify-between gap-6 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
          <div>© 2026 CollectAI Neural Network. All rights reserved.</div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-slate-900 dark:hover:text-white">Privacy Protocol</a>
            <a href="#" className="hover:text-slate-900 dark:hover:text-white">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
