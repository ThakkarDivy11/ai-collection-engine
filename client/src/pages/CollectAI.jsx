import React, { useEffect, useRef, useState } from 'react';
import {
  Users, CreditCard, BarChart3, Mail, CheckCircle2, ArrowRight,
  TrendingUp, Bot, Sparkles, Activity, PieChart, Shield
} from 'lucide-react';
import { StarButton } from "../components/ui/StarButton";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

const CSS = `
@keyframes float-premium {
  0%, 100% { transform: translate(0, 0); }
  33% { transform: translate(10px, -15px); }
  66% { transform: translate(-10px, -10px); }
}
@keyframes float-premium-reverse {
  0%, 100% { transform: translate(0, 0); }
  33% { transform: translate(-10px, 15px); }
  66% { transform: translate(10px, 10px); }
}
@keyframes sweep {
  0% { transform: translate(-120%, -120%) rotate(45deg); }
  100% { transform: translate(120%, 120%) rotate(45deg); }
}
@keyframes scan-vertical {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
}
@keyframes shine {
  0% { transform: translateX(-200%) skewX(-15deg); }
  100% { transform: translateX(200%) skewX(-15deg); }
}
@keyframes twinkle {
  0%, 100% { opacity: 0.2; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.3); }
}
.animate-float { animation: float 6s ease-in-out infinite; }
.animate-float-slow { animation: float-slow 10s ease-in-out infinite; }
.animate-float-delayed { animation: float-delayed 8s ease-in-out infinite; animation-delay: -4s; }
.animate-float-premium { animation: float-premium 8s ease-in-out infinite; }
.animate-float-premium-delayed { animation: float-premium 8s ease-in-out infinite; animation-delay: -3s; }
.animate-sweep { animation: sweep 12s linear infinite; }
.animate-scan-vertical { animation: scan-vertical 8s linear infinite; }
.animate-shine { animation: shine 5s ease-in-out infinite; }
.animate-twinkle { animation: twinkle 3s ease-in-out infinite; }
@keyframes fade-up {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-up { animation: fade-up 0.7s ease-out forwards; }
`;


const RevenueChart = () => {
  const [data, setData] = useState([
    { name: 'M', value: 42000 },
    { name: 'T', value: 38000 },
    { name: 'W', value: 54000 },
    { name: 'T', value: 48000 },
    { name: 'F', value: 62000 },
    { name: 'S', value: 58000 },
    { name: 'S', value: 74000 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => prev.map(item => ({
        ...item,
        value: Math.max(10000, item.value + (Math.random() - 0.5) * 2000)
      })));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-36">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#7c3aed" />
              <stop offset="100%" stopColor="#c026d3" />
            </linearGradient>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-black/60 backdrop-blur-xl border border-white/10 p-2 rounded-lg shadow-xl">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{payload[0].payload.name}</p>
                    <p className="text-sm font-black text-white">${payload[0].value.toLocaleString()}</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="url(#lineGradient)"
            strokeWidth={4}
            fill="url(#areaGradient)"
            isAnimationActive={true}
            animationDuration={2500}
            animationEasing="ease-out"
            filter="url(#glow)"
            activeDot={{ r: 6, fill: '#fff', stroke: '#8b5cf6', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
      <div className="flex justify-between px-2 mt-2">
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(d => (
          <span key={d} className="text-[10px] text-slate-500 font-medium">{d}</span>
        ))}
      </div>
    </div>
  );
};

function AnimatedBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width, height;
    let blobs = [];
    let animationId;

    const init = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;

      blobs = [];
      const colors = [260, 270, 240];
      for (let i = 0; i < 4; i++) {
        blobs.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: width * 0.4,
          dx: (Math.random() - 0.5) * 0.25,
          dy: (Math.random() - 0.5) * 0.25,
          hue: colors[Math.floor(Math.random() * colors.length)]
        });
      }
    };
    init();
    window.addEventListener('resize', init);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      blobs.forEach(b => {
        b.x += b.dx;
        b.y += b.dy;
        if (b.x < 0 || b.x > width) b.dx *= -1;
        if (b.y < 0 || b.y > height) b.dy *= -1;

        const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        grad.addColorStop(0, `hsla(${b.hue}, 80%, 50%, 0.15)`);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
      });
      animationId = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      window.removeEventListener('resize', init);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[-10] bg-[#020617]">
      {/* Layer 2: Animated Gradient Blobs */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <div className="absolute inset-0 bg-black/60 pointer-events-none" />
      {/* Layer 4: Global Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.07)_1.5px,transparent_1.5px),linear-gradient(to_bottom,rgba(255,255,255,0.07)_1.5px,transparent_1.5px)] bg-[size:60px_60px] pointer-events-none"></div>
      {/* Layer 5: Light Sweep Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[200%] h-[150px] bg-gradient-to-r from-transparent via-purple-500/10 to-transparent blur-[120px] animate-sweep mix-blend-screen" />
      </div>
      {/* Layer 6: Vertical Light Scan */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-full h-[150px] bg-gradient-to-b from-transparent via-purple-500/15 to-transparent blur-[100px] animate-scan-vertical mix-blend-screen" />
      </div>
    </div>
  );
}

export default function CollectAI() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <div className="min-h-screen text-slate-100 font-sans selection:bg-purple-500/30 overflow-x-hidden">
      <style>{CSS}</style>
      <AnimatedBackground />

      {/* NAVBAR */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-slate-900/80 backdrop-blur-xl border-b border-white/10 py-4 shadow-xl' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <span className="text-white font-bold text-xl leading-none">C</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">Collect<span className="text-purple-500">AI</span></span>
          </div>
          <div className="hidden md:flex gap-8 items-center">
            {['Features', 'AI Benefits', 'Process', 'Pricing'].map(t => (
              <a key={t} href={`#${t.toLowerCase().replace(' ', '-')}`} className="text-sm font-medium text-slate-300 hover:text-white transition-colors">{t}</a>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <a href="/login" className="text-slate-300 hover:text-white font-medium transition-colors">Log in</a>
            <StarButton href="/signup" text="Sign up" className="px-6 py-2.5" />
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative min-h-[100vh] flex items-center pt-20 pb-20 overflow-hidden">
        {/* Layer 3: Glow lighting behind hero section */}
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative w-full flex flex-col md:flex-row items-center gap-16">

          {/* HERO LEFT */}
          <div className="w-full md:w-1/2 flex flex-col items-start pt-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-8 backdrop-blur-md">
              <Sparkles size={14} className="text-purple-400" />
              <span className="text-xs font-semibold text-purple-400 tracking-wide uppercase">Next-Gen AI Platform</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-[1.05] text-white mb-6">
              Client Management, <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-violet-500 to-indigo-400">Reimagined</span>
            </h1>
            <p className="text-lg lg:text-xl text-slate-400/90 font-medium leading-relaxed max-w-lg mb-10">
              Organize, track, and grow your client relationships — all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <StarButton text="Get Started" className="px-8 py-4 text-lg">
                Get Started <ArrowRight size={20} />
              </StarButton>
              <StarButton text="Learn More" className="px-8 py-4 text-lg bg-slate-900/50" />
            </div>
          </div>

          {/* HERO RIGHT / UI */}
          <div className="w-full md:w-1/2 relative h-[500px]">
            {/* Layer 3: Glow lighting specifically behind dashboard */}
            <div className="absolute top-1/2 right-10 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[130px] pointer-events-none animate-pulse"></div>

            {/* Main Glass Dashboard */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-full max-w-lg rounded-xl bg-white/5 backdrop-blur-md border border-white/10 p-6 shadow-xl hover:scale-[1.02] transition-transform duration-500 animate-float">
              <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
                <div>
                  <p className="text-xs font-bold tracking-widest text-purple-400 uppercase mb-1">Total Revenue</p>
                  <div className="flex items-end gap-3">
                    <span className="text-4xl font-bold text-white">$45,200</span>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-purple-400 bg-purple-500/10 px-2 py-1 rounded-md">
                      <TrendingUp size={12} /> +12.5%
                    </span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/5 flex items-center justify-center shadow-inner">
                  <BarChart3 size={20} className="text-purple-400" />
                </div>
              </div>

              {/* Chart UI Replacement: Animated Recharts AreaChart */}
              <div className="mb-4">
                <RevenueChart />
              </div>

              {/* Active Users row */}
              <div className="flex justify-between items-center bg-slate-800/40 rounded-xl p-4 border border-white/5 mt-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <Users size={16} className="text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Active Clients</p>
                    <p className="text-xs text-slate-400">Tracked across region</p>
                  </div>
                </div>
                <span className="text-lg font-bold text-white">1,240</span>
              </div>
            </div>

          </div>

          {/* Floating UI Elements Replacement Area */}
          <div className="hidden lg:block">
            {/* Top-Left Card: AI Agent */}
            <div className="absolute left-[45%] top-[88%] z-20 group">
              {/* Behind-card Glow */}
              <div className="absolute inset-0 bg-purple-600/20 blur-[60px] rounded-full scale-150 pointer-events-none"></div>

              <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex items-center gap-4 shadow-[0_0_40px_rgba(139,98,246,0.2)] hover:scale-105 transition-all duration-300 animate-float-premium">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Bot size={18} className="text-blue-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">AI Agent Deployed</p>
                  <p className="text-[10px] text-slate-400">Automating 45 actions</p>
                </div>
              </div>
            </div>

            {/* Mid-Right Card: Payment Received */}
            <div className="absolute right-[-3%] top-[2%] z-20 group">
              {/* Behind-card Glow */}
              <div className="absolute inset-0 bg-violet-600/20 blur-[80px] rounded-full scale-150 pointer-events-none"></div>

              <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex items-center gap-4 shadow-[0_0_40px_rgba(139,92,246,0.2)] hover:scale-105 transition-all duration-300 animate-float-premium-delayed">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <CheckCircle2 size={18} className="text-purple-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Payment Received</p>
                  <p className="text-[10px] text-slate-400">$2,400 via Stripe</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="py-20 relative z-10 border-y border-white/5 bg-slate-950/20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Revenue Managed', val: '$2M+' },
              { label: 'Active Clients', val: '10k+' },
              { label: 'Recovery Rate', val: '98%' },
              { label: 'Time Saved', val: '15h/wk' }
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center justify-center text-center p-6 rounded-2xl bg-gradient-to-b from-white/5 to-transparent border border-white/5">
                <span className="text-4xl lg:text-5xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-500 mb-2">{s.val}</span>
                <span className="text-sm font-bold tracking-widest text-purple-400 uppercase">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Everything you need</h2>
            <p className="text-lg text-slate-400/90 font-medium">Streamline your entire operation with powerful tools designed to automate, collect, and optimize revenue.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Users, t: "Client Directory", d: "Manage all your clients from a unified dashboard with rich details." },
              { icon: CreditCard, t: "Automated Billing", d: "Send recurring invoices automatically without manual effort." },
              { icon: Activity, t: "Real-time Tracking", d: "Monitor payment statuses and cash flow immediately." },
              { icon: Mail, t: "Smart Follow-ups", d: "AI-driven email reminders that optimize payment collection." },
              { icon: Shield, t: "Secure Data", d: "Enterprise-grade encryption for all your sensitive client info." },
              { icon: PieChart, t: "Deep Analytics", d: "Visualize data trends and forecast your next month's revenue." }
            ].map((f, i) => (
              <div key={i} className="group p-8 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 hover:scale-105 transition-all duration-300">
                <div className="w-14 h-14 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <f.icon size={26} className="text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{f.t}</h3>
                <p className="text-slate-400 leading-relaxed">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI BENEFITS SECTION */}
      <section id="ai-benefits" className="py-24 relative z-10 bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row items-center gap-16">
          <div className="w-full md:w-1/2">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
              <Bot size={14} className="text-blue-400" />
              <span className="text-xs font-semibold text-blue-400 tracking-wide uppercase">AI Powered Engine</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
              Let AI do the <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">heavy lifting.</span>
            </h2>
            <p className="text-lg text-slate-400 mb-8">
              Our advanced machine learning models predict client behavior, automate reminders, and generate actionable insights so you never have to guess.
            </p>
            <ul className="space-y-4">
              {[
                "Predictive payment probability scoring",
                "Automated personalized outreach campaigns",
                "Smart anomaly detection for failed payments",
                "Conversational AI for billing support"
              ].map((line, i) => (
                <li key={i} className="flex items-center gap-4 text-slate-300">
                  <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 size={12} className="text-purple-400" />
                  </div>
                  {line}
                </li>
              ))}
            </ul>
          </div>
          <div className="w-full md:w-1/2 relative h-[400px]">
            {/* Floating AI Cards */}
            <div className="absolute right-0 top-10 w-80 bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 animate-float">
              <div className="flex justify-between items-center mb-4">
                <p className="text-xs font-bold text-slate-400">Insight Generated</p>
                <Sparkles size={14} className="text-indigo-400" />
              </div>
              <p className="text-white font-medium">"Acme Corp has a 92% likelihood of paying late this month. Recommend offering a 2% early-pay discount."</p>
              <StarButton text="Apply Strategy" className="mt-4 py-2 w-full text-xs font-bold bg-indigo-500/10 hover:bg-indigo-500/20" />
            </div>

            <div className="absolute left-0 bottom-10 w-72 bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 animate-float-delayed">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Mail size={16} className="text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Drafted Email</p>
                  <p className="text-xs text-slate-400">Gentle Reminder</p>
                </div>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full mb-2"></div>
              <div className="h-2 w-3/4 bg-slate-800 rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Automation Section */}
      <section id="process" className="py-32 relative z-10 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/5 rounded-full blur-[150px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto mb-20 relative animate-fade-up">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 uppercase tracking-tight">Automation in Action</h2>
            <p className="text-lg text-slate-400/90 font-medium mb-16">Witness the power of intelligent client management.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {[
              { icon: Sparkles, title: 'Connect', desc: 'Secure data bridge.' },
              { icon: Activity, title: 'Analyze', desc: 'AI pattern discovery.' },
              { icon: Bot, title: 'Automate', desc: 'Smart trigger engine.' },
              { icon: TrendingUp, title: 'Scale', desc: 'Exponential growth.' }
            ].map((step, i) => (
              <div
                key={i}
                className="group p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl hover:bg-purple-500/10 hover:border-purple-500/30 transition-all duration-500 animate-fade-up opacity-0"
                style={{ animationDelay: `${i * 150}ms`, animationFillMode: 'forwards' }}
              >
                <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400 mb-8 mx-auto group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <step.icon size={32} strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors uppercase tracking-tight">{step.title}</h3>
                <p className="text-slate-400 text-lg group-hover:text-slate-300 transition-colors leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Pricing Section */}
      <section id="pricing" className="py-32 relative z-10 border-y border-white/5">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-purple-500/5 rounded-full blur-[160px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto mb-20 animate-fade-up">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 uppercase tracking-tight">Start Free. Scale Fast.</h2>
            <p className="text-lg text-slate-400">No hidden fees. Upgrade when you’re ready.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Starter Plan */}
            <div className="group p-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl hover:scale-[1.03] hover:bg-white/10 transition-all duration-500 flex flex-col items-center text-center">
              <h3 className="text-xl font-bold text-slate-400 mb-2 uppercase tracking-widest">Starter</h3>
              <div className="text-5xl font-black text-white mb-6">$0<span className="text-lg text-slate-500 font-medium">/mo</span></div>
              <ul className="space-y-4 mb-10 text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-purple-400" /> Basic collection tools</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-purple-400" /> Standard dashboard</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-purple-400" /> Community support</li>
              </ul>
              <div className="mt-auto w-full">
                <StarButton text="Get Started" className="w-full py-4 text-lg" />
              </div>
            </div>

            {/* Pro Plan */}
            <div className="group p-10 bg-purple-600/10 backdrop-blur-xl border-2 border-purple-500/30 rounded-3xl hover:scale-[1.03] hover:bg-purple-600/20 transition-all duration-500 flex flex-col items-center text-center relative shadow-[0_0_40px_rgba(139,92,246,0.15)] hover:shadow-[0_0_60px_rgba(139,92,246,0.25)]">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-purple-600 text-white text-xs font-black rounded-full uppercase tracking-tighter shadow-lg">Most Popular</div>
              <h3 className="text-xl font-bold text-purple-300 mb-2 uppercase tracking-widest">Pro</h3>
              <div className="text-5xl font-black text-white mb-6">$49<span className="text-lg text-slate-500 font-medium">/mo</span></div>
              <ul className="space-y-4 mb-10 text-slate-200 font-medium">
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-purple-400" /> AI-driven automation</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-purple-400" /> Smart follow-ups</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-purple-400" /> Priority 24/7 support</li>
              </ul>
              <div className="mt-auto w-full">
                <StarButton text="Go Professional" className="w-full py-4 text-lg bg-purple-600 hover:bg-purple-500" />
              </div>
            </div>

            {/* Growth Plan */}
            <div className="group p-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl hover:scale-[1.03] hover:bg-white/10 transition-all duration-500 flex flex-col items-center text-center">
              <h3 className="text-xl font-bold text-slate-400 mb-2 uppercase tracking-widest">Growth</h3>
              <div className="text-5xl font-black text-white mb-6">$99<span className="text-lg text-slate-500 font-medium">/mo</span></div>
              <ul className="space-y-4 mb-10 text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-purple-400" /> Enterprise scaling</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-purple-400" /> Full API access</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-purple-400" /> Dedicated manager</li>
              </ul>
              <div className="mt-auto w-full">
                <StarButton text="Contact Sales" className="w-full py-4 text-lg" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-32 relative z-10 text-center overflow-hidden">
        <div className="absolute inset-0 bg-purple-500/5 backdrop-blur-md"></div>
        <div className="max-w-3xl mx-auto px-6 relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">Command your revenue.</h2>
          <p className="text-xl text-slate-400/90 font-medium mb-10 text-balance">Join thousands of businesses managing collections intelligently.</p>
          <StarButton text="Start Your Free Trial" className="px-10 py-5 text-xl font-black bg-white/5 border-white/20 shadow-2xl shadow-purple-600/30" />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-white/10 bg-slate-950 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-500 flex items-center justify-center">
              <span className="text-slate-950 font-black">C</span>
            </div>
            <span className="font-bold text-white tracking-widest uppercase">CollectAI</span>
          </div>
          <div className="flex gap-8 text-sm text-slate-400 md:mr-auto md:ml-12">
            <a href="#" className="hover:text-purple-400 transition-colors">Twitter</a>
            <a href="#" className="hover:text-purple-400 transition-colors">GitHub</a>
            <a href="#" className="hover:text-purple-400 transition-colors">Discord</a>
          </div>
          <p className="text-sm text-slate-500">&copy; 2026 CollectAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
