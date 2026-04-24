import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { BrainCircuit, ChevronRight } from "lucide-react";

const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    const titleText = titleRef.current;
    if (titleText) {
      const originalText = titleText.innerText;
      const words = originalText.split(" ");
      titleText.innerHTML = words.map(word => `<span class="inline-block overflow-hidden"><span class="inline-block translate-y-full">${word}</span></span>`).join(" ");

      const spans = titleText.querySelectorAll("span span");
      tl.to(spans, {
        y: 0,
        duration: 1.2,
        stagger: 0.1,
        ease: "power4.out"
      });
    }

    tl.fromTo(subRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1 },
      "-=0.8"
    )
      .fromTo(buttonsRef.current?.children || [],
        { opacity: 0, scale: 0.9, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.8, stagger: 0.1 },
        "-=0.6"
      );
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-screen flex flex-col items-center justify-center pt-40 pb-32 px-6 z-10 overflow-visible">
      <div className="max-w-7xl mx-auto text-center mb-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-green-500/10 dark:bg-[#00ff7f]/5 text-green-700 dark:text-[#00ff7f] text-[10px] font-semibold mb-12 tracking-[0.3em] uppercase backdrop-blur-sm border border-green-500/10 dark:border-[#00ff7f]/10"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-green-600 dark:bg-[#00ff7f] shadow-[0_0_8px_rgba(22,163,74,0.5)] dark:shadow-[0_0_8px_rgba(0,255,127,0.5)]" />
          <span>The Future of Recovery</span>
        </motion.div>

        <h1
          ref={titleRef}
          className="text-[12vw] md:text-[9.5rem] font-semibold text-slate-900 dark:text-white tracking-tighter leading-[0.8] mb-12"
        >
          AI-Powered Revenue.  <br />
          <span className="text-[#16a34a] dark:text-[#00ff7f]"> Fully Automated.</span>
        </h1>

        <p
          ref={subRef}
          className="text-lg md:text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-16 leading-relaxed font-normal"
        >
          CollectAI integrates Neural Churn Prediction and Autonomous Negotiators
          to deliver high-scale, AI-driven payment recovery for the modern enterprise.
        </p>

        <div ref={buttonsRef} className="flex flex-col sm:flex-row items-center justify-center gap-8">
          <button className="px-12 py-6 bg-slate-950 dark:bg-white dark:text-black text-white font-semibold rounded-3xl transition-all hover:scale-[1.03] active:scale-95 shadow-[0_30px_60px_rgba(0,0,0,0.1)] text-lg">
            Start Recovery
          </button>

          <button className="px-12 py-6 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white font-semibold rounded-3xl border border-slate-200 dark:border-white/10 transition-all hover:bg-white dark:hover:bg-slate-900 backdrop-blur-xl text-lg flex items-center gap-3 group">
            See Platform <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-6xl mx-auto px-4"
      >
        <div className="relative group">
          <div className="absolute -inset-40 bg-green-600/5 dark:bg-[#00ff7f]/5 blur-[150px] rounded-full pointer-events-none" />

          <div className="relative rounded-3xl overflow-hidden shadow-[0_80px_150px_rgba(0,0,0,0.05)] border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/50 aspect-[16/9]">
            <div className="h-12 bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-white/5 flex items-center px-6 gap-2">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
              </div>
            </div>

            <div className="p-10 h-full bg-white dark:bg-transparent relative overflow-hidden">
              <div className="relative z-10 grid grid-cols-4 gap-8 h-full text-slate-900 dark:text-white text-left">
                <div className="col-span-3 space-y-8">
                  <div className="h-2/3 rounded-[2.5rem] bg-slate-50 dark:bg-white/[0.02] p-10 flex flex-col justify-between border border-slate-200 dark:border-white/5">
                    <div className="text-sm font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Active Recovery Stream</div>
                    <div className="flex items-end gap-3 h-40">
                      {[30, 60, 45, 90, 65, 85, 55, 75, 40, 95, 60, 80, 50, 90].map((h, i) => (
                        <motion.div
                          key={i}
                          initial={{ scaleY: 0 }}
                          animate={{ scaleY: h / 100 }}
                          transition={{ delay: 1 + i * 0.05, duration: 1.2 }}
                          style={{ transformOrigin: "bottom" }}
                          className="flex-1 h-full bg-gradient-to-t from-[#16a34a] dark:from-[#00ff7f] to-[#16a34a]/20 dark:to-[#00ff7f]/20 rounded-t-xl"
                        />
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <div className="h-40 rounded-[2.5rem] bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 p-8">
                      <div className="text-3xl font-semibold text-slate-900 dark:text-white mb-2">99.98%</div>
                      <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Prediction Accuracy</div>
                    </div>
                    <div className="h-40 rounded-[2.5rem] bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 p-8">
                      <div className="text-3xl font-semibold text-slate-900 dark:text-white mb-2">₹48.2Cr</div>
                      <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Recovered Today</div>
                    </div>
                  </div>
                </div>
                <div className="col-span-1 rounded-[2.5rem] bg-slate-100/50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 p-8 text-center">
                  <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-10">Recovery Core</div>
                  <div className="flex flex-col items-center gap-6">
                    <div className="w-24 h-24 rounded-full border-4 border-green-500/10 dark:border-[#00ff7f]/10 flex items-center justify-center relative">
                      <div className="w-16 h-16 rounded-full bg-green-500/10 dark:bg-[#00ff7f]/5 animate-ping absolute" />
                      <BrainCircuit size={40} className="text-[#16a34a] dark:text-[#00ff7f]" />
                    </div>
                    <div className="space-y-3 w-full">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="h-1.5 w-full bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            animate={{ x: ["-100%", "100%"] }}
                            transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                            className="h-full w-1/3 bg-[#16a34a] dark:bg-[#00ff7f] rounded-full"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
