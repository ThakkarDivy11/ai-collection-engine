import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BrainCircuit, Users, Zap, Search, ChevronRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const HorizontalFeatures: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const features = [
    {
      title: "Neural Churn Prediction",
      desc: "Our deep-learning engine identifies high-risk accounts 60 days before potential default, allowing for proactive intervention.",
      icon: <BrainCircuit size={48} className="text-matisse-500 dark:text-matisse-300" />,
      stat: "99.2% Accuracy",
      color: "from-matisse-500/5 dark:from-matisse-300/5",
      mockup: {
        title: "Churn Risk Monitor",
        subtitle: "Real-time Neural Analysis",
        rows: [
          { label: "Account #8492", value: "94% Risk", color: "bg-rose-500" },
          { label: "Account #7123", value: "88% Risk", color: "bg-rose-500" },
          { label: "Account #3941", value: "82% Risk", color: "bg-amber-500" }
        ]
      }
    },
    {
      title: "Autonomous Negotiators",
      desc: "AI agents that handle settlement dialogues with human-level empathy and professional persistence, 24/7.",
      icon: <Users size={48} className="text-matisse-500 dark:text-matisse-300" />,
      stat: "4.2x Recovery Rate",
      color: "from-matisse-400/5 dark:from-matisse-200/5",
      mockup: {
        title: "Active Negotiations",
        subtitle: "Neural NLP Engine",
        rows: [
          { label: "Settlement Found", value: "₹45,000", color: "bg-matisse-500" },
          { label: "Agent Response", value: "Pending", color: "bg-matisse-500" },
          { label: "User Sentiment", value: "Positive", color: "bg-matisse-500" }
        ]
      }
    },
    {
      title: "Recovery Operations",
      desc: "Streamline the entire debt lifecycle with automated workflows that adapt to debtor behavior in real-time.",
      icon: <Zap size={48} className="text-matisse-500 dark:text-matisse-300" />,
      stat: "0ms Latency",
      color: "from-matisse-600/5 dark:from-matisse-400/5",
      mockup: {
        title: "Operation Pipeline",
        subtitle: "Autonomous Workflows",
        rows: [
          { label: "Auto-Trigger", value: "Active", color: "bg-matisse-500" },
          { label: "Batch Process", value: "1.2s", color: "bg-matisse-500" },
          { label: "Queue Status", value: "Optimal", color: "bg-matisse-500" }
        ]
      }
    },
    {
      title: "Revenue Forensic",
      desc: "Identify hidden leaks in your payment pipeline with deep-dive forensic analysis of structural churn patterns.",
      icon: <Search size={48} className="text-matisse-500 dark:text-matisse-300" />,
      stat: "₹250Cr+ Analyzed",
      color: "from-matisse-700/5 dark:from-matisse-500/5",
      mockup: {
        title: "Forensic Analysis",
        subtitle: "Structural Leak Detection",
        rows: [
          { label: "Leak Detected", value: "₹2.4M", color: "bg-rose-500" },
          { label: "Pattern ID", value: "#XJ-92", color: "bg-matisse-500" },
          { label: "Impact Score", value: "Critical", color: "bg-rose-500" }
        ]
      }
    }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const pin = gsap.fromTo(
        sectionRef.current,
        { x: 0 },
        {
          x: "-300vw",
          ease: "none",
          duration: 1,
          scrollTrigger: {
            trigger: triggerRef.current,
            start: "top top",
            end: "2000 top",
            scrub: 0.6,
            pin: true,
            snap: 1 / (features.length - 1),
            invalidateOnRefresh: true,
          },
        }
      );
      return () => pin.kill();
    }, triggerRef);

    return () => ctx.revert();
  }, [features.length]);

  return (
    <div className="relative">
      {/* Mobile Stacked View */}
      <div className="md:hidden space-y-10 px-6 py-20 bg-matisse-50 dark:bg-[#112740]">
         <div className="text-center mb-16">
            <span className="text-matisse-600 dark:text-matisse-300 font-semibold text-xs uppercase tracking-[0.4em] mb-4 block">Core Engine</span>
            <h2 className="text-4xl font-semibold text-slate-900 dark:text-white tracking-tighter">Sophisticated Recovery.</h2>
         </div>
         {features.map((f, i) => (
            <div key={i} className="p-8 rounded-[2rem] bg-white dark:bg-white/[0.02] border border-matisse-100 dark:border-matisse-800/20">
                <div className="mb-6">{f.icon}</div>
                <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4 tracking-tight">{f.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">{f.desc}</p>
                <div className="text-matisse-600 dark:text-matisse-300 font-bold text-sm tracking-widest uppercase">{f.stat}</div>
            </div>
         ))}
      </div>

      {/* Desktop Horizontal View */}
      <div ref={triggerRef} className="hidden md:block overflow-hidden bg-matisse-50 dark:bg-[#112740]">
        <div ref={sectionRef} className="flex h-screen w-[400vw] relative z-10">
          {features.map((f, i) => (
            <div key={i} className={`w-screen h-screen flex items-center justify-center relative px-20 overflow-hidden`}>
                {/* Background Accent */}
                <div className={`absolute inset-0 bg-gradient-to-br ${f.color} to-transparent opacity-30 pointer-events-none`} />
                
                <div className="max-w-7xl w-full grid grid-cols-2 gap-20 items-center relative z-10 text-left">
                    <div className="space-y-10">
                        <MotionWrapper>
                             <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white dark:bg-white/5 border border-matisse-100 dark:border-matisse-800/30 text-matisse-700 dark:text-matisse-300 text-[10px] font-semibold tracking-widest uppercase mb-4">
                                <span className="w-2 h-2 rounded-full bg-matisse-500 animate-pulse" />
                                Feature 0{i + 1}
                             </div>
                        </MotionWrapper>
                        
                        <h2 className="text-[7rem] font-semibold text-slate-900 dark:text-white tracking-tighter leading-[0.9]">
                            {f.title.split(' ').map((word, idx) => (
                                <React.Fragment key={idx}>
                                    {word === 'Negotiators' || word === 'Prediction' || word === 'Forensic' || word === 'Operations' ? (
                                        <span className="text-matisse-500 dark:text-matisse-300">{word}</span>
                                    ) : word}
                                    {' '}
                                </React.Fragment>
                            ))}
                        </h2>
                        
                        <p className="text-2xl text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed font-normal">
                            {f.desc}
                        </p>
                        
                        <div className="flex items-center gap-10">
                            <div>
                                <div className="text-4xl font-semibold text-slate-900 dark:text-white mb-1">{f.stat}</div>
                                <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Industry Benchmark</div>
                            </div>
                            <button className="flex items-center gap-3 text-slate-900 dark:text-white font-semibold group border-b border-matisse-200 dark:border-matisse-800/30 pb-2 hover:border-matisse-500 transition-all">
                                Explore Tech <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>

                    <div className="relative aspect-[4/3] rounded-[3rem] bg-white dark:bg-white/[0.03] border border-matisse-100 dark:border-matisse-800/20 overflow-hidden shadow-xl group">
                         {/* Mock UI Preview */}
                         <div className="absolute inset-10 flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <div className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">{f.mockup.title}</div>
                                    <div className="text-[10px] font-bold text-slate-400 dark:text-matisse-500 uppercase tracking-widest">{f.mockup.subtitle}</div>
                                </div>
                                <div className="w-12 h-12 rounded-2xl bg-matisse-500/10 flex items-center justify-center">
                                    {f.icon}
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                {f.mockup.rows.map((row, idx) => (
                                    <div key={idx} className="h-14 w-full bg-slate-50/50 dark:bg-white/5 border border-slate-100 dark:border-matisse-800/20 rounded-2xl flex items-center px-6 justify-between group-hover:bg-slate-100/50 dark:group-hover:bg-white/10 transition-colors shadow-sm">
                                        <div className="flex gap-4 items-center">
                                            <div className={`w-2 h-2 rounded-full ${row.color}`} />
                                            <div className="text-sm font-semibold text-slate-600 dark:text-slate-300">{row.label}</div>
                                        </div>
                                        <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">{row.value}</div>
                                    </div>
                                ))}
                            </div>
                         </div>
                         
                         {/* Shine effect */}
                         <div className="absolute inset-0 bg-gradient-to-tr from-black/0 via-black/[0.01] to-black/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </div>
                </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const MotionWrapper = ({ children }: any) => <div className="opacity-1">{children}</div>;

export default HorizontalFeatures;
