import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

// ─── Lucide-style inline SVG icons ────────────────────────────────────────────
const Icon = ({ d, size = 16, className = "", strokeWidth = 2, viewBox = "0 0 24 24", extra = null }) => (
  <svg width={size} height={size} viewBox={viewBox} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
    {extra}
  </svg>
);

const Icons = {
  ArrowRight: (p) => <Icon {...p} d="M5 12h14M12 5l7 7-7 7" />,
  Play:       (p) => <Icon {...p} d="" extra={<polygon points="5 3 19 12 5 21 5 3" fill="currentColor" stroke="none" />} />,
  Menu:       (p) => <Icon {...p} d={["M3 12h18","M3 6h18","M3 18h18"]} />,
  X:          (p) => <Icon {...p} d={["M18 6 6 18","M6 6l12 12"]} />,
  Sun:        (p) => <Icon {...p} d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" extra={<circle cx="12" cy="12" r="5" />} />,
  Moon:       (p) => <Icon {...p} d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />,
  TrendingUp: (p) => <Icon {...p} d="M22 7 13.5 15.5 8.5 10.5 2 17M16 7h6v6" />,
  BarChart3:  (p) => <Icon {...p} d={["M3 3v18h18","M18 17V9","M13 17V5","M8 17v-3"]} />,
  Users:      (p) => <Icon {...p} d={["M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2","M23 21v-2a4 4 0 0 0-3-3.87","M16 3.13a4 4 0 0 1 0 7.75"]} extra={<circle cx="9" cy="7" r="4" />} />,
  CheckCircle:(p) => <Icon {...p} d="M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4 12 14.01l-3-3" />,
  Check:      (p) => <Icon {...p} d="M20 6 9 17l-5-5" />,
  Grid3x3:    (p) => <Icon {...p} d={["M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z"]} />,
  CreditCard: (p) => <Icon {...p} d={["M1 4h22v16H1z","M1 10h22"]} />,
  Brain:      (p) => <Icon {...p} d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />,
  LayoutDash: (p) => <Icon {...p} d={["M3 3h7v9H3zM14 3h7v5h-7zM14 12h7v9h-7zM3 16h7v5H3z"]} />,
  Mail:       (p) => <Icon {...p} d={["M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z","M22 6l-10 7L2 6"]} />,
  Sparkles:   (p) => <Icon {...p} d={["M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z","M20 3v4","M22 5h-4","M4 17v2","M5 18H3"]} />,
  Bot:        (p) => <Icon {...p} d={["M12 8V4H8","M8 8H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1h-3"]} extra={<><rect x="8" y="8" width="8" height="8" rx="1"/><circle cx="10" cy="12" r="1" fill="currentColor"/><circle cx="14" cy="12" r="1" fill="currentColor"/></>} />,
  AlertTri:   (p) => <Icon {...p} d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01" />,
  Clock:      (p) => <Icon {...p} d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zM12 6v6l4 2" />,
  Globe:      (p) => <Icon {...p} d="M2 12a10 10 0 1 0 20 0A10 10 0 0 0 2 12zM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z" />,
  Eye:        (p) => <Icon {...p} d={["M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"]} extra={<circle cx="12" cy="12" r="3" />} />,
  Download:   (p) => <Icon {...p} d={["M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4","M7 10l5 5 5-5","M12 15V3"]} />,
  Route:      (p) => <Icon {...p} d="M3 3h6v6H3zM15 15h6v6h-6zM18 18h-3c-1.7 0-3-1.3-3-3V6c0-1.7-1.3-3-3-3H6" />,
  Tag:        (p) => <Icon {...p} d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2z" extra={<circle cx="7" cy="7" r="1.5" fill="currentColor" />} />,
  Rocket:     (p) => <Icon {...p} d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09zM12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" extra={<path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />} />,
  Flame:      (p) => <Icon {...p} d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />,
  Building2:  (p) => <Icon {...p} d={["M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z","M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2","M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2","M10 6h4","M10 10h4","M10 14h4","M10 18h4"]} />,
  IndianRupee:(p) => <Icon {...p} d={["M6 3h12","M6 8h12","M6 13l8.5 8","M6 13h3a4 4 0 0 0 0-8"]} />,
  Target:     (p) => <Icon {...p} d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zM12 6a6 6 0 1 0 0 12A6 6 0 0 0 12 6zM12 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />,
  Zap:        (p) => <Icon {...p} d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />,
  Receipt:    (p) => <Icon {...p} d={["M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z","M16 8H8","M16 12H8","M12 16H8"]} />,
  FileText:   (p) => <Icon {...p} d={["M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z","M14 2v6h6","M16 13H8","M16 17H8","M10 9H8"]} />,
  ShieldCheck:(p) => <Icon {...p} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" extra={<path d="m9 12 2 2 4-4" />} />,
  Lock:       (p) => <Icon {...p} d={["M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z"]} extra={<path d="M7 11V7a5 5 0 0 1 10 0v4" />} />,
  Calendar:   (p) => <Icon {...p} d={["M8 2v4","M16 2v4","M3 10h18","M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"]} />,
  Twitter:    (p) => <Icon {...p} d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />,
  Linkedin:   (p) => <Icon {...p} d={["M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z","M2 9h4v12H2z"]} extra={<circle cx="4" cy="4" r="2" />} />,
  Github:     (p) => <Icon {...p} d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" extra={<path d="M9 18c-4.51 2-5-2-7-2" />} />,
  Instagram:  (p) => <Icon {...p} d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2z" extra={<><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/></>} />,
};

// ─── Scroll animation hook ─────────────────────────────────────────────────────
function useScrollAnim() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function Anim({ children, className = "", delay = 0, from = "up", style = {} }) {
  const [ref, vis] = useScrollAnim();
  const base = { opacity: 0, transition: `all 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}s`, ...style };
  const hidden = from === "left" ? { transform: "translateX(-50px)" } : from === "right" ? { transform: "translateX(50px)" } : { transform: "translateY(40px)" };
  const shown  = { opacity: 1, transform: "none" };
  return <div ref={ref} className={className} style={{ ...base, ...(vis ? shown : hidden) }}>{children}</div>;
}

// ─── Data ──────────────────────────────────────────────────────────────────────
const FEATURES = [
  { icon: Icons.Users,      grad: "from-emerald-500 to-emerald-600", shadow: "shadow-emerald-600/25", title: "Client Management", desc: "View, edit and track all your client details in one place. Organize by status, revenue, and client info with powerful filtering.", tags: ["CRM","Segmentation","Analytics"], span: "md:col-span-2 lg:col-span-2", large: true },
  { icon: Icons.CreditCard, grad: "from-amber-400 to-amber-500",     shadow: "shadow-amber-500/25",   title: "Payment Tracking",  desc: "Monitor invoices, follow-ups, and payments instantly with real-time updates.", accent: true },
  { icon: Icons.Brain,      grad: "from-teal-500 to-teal-600",       shadow: "shadow-teal-600/25",    title: "AI Insights",       desc: "Smart analytics and AI-generated recommendations on client activity and revenue trends." },
  { icon: Icons.LayoutDash, grad: "from-emerald-500 to-emerald-600", shadow: "shadow-emerald-600/25", title: "Revenue Dashboard", desc: "Visual charts and KPIs for revenue, transactions, and growth trends at a glance." },
  { icon: Icons.Mail,       grad: "from-orange-500 to-orange-600",   shadow: "shadow-orange-600/25",  title: "Email Automation",  desc: "AI-powered personalized follow-ups, payment reminders, and capture messages." },
];

const AI_CARDS = [
  { icon: Icons.AlertTri, bg: "bg-red-500/15", ic: "text-red-400",   name: "Acme Corp",    sub: "Overdue by 15 days",  badge: "Overdue",   badgeBg: "bg-red-500/15 text-red-400",    botBg: "bg-emerald-600",   botText: "text-emerald-400",  msg: "AI suggests: Send urgent follow-up now - 87% success probability" },
  { icon: Icons.Clock,    bg: "bg-amber-500/15",ic: "text-amber-400", name: "TechStart Ltd",sub: "Due in 3 days",        badge: "Reminder",  badgeBg: "bg-amber-500/15 text-amber-400", botBg: "bg-amber-600",     botText: "text-amber-400",    msg: "AI suggests: Gentle reminder in 24 hours - 94% likelihood" },
  { icon: Icons.CheckCircle, bg: "bg-emerald-500/15", ic: "text-emerald-400", name: "Nexus Group", sub: "Paid yesterday", badge: "Completed", badgeBg: "bg-emerald-500/15 text-emerald-400", botBg: "bg-emerald-600", botText: "text-emerald-400", msg: "AI insight: This client pays 2 days early on average - offer discount for annual plan", botIcon: Icons.TrendingUp },
];

const STEPS = [
  { step: "Step 1", color: "bg-emerald-500", shadow: "shadow-emerald-500/30", badge: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300", title: "Add Clients",      desc: "Sign up, add your profile, and invite client contacts directly or import in bulk via CSV.", left: true },
  { step: "Step 2", color: "bg-amber-500",   shadow: "shadow-amber-500/30",   badge: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300",         title: "Track Payments",  desc: "Create invoices, monitor payment status, and get notified as revenue comes in automatically.", left: false },
  { step: "Step 3", color: "bg-teal-500",    shadow: "shadow-teal-500/30",    badge: "bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300",             title: "AI Insights",     desc: "Let AI analyze your data and recommend actionable improvements on revenue and client engagement.", left: true },
  { step: "Step 4", color: "bg-emerald-500", shadow: "shadow-emerald-500/30", badge: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300", title: "Grow Revenue",    desc: "Act on insights, streamline follow-ups, and watch your collection rate and revenue grow.", left: false },
];

const INVOICES = [
  { id: "INV-001", client: "Acme Corp - Nov 15, 2024",    amount: "42,000", status: "PAID",    statusCls: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300", iconCls: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400" },
  { id: "INV-002", client: "TechStart Ltd - Nov 20, 2024",amount: "28,500", status: "PENDING", statusCls: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300",         iconCls: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400" },
  { id: "INV-003", client: "Nexus Group - Nov 25, 2024",  amount: "62,000", status: "OVERDUE", statusCls: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300",                 iconCls: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400" },
];

const BARS = [
  { h: "40%",  bg: "bg-emerald-100 dark:bg-emerald-900/50", day: "M" },
  { h: "55%",  bg: "bg-emerald-200 dark:bg-emerald-800/50", day: "T" },
  { h: "35%",  bg: "bg-emerald-300 dark:bg-emerald-700/50", day: "W" },
  { h: "70%",  bg: "bg-emerald-400 dark:bg-emerald-600/50", day: "T" },
  { h: "60%",  bg: "bg-emerald-500 dark:bg-emerald-500/50", day: "F" },
  { h: "85%",  bg: "bg-amber-400 dark:bg-amber-500",        day: "S" },
  { h: "95%",  bg: "bg-amber-500 dark:bg-amber-400",        day: "S" },
];

const PRICING = [
  {
    tier: "Starter", icon: Icons.Rocket, price: "Free", sub: "For small businesses and freelancers",
    features: ["Up to 10 clients","Basic payment tracking","Standard invoicing","Email support"],
    cta: "Get Started Free", ctaCls: "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600",
    badgeCls: "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300",
    checkCls: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
    border: "border-2 border-slate-200 dark:border-slate-700", topBar: "from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-700",
  },
  {
    tier: "Growth", icon: Icons.Flame, price: "₹999", priceSub: "/month", sub: "For growing businesses that need AI power",
    features: ["Unlimited clients","AI insights & analytics","Priority email automation","Client portal","Priority support"],
    cta: "Start Free Trial", ctaCls: "bg-white text-emerald-700 hover:bg-emerald-50 shadow-lg",
    popular: true,
  },
  {
    tier: "Enterprise", icon: Icons.Building2, price: "Custom", sub: "For large organizations that need more",
    features: ["Everything in Growth","Dedicated account manager","Custom integrations","SLA guarantee","On-premise option"],
    cta: "Contact Sales", ctaCls: "bg-slate-900 dark:bg-slate-700 text-white hover:bg-slate-800 dark:hover:bg-slate-600",
    badgeCls: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300",
    checkCls: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",
    border: "border-2 border-slate-200 dark:border-slate-700", topBar: "from-amber-300 to-amber-400 dark:from-amber-600 dark:to-amber-500",
  },
];

// ─── Styles ─────────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
  .cai-root { font-family: 'Inter', sans-serif; overflow-x: hidden; }
  .cai-root * { box-sizing: border-box; }
  .gradient-text { background: linear-gradient(135deg, #059669, #10b981, #f59e0b); background-size: 200% 200%; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; animation: cai-gradient 8s ease infinite; }
  .gradient-text-amber { background: linear-gradient(135deg, #f59e0b, #d97706, #059669); background-size: 200% 200%; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; animation: cai-gradient 8s ease infinite; }
  @keyframes cai-gradient { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
  @keyframes cai-float  { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-20px)} }
  @keyframes cai-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.7)} }
  @keyframes cai-bar { from{height:0} to{height:var(--bh)} }
  .cai-float   { animation: cai-float 6s ease-in-out infinite; }
  .cai-float-2 { animation: cai-float 6s ease-in-out -3s infinite; }
  .pulse-dot { animation: cai-pulse 2s infinite; }
  .shimmer-btn { position: relative; overflow: hidden; }
  .shimmer-btn::after { content:''; position:absolute;top:0;left:-100%;width:100%;height:100%; background:linear-gradient(90deg,transparent,rgba(255,255,255,.2),transparent); transition:left .5s; }
  .shimmer-btn:hover::after { left:100%; }
  .hover-lift { transition: transform .3s ease, box-shadow .3s ease; }
  .hover-lift:hover { transform: translateY(-6px); box-shadow: 0 25px 50px rgba(0,0,0,.1); }
  .nav-blur { backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); }
  .hero-bg-light { background: linear-gradient(160deg, #ecfdf5 0%, #ffffff 40%, #fffbeb 100%); }
  .hero-bg-dark  { background: linear-gradient(160deg, #064e3b 0%, #0f172a 40%, #78350f 100%); }
  .angled-section { clip-path: polygon(0 8%, 100% 0, 100% 100%, 0 100%); }
  .mobile-menu { transform: translateX(100%); transition: transform .3s ease; width:80%; max-width:360px; }
  .mobile-menu.open { transform: translateX(0); }
  .bar-enter { height: 0; }
  .bar-enter.animated { animation: cai-bar 1.2s cubic-bezier(0.16,1,0.3,1) forwards; }
  .feat-icon { transition: transform .3s; }
  .feature-card-hover:hover .feat-icon { transform: scale(1.1) rotate(3deg); }
`;

// ─── Main Component ────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [dark, setDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [barsTriggered, setBarsTriggered] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!heroRef.current) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setTimeout(() => setBarsTriggered(true), 500); }, { threshold: 0.3 });
    obs.observe(heroRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <style>{css}</style>
      <div className={`cai-root ${dark ? "dark" : ""} bg-white dark:bg-slate-950 text-slate-900 dark:text-white`}>

        {/* ── NAV ────────────────────────────────────────────────────────────── */}
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-white/80 dark:bg-slate-950/80 nav-blur shadow-sm border-b border-slate-100 dark:border-slate-800" : ""}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 lg:h-20">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="w-9 h-9 bg-gradient-to-br from-emerald-600 to-emerald-500 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 shadow-lg shadow-emerald-600/25">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
                  </svg>
                </div>
                <span className="text-xl font-bold text-slate-900 dark:text-white">Collect<span className="text-emerald-600 dark:text-emerald-400">AI</span></span>
              </Link>

              <div className="hidden lg:flex items-center gap-8">
                {["#features","#how-it-works","#pricing"].map((href, i) => (
                  <a key={href} href={href} className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                    {["Features","How It Works","Pricing"][i]}
                  </a>
                ))}
              </div>

              <div className="hidden lg:flex items-center gap-4">
                <Link to="/login" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Sign In</Link>
                <button onClick={() => setDark(d => !d)}
                  className={`w-[52px] h-7 rounded-2xl relative cursor-pointer transition-all duration-500 border-2 flex items-center ${dark ? "bg-slate-800 border-slate-600" : "bg-slate-200 border-slate-300"}`}>
                  <div className={`w-5 h-5 rounded-full absolute top-[1px] transition-all duration-500 flex items-center justify-center ${dark ? "left-[26px] bg-emerald-500" : "left-[1px] bg-amber-400"}`}>
                    {dark ? <Icons.Moon size={10} className="text-white" /> : <Icons.Sun size={10} className="text-slate-900" />}
                  </div>
                </button>
                <Link to="/login" className="shimmer-btn inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition-all duration-300">
                  Get Started <Icons.ArrowRight size={16} />
                </Link>
              </div>

              <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 text-slate-600 dark:text-slate-400"><Icons.Menu size={24} /></button>
            </div>
          </div>

          <div className={`mobile-menu fixed top-0 right-0 h-full bg-white dark:bg-slate-900 shadow-2xl z-50 lg:hidden ${mobileOpen ? "open" : ""}`}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-8">
                <span className="text-lg font-bold text-slate-900 dark:text-white">Menu</span>
                <button onClick={() => setMobileOpen(false)} className="p-2 text-slate-400"><Icons.X size={24} /></button>
              </div>
              <div className="flex flex-col gap-6">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="text-lg font-medium text-slate-900 dark:text-white">Sign In</Link>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-emerald-600 text-white font-semibold rounded-xl">
                  Get Started <Icons.ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* ── HERO ───────────────────────────────────────────────────────────── */}
        <section ref={heroRef} className={`relative min-h-screen flex items-center overflow-hidden ${dark ? "hero-bg-dark" : "hero-bg-light"}`}>
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04]" style={{ backgroundImage: "radial-gradient(#059669 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
            <div className="grid lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 text-center lg:text-left">
                <Anim className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 rounded-2xl mb-8">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full pulse-dot" />
                  <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Smart Revenue Intelligence</span>
                </Anim>
                <Anim delay={0.1}>
                  <h1 className="text-5xl lg:text-8xl font-black leading-none mb-8">Collect<br /><span className="gradient-text">AI</span></h1>
                </Anim>
                <Anim delay={0.2}>
                  <p className="text-lg text-slate-500 dark:text-slate-400 mb-10 leading-relaxed max-w-lg mx-auto lg:mx-0">
                    The elite command center for automated client management and revenue recovery. Scale your business with autonomous AI agents.
                  </p>
                </Anim>
                <Anim delay={0.3} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link to="/login" className="shimmer-btn px-10 py-4 bg-emerald-600 text-white font-bold rounded-2xl shadow-xl">Get Early Access</Link>
                  <Link to="/dashboard" className="px-10 py-4 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-2xl border-2 border-slate-200">View Demo</Link>
                </Anim>
              </div>

              <Anim className="lg:col-span-5" from="right" delay={0.2}>
                <div className="relative bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-6 lg:p-8 border border-slate-100 dark:border-slate-700">
                  <p className="text-xs font-semibold text-emerald-600 uppercase mb-4">REVENUE THIS MONTH</p>
                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-3xl font-black text-slate-900 dark:text-white">2,48,500</span>
                    <span className="text-emerald-600 text-xs font-bold">+14%</span>
                  </div>
                  <div className="flex items-end gap-3 h-32">
                    {BARS.map((b, i) => (
                      <div key={i} className={`flex-1 rounded-t-xl ${b.bg} ${barsTriggered ? "bar-enter animated" : "bar-enter"}`} style={{ "--bh": b.h, animationDelay: `${i * 0.08}s` }} />
                    ))}
                  </div>
                </div>
              </Anim>
            </div>
          </div>
        </section>

        {/* ── FEATURES ───────────────────────────────────────────────────────── */}
        <section id="features" className="py-24 bg-slate-50 dark:bg-slate-900">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black mb-6">Everything you need</h2>
              <p className="text-slate-500">AI-powered tools to run your business smarter.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {FEATURES.map((f, i) => (
                <div key={i} className="p-8 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 hover-lift">
                  <div className={`w-14 h-14 bg-gradient-to-br ${f.grad} rounded-2xl flex items-center justify-center mb-6`}>
                    <f.icon size={28} className="text-white" />
                  </div>
                  <h3 className="font-bold text-xl mb-3">{f.title}</h3>
                  <p className="text-sm text-slate-500">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ────────────────────────────────────────────────────────────── */}
        <section className="py-24 bg-emerald-900 text-center text-white">
          <h2 className="text-4xl font-black mb-8">Ready to grow?</h2>
          <Link to="/login" className="px-10 py-4 bg-white text-emerald-900 font-bold rounded-2xl">Start Free Now</Link>
        </section>

        <footer className="py-12 bg-slate-950 text-slate-600 text-center border-t border-slate-800">
          <p>© 2026 CollectAI. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
}
