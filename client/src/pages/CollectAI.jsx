import { useState, useEffect, useRef } from "react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
.cai{font-family:'Inter',sans-serif;overflow-x:hidden;scroll-behavior:smooth;}
.cai a{text-decoration:none;color:inherit;}
.cai button{cursor:pointer;font-family:inherit;}
.gt{background:linear-gradient(135deg,#059669,#10b981,#f59e0b);background-size:200%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:grad 8s ease infinite;}
.gta{background:linear-gradient(135deg,#f59e0b,#d97706,#059669);background-size:200%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:grad 8s ease infinite;}
@keyframes grad{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
.hero-bg-l{background:linear-gradient(160deg,#ecfdf5 0%,#fff 40%,#fffbeb 100%);}
.hero-bg-d{background:linear-gradient(160deg,#064e3b 0%,#0f172a 40%,#78350f 100%);}
@keyframes floatA{0%,100%{transform:translateY(0)}50%{transform:translateY(-18px)}}
@keyframes floatB{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
@keyframes spinCW{to{transform:rotate(360deg)}}
@keyframes spinCCW{to{transform:rotate(-360deg)}}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(.7)}}
@keyframes barUp{from{height:0}to{height:var(--h)}}
.fa{animation:floatA 6s ease-in-out infinite;}
.fb{animation:floatB 6s ease-in-out -3s infinite;}
.scw{animation:spinCW 20s linear infinite;}
.scc{animation:spinCCW 15s linear infinite;}
.pd{animation:pulse 2s infinite;}
.aos{opacity:0;transform:translateY(28px);transition:opacity .75s cubic-bezier(.16,1,.3,1),transform .75s cubic-bezier(.16,1,.3,1);}
.aos.fl{transform:translateX(-36px);}
.aos.fr{transform:translateX(36px);}
.aos.v{opacity:1;transform:none;}
.lift{transition:transform .3s,box-shadow .3s;}
.lift:hover{transform:translateY(-5px);}
.shim{position:relative;overflow:hidden;}
.shim::after{content:'';position:absolute;top:0;left:-100%;width:100%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.2),transparent);transition:left .5s;}
.shim:hover::after{left:100%;}
.fb-top::before{content:'';position:absolute;top:0;left:0;width:100%;height:3px;background:linear-gradient(to right,#10b981,#059669);transform:scaleX(0);transform-origin:left;transition:transform .35s;}
.fb-top:hover::before{transform:scaleX(1);}
.fi{transition:transform .3s;}
.fb-top:hover .fi{transform:scale(1.1) rotate(3deg);}
.inv:hover{background:rgba(16,185,129,.04);}
.mob-menu{transform:translateX(100%);transition:transform .3s ease;width:80%;max-width:360px;}
.mob-menu.open{transform:translateX(0);}
.bar{width:100%;border-radius:8px;height:0;}
.bar.go{animation:barUp 1.15s cubic-bezier(.16,1,.3,1) forwards;}
::-webkit-scrollbar{width:7px;}
::-webkit-scrollbar-track{background:#f1f5f9;}
.glass-card{background:rgba(15,23,42,0.6);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,0.08);box-shadow:0 10px 30px -10px rgba(0,0,0,0.5),inset 0 1px 1px rgba(255,255,255,0.05);}
.bento-glow{position:relative;transition:all .3s ease;}
.bento-glow::after{content:'';position:absolute;inset:-1px;border-radius:inherit;background:linear-gradient(135deg,#10b981,#f59e0b);z-index:-1;opacity:0.15;transition:opacity .3s,filter .3s;}
.bento-glow:hover::after{opacity:0.5;filter:blur(4px);}
.bento-glow:hover{transform:translateY(-8px) scale(1.02);box-shadow:0 30px 60px -15px rgba(0,0,0,0.6);}
@keyframes bentoFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
.bento-float{animation:bentoFloat 8s ease-in-out infinite;}
.accent-line{position:absolute;top:0;right:0;width:80px;height:2px;background:linear-gradient(to left,#10b981,transparent);border-radius:0 24px 0 24px;}
.progress-glow{box-shadow:0 0 15px rgba(245,158,11,0.4);position:relative;overflow:hidden;}
.progress-glow::after{content:'';position:absolute;top:0;left:-100%;width:100%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent);animation:shim 2.5s infinite;}
@keyframes shim{0%{left:-100%}100%{left:100%}}
.noise{position:absolute;inset:0;opacity:.015;pointer-events:none;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");}
@media (max-width: 1200px) {
  .cai .f-grid { grid-template-columns: repeat(2, 1fr) !important; }
}
@media (max-width: 640px) {
  .cai .f-grid { grid-template-columns: 1fr !important; }
}
.bento-glow:hover{transform:translateY(-8px) scale(1.05);box-shadow:0 30px 60px -15px rgba(0,0,0,0.6);}
.ultra-glass{background:rgba(15,23,42,0.45);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border:1px solid rgba(255,255,255,0.08);box-shadow:0 40px 100px rgba(0,0,0,0.6),inset 0 1px 1px rgba(255,255,255,0.1);transition:all .4s cubic-bezier(.16,1,.3,1);}
.ultra-glass:hover{transform:translateY(-5px) scale(1.01);box-shadow:0 50px 120px rgba(0,0,0,0.7);}
.inner-glow{position:relative;overflow:visible;}
.inner-glow::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent);z-index:2;}
@keyframes cardFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-15px)}}
.premium-float{animation:cardFloat 8s ease-in-out infinite;}
.number-glow{background:linear-gradient(to bottom, #fff, #a7f3d0);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;filter:drop-shadow(0 0 12px rgba(16,185,129,0.3));}
.floating-glass{background:rgba(15,23,42,0.6);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.1);box-shadow:0 15px 35px rgba(0,0,0,0.4);transition:all .3s ease;}
.floating-lift:hover{transform:translateY(-8px) scale(1.05);box-shadow:0 25px 50px rgba(0,0,0,0.5);border-color:rgba(16,185,129,0.4);}
.bar-glow{filter:drop-shadow(0 0 8px currentColor);transition:height 1.2s cubic-bezier(.16,1,.3,1);}
.hero-glow-bg{position:absolute;inset:-40px;background:linear-gradient(135deg,rgba(16,185,129,0.15),rgba(245,158,11,0.1),transparent);border-radius:40px;filter:blur(40px);z-index:-1;}
`;

function useAos(from = "") {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: .08, rootMargin: "0px 0px -40px 0px" });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return [ref, `aos${from ? " " + from : ""}${v ? " v" : ""}`];
}

function A({ children, cls = "", from = "", delay = 0 }) {
  const [ref, ac] = useAos(from);
  return <div ref={ref} className={`${ac} ${cls}`} style={{ transitionDelay: `${delay}s` }}>{children}</div>;
}

const Svg = ({ d, s = 16, cls = "", sw = 2, extra = null }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }} className={cls}>
    {[].concat(d).map((p, i) => <path key={i} d={p} />)}{extra}
  </svg>
);

const Icons = {
  Arrow: p => <Svg {...p} d={["M5 12h14", "M12 5l7 7-7 7"]} />,
  Play: p => <svg width={p.s || 16} height={p.s || 16} viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>,
  Menu: p => <Svg {...p} d={["M3 12h18", "M3 6h18", "M3 18h18"]} />,
  X: p => <Svg {...p} d={["M18 6 6 18", "M6 6l12 12"]} />,
  Sun: p => <Svg {...p} d="M12 2v2m0 16v2M5 5l1.4 1.4m11.2 11.2L19 19M2 12h2m16 0h2M5 19l1.4-1.4M17.6 6.4 19 5" extra={<circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />} />,
  Moon: p => <Svg {...p} d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />,
  TrendUp: p => <Svg {...p} d={["M22 7 13.5 15.5 8.5 10.5 2 17", "M16 7h6v6"]} />,
  Bar3: p => <Svg {...p} d={["M3 3v18h18", "M18 17V9", "M13 17V5", "M8 17v-3"]} />,
  Users: p => <Svg {...p} d={["M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2", "M23 21v-2a4 4 0 0 0-3-3.87", "M16 3.13a4 4 0 0 1 0 7.75"]} extra={<circle cx="9" cy="7" r="4" fill="none" stroke="currentColor" strokeWidth="2" />} />,
  Check: p => <Svg {...p} d="M20 6 9 17l-5-5" />,
  CheckC: p => <Svg {...p} d="M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4 12 14.01l-3-3" />,
  Grid: p => <Svg {...p} d={["M3 3h7v7H3z", "M14 3h7v7h-7z", "M3 14h7v7H3z", "M14 14h7v7h-7z"]} />,
  Card: p => <Svg {...p} d={["M1 4h22v16H1z", "M1 10h22"]} />,
  Brain: p => <Svg {...p} d="M12 5a3 3 0 1 0-5.998.126 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z M12 5a3 3 0 1 1 5.998.126 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />,
  Layout: p => <Svg {...p} d={["M3 3h7v9H3z", "M14 3h7v5h-7z", "M14 12h7v9h-7z", "M3 16h7v5H3z"]} />,
  Mail: p => <Svg {...p} d={["M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z", "M22 6l-10 7L2 6"]} />,
  Spark: p => <Svg {...p} d={["M9.94 15.5A2 2 0 0 0 8.5 14.06l-6.13-1.58a.5.5 0 0 1 0-.96L8.5 9.94A2 2 0 0 0 9.94 8.5l1.58-6.13a.5.5 0 0 1 .96 0L14.06 8.5A2 2 0 0 0 15.5 9.94l6.13 1.58a.5.5 0 0 1 0 .96L15.5 14.06a2 2 0 0 0-1.44 1.44l-1.58 6.13a.5.5 0 0 1-.96 0z", "M20 3v4", "M22 5h-4", "M4 17v2", "M5 18H3"]} />,
  Bot: p => <Svg {...p} d={["M12 8V4H8", "M8 8H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1h-3"]} extra={<rect x="8" y="8" width="8" height="8" rx="1" fill="none" stroke="currentColor" strokeWidth="2" />} />,
  Alert: p => <Svg {...p} d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01" />,
  Clock: p => <Svg {...p} d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM12 6v6l4 2" />,
  Globe: p => <Svg {...p} d="M2 12a10 10 0 1 0 20 0A10 10 0 0 0 2 12zM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z" />,
  Eye: p => <Svg {...p} d={["M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"]} extra={<circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="2" />} />,
  Down: p => <Svg {...p} d={["M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", "M7 10l5 5 5-5", "M12 15V3"]} />,
  Route: p => <Svg {...p} d="M3 3h6v6H3zM15 15h6v6h-6zM18 18h-3c-1.7 0-3-1.3-3-3V6c0-1.7-1.3-3-3-3H6" />,
  Tag: p => <Svg {...p} d="M12 2H2v10l9.3 9.3c.9.9 2.5.9 3.4 0l6.6-6.6c.9-.9.9-2.5 0-3.4L12 2z" extra={<circle cx="7" cy="7" r="1.5" fill="currentColor" stroke="none" />} />,
  Rocket: p => <Svg {...p} d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09zM12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" extra={<path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />} />,
  Flame: p => <Svg {...p} d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z" />,
  Build: p => <Svg {...p} d={["M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z", "M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2", "M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2", "M10 6h4", "M10 10h4", "M10 14h4", "M10 18h4"]} />,
  Rupee: p => <Svg {...p} d={["M6 3h12", "M6 8h12", "M6 13l8.5 8", "M6 13h3a4 4 0 0 0 0-8"]} />,
  Target: p => <Svg {...p} d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zM12 6a6 6 0 1 0 0 12A6 6 0 0 0 12 6z" extra={<circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />} />,
  Zap: p => <Svg {...p} d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />,
  Receipt: p => <Svg {...p} d={["M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z", "M16 8H8", "M16 12H8", "M12 16H8"]} />,
  File: p => <Svg {...p} d={["M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z", "M14 2v6h6", "M16 13H8", "M16 17H8", "M10 9H8"]} />,
  Shield: p => <Svg {...p} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" extra={<path d="m9 12 2 2 4-4" />} />,
  Lock: p => <Svg {...p} d={["M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z", "M7 11V7a5 5 0 0 1 10 0v4"]} />,
  Cal: p => <Svg {...p} d={["M8 2v4", "M16 2v4", "M3 10h18", "M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"]} />,
  Twitter: p => <Svg {...p} d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />,
  LI: p => <Svg {...p} d={["M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z", "M2 9h4v12H2z"]} extra={<circle cx="4" cy="4" r="2" fill="none" stroke="currentColor" strokeWidth="2" />} />,
  GH: p => <Svg {...p} d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" extra={<path d="M9 18c-4.51 2-5-2-7-2" />} />,
  IG: p => <Svg {...p} d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2z" extra={<><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" /></>} />,
};

const LogoSvg = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
  </svg>
);

const BARS_L = [
  { h: "40%", bg: "#a7f3d0" }, { h: "55%", bg: "#6ee7b7" }, { h: "35%", bg: "#34d399" },
  { h: "70%", bg: "#10b981" }, { h: "60%", bg: "#059669" }, { h: "85%", bg: "#fbbf24" }, { h: "95%", bg: "#f59e0b" },
];
const BARS_D = [
  { h: "40%", bg: "#065f46" }, { h: "55%", bg: "#047857" }, { h: "35%", bg: "#059669" },
  { h: "70%", bg: "#10b981" }, { h: "60%", bg: "#34d399" }, { h: "85%", bg: "#d97706" }, { h: "95%", bg: "#f59e0b" },
];
const DAYS = ["M", "T", "W", "T", "F", "S", "S"];

export default function CollectAI() {
  const [dark, setDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobOpen, setMobOpen] = useState(false);
  const [barsGo, setBarsGo] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn); return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    if (!heroRef.current) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setTimeout(() => setBarsGo(true), 500); }, { threshold: .3 });
    obs.observe(heroRef.current); return () => obs.disconnect();
  }, []);

  const dk = dark;
  const bg = dk ? "#0f172a" : "#fff";
  const surf = dk ? "#1e293b" : "#fff";
  const surf2 = dk ? "#0f172a" : "#f8fafc";
  const text = dk ? "#f1f5f9" : "#0f172a";
  const tx2 = dk ? "#94a3b8" : "#64748b";
  const brd = dk ? "#334155" : "#e2e8f0";
  const brd2 = dk ? "#1e293b" : "#f1f5f9";
  const bars = dk ? BARS_D : BARS_L;

  const navStyle = scrolled ? {
    background: dk ? "rgba(15,23,42,.88)" : "rgba(255,255,255,.88)",
    backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
    borderBottom: `1px solid ${brd}`, boxShadow: "0 1px 20px rgba(0,0,0,.07)"
  } : {};

  const p = (p, hover) => ({
    onMouseEnter: e => Object.assign(e.currentTarget.style, hover),
    onMouseLeave: e => Object.assign(e.currentTarget.style, p),
  });

  return (
    <>
      <style>{CSS}</style>
      <div className="cai" style={{ background: bg, color: text }}>

        {/* NAV */}
        <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, transition: "all .4s", ...navStyle }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 28px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>
              <a href="#" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#059669,#10b981)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(16,185,129,.28)" }}>
                  <LogoSvg />
                </div>
                <span style={{ fontSize: 20, fontWeight: 800, color: text }}>Collect<span style={{ color: "#059669" }}>AI</span></span>
              </a>

              <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
                {["#features", "#how-it-works", "#pricing"].map((h, i) => (
                  <a key={h} href={h} style={{ fontSize: 14, fontWeight: 500, color: tx2, transition: "color .2s" }}
                    {...p({ color: tx2 }, { color: "#059669" })}>{["Features", "How It Works", "Pricing"][i]}</a>
                ))}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <a href="/login" style={{ fontSize: 14, fontWeight: 500, color: tx2 }}>Sign In</a>
                <button onClick={() => setDark(d => !d)} style={{ width: 52, height: 28, borderRadius: 14, border: `2px solid ${brd}`, background: dk ? "#1e293b" : "#e5e7eb", position: "relative", transition: "all .4s", padding: 0 }}>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", position: "absolute", top: 2, left: dk ? 26 : 2, transition: "all .45s cubic-bezier(.68,-.55,.265,1.55)", background: dk ? "#10b981" : "#f59e0b", boxShadow: dk ? "0 2px 8px rgba(16,185,129,.4)" : "0 2px 8px rgba(245,158,11,.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {dk ? <Icons.Moon s={10} cls="" style={{ color: "#fff" }} /> : <Icons.Sun s={10} cls="" style={{ color: "#1e293b" }} />}
                  </div>
                </button>
                <a href="/login" className="shim" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 22px", borderRadius: 12, background: "#059669", color: "#fff", fontSize: 13, fontWeight: 700, boxShadow: "0 4px 14px rgba(16,185,129,.28)", transition: "background .2s" }}
                  {...p({ background: "#059669" }, { background: "#047857" })}>
                  Get Started <Icons.Arrow s={15} />
                </a>
              </div>
            </div>
          </div>
        </nav>

        {/* HERO */}
        <section ref={heroRef} className={dk ? "hero-bg-d" : "hero-bg-l"} style={{ minHeight: "100vh", display: "flex", alignItems: "center", overflow: "hidden", position: "relative", paddingTop: 80 }}>
          <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
            <div className="fa" style={{ position: "absolute", top: 128, right: 80, width: 256, height: 256, background: "rgba(167,243,208,.45)", borderRadius: "50%", filter: "blur(80px)" }} />
            <div className="fb" style={{ position: "absolute", bottom: 128, left: 40, width: 320, height: 320, background: "rgba(253,230,138,.32)", borderRadius: "50%", filter: "blur(80px)" }} />
            <div className="scw" style={{ position: "absolute", top: "24%", right: "24%", width: 160, height: 160, border: "2px solid rgba(167,243,208,.32)", rotate: "45deg" }} />
            <div className="scc" style={{ position: "absolute", bottom: "32%", left: "32%", width: 96, height: 96, border: "2px solid rgba(253,230,138,.32)", rotate: "12deg" }} />
            <div style={{ position: "absolute", inset: 0, opacity: .03, backgroundImage: "radial-gradient(#059669 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
          </div>

          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "64px 28px", position: "relative", width: "100%" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "center" }}>

              {/* LEFT */}
              <div>
                <A>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 18px", borderRadius: 100, background: dk ? "rgba(16,185,129,.08)" : "rgba(236,253,245,1)", border: `1px solid ${dk ? "rgba(16,185,129,.18)" : "#a7f3d0"}`, marginBottom: 28 }}>
                    <div className="pd" style={{ width: 7, height: 7, borderRadius: "50%", background: "#10b981" }} />
                    <span style={{ fontSize: 13, fontWeight: 500, color: dk ? "#34d399" : "#059669" }}>Smart Revenue Intelligence Platform</span>
                  </div>
                </A>
                <A delay={.1}>
                  <h1 style={{ fontSize: "clamp(64px,7.5vw,118px)", fontWeight: 900, lineHeight: .93, letterSpacing: "-2px", marginBottom: 28 }}>
                    <span style={{ color: text }}>Collect</span><br />
                    <span className="gt">AI</span>
                  </h1>
                </A>
                <A delay={.2}>
                  <p style={{ fontSize: 17, color: tx2, maxWidth: 480, lineHeight: 1.78, marginBottom: 40, fontWeight: 400 }}>
                    The elite command center for automated client management and revenue recovery. Scale your business with autonomous AI agents.
                  </p>
                </A>
                <A delay={.3}>
                  <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 44 }}>
                    <a href="/login" className="shim" style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "15px 34px", borderRadius: 16, background: "#059669", color: "#fff", fontWeight: 800, fontSize: 15, boxShadow: "0 8px 24px rgba(16,185,129,.32)", transition: "all .25s" }}
                      {...p({ background: "#059669", transform: "translateY(0)" }, { background: "#047857", transform: "translateY(-2px)" })}>
                      Get Early Access <Icons.Arrow s={18} />
                    </a>
                    <a href="/demo" style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "15px 34px", borderRadius: 16, background: surf, color: text, fontWeight: 700, fontSize: 15, border: `2px solid ${brd}`, transition: "all .25s" }}
                      {...p({ borderColor: brd, color: text }, { borderColor: "#10b981", color: "#059669" })}>
                      <div style={{ width: 34, height: 34, borderRadius: 8, background: dk ? "rgba(16,185,129,.08)" : "#ecfdf5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Icons.Play s={14} />
                      </div>
                      View Demo
                    </a>
                  </div>
                </A>
                <A delay={.4}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ display: "flex" }}>
                      {[["linear-gradient(135deg,#34d399,#059669)", "JK"], ["linear-gradient(135deg,#fbbf24,#d97706)", "MR"], ["linear-gradient(135deg,#2dd4bf,#0d9488)", "AS"], ["linear-gradient(135deg,#6ee7b7,#10b981)", "+99"]].map(([g, l], i) => (
                        <div key={i} style={{ width: 40, height: 40, borderRadius: 10, background: g, marginLeft: i ? -10 : 0, border: `3px solid ${surf}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "#fff" }}>{l}</div>
                      ))}
                    </div>
                    <span style={{ fontSize: 13 }}>
                      <b style={{ color: text }}>100+ teams</b>
                      <span style={{ color: tx2 }}> trust us daily</span>
                    </span>
                  </div>
                </A>
              </div>

              {/* RIGHT – dashboard */}
              <A from="fr" delay={.15}>
                <div style={{ position: "relative" }}>
                  <div className="hero-glow-bg" />
                  <div className={`ultra-glass inner-glow premium-float`} style={{
                    borderRadius: 28, padding: "34px 34px 28px",
                    width: "100%", maxWidth: 540
                  }}>
                    {/* header */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
                      <div>
                        <p style={{ fontSize: 11, fontWeight: 800, color: "#10b981", textTransform: "uppercase", letterSpacing: "1.8px", marginBottom: 8 }}>REVENUE THIS MONTH</p>
                        <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
                          <span className="number-glow" style={{ fontSize: 42, fontWeight: 900, letterSpacing: "-1.5px" }}>2,48,500</span>
                          <span style={{
                            display: "inline-flex", alignItems: "center", gap: 5, padding: "5px 12px",
                            borderRadius: 100, background: dk ? "rgba(16,185,129,0.15)" : "#ecfdf5",
                            color: "#10b981", fontSize: 13, fontWeight: 800, boxShadow: "0 0 15px rgba(16,185,129,0.2)"
                          }}>
                            <Icons.TrendUp s={12} /> +14%
                          </span>
                        </div>
                      </div>
                      <div className="fi" style={{
                        width: 56, height: 56, borderRadius: 16,
                        background: "linear-gradient(135deg,#059669,#10b981)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        boxShadow: "0 10px 25px rgba(16,185,129,0.4)"
                      }}>
                        <Icons.Bar3 s={26} cls="" style={{ color: "#fff" }} />
                      </div>
                    </div>

                    {/* bars */}
                    <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 160, marginBottom: 28, padding: "0 4px" }}>
                      {bars.map((b, i) => (
                        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 10, height: "100%", justifyContent: "flex-end" }}>
                          <div className={`bar${barsGo ? " go" : ""} bar-glow`} style={{
                            "--h": b.h, background: `linear-gradient(to top, ${b.bg}, ${i > 4 ? "#f59e0b" : "#34d399"})`,
                            animationDelay: `${i * 0.1}s`, borderRadius: "6px 6px 4px 4px", width: "100%",
                            color: i > 4 ? "rgba(245,158,11,0.5)" : "rgba(16,185,129,0.5)"
                          }} />
                          <span style={{ fontSize: 11, color: tx2, fontWeight: 600 }}>{DAYS[i]}</span>
                        </div>
                      ))}
                    </div>

                    {/* bottom stats */}
                    <div style={{ position: "relative", zIndex: 10, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, paddingTop: 24, borderTop: `1px solid ${dk ? "rgba(255,255,255,0.06)" : "#f1f5f9"}` }}>
                      {[
                        { Ic: Icons.Users, c: "#fbbf24", bg: "linear-gradient(135deg,rgba(245,158,11,0.2),transparent)", lbl: "Active Clients", val: "1,240" },
                        { Ic: Icons.CheckC, c: "#10b981", bg: "linear-gradient(135deg,rgba(16,185,129,0.2),transparent)", lbl: "Success Rate", val: "94.2%" }
                      ].map((s, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                          <div style={{
                            width: 44, height: 44, borderRadius: 12, background: s.bg,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            border: `1px solid ${dk ? "rgba(255,255,255,0.05)" : "transparent"}`,
                            boxShadow: `0 5px 15px ${s.c}20`
                          }}>
                            <s.Ic s={20} cls="" style={{ color: s.c }} />
                          </div>
                          <div>
                            <p style={{ fontSize: 10, color: tx2, textTransform: "uppercase", letterSpacing: "1.2px", marginBottom: 3, fontWeight: 700 }}>{s.lbl}</p>
                            <p style={{ fontSize: 22, fontWeight: 900, color: text }}>{s.val}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* floating top-right */}
                  <div className="fa floating-glass floating-lift" style={{ position: "absolute", top: -35, right: -45, borderRadius: 20, padding: "18px 22px", zIndex: 2, cursor: "pointer" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <div style={{
                        width: 44, height: 44, borderRadius: 12,
                        background: "linear-gradient(135deg,#059669,#10b981)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        boxShadow: "0 8px 15px rgba(16,185,129,0.3)"
                      }}>
                        <Icons.CheckC s={22} cls="" style={{ color: "#fff" }} />
                      </div>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 800, color: text }}>Payment Received</p>
                        <p style={{ fontSize: 11, color: tx2, fontWeight: 500 }}>₹45,000 · Acme Corp</p>
                      </div>
                    </div>
                  </div>

                  {/* floating bottom-left */}
                  <div className="fb floating-glass floating-lift" style={{ position: "absolute", bottom: -35, left: -65, borderRadius: 20, padding: "18px 22px", zIndex: 2, cursor: "pointer" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <div style={{
                        width: 44, height: 44, borderRadius: 12,
                        background: "linear-gradient(135deg,#fbbf24,#f59e0b)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        boxShadow: "0 8px 15px rgba(245,158,11,0.3)"
                      }}>
                        <Icons.Bot s={22} cls="" style={{ color: "#fff" }} />
                      </div>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 800, color: text }}>AI Follow-up Sent</p>
                        <p style={{ fontSize: 11, color: tx2, fontWeight: 500 }}>TechStart Ltd · Just now</p>
                      </div>
                    </div>
                  </div>
                </div>
              </A>
            </div>
          </div>
        </section>

        {/* STATS BAR */}
        <section style={{ padding: "60px 0", background: dk ? "#020617" : "#fff", borderBottom: `1px solid ${brd}` }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 28px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
              {[
                { g: dk ? "#1e293b" : "linear-gradient(135deg,#ecfdf5,#d1fae5)", bd: dk ? brd : "#a7f3d0", Ic: Icons.Rupee, ic: "#059669", ib: dk ? "rgba(16,185,129,.1)" : "#d1fae5", v: "2L+", l: "Revenue Managed" },
                { g: dk ? "#1e293b" : "linear-gradient(135deg,#fffbeb,#fef3c7)", bd: dk ? brd : "#fde68a", Ic: Icons.Users, ic: "#d97706", ib: dk ? "rgba(245,158,11,.1)" : "#fef3c7", v: "100+", l: "Active Clients" },
                { g: dk ? "#1e293b" : "linear-gradient(135deg,#f0fdfa,#ccfbf1)", bd: dk ? brd : "#99f6e4", Ic: Icons.Target, ic: "#0d9488", ib: dk ? "rgba(20,184,166,.1)" : "#ccfbf1", v: "95%", l: "Success Rate" },
                { g: dk ? "#1e293b" : "linear-gradient(135deg,#ecfdf5,#d1fae5)", bd: dk ? brd : "#a7f3d0", Ic: Icons.Zap, ic: "#059669", ib: dk ? "rgba(16,185,129,.1)" : "#d1fae5", v: "Live", l: "AI Insights" },
              ].map((s, i) => (
                <A key={i} delay={i * .1}>
                  <div style={{ borderRadius: 20, padding: "22px 20px", background: s.g, border: `1px solid ${s.bd}`, textAlign: "center" }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: s.ib, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                      <s.Ic s={22} cls="" style={{ color: s.ic }} />
                    </div>
                    <p style={{ fontSize: 36, fontWeight: 900, color: text, letterSpacing: "-1px" }}>{s.v}</p>
                    <p style={{ fontSize: 13, color: tx2, marginTop: 4 }}>{s.l}</p>
                  </div>
                </A>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" style={{ padding: "96px 0", background: dk ? "#0f172a" : "#f8fafc" }}>
          <div style={{ width: "100%", padding: "0 20px" }}>
            <div style={{ textAlign: "center", maxWidth: 620, margin: "0 auto 68px" }}>
              <A>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 20px", borderRadius: 100, background: dk ? "rgba(16,185,129,.1)" : "#d1fae5", color: dk ? "#34d399" : "#065f46", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 18 }}>
                  <Icons.Grid s={14} /> Features
                </div>
              </A>
              <A delay={.1}><h2 style={{ fontSize: "clamp(36px,4vw,58px)", fontWeight: 900, color: text, lineHeight: 1.1, marginBottom: 16 }}>Everything you need to <span className="gta">manage clients</span></h2></A>
              <A delay={.2}><p style={{ fontSize: 16, color: tx2 }}>A complete suite of AI-powered tools to run your business smarter.</p></A>
            </div>

            {/* feature grid */}
            <div className="f-grid" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 24 }}>
              {[
                { Ic: Icons.Users, g: "#059669,#10b981", sh: "rgba(16,185,129,0.4)", title: "Client Management", desc: "View, edit and track all your client details in one place with powerful filtering.", tags: ["CRM", "Analytics"] },
                { Ic: Icons.Card, g: "#fbbf24,#f59e0b", sh: "rgba(245,158,11,0.4)", title: "Payment Tracking", desc: "Monitor invoices and payments instantly with real-time updates.", progress: 73 },
                { Ic: Icons.Brain, g: "#0d9488,#14b8a6", sh: "rgba(13,148,136,0.4)", title: "AI Insights", desc: "Smart analytics and recommendations on client activity and trends." },
                { Ic: Icons.Layout, g: "#059669,#10b981", sh: "rgba(16,185,129,0.4)", title: "Revenue Dashboard", desc: "Visual charts and KPIs for transitions and growth trends at a glance." },
                { Ic: Icons.Mail, g: "#ea580c,#f97316", sh: "rgba(234,88,12,0.4)", title: "Email Automation", desc: "AI-powered personalized follow-ups and payment reminders." },
              ].map((f, i) => (
                <A key={i} delay={i * .1}>
                  <div className={`bento-glow bento-card ${dk ? "glass-card" : "fb-top lift"}`} style={{
                    background: dk ? "rgba(15,23,42,0.6)" : surf,
                    borderRadius: 24, padding: "32px 24px",
                    border: `1px solid ${dk ? "rgba(255,255,255,0.08)" : brd}`,
                    cursor: "pointer", height: "100%", position: "relative", overflow: "hidden",
                    display: "flex", flexDirection: "column"
                  }}>
                    {dk && <div className="noise" />}
                    <div style={{ position: "relative", zIndex: 1, height: "100%", display: "flex", flexDirection: "column" }}>
                      <div className="fi" style={{
                        width: 52, height: 52, borderRadius: 16,
                        background: `linear-gradient(135deg,${f.g})`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        marginBottom: 20, boxShadow: `0 8px 20px ${f.sh}`
                      }}>
                        <f.Ic s={24} cls="" style={{ color: "#fff" }} />
                      </div>
                      <h3 style={{ fontSize: 18, fontWeight: 800, color: text, marginBottom: 12 }}>{f.title}</h3>
                      <p style={{ fontSize: 13, color: tx2, lineHeight: 1.6, marginBottom: f.tags || f.progress ? 20 : 0 }}>{f.desc}</p>

                      {f.tags && (
                        <div style={{ display: "flex", gap: 8, marginTop: "auto", flexWrap: "wrap" }}>
                          {f.tags.map(t => (
                            <span key={t} style={{ padding: "4px 10px", borderRadius: 8, background: dk ? "rgba(16,185,129,0.1)" : "#ecfdf5", color: dk ? "#34d399" : "#065f46", fontSize: 11, fontWeight: 600 }}>{t}</span>
                          ))}
                        </div>
                      )}

                      {f.progress && (
                        <div style={{ marginTop: "auto", padding: 12, background: dk ? "rgba(0,0,0,0.2)" : "#f8fafc", borderRadius: 12, border: `1px solid ${dk ? "rgba(255,255,255,0.05)" : "#f1f5f9"}` }}>
                          <div style={{ width: "100%", height: 6, borderRadius: 100, background: dk ? "rgba(255,255,255,0.05)" : "#e2e8f0", overflow: "hidden" }}>
                            <div className="progress-glow" style={{ width: `${f.progress}%`, height: "100%", background: "linear-gradient(90deg,#fbbf24,#f59e0b)" }} />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </A>
              ))}
            </div>
          </div>
        </section>

        {/* AI SECTION */}
        <section style={{ padding: "96px 0", background: "#020617", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
            <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "linear-gradient(135deg,rgba(16,185,129,.07),transparent,rgba(245,158,11,.07))" }} />
            <div style={{ position: "absolute", top: 40, left: 40, width: 288, height: 288, background: "rgba(16,185,129,.07)", borderRadius: "50%", filter: "blur(60px)" }} />
            <div style={{ position: "absolute", bottom: 40, right: 40, width: 384, height: 384, background: "rgba(245,158,11,.06)", borderRadius: "50%", filter: "blur(60px)" }} />
            <div style={{ position: "absolute", inset: 0, opacity: .025, backgroundImage: "radial-gradient(#fff 1px,transparent 1px)", backgroundSize: "24px 24px" }} />
          </div>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 28px", position: "relative" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 60, flexWrap: "wrap", gap: 24 }}>
              <A>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 18px", borderRadius: 100, background: "rgba(16,185,129,.07)", border: "1px solid rgba(16,185,129,.18)", marginBottom: 18 }}>
                  <Icons.Spark s={14} cls="" style={{ color: "#34d399" }} /> <span style={{ fontSize: 13, fontWeight: 600, color: "#6ee7b7" }}>Powered by AI</span>
                </div>
                <h2 style={{ fontSize: "clamp(36px,5vw,62px)", fontWeight: 900, color: "#f1f5f9", lineHeight: 1.1 }}>Let AI Do<br /><span style={{ color: "#34d399" }}>The Thinking</span></h2>
              </A>
              <A delay={.2}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "12px 22px", borderRadius: 16, background: "rgba(30,41,59,.6)", border: "1px solid rgba(51,65,85,.8)" }}>
                  <div style={{ display: "flex", gap: 5 }}>
                    {[["#34d399", 0], ["#fbbf24", .5], ["#2dd4bf", 1]].map(([c, d]) => (
                      <div key={d} className="pd" style={{ width: 8, height: 8, borderRadius: "50%", background: c, animationDelay: `${d}s` }} />
                    ))}
                  </div>
                  <span style={{ fontSize: 13, color: "#94a3b8" }}>Processing 12 actions</span>
                </div>
              </A>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "start" }}>
              <A>
                <p style={{ fontSize: 16, color: "#94a3b8", marginBottom: 40, lineHeight: 1.82 }}>
                  CollectAI's built-in intelligence engine continuously analyzes your client data, payment patterns, and business metrics — turning raw numbers into actionable insights automatically.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                  {[
                    { n: "01", c: "rgba(16,185,129,.14)", tc: "#34d399", title: "Auto-generate follow-up emails", sub: "Personalized emails crafted by AI based on client behavior patterns", d: .2 },
                    { n: "02", c: "rgba(245,158,11,.14)", tc: "#fbbf24", title: "Predict client behavior", sub: "AI models predict payment likelihood and response times", d: .3 },
                    { n: "03", c: "rgba(20,184,166,.14)", tc: "#2dd4bf", title: "Revenue insights instantly", sub: "Real-time dashboards surface trends and anomalies automatically", d: .4 },
                    { n: "04", c: "rgba(16,185,129,.14)", tc: "#34d399", title: "Smart reminders that convert", sub: "AI-optimized timing and messaging for maximum payment rates", d: .5 },
                  ].map(item => (
                    <A key={item.n} delay={item.d}>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                        <div style={{ flexShrink: 0, width: 40, height: 40, borderRadius: 12, background: item.c, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: item.tc }}>{item.n}</div>
                        <div>
                          <h4 style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", marginBottom: 4 }}>{item.title}</h4>
                          <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.65 }}>{item.sub}</p>
                        </div>
                      </div>
                    </A>
                  ))}
                </div>
              </A>

              <A from="fr" delay={.2}>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {[
                    { Ic: Icons.Alert, ibg: "rgba(239,68,68,.14)", ic: "#f87171", name: "Acme Corp", sub: "Overdue by 15 days", badge: "Overdue", bbg: "rgba(239,68,68,.14)", bc: "#f87171", botBg: "#059669", BotI: Icons.Bot, bc2: "#4ade80", msg: "AI suggests: Send urgent follow-up now — 87% success probability" },
                    { Ic: Icons.Clock, ibg: "rgba(245,158,11,.14)", ic: "#fbbf24", name: "TechStart Ltd", sub: "Due in 3 days", badge: "Reminder", bbg: "rgba(245,158,11,.14)", bc: "#fbbf24", botBg: "#d97706", BotI: Icons.Bot, bc2: "#fbbf24", msg: "AI suggests: Gentle reminder in 24 hours — 94% likelihood" },
                    { Ic: Icons.CheckC, ibg: "rgba(16,185,129,.14)", ic: "#34d399", name: "Nexus Group", sub: "Paid yesterday", badge: "Completed", bbg: "rgba(16,185,129,.14)", bc: "#34d399", botBg: "#065f46", BotI: Icons.TrendUp, bc2: "#34d399", msg: "AI insight: This client pays 2 days early on average — offer discount for annual plan" },
                  ].map((c, i) => (
                    <div key={i} style={{ background: "rgba(30,41,59,.65)", backdropFilter: "blur(20px)", borderRadius: 20, border: "1px solid rgba(51,65,85,.6)", padding: 20, cursor: "pointer", transition: "border-color .3s" }}
                      {...p({ "borderColor": "rgba(51,65,85,.6)" }, { "borderColor": "rgba(16,185,129,.4)" })}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{ width: 40, height: 40, borderRadius: 12, background: c.ibg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <c.Ic s={20} cls="" style={{ color: c.ic }} />
                          </div>
                          <div>
                            <p style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9" }}>{c.name}</p>
                            <p style={{ fontSize: 11, color: "#64748b" }}>{c.sub}</p>
                          </div>
                        </div>
                        <span style={{ padding: "4px 12px", borderRadius: 8, background: c.bbg, color: c.bc, fontSize: 11, fontWeight: 700 }}>{c.badge}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, paddingTop: 12, borderTop: "1px solid rgba(51,65,85,.5)" }}>
                        <div style={{ width: 22, height: 22, borderRadius: 6, background: c.botBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <c.BotI s={12} cls="" style={{ color: "#fff" }} />
                        </div>
                        <p style={{ fontSize: 11, color: c.bc2 }}>{c.msg}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </A>
            </div>
          </div>
        </section>

        {/* CLIENT PORTAL */}
        <section style={{ padding: "96px 0", background: dk ? "#020617" : "#fff" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 28px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
              <A from="fl">
                <div style={{ position: "relative" }}>
                  <div style={{ position: "absolute", inset: -24, background: "linear-gradient(135deg,rgba(16,185,129,.07),rgba(245,158,11,.05))", borderRadius: 28, filter: "blur(24px)" }} />
                  <div style={{ position: "relative", background: surf, borderRadius: 28, boxShadow: dk ? "0 24px 64px rgba(0,0,0,.4)" : "0 24px 64px rgba(0,0,0,.08)", border: `1px solid ${brd}`, overflow: "hidden" }}>
                    <div style={{ background: "linear-gradient(to right,#059669,#047857)", padding: "18px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(255,255,255,.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Icons.Receipt s={18} cls="" style={{ color: "#fff" }} />
                        </div>
                        <div>
                          <h4 style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Billing Portal</h4>
                          <p style={{ fontSize: 11, color: "rgba(255,255,255,.7)" }}>3 Invoices</p>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        {[0, 1, 2].map(i => <div key={i} style={{ width: 12, height: 12, borderRadius: "50%", background: "rgba(255,255,255,.28)" }} />)}
                      </div>
                    </div>
                    {[
                      { id: "INV-001", cl: "Acme Corp", dt: "Nov 15, 2024", amt: "42,000", st: "PAID", sc: "#059669", sbg: "rgba(16,185,129,.1)", ic: "#059669", ibg: "rgba(16,185,129,.1)" },
                      { id: "INV-002", cl: "TechStart Ltd", dt: "Nov 20, 2024", amt: "28,500", st: "PENDING", sc: "#d97706", sbg: "rgba(245,158,11,.1)", ic: "#d97706", ibg: "rgba(245,158,11,.1)" },
                      { id: "INV-003", cl: "Nexus Group", dt: "Nov 25, 2024", amt: "62,000", st: "OVERDUE", sc: "#ef4444", sbg: "rgba(239,68,68,.1)", ic: "#ef4444", ibg: "rgba(239,68,68,.1)" },
                    ].map((inv, i, arr) => (
                      <div key={i} className="inv" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", borderBottom: i < arr.length - 1 ? `1px solid ${brd2}` : "none", transition: "background .15s", cursor: "default" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                          <div style={{ width: 40, height: 40, borderRadius: 12, background: inv.ibg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Icons.File s={18} cls="" style={{ color: inv.ic }} />
                          </div>
                          <div>
                            <p style={{ fontSize: 13, fontWeight: 700, color: text }}>{inv.id}</p>
                            <p style={{ fontSize: 11, color: tx2 }}>{inv.cl} · {inv.dt}</p>
                          </div>
                        </div>
                        <p style={{ fontSize: 14, fontWeight: 700, color: text }}>₹{inv.amt}</p>
                        <span style={{ padding: "4px 12px", borderRadius: 8, background: inv.sbg, color: inv.sc, fontSize: 11, fontWeight: 700 }}>{inv.st}</span>
                      </div>
                    ))}
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "13px 24px", background: dk ? "rgba(0,0,0,.18)" : surf2, borderTop: `1px solid ${brd}` }}>
                      <span style={{ fontSize: 12, color: tx2 }}>Total Outstanding</span>
                      <span style={{ fontSize: 14, fontWeight: 700, color: text }}>₹90,500</span>
                    </div>
                  </div>
                </div>
              </A>

              <div>
                <A><div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 20px", borderRadius: 100, background: dk ? "rgba(245,158,11,.1)" : "#fef3c7", color: dk ? "#fbbf24" : "#92400e", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 18 }}>
                  <Icons.Globe s={14} /> Client Portal
                </div></A>
                <A delay={.1}><h2 style={{ fontSize: "clamp(36px,4vw,58px)", fontWeight: 900, color: text, lineHeight: 1.1, marginBottom: 18 }}>A portal your <span className="gt">clients love</span></h2></A>
                <A delay={.2}><p style={{ fontSize: 16, color: tx2, lineHeight: 1.8, marginBottom: 32 }}>Give every client a dedicated portal to view invoices, track payments, and download receipts — all in one beautiful interface.</p></A>
                <A delay={.3}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {[
                      { Ic: Icons.Eye, bg: dk ? "rgba(16,185,129,.1)" : "#ecfdf5", c: "#059669", title: "View Invoices", sub: "Clients see all their invoices in one clean view" },
                      { Ic: Icons.Down, bg: dk ? "rgba(245,158,11,.1)" : "#fef3c7", c: "#d97706", title: "Download Receipts", sub: "Auto-generated PDF receipts for every payment" },
                      { Ic: Icons.Card, bg: dk ? "rgba(20,184,166,.1)" : "#ccfbf1", c: "#0d9488", title: "Track Payments", sub: "Real-time payment status and history tracking" },
                    ].map((it, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "15px 18px", borderRadius: 16, background: surf2 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 12, background: it.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <it.Ic s={18} cls="" style={{ color: it.c }} />
                        </div>
                        <div>
                          <h4 style={{ fontSize: 14, fontWeight: 700, color: text }}>{it.title}</h4>
                          <p style={{ fontSize: 12, color: tx2 }}>{it.sub}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </A>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" style={{ padding: "96px 0", background: dk ? "#0f172a" : "#f8fafc" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 28px" }}>
            <div style={{ textAlign: "center", maxWidth: 580, margin: "0 auto 68px" }}>
              <A><div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 20px", borderRadius: 100, background: dk ? "rgba(245,158,11,.1)" : "#fef3c7", color: dk ? "#fbbf24" : "#92400e", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 18 }}>
                <Icons.Route s={14} /> How It Works
              </div></A>
              <A delay={.1}><h2 style={{ fontSize: "clamp(36px,4vw,58px)", fontWeight: 900, color: text, lineHeight: 1.1 }}>Up and running in <span className="gta">minutes</span></h2></A>
            </div>
            <div style={{ maxWidth: 820, margin: "0 auto", position: "relative" }}>
              <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", top: 0, bottom: 0, width: 2, background: "linear-gradient(to bottom,#10b981,#f59e0b,#14b8a6)" }} />
              {[
                { n: "Step 1", col: "#10b981", sh: "rgba(16,185,129,.28)", bb: "#d1fae5", bc: "#065f46", title: "Add Clients", desc: "Sign up, add your profile, and invite client contacts directly or import in bulk via CSV.", left: true },
                { n: "Step 2", col: "#f59e0b", sh: "rgba(245,158,11,.28)", bb: "#fef3c7", bc: "#78350f", title: "Track Payments", desc: "Create invoices, monitor payment status, and get notified as revenue comes in automatically.", left: false },
                { n: "Step 3", col: "#14b8a6", sh: "rgba(20,184,166,.28)", bb: "#ccfbf1", bc: "#134e4a", title: "AI Insights", desc: "Let AI analyze your data and recommend actionable improvements on revenue and client engagement.", left: true },
                { n: "Step 4", col: "#059669", sh: "rgba(5,150,105,.28)", bb: "#d1fae5", bc: "#065f46", title: "Grow Revenue", desc: "Act on insights, streamline follow-ups, and watch your collection rate and revenue grow.", left: false },
              ].map((s, i) => (
                <A key={i} delay={i * .12}>
                  <div style={{ display: "flex", marginBottom: i < 3 ? 60 : 0, position: "relative", alignItems: "center" }}>
                    {s.left ? (<>
                      <div style={{ flex: "0 0 50%", paddingRight: 56 }}>
                        <div style={{ background: surf, borderRadius: 20, padding: "26px 30px", border: `1px solid ${brd}` }}>
                          <div style={{ display: "inline-flex", padding: "4px 14px", borderRadius: 100, background: s.bb, color: s.bc, fontSize: 11, fontWeight: 700, marginBottom: 12 }}>{s.n}</div>
                          <h3 style={{ fontSize: 19, fontWeight: 800, color: text, marginBottom: 8 }}>{s.title}</h3>
                          <p style={{ fontSize: 13, color: tx2, lineHeight: 1.75 }}>{s.desc}</p>
                        </div>
                      </div>
                      <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", width: 28, height: 28, borderRadius: "50%", background: s.col, border: `4px solid ${dk ? "#0f172a" : "#f8fafc"}`, zIndex: 2, boxShadow: `0 0 0 4px ${s.sh}` }} />
                      <div style={{ flex: "0 0 50%" }} />
                    </>) : (<>
                      <div style={{ flex: "0 0 50%" }} />
                      <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", width: 28, height: 28, borderRadius: "50%", background: s.col, border: `4px solid ${dk ? "#0f172a" : "#f8fafc"}`, zIndex: 2, boxShadow: `0 0 0 4px ${s.sh}` }} />
                      <div style={{ flex: "0 0 50%", paddingLeft: 56 }}>
                        <div style={{ background: surf, borderRadius: 20, padding: "26px 30px", border: `1px solid ${brd}` }}>
                          <div style={{ display: "inline-flex", padding: "4px 14px", borderRadius: 100, background: s.bb, color: s.bc, fontSize: 11, fontWeight: 700, marginBottom: 12 }}>{s.n}</div>
                          <h3 style={{ fontSize: 19, fontWeight: 800, color: text, marginBottom: 8 }}>{s.title}</h3>
                          <p style={{ fontSize: 13, color: tx2, lineHeight: 1.75 }}>{s.desc}</p>
                        </div>
                      </div>
                    </>)}
                  </div>
                </A>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" style={{ padding: "96px 0", background: dk ? "#020617" : "#fff" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 28px" }}>
            <div style={{ textAlign: "center", maxWidth: 580, margin: "0 auto 68px" }}>
              <A><div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 20px", borderRadius: 100, background: dk ? "rgba(16,185,129,.1)" : "#d1fae5", color: dk ? "#34d399" : "#065f46", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 18 }}>
                <Icons.Tag s={14} /> Pricing
              </div></A>
              <A delay={.1}><h2 style={{ fontSize: "clamp(36px,4vw,58px)", fontWeight: 900, color: text, lineHeight: 1.1, marginBottom: 14 }}>Simple, <span className="gt">transparent</span> pricing</h2></A>
              <A delay={.2}><p style={{ fontSize: 16, color: tx2 }}>No hidden fees. Cancel anytime.</p></A>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18, maxWidth: 960, margin: "0 auto" }}>
              {[
                {
                  tier: "Starter", Ic: Icons.Rocket, price: "Free", sub: "For small businesses and freelancers", popular: false,
                  bb: "#f1f5f9", bc: "#475569", topG: "#e2e8f0,#cbd5e1",
                  feats: ["Up to 10 clients", "Basic payment tracking", "Standard invoicing", "Email support"],
                  fib: "rgba(16,185,129,.08)", fic: "#059669", cta: "Get Started Free", ctaBg: "#f1f5f9", ctaC: "#374151"
                },
                {
                  tier: "Growth", Ic: Icons.Flame, price: "₹999/mo", sub: "For growing businesses that need AI power", popular: true,
                  feats: ["Unlimited clients", "AI insights & analytics", "Priority email automation", "Client portal", "Priority support"],
                  cta: "Start Free Trial"
                },
                {
                  tier: "Enterprise", Ic: Icons.Build, price: "Custom", sub: "For large organizations that need more", popular: false,
                  bb: "#fef3c7", bc: "#92400e", topG: "#fcd34d,#fbbf24",
                  feats: ["Everything in Growth", "Dedicated account manager", "Custom integrations", "SLA guarantee", "On-premise option"],
                  fib: "rgba(245,158,11,.08)", fic: "#d97706", cta: "Contact Sales", ctaBg: "#0f172a", ctaC: "#fff"
                },
              ].map((p2, i) => (
                <A key={i} delay={i * .1}>
                  {p2.popular ? (
                    <div style={{ borderRadius: 24, padding: 30, background: "linear-gradient(160deg,#059669,#065f46)", color: "#fff", position: "relative", overflow: "hidden", height: "100%", display: "flex", flexDirection: "column" }}>
                      <div style={{ position: "absolute", inset: 0, opacity: .04, backgroundImage: "radial-gradient(#fff 1px,transparent 1px)", backgroundSize: "16px 16px" }} />
                      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(to right,#fbbf24,#f59e0b)" }} />
                      <div style={{ position: "relative", flex: 1, display: "flex", flexDirection: "column" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 8, background: "rgba(255,255,255,.2)", fontSize: 12, fontWeight: 700 }}>
                            <Icons.Flame s={13} /> Growth
                          </div>
                          <span style={{ padding: "4px 12px", borderRadius: 100, background: "#f59e0b", color: "#1c1917", fontSize: 11, fontWeight: 700 }}>Most Popular</span>
                        </div>
                        <div style={{ marginBottom: 6 }}>
                          <span style={{ fontSize: 46, fontWeight: 900 }}>₹999</span>
                          <span style={{ fontSize: 14, color: "rgba(255,255,255,.6)" }}>/month</span>
                        </div>
                        <p style={{ fontSize: 13, color: "rgba(255,255,255,.6)", marginBottom: 26 }}>For growing businesses that need AI power</p>
                        <ul style={{ display: "flex", flexDirection: "column", gap: 13, marginBottom: 28, flex: 1 }}>
                          {p2.feats.map(f => (
                            <li key={f} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "rgba(255,255,255,.85)" }}>
                              <div style={{ width: 20, height: 20, borderRadius: 6, background: "rgba(255,255,255,.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icons.Check s={12} /></div>
                              {f}
                            </li>
                          ))}
                        </ul>
                        <a href="/login" className="shim" style={{ display: "block", textAlign: "center", padding: "12px 20px", borderRadius: 14, background: "#fff", color: "#059669", fontWeight: 700, fontSize: 14, boxShadow: "0 4px 14px rgba(0,0,0,.14)" }}>Start Free Trial</a>
                      </div>
                    </div>
                  ) : (
                    <div className="lift" style={{ borderRadius: 24, padding: 30, background: surf, border: `2px solid ${brd}`, height: "100%", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
                      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(to right,${p2.topG})` }} />
                      <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 8, background: p2.bb, color: p2.bc, fontSize: 12, fontWeight: 700, width: "fit-content", marginBottom: 18 }}>
                        <p2.Ic s={13} /> {p2.tier}
                      </div>
                      <div style={{ marginBottom: 6 }}>
                        <span style={{ fontSize: 46, fontWeight: 900, color: text }}>{p2.price}</span>
                      </div>
                      <p style={{ fontSize: 13, color: tx2, marginBottom: 26 }}>{p2.sub}</p>
                      <ul style={{ display: "flex", flexDirection: "column", gap: 13, marginBottom: 28, flex: 1 }}>
                        {p2.feats.map(f => (
                          <li key={f} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: tx2 }}>
                            <div style={{ width: 20, height: 20, borderRadius: 6, background: p2.fib, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                              <Icons.Check s={12} cls="" style={{ color: p2.fic }} />
                            </div>
                            {f}
                          </li>
                        ))}
                      </ul>
                      <a href="/login" style={{ display: "block", textAlign: "center", padding: "12px 20px", borderRadius: 14, background: p2.ctaBg, color: p2.ctaC, fontWeight: 700, fontSize: 14, transition: "opacity .2s" }}
                        {...p({ opacity: 1 }, { opacity: .85 })}>{p2.cta}</a>
                    </div>
                  )}
                </A>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ padding: "96px 0", background: "linear-gradient(135deg,#065f46,#047857,#064e3b)", position: "relative", overflow: "hidden", textAlign: "center" }}>
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
            <div style={{ position: "absolute", top: 0, left: "25%", width: 384, height: 384, background: "rgba(245,158,11,.08)", borderRadius: "50%", filter: "blur(60px)" }} />
            <div style={{ position: "absolute", bottom: 0, right: "25%", width: 384, height: 384, background: "rgba(20,184,166,.08)", borderRadius: "50%", filter: "blur(60px)" }} />
            <div style={{ position: "absolute", inset: 0, opacity: .04, backgroundImage: "radial-gradient(#fff 1px,transparent 1px)", backgroundSize: "32px 32px" }} />
          </div>
          <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 28px", position: "relative" }}>
            <A><div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 20px", borderRadius: 100, background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.2)", marginBottom: 26 }}>
              <Icons.Rocket s={14} cls="" style={{ color: "#fcd34d" }} /> <span style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>Ready to get started?</span>
            </div></A>
            <A delay={.1}><h2 style={{ fontSize: "clamp(40px,6vw,76px)", fontWeight: 900, color: "#fff", lineHeight: 1.05, marginBottom: 22 }}>
              Start Managing Your Business<br /><span style={{ color: "#fcd34d" }}>Smarter Today</span>
            </h2></A>
            <A delay={.2}><p style={{ fontSize: 17, color: "rgba(255,255,255,.6)", maxWidth: 520, margin: "0 auto 44px", lineHeight: 1.8 }}>
              Join hundreds of businesses already using CollectAI to automate collections, track revenue, and grow AI-powered margins.
            </p></A>
            <A delay={.3}><div style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap", marginBottom: 36 }}>
              <a href="/login" className="shim" style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "15px 40px", borderRadius: 16, background: "#fff", color: "#047857", fontWeight: 800, fontSize: 15, boxShadow: "0 8px 24px rgba(0,0,0,.18)", transition: "transform .2s" }}
                {...p({ transform: "translateY(0)" }, { transform: "translateY(-2px)" })}>
                Start Free <Icons.Arrow s={18} />
              </a>
              <a href="/login" style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "15px 40px", borderRadius: 16, background: "rgba(255,255,255,.1)", color: "#fff", fontWeight: 700, fontSize: 15, border: "2px solid rgba(255,255,255,.25)", transition: "background .2s" }}
                {...p({ background: "rgba(255,255,255,.1)" }, { background: "rgba(255,255,255,.18)" })}>
                <Icons.Cal s={18} /> Book a Demo
              </a>
            </div></A>
            <A delay={.4}><div style={{ display: "flex", justifyContent: "center", gap: 28, flexWrap: "wrap" }}>
              {[[Icons.Shield, "No credit card required"], [Icons.Zap, "Free forever plan"], [Icons.Lock, "Cancel anytime"]].map(([Ic, t], i) => (
                <span key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "rgba(255,255,255,.55)" }}>
                  <Ic s={14} cls="" style={{ color: "#fcd34d" }} /> {t}
                </span>
              ))}
            </div></A>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ background: "#020617", paddingTop: 68, paddingBottom: 28, borderTop: "1px solid #1e293b" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 28px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr 1fr", gap: 48, marginBottom: 52 }}>
              <div>
                <a href="#" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#059669,#10b981)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(16,185,129,.28)" }}><LogoSvg /></div>
                  <span style={{ fontSize: 20, fontWeight: 800, color: "#f1f5f9" }}>Collect<span style={{ color: "#34d399" }}>AI</span></span>
                </a>
                <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.75, marginBottom: 22 }}>AI-powered client management and revenue tracking for modern businesses.</p>
                <div style={{ display: "flex", gap: 10 }}>
                  {[Icons.Twitter, Icons.LI, Icons.GH, Icons.IG].map((Ic, i) => (
                    <a key={i} href="#" style={{ width: 38, height: 38, borderRadius: 10, background: "#1e293b", display: "flex", alignItems: "center", justifyContent: "center", color: "#475569", transition: "all .2s" }}
                      {...p({ background: "#1e293b", color: "#475569" }, { background: "#334155", color: "#f1f5f9" })}>
                      <Ic s={15} />
                    </a>
                  ))}
                </div>
              </div>
              {[["Product", ["Features", "Pricing", "Integrations", "Changelog", "API Docs"]], ["Company", ["About", "Blog", "Careers", "Privacy Policy", "Terms"]], ["Contact", ["Support", "Sales", "Partnerships", "hello@collectai.in"]]].map(([title, links]) => (
                <div key={title}>
                  <h4 style={{ fontSize: 11, fontWeight: 700, color: "#f1f5f9", marginBottom: 18, textTransform: "uppercase", letterSpacing: "1.5px" }}>{title}</h4>
                  <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
                    {links.map(l => (
                      <li key={l}><a href="#" style={{ fontSize: 13, color: "#475569", transition: "color .2s" }}
                        {...p({ color: "#475569" }, { color: "#34d399" })}>{l}</a></li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 22, borderTop: "1px solid #1e293b" }}>
              <p style={{ fontSize: 12, color: "#334155" }}>© 2025 CollectAI Technologies. All rights reserved.</p>
              <div style={{ display: "flex", gap: 22 }}>
                {["Privacy", "Terms", "Cookies"].map(l => (
                  <a key={l} href="#" style={{ fontSize: 12, color: "#334155", transition: "color .2s" }}
                    {...p({ color: "#334155" }, { color: "#64748b" })}>{l}</a>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
