import React from "react";

export default function BackgroundWrapper({ children }) {
  return (
    <div className="relative min-h-screen w-full bg-[#112740] overflow-hidden">

      {/* 🌌 BASE GRADIENT - Blue/Cyan only */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(59,130,246,0.1),transparent_40%),radial-gradient(circle_at_80%_70%,rgba(6,182,212,0.1),transparent_40%)]" />

      {/* ⚡ GRID */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px"
        }}
      />

      {/* 🌊 WAVES - Slow, subtle, blue gradient */}
      <div className="absolute bottom-0 left-0 w-full h-[400px] overflow-hidden pointer-events-none">
        <svg viewBox="0 0 1440 320" className="absolute w-full h-full opacity-[0.15]">
          <path
            fill="none"
            stroke="url(#waveGradient)"
            strokeWidth="1.5"
            d="M0,160 C360,80 720,240 1440,160"
          >
            <animate
              attributeName="d"
              dur="15s"
              repeatCount="indefinite"
              values="
              M0,160 C360,80 720,240 1440,160;
              M0,180 C360,260 720,100 1440,180;
              M0,160 C360,80 720,240 1440,160
              "
            />
          </path>

          <defs>
            <linearGradient id="waveGradient" x1="0" x2="1">
              <stop offset="0%" stopColor="#2d84ca" />
              <stop offset="50%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#2d84ca" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* ✨ FLOATING PARTICLES - Minimal and subtle */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <span
            key={i}
            className="absolute bg-matisse-400/20 rounded-full"
            style={{
              width: "1px",
              height: "1px",
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
              animation: `float-particle ${10 + Math.random() * 15}s linear infinite`,
              animationDelay: `-${Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      {/* 🎬 ANIMATION */}
      <style>{`
        @keyframes float-particle {
          0% { transform: translateY(0) scale(1); opacity: 0 }
          20% { opacity: 0.5 }
          80% { opacity: 0.5 }
          100% { transform: translateY(-100px) scale(0.5); opacity: 0 }
        }
      `}</style>

      {/* CONTENT */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
