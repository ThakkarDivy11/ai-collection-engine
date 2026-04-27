import React from "react";
import { motion } from "framer-motion";
import { 
  BrainCircuit, 
  Layers, 
  Zap, 
  BarChart3, 
  ShieldCheck, 
  Globe 
} from "lucide-react";

const Features: React.FC = () => {
  const features = [
    {
      title: "Churn Prediction",
      desc: "Identify high-risk clients before they default using our neural risk scoring.",
      icon: <BrainCircuit className="text-[#00ff7f]" />,
    },
    {
      title: "Smart Negotiators",
      desc: "AI agents that handle payment discussions and settlements autonomously.",
      icon: <Layers className="text-indigo-400" />,
    },
    {
      title: "Recovery Ops",
      desc: "Automated workflows that escalate and resolve overdue accounts at scale.",
      icon: <Zap className="text-calypso-400" />,
    },
    {
      title: "Revenue Forensic",
      desc: "Deep-dive analysis of collection trends and cash flow leakage points.",
      icon: <BarChart3 className="text-calypso-600" />,
    },
    {
      title: "AI Email Core",
      desc: "Generative follow-ups that adapt to client sentiment and behavior.",
      icon: <ShieldCheck className="text-calypso-600" />,
    },
    {
      title: "Global Ledger",
      desc: "Total transparency over global payment nodes and recovery status.",
      icon: <Globe className="text-blue-300" />,
    },
  ];

  return (
    <section id="features" className="py-40 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="mb-32">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-[#00ff7f] font-semibold text-xs uppercase tracking-[0.4em] mb-6"
          >
            Capabilities
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-semibold text-white tracking-tighter leading-tight"
          >
            Engineered for <br />
            <span className="text-slate-500">Revenue Resilience.</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              whileHover={{ y: -12 }}
              className="group relative p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 transition-all hover:bg-white/[0.04] hover:border-white/10"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-calypso-500/0 via-transparent to-calypso-500/0 group-hover:from-calypso-500/[0.05] group-hover:to-calypso-600/[0.05] transition-all duration-700 rounded-[2.5rem]" />
              
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-[#00ff7f]/10 group-hover:border-calypso-500/20 transition-all duration-500">
                  {f.icon}
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4 tracking-tight group-hover:text-calypso-400 transition-colors">
                  {f.title}
                </h3>
                <p className="text-slate-400 leading-relaxed font-normal">
                  {f.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
