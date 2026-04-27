import React, { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import ThreeBackground from "../components/landing/ThreeBackground";
import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import { Stats, HowItWorks, CTA, Footer } from "../components/landing/LandingMisc";
import HorizontalFeatures from "../components/landing/HorizontalFeatures";
import Intelligence from "../components/landing/Intelligence";
import CircleGrid from "../components/landing/CircleGrid";
import Pricing from "../components/landing/Pricing";

gsap.registerPlugin(ScrollTrigger);

const LandingPage: React.FC = () => {
  useEffect(() => {
    // Initialize Lenis Smooth Scroll
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
    });

    // Synchronize Lenis with GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Reveal animations for sections
    const sections = document.querySelectorAll("section");
    sections.forEach((section) => {
      gsap.fromTo(
        section,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power4.out",
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    });

    // Cleanup
    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  return (
    <div className="relative w-full overflow-hidden bg-white dark:bg-[#1a2a37] text-slate-900 dark:text-white selection:bg-[#4b8aac]/10">
      <div className="fixed inset-0 z-0 opacity-40 dark:opacity-100 grayscale dark:grayscale-0 pointer-events-none">
        <ThreeBackground />
      </div>
      <Navbar />
      
      <main className="flex flex-col relative z-10">
        {/* HERO - Subtle particles / gradient background */}
        <section className="relative">
          <Hero />
        </section>

        {/* STATS - Clean horizontal layout */}
        <Stats />

        {/* HORIZONTAL FEATURES - GSAP ScrollTrigger Pinned Section */}
        <HorizontalFeatures />

        {/* AI SECTION - Split layout with soft glow blobs */}
        <section className="relative">
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-calypso-600/10 blur-[150px] rounded-full pointer-events-none" />
          <Intelligence />
        </section>

        {/* CIRCLE GRID - Interactive GSAP Animation */}
        <section className="relative py-0 bg-white dark:bg-[#1a2a37] overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 pt-24 pb-0">
            <div className="text-center mb-16">
              <span className="text-calypso-600 dark:text-calypso-300 font-semibold text-xs uppercase tracking-[0.4em] mb-4 block">Live Engine</span>
              <h2 className="text-5xl md:text-6xl font-semibold text-slate-900 dark:text-white tracking-tighter">Neural <span className="text-calypso-500">Pulse</span></h2>
              <p className="text-slate-500 dark:text-slate-400 mt-4 max-w-md mx-auto text-base">Click to pause the simulation. Our AI runs thousands of micro-calculations every second.</p>
            </div>
          </div>
          <div className="w-full" style={{ height: '60vh' }}>
            <CircleGrid />
          </div>
        </section>

        {/* HOW IT WORKS - Minimal design */}
        <section>
           <HowItWorks />
        </section>

        {/* PRICING - Slightly lighter background for contrast */}
        <section className="bg-slate-900/20 relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0%,transparent_70%)] pointer-events-none" />
          <Pricing />
        </section>

        {/* CTA - Strong gradient contrast */}
        <section>
           <CTA />
        </section>
      </main>
      
      <Footer />
      
      {/* Cinematic Texture Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.02] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
};

export default LandingPage;
