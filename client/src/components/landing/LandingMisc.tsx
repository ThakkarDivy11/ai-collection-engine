/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { motion } from "framer-motion";
import { BrainCircuit, Sparkles, Globe, Zap, Twitter, Github, Linkedin, Mail } from "lucide-react";
import { useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { AuroraHero } from "../ui/aurora-hero-bg";
import { Link } from "react-router-dom";
import LogoLoop from "../ui/LogoLoop";
import { 
  SiFigma, 
  SiFramer, 
  SiStorybook, 
  SiReact, 
  SiNotion, 
  SiTypescript, 
  SiTailwindcss, 
  SiStripe, 
  SiNextdotjs, 
  SiGithub 
} from 'react-icons/si';
import ElectricBorder from "../ui/ElectricBorder";
import CardStack from "../CardStack";
import { LineChart, Line, BarChart, Bar, AreaChart, Area, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

const Counter = ({ value, duration = 2 }: { value: number; duration?: number }) => {
  const count = useMotionValue(0);
  const rounded = useTransform<number, string>(count, (latest) => {
    if (value % 1 !== 0) return latest.toFixed(1);
    return Math.round(latest).toString();
  });
  const ref = React.useRef(null);
  const inView = useInView(ref, { once: true });

  React.useEffect(() => {
    if (inView) {
      const controls = animate(count, value, {
        duration,
        ease: [0.2, 0.65, 0.3, 0.9],
      });
      return controls.stop;
    }
  }, [inView, value, count, duration]);

  return <span ref={ref}><motion.span>{rounded}</motion.span></span>;
};

export const Stats: React.FC = () => {
  const stats = [
    { label: "Revenue Recovered", prefix: "₹", val: 250, suffix: "Cr+" },
    { label: "AI Predictions", prefix: "", val: 2.4, suffix: "M+" },
    { label: "Collection Rate", prefix: "", val: 94.2, suffix: "%" },
    { label: "Default Reduced", prefix: "", val: 68, suffix: "%" },
  ];

  return (
    <section className="py-24 px-6 border-y border-matisse-100 dark:border-matisse-800/20 bg-white dark:bg-[#112740]">
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
            <div className="text-4xl md:text-6xl font-semibold text-slate-900 dark:text-white tracking-tighter mb-2">
              {s.prefix}<Counter value={s.val} />{s.suffix}
            </div>
            <div className="text-matisse-600 dark:text-matisse-300 font-semibold text-[10px] uppercase tracking-[0.3em]">{s.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export const PartnerLogos: React.FC = () => {
  const partners = [
    { node: React.createElement(SiFigma as any, { style: { color: "#F24E1E" } }), title: "Figma" },
    { node: React.createElement(SiFramer as any, { style: { color: "#0055FF" } }), title: "Framer" },
    { node: React.createElement(SiStorybook as any, { style: { color: "#FF4785" } }), title: "Storybook" },
    { node: React.createElement(SiReact as any, { style: { color: "#61DAFB" } }), title: "React" },
    { node: React.createElement(SiNotion as any, { className: "text-slate-900 dark:text-white" }), title: "Notion" },
    { node: React.createElement(SiTypescript as any, { style: { color: "#3178C6" } }), title: "TypeScript" },
    { node: React.createElement(SiTailwindcss as any, { style: { color: "#06B6D4" } }), title: "Tailwind CSS" },
    { node: React.createElement(SiStripe as any, { style: { color: "#635BFF" } }), title: "Stripe" },
    { node: React.createElement(SiNextdotjs as any, { className: "text-slate-900 dark:text-white" }), title: "Next.js" },
    { node: React.createElement(SiGithub as any, { className: "text-slate-900 dark:text-white" }), title: "GitHub" },
  ];

  return (
    <section className="py-12 bg-white dark:bg-[#112740] border-y border-matisse-100 dark:border-matisse-800/20 overflow-hidden relative [--fade-bg:white] dark:[--fade-bg:#112740]">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-xl md:text-2xl font-light text-slate-500 dark:text-slate-300 mb-10 tracking-tight">
          Trusted by <span className="text-slate-900 dark:text-white italic font-serif">innovative teams</span>
        </p>
        <div className="relative h-16">
          <LogoLoop
            logos={partners}
            speed={40}
            direction="left"
            logoHeight={44}
            gap={120}
            hoverSpeed={0}
            scaleOnHover
            fadeOut
            fadeOutColor="var(--fade-bg)"
            className="opacity-90 hover:opacity-100 transition-opacity duration-500"
          />
        </div>
      </div>
    </section>
  );
};

export const HowItWorks: React.FC = () => {
  const chartData1 = [{ value: 10 }, { value: 30 }, { value: 15 }, { value: 45 }, { value: 35 }, { value: 60 }];
  const chartData2 = [{ value: 65 }, { value: 40 }, { value: 20 }, { value: 10 }, { value: 5 }];
  const chartData3 = [{ value: 20 }, { value: 40 }, { value: 30 }, { value: 70 }, { value: 50 }, { value: 90 }];
  const chartData4 = [{ name: 'A', value: 400 }, { name: 'B', value: 300 }, { name: 'C', value: 300 }, { name: 'D', value: 200 }];
  const COLORS = ['#2563eb', '#8b5cf6', '#0ea5e9', '#38bdf8'];

  const steps = [
    { 
      title: "Data Integration", 
      desc: "Sync your existing invoices and client history.", 
      icon: <BrainCircuit size={24} />,
      chart: (
        <ResponsiveContainer width="100%" height={80}>
          <LineChart data={chartData1}>
            <Line type="monotone" dataKey="value" stroke="#38bdf8" strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      )
    },
    { 
      title: "Risk Analysis", 
      desc: "AI predicts churn risk and default probability.", 
      icon: <Sparkles size={24} />,
      chart: (
        <ResponsiveContainer width="100%" height={80}>
          <BarChart data={chartData2}>
            <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )
    },
    { 
      title: "Auto Recovery", 
      desc: "Neural negotiators begin recovery flows.", 
      icon: <Globe size={24} />,
      chart: (
        <ResponsiveContainer width="100%" height={80}>
          <AreaChart data={chartData3}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="value" stroke="#2563eb" fillOpacity={1} fill="url(#colorValue)" />
          </AreaChart>
        </ResponsiveContainer>
      )
    },
    { 
      title: "Capital Reclaimed", 
      desc: "Payments are settled and revenue is secured.", 
      icon: <Zap size={24} />,
      chart: (
        <ResponsiveContainer width="100%" height={80}>
          <PieChart>
            <Pie
              data={chartData4}
              innerRadius={20}
              outerRadius={35}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {chartData4.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      )
    },
  ];

  return (
    <section id="how-it-works" className="pt-24 pb-40 px-6 bg-matisse-50/50 dark:bg-white/[0.01]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

          {/* Left: Header Content */}
          <div className="flex-1 text-left">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-matisse-600 dark:text-matisse-300 font-semibold text-xs uppercase tracking-[0.4em] mb-8"
            >
              Operation
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.8 }}
              className="text-6xl md:text-8xl font-semibold text-slate-900 dark:text-white tracking-tighter leading-[1.05] mb-8"
            >
              How Nexus <br />
              <span className="text-matisse-600 dark:text-matisse-300">Orchestrates</span>
              <br />
              <span className="text-matisse-600 dark:text-matisse-300">Capital.</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25, duration: 0.7 }}
              className="text-slate-500 dark:text-slate-400 text-lg md:text-xl leading-relaxed max-w-md"
            >
              Four intelligent stages, fully automated — from data ingestion to capital recovery.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.35 }}
              className="mt-10 flex flex-wrap gap-3"
            >
              {steps.map((s, i) => (
                <span key={i} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-matisse-50 dark:bg-matisse-500/10 text-matisse-700 dark:text-matisse-300 text-sm font-medium border border-matisse-100 dark:border-matisse-800/20">
                  <span className="opacity-50 text-xs font-bold">0{i + 1}</span>
                  {s.title}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Right: Floating Card Stack */}
          <div className="flex-shrink-0 flex justify-center lg:justify-end">
            <div className="w-[320px] h-[420px] md:w-[400px] md:h-[480px]">
              <CardStack
                randomRotation={true}
                sensitivity={180}
                sendToBackOnClick={true}
                cards={steps.map((s, i) => (
                  <div
                    key={i}
                    className="group p-10 rounded-[2.5rem] bg-white dark:bg-[#112740] border border-matisse-100 dark:border-matisse-800/10 shadow-xl h-full flex flex-col pointer-events-none"
                  >
                    <div className="flex justify-between items-start mb-8">
                      <div className="w-16 h-16 rounded-[1.5rem] bg-matisse-50 dark:bg-matisse-500/10 flex items-center justify-center text-matisse-600 dark:text-matisse-300 shadow-sm flex-shrink-0">
                        {s.icon}
                      </div>
                      <div className="w-24 h-16 opacity-70">
                        {s.chart}
                      </div>
                    </div>
                    <h3 className="text-3xl font-semibold text-slate-900 dark:text-white mb-6 tracking-tight">
                      <span className="text-slate-300 dark:text-matisse-800/40 mr-2 font-bold tracking-tighter">0{i + 1}</span> {s.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed flex-grow">
                      {s.desc}
                    </p>
                    <div className="mt-auto text-[10px] font-bold uppercase tracking-[0.3em] text-matisse-500/50">
                      Swipe or Click to Next
                    </div>
                  </div>
                ))}
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export const CTA: React.FC = () => {
  return (
    <AuroraHero className="border-y border-white/5 pt-40 pb-20">
      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        {/* Decorative elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-matisse-500/10 blur-[150px] rounded-full pointer-events-none" />

        <div className="relative z-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-matisse-500/10 border border-matisse-500/20 text-matisse-600 dark:text-matisse-300 text-[10px] font-semibold uppercase tracking-[0.4em] mb-12"
          >
            <span className="w-2 h-2 rounded-full bg-matisse-500 animate-pulse" />
            Get Started Today
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 40, filter: "blur(20px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl md:text-7xl font-semibold text-slate-900 dark:text-white tracking-tighter leading-[1.1] mb-12"
          >
            Ready to <br />
            <span className="text-matisse-600 dark:text-matisse-400">Scale?</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 1, ease: "easeOut" }}
            className="text-slate-600 dark:text-slate-400 text-xl md:text-2xl mb-20 font-normal max-w-2xl mx-auto leading-relaxed"
          >
            Join the leading financial institutions using Nexus to automate recovery and maximize capital efficiency.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center"
          >
            <Link to="/login">
              <button className="px-16 py-7 bg-matisse-600 hover:bg-matisse-700 text-white font-semibold rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-matisse-500/40 text-lg">
                Start Free Trial
              </button>
            </Link>
          </motion.div>
        </div>
      </div>
    </AuroraHero>
  );
};

export const Footer: React.FC = () => {
  return (
    <footer className="pt-12 pb-24 px-6 bg-white dark:bg-[#112740] border-t border-matisse-100 dark:border-matisse-800/20 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
          <div className="col-span-1 md:col-span-2">
            <div className="text-3xl font-semibold text-slate-900 dark:text-white mb-8 tracking-tighter">
              <img src="/logo.png" alt="CollectAI" className="h-14 w-auto" />
            </div>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed font-normal">
              Architecting the world's most sophisticated autonomous financial infrastructure.
            </p>
          </div>
          <div>
            <div className="text-slate-900 dark:text-white font-semibold text-xs uppercase tracking-widest mb-8">Protocol</div>
            <div className="space-y-4">
              {["Features", "Nexus Core", "Intelligence", "Pricing"].map(link => (
                <a key={link} href="#!" className="block text-slate-500 hover:text-matisse-600 dark:hover:text-matisse-300 transition-colors font-normal">{link}</a>
              ))}
            </div>
          </div>
          <div>
            <div className="text-slate-900 dark:text-white font-semibold text-xs uppercase tracking-widest mb-8">Connect</div>
            <div className="flex gap-6">
              {[Twitter, Github, Linkedin, Mail].map((Icon, i) => (
                <a key={i} href="#!" className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="pt-12 border-t border-matisse-100 dark:border-matisse-800/20 flex flex-col md:flex-row justify-between gap-6 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
          <div>© 2026 CollectAI Neural Network. All rights reserved.</div>
          <div className="flex gap-8">
            <a href="#!" className="hover:text-slate-900 dark:hover:text-white">Privacy Protocol</a>
            <a href="#!" className="hover:text-slate-900 dark:hover:text-white">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
