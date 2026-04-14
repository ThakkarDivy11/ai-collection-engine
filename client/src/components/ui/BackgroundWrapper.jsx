import React from "react";

export default function BackgroundWrapper({ children }) {
  return (
    <div className="relative min-h-screen w-full bg-slate-50 dark:bg-[#020617] overflow-hidden transition-colors duration-300">
      {/* 2. Grid & Particle Layer */}
      <div 
        className="hidden dark:block absolute inset-0 z-0 opacity-[0.12]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px'
        }}
        aria-hidden="true"
      />
      {/* Dots at intersections */}
      <div 
        className="hidden dark:block absolute inset-0 z-0 opacity-10"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(59,130,246,0.5) 0.8px, transparent 0.8px)',
          backgroundSize: '48px 48px',
          backgroundPosition: '-0.4px -0.4px'
        }}
        aria-hidden="true"
      />

      {/* 3. Multi-color Neon Glow Layers */}
      <div className="hidden dark:block absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Blue Glow (Top Left) */}
        <div className="absolute top-[-15%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[140px] animate-pulse" style={{ animationDuration: '4s' }} />
        
        {/* Purple Glow (Middle Right) */}
        <div className="absolute top-[20%] right-[-10%] w-[45%] h-[45%] bg-purple-600/10 rounded-full blur-[140px]" />
        
        {/* Pink/Indigo Glow (Bottom Left) */}
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-pink-500/5 rounded-full blur-[120px]" />
      </div>

      {/* 4. Depth Layer - Vertical Gradient Mask */}
      <div 
        className="hidden dark:block absolute inset-0 z-0 bg-gradient-to-b from-[#020617]/0 via-[#020617]/20 to-[#020617]"
        aria-hidden="true"
      />

      {/* Content Wrapper */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
}
