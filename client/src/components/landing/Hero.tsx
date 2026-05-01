import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { BrainCircuit, ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils";
import GsapThreeHeroBackground from "./GsapThreeHeroBackground";
import {
  animateHeroSection,
  createFloatingElements,
  createGlowPulse,
  createMagnetEffect
} from "./gsapAnimations";

const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      animateHeroSection(containerRef.current);
      createFloatingElements('.floating-element');
      createGlowPulse('.glow-element');
      createMagnetEffect('.hero-button');
    }

    return () => {
      // Cleanup animations if needed
    };
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-[90vh] flex flex-col items-center justify-center pt-32 pb-24 px-6 z-10 overflow-visible">
      <GsapThreeHeroBackground />
      <div className="max-w-7xl mx-auto text-center mb-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-calypso-500/10 dark:bg-calypso-300/5 text-calypso-700 dark:text-calypso-300 text-[10px] font-semibold mb-8 tracking-[0.3em] uppercase backdrop-blur-sm border border-calypso-500/10 dark:border-calypso-300/10"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-calypso-600 dark:bg-calypso-400 shadow-[0_0_8px_rgba(207,123,64,0.5)] dark:shadow-[0_0_8px_rgba(228,186,141,0.5)]" />
            <span>The Future of Recovery</span>
          </motion.div>

          <h1
            ref={titleRef}
            className="hero-title text-[7.5vw] md:text-[6.5rem] font-semibold text-slate-900 dark:text-white tracking-tighter leading-[1.1] mb-10 will-change-transform"
          >
            AI-Powered Revenue.  <br />
            <span className="text-calypso-500 dark:text-calypso-300">Fully Automated.</span>
          </h1>

          <p
            ref={subRef}
            className="hero-subtitle text-lg md:text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-16 leading-relaxed font-normal will-change-transform"
          >
            CollectAI integrates Neural Churn Prediction and Autonomous Negotiators
            to deliver high-scale, AI-driven payment recovery for the modern enterprise.
          </p>

          <div ref={buttonsRef} className="flex flex-col sm:flex-row items-center justify-center gap-8">
            <button className="hero-button px-12 py-6 bg-slate-950 dark:bg-calypso-500 dark:text-white text-white font-semibold rounded-3xl transition-all hover:scale-[1.03] active:scale-95 shadow-[0_30px_60px_rgba(0,0,0,0.1)] text-lg will-change-transform">
              Start Recovery
            </button>

            <button className="hero-button px-12 py-6 bg-white dark:bg-transparent text-slate-900 dark:text-calypso-300 font-semibold rounded-3xl border border-slate-200 dark:border-calypso-800/30 transition-all hover:bg-slate-50 dark:hover:bg-calypso-900/20 backdrop-blur-xl text-lg flex items-center gap-3 group will-change-transform">
              See Platform <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-6xl mx-auto px-4 hero-dashboard"
        >
          <div className="relative group">
            <div className="absolute -inset-40 bg-calypso-500/5 blur-[150px] rounded-full pointer-events-none glow-element" />

            <div className="relative rounded-3xl overflow-hidden shadow-[0_80px_200px_rgba(0,0,0,0.15)] border border-slate-200 bg-white aspect-[16/9]">
              <div className="h-12 bg-slate-50 border-b border-slate-200 flex items-center px-6 gap-2">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                </div>
              </div>

              <div className="p-10 h-full bg-white relative overflow-hidden">
                <div className="relative z-10 grid grid-cols-4 gap-8 h-full text-slate-900 text-left">
                  <div className="col-span-3 space-y-8">
                    <div className="h-2/3 rounded-[2.5rem] bg-slate-50 p-10 flex flex-col justify-between border border-slate-200">
                      <div className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Active Recovery Stream</div>
                      <div className="flex items-end gap-3 h-40">
                        {[30, 60, 45, 90, 65, 85, 55, 75, 40, 95, 60, 80, 50, 90].map((h, i) => (
                          <div key={i} className="flex-1 flex flex-col-reverse gap-[2px] h-full">
                            {Array.from({ length: 8 }).map((_, j) => (
                              <motion.div
                                key={j}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{
                                  opacity: (j + 1) * 12.5 <= h ? 1 : 0.1,
                                  scale: (j + 1) * 12.5 <= h ? 1 : 0.9
                                }}
                                transition={{
                                  delay: 1 + i * 0.05 + j * 0.03,
                                  duration: 0.4
                                }}
                                className={cn(
                                  "flex-1 w-full rounded-sm transition-colors duration-500",
                                  (j + 1) * 12.5 <= h
                                    ? i < 4 ? "bg-calypso-500" : i < 9 ? "bg-calypso-400" : "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                                    : "bg-slate-100 dark:bg-white/5"
                                )}
                              />
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                      <div className="h-40 rounded-[2.5rem] bg-slate-50 border border-slate-200 p-8">
                        <div className="text-3xl font-semibold text-slate-900 mb-2">99.98%</div>
                        <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Prediction Accuracy</div>
                      </div>
                      <div className="h-40 rounded-[2.5rem] bg-slate-50 border border-slate-200 p-8">
                        <div className="text-3xl font-semibold text-slate-900 mb-2">₹48.2Cr</div>
                        <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Recovered Today</div>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-1 rounded-[2.5rem] bg-slate-50 border border-slate-200 p-8 text-center">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-10">Recovery Core</div>
                    <div className="flex flex-col items-center gap-6">
                      <div className="w-24 h-24 rounded-full border-4 border-calypso-500/10 flex items-center justify-center relative">
                        <div className="w-16 h-16 rounded-full bg-calypso-500/10 animate-ping absolute" />
                        <BrainCircuit size={40} className="text-calypso-500" />
                      </div>
                      <div className="space-y-3 w-full">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                            <motion.div
                              animate={{ x: ["-100%", "100%"] }}
                              transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                              className="h-full w-1/3 bg-calypso-500 rounded-full"
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
