import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

const Pricing: React.FC = () => {
  const plans = [
    {
      name: "Standard",
      price: "12%",
      sub: "per recovered asset",
      features: ["Neural Churn Prediction", "Standard Auto-Negotiator", "Email/SMS Channels", "Basic Analytics"],
      featured: false
    },
    {
      name: "Velocity",
      price: "18%",
      sub: "per recovered asset",
      features: ["Advanced Neural Core", "Priority Negotiators", "Multi-channel Omni", "Full Forensic Suite", "API Access"],
      featured: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      sub: "scaled recovery ops",
      features: ["Custom Neural Models", "White-glove Agents", "On-prem Deployment", "24/7 Priority Support", "Dedicated Strategist"],
      featured: false
    }
  ];

  return (
    <div id="pricing" className="max-w-7xl mx-auto px-6 py-40">
      <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-matisse-600 dark:text-matisse-300 font-semibold text-xs uppercase tracking-[0.4em] mb-6"
          >
            Investment
          </motion.div>
          <h2 className="text-5xl md:text-7xl font-semibold text-slate-900 dark:text-white tracking-tighter leading-tight">
            Performance Based <br />
            <span className="text-slate-400 dark:text-slate-500">Pricing Models.</span>
          </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {plans.map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={`relative p-12 rounded-[3.5rem] border ${
              p.featured 
                ? "bg-white dark:bg-matisse-950/20 border-matisse-500 dark:border-matisse-300 shadow-2xl scale-105 z-10" 
                : "bg-matisse-50/30 dark:bg-white/[0.01] border-matisse-100 dark:border-matisse-800/20"
            }`}
          >
            {p.featured && (
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-matisse-500 dark:bg-matisse-300 rounded-full text-[10px] font-semibold text-white dark:text-matisse-950 uppercase tracking-widest shadow-lg">
                Most Popular
              </div>
            )}
            
            <div className="text-xl font-semibold text-slate-900 dark:text-white mb-2 tracking-tight">{p.name}</div>
            <div className="flex items-baseline gap-2 mb-8">
              <span className="text-6xl font-semibold text-slate-900 dark:text-white tracking-tighter">{p.price}</span>
              <span className="text-slate-500 dark:text-slate-500 font-normal text-sm">{p.sub}</span>
            </div>

            <div className="space-y-4 mb-12">
              {p.features.map((f, j) => (
                <div key={j} className="flex items-center gap-3 text-sm font-normal text-slate-600 dark:text-slate-400">
                  <CheckCircle2 size={16} className="text-matisse-500 dark:text-matisse-300" />
                  {f}
                </div>
              ))}
            </div>

            <Link to="/login" className="block w-full">
              <button className={`w-full py-5 rounded-2xl font-semibold transition-all shadow-sm ${
                p.featured 
                  ? "bg-matisse-500 dark:bg-matisse-300 text-white dark:text-matisse-950 shadow-xl hover:scale-105" 
                  : "bg-white dark:bg-white/5 text-slate-900 dark:text-white border border-matisse-200 dark:border-matisse-800/20 hover:bg-matisse-50"
              }`}>
                {p.featured ? "Deploy Velocity" : "Get Started"}
              </button>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;
