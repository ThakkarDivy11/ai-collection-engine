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
      icon: <BrainCircuit size={48} className="text-[#16a34a] dark:text-[#00ff7f]" />,
      stat: "99.2% Accuracy",
      color: "from-green-500/5 dark:from-[#00ff7f]/5"
    },
    {
      title: "Autonomous Negotiators",
      desc: "AI agents that handle settlement dialogues with human-level empathy and professional persistence, 24/7.",
      icon: <Users size={48} className="text-[#16a34a] dark:text-[#00ff7f]" />,
      stat: "4.2x Recovery Rate",
      color: "from-slate-500/5 dark:from-blue-500/5"
    },
    {
      title: "Recovery Operations",
      desc: "Streamline the entire debt lifecycle with automated workflows that adapt to debtor behavior in real-time.",
      icon: <Zap size={48} className="text-[#16a34a] dark:text-[#00ff7f]" />,
      stat: "0ms Latency",
      color: "from-indigo-500/5 dark:from-indigo-500/5"
    },
    {
      title: "Revenue Forensic",
      desc: "Identify hidden leaks in your payment pipeline with deep-dive forensic analysis of structural churn patterns.",
      icon: <Search size={48} className="text-[#16a34a] dark:text-[#00ff7f]" />,
      stat: "₹250Cr+ Analyzed",
      color: "from-emerald-500/5 dark:from-emerald-500/5"
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
  }, []);

  return (
    <div className="relative">
      {/* Mobile Stacked View */}
      <div className="md:hidden space-y-10 px-6 py-20 bg-white dark:bg-[#020617]">
         <div className="text-center mb-16">
            <span className="text-[#16a34a] dark:text-[#00ff7f] font-semibold text-xs uppercase tracking-[0.4em] mb-4 block">Core Engine</span>
            <h2 className="text-4xl font-semibold text-slate-900 dark:text-white tracking-tighter">Sophisticated Recovery.</h2>
         </div>
         {features.map((f, i) => (
            <div key={i} className="p-8 rounded-[2rem] bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5">
                <div className="mb-6">{f.icon}</div>
                <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4 tracking-tight">{f.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">{f.desc}</p>
                <div className="text-[#16a34a] dark:text-[#00ff7f] font-bold text-sm tracking-widest uppercase">{f.stat}</div>
            </div>
         ))}
      </div>

      {/* Desktop Horizontal View */}
      <div ref={triggerRef} className="hidden md:block overflow-hidden bg-white dark:bg-[#020617]">
        <div ref={sectionRef} className="flex h-screen w-[400vw] relative z-10">
          {features.map((f, i) => (
            <div key={i} className={`w-screen h-screen flex items-center justify-center relative px-20 overflow-hidden`}>
                {/* Background Accent */}
                <div className={`absolute inset-0 bg-gradient-to-br ${f.color} to-transparent opacity-30 pointer-events-none`} />
                
                <div className="max-w-7xl w-full grid grid-cols-2 gap-20 items-center relative z-10 text-left">
                    <div className="space-y-10">
                        <MotionWrapper>
                             <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 text-[10px] font-semibold tracking-widest uppercase mb-4">
                                <span className="w-2 h-2 rounded-full bg-[#16a34a] dark:bg-[#00ff7f] animate-pulse" />
                                Feature 0{i + 1}
                             </div>
                        </MotionWrapper>
                        
                        <h2 className="text-[7rem] font-semibold text-slate-900 dark:text-white tracking-tighter leading-[0.9]">
                            {f.title.split(' ').map((word, idx) => (
                                <React.Fragment key={idx}>
                                    {word === 'Negotiators' || word === 'Prediction' || word === 'Forensic' || word === 'Operations' ? (
                                        <span className="text-[#16a34a] dark:text-[#00ff7f]">{word}</span>
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
                            <button className="flex items-center gap-3 text-slate-900 dark:text-white font-semibold group border-b border-slate-200 dark:border-white/10 pb-2 hover:border-[#16a34a] dark:hover:border-[#00ff7f] transition-all">
                                Explore Tech <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>

                    <div className="relative aspect-[4/3] rounded-[3rem] bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 overflow-hidden shadow-xl group">
                         {/* Mock UI Preview */}
                         <div className="absolute inset-10 flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                                <div className="space-y-2">
                                    <div className="h-2 w-32 bg-slate-200 dark:bg-white/10 rounded-full" />
                                    <div className="h-2 w-20 bg-slate-100 dark:bg-white/5 rounded-full" />
                                </div>
                                <div className="w-12 h-12 rounded-2xl bg-[#16a34a]/10 dark:bg-[#00ff7f]/10 flex items-center justify-center">
                                    {f.icon}
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                {[1, 2, 3].map(item => (
                                    <div key={item} className="h-12 w-full bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl flex items-center px-6 justify-between group-hover:bg-slate-50 dark:group-hover:bg-white/10 transition-colors">
                                        <div className="flex gap-4 items-center">
                                            <div className="w-2 h-2 rounded-full bg-[#16a34a] dark:bg-[#00ff7f]" />
                                            <div className="h-2 w-40 bg-slate-100 dark:bg-white/10 rounded-full" />
                                        </div>
                                        <div className="h-2 w-12 bg-slate-100 dark:bg-white/10 rounded-full" />
                                    </div>
                                ))}
                            </div>
                         </div>
                         
                         {/* Shine effect */}
                         <div className="absolute inset-0 bg-gradient-to-tr from-black/0 dark:from-white/0 via-black/[0.01] dark:via-white/[0.02] to-black/0 dark:to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
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
