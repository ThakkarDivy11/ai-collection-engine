import React from "react";

export default function BackgroundWrapper({ children }) {
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`relative min-h-screen w-full transition-colors duration-500 overflow-hidden ${isDark ? 'bg-[#0a0f1a]' : 'bg-slate-50'}`}>

      {/* 🌌 BASE GRADIENT - Adjusted for theme */}
      <div className={`absolute inset-0 transition-opacity duration-1000 ${isDark ? 'opacity-100' : 'opacity-40'}`} 
           style={{ background: 'radial-gradient(circle at 20% 30%, rgba(45, 132, 202, 0.1), transparent 40%), radial-gradient(circle at 80% 70%, rgba(6, 182, 212, 0.1), transparent 40%)' }} />

      {/* ⚡ GRID */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${isDark ? 'opacity-[0.05]' : 'opacity-[0.03]'}`}
        style={{
          backgroundImage: `
            linear-gradient(${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} 1px, transparent 1px),
            linear-gradient(90deg, ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} 1px, transparent 1px)
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
