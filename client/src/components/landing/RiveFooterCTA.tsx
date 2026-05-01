import React from "react";
import { useRive, Layout, Fit, Alignment } from "@rive-app/react-canvas";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const RiveFooterCTA: React.FC = () => {
  const { RiveComponent } = useRive({
    src: "/crypto-concept.riv",
    stateMachines: "State Machine 1",
    autoplay: true,
    layout: new Layout({
      fit: Fit.Cover,
      alignment: Alignment.Center,
    }),
  });

  return (
    <section className="relative h-[500px] md:h-[600px] w-full overflow-hidden bg-[#050b16]">
      {/* Rive Background */}
      <div className="absolute inset-0 z-0">
        <RiveComponent />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 h-full w-full flex flex-col items-center justify-center text-center px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-12 drop-shadow-2xl"
        >
          Trade the Future <br />
          Own the Moment
        </motion.h2>

        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="group flex items-center gap-3 px-10 py-5 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/30 rounded-full text-white font-semibold transition-all duration-300"
        >
          Get started for free
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </div>

      {/* Bottom fade to footer */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#1a2a37] to-transparent z-20" />
    </section>
  );
};

export default RiveFooterCTA;
