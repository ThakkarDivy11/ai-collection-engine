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
    <section className="py-24 px-6 border-y border-calypso-100 dark:border-calypso-800/20 bg-white dark:bg-[#1a2a37]">
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
            <div className="text-calypso-600 dark:text-calypso-300 font-semibold text-[10px] uppercase tracking-[0.3em]">{s.label}</div>
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
    <section id="how-it-works" className="py-40 px-6 bg-calypso-50/50 dark:bg-white/[0.01]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-32">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-calypso-600 dark:text-calypso-300 font-semibold text-xs uppercase tracking-[0.4em] mb-6"
          >
            Operation
          </motion.div>
          <h2 className="text-5xl md:text-7xl font-semibold text-slate-900 dark:text-white tracking-tighter leading-tight">
            How Nexus <br />
            <span className="text-calypso-600 dark:text-calypso-300 ">Orchestrates Capital.</span>
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
              className="group p-10 rounded-[2.5rem] bg-white dark:bg-white/[0.02] border border-calypso-100 dark:border-calypso-800/10 hover:border-calypso-500/50 dark:hover:border-calypso-300/30 transition-all duration-500 hover:shadow-2xl hover:shadow-calypso-500/5"
            >
              <div className="w-16 h-16 rounded-[1.5rem] bg-calypso-50 dark:bg-calypso-500/10 flex items-center justify-center text-calypso-600 dark:text-calypso-300 mb-8 group-hover:scale-110 group-hover:bg-calypso-500 group-hover:text-white transition-all duration-500 shadow-sm">
                {s.icon}
              </div>
              <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4 tracking-tight">
                <span className="text-slate-300 dark:text-calypso-800/40 mr-2 font-bold tracking-tighter">0{i + 1}</span> {s.title}
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
        className="max-w-7xl mx-auto rounded-[3.5rem] bg-white p-12 md:p-24 text-center relative overflow-hidden shadow-2xl border border-calypso-100"
      >
        {/* Decorative elements */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-calypso-500/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-calypso-400/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-calypso-50 border border-calypso-100 text-calypso-700 text-[10px] font-semibold uppercase tracking-[0.4em] mb-10">
            <span className="w-2 h-2 rounded-full bg-calypso-500 animate-pulse" />
            Get Started Today
          </div>
          <h2 className="text-5xl md:text-8xl font-semibold text-slate-900 tracking-tighter leading-none mb-6">
            Ready to <br />
            <span className="text-calypso-500">Scale?</span>
          </h2>
          <p className="text-slate-500 text-xl mb-16 font-normal max-w-xl mx-auto leading-relaxed">
            Join the leading financial institutions using Nexus to automate recovery and maximize capital.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button className="px-12 py-5 bg-calypso-600 hover:bg-calypso-700 text-white font-semibold rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-calypso-500/20 text-base">
              Start Free Trial
            </button>
            <button className="px-12 py-5 bg-transparent text-slate-700 font-semibold rounded-2xl border border-slate-200 hover:border-calypso-300 hover:text-calypso-600 transition-all text-base">
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
    <footer className="py-24 px-6 bg-white dark:bg-[#1a2a37] border-t border-calypso-100 dark:border-calypso-800/20 relative z-10">
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
                <a key={link} href="#" className="block text-slate-500 hover:text-calypso-600 dark:hover:text-calypso-300 transition-colors font-normal">{link}</a>
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
        <div className="pt-12 border-t border-calypso-100 dark:border-calypso-800/20 flex flex-col md:flex-row justify-between gap-6 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
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
