import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { BrainCircuit, ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils";
import GsapThreeHeroBackground from "./GsapThreeHeroBackground";
import {
  animateHeroSection,
  createFloatingElements,
  createGlowPulse,
  createMagnetEffect,
  createMouseParallax,
  createHeroFloatingElements,
  createButtonGlow,
  createHeroScrollAnimations
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
      createButtonGlow('.hero-button');
      createHeroScrollAnimations();

      // Add mouse parallax to dashboard elements
      if (containerRef.current) {
        createMouseParallax(containerRef.current, ['.hero-dashboard > div > div']);
      }

      // Create floating particles
      const cleanupParticles = createHeroFloatingElements(containerRef.current);

      return () => {
        cleanupParticles();
        // Cleanup animations if needed
      };
    }
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-[90vh] flex flex-col items-center justify-center pt-32 pb-24 px-6 z-10 overflow-visible">
      <GsapThreeHeroBackground />

      {/* Floating decorative elements */}
      <div className="absolute top-20 left-10 w-20 h-20 rounded-full bg-calypso-500/10 dark:bg-calypso-400/10 blur-xl floating-element" />
      <div className="absolute top-40 right-20 w-32 h-32 rounded-full bg-emerald-500/10 dark:bg-emerald-400/10 blur-xl floating-element" />
      <div className="absolute bottom-40 left-1/4 w-16 h-16 rounded-full bg-blue-500/10 dark:bg-blue-400/10 blur-xl floating-element" />

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
            AI-Powered Revenue. <span className="text-calypso-500 dark:text-calypso-300">Fully Automated.</span>
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


      </section>
    );
  };

export default Hero;
