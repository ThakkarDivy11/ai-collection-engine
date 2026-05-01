import React, { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import { Stats, HowItWorks, CTA, Footer } from "../components/landing/LandingMisc";
import HorizontalFeatures from "../components/landing/HorizontalFeatures";
import Intelligence from "../components/landing/Intelligence";
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
      <Navbar />

      <main className="flex flex-col relative z-10">
        {/* HERO - Subtle particles / gradient background */}
        <section className="relative">
          <Hero />
        </section>

        {/* HORIZONTAL FEATURES - GSAP ScrollTrigger Pinned Section */}
        <HorizontalFeatures />

        {/* AI SECTION - Split layout with soft glow blobs */}
        <section className="relative">
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-calypso-600/10 blur-[150px] rounded-full pointer-events-none" />
          <Intelligence />
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
