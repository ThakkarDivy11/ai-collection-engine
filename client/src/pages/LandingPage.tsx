import React, { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import { Stats, PartnerLogos, HowItWorks, CTA } from "../components/landing/LandingMisc";
import HorizontalFeatures from "../components/landing/HorizontalFeatures";
import Intelligence from "../components/landing/Intelligence";
import AuroraPricing from "../components/ui/aurora-pricing";
import { Footer7 } from "../components/ui/footer-7";

gsap.registerPlugin(ScrollTrigger);

const LandingPage: React.FC = () => {
  console.log("Landing page loaded");
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
    <div className="relative w-full overflow-hidden bg-white dark:bg-[#112740] text-slate-900 dark:text-white selection:bg-[#2d84ca]/10">
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

        {/* PARTNER LOGOS - Infinite Loop */}
        <PartnerLogos />

        {/* AI SECTION - Split layout with soft glow blobs */}
        <section className="relative">
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-matisse-600/10 blur-[150px] rounded-full pointer-events-none" />
          <Intelligence />
        </section>



        {/* HOW IT WORKS - Minimal design */}
        <section>
          <HowItWorks />
        </section>

        {/* PRICING - Slightly lighter background for contrast */}
        <section className="relative bg-transparent">
          <AuroraPricing />
        </section>

        {/* CTA - Strong gradient contrast */}
        <section>
          <CTA />
        </section>
      </main>

      <Footer7 />

      {/* Cinematic Texture Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.02] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
};

export default LandingPage;
