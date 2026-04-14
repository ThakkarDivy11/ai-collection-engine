import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { TrendingUp, Users, CreditCard, BrainCircuit, ArrowUpRight } from 'lucide-react';

export default function FloatingDashboard() {
  // 3D Tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['10deg', '-10deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-10deg', '10deg']);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div className="relative w-full max-w-[500px] aspect-[4/3] perspective-[1000px] flex items-center justify-center p-4">
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        initial={{ y: 0 }}
        animate={{ 
          y: [-15, 15, -15],
        }}
        transition={{ 
          duration: 6, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="relative w-full h-full bg-white/5 dark:bg-slate-900/40 backdrop-blur-2xl border border-white/10 dark:border-white/10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] shadow-blue-500/10 overflow-hidden group"
      >
        {/* Glow behind card */}
        <div className="absolute inset-0 z-[-1] opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-blue-500/20 via-transparent to-pink-500/20 blur-2xl" />

        <div className="p-6 h-full flex flex-col justify-between" style={{ transform: "translateZ(50px)" }}>
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Revenue Intelligence</p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                ₹2,48,500 <span className="text-xs font-bold text-emerald-400 flex items-center"><TrendingUp size={12} className="mr-1" /> +24%</span>
              </h3>
            </div>
            <div className="p-2 bg-blue-600/10 rounded-xl border border-blue-500/20 text-blue-500">
              <BrainCircuit size={20} />
            </div>
          </div>

          {/* Main Visual: Fake AI Analysis Chart */}
          <div className="flex-1 my-6 relative overflow-hidden rounded-2xl bg-slate-900/5 dark:bg-black/20 border border-white/5 p-4">
            <div className="flex items-end gap-1.5 h-full opacity-60">
              {[40, 65, 45, 80, 55, 90, 70, 95, 60, 85, 75, 100].map((h, i) => (
                <motion.div 
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: i * 0.05, duration: 0.5 }}
                  className="flex-1 bg-gradient-to-t from-blue-600 to-indigo-400 rounded-t-sm"
                />
              ))}
            </div>
            {/* Pulsing indicator */}
            <div className="absolute top-4 right-4 flex items-center gap-2 px-2 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] font-bold text-blue-400">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
              AI ANALYZING...
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-white/5 border border-white/10 rounded-2xl">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <Users size={14} />
                <span className="text-[10px] font-bold uppercase tracking-tight">Active Clients</span>
              </div>
              <div className="text-lg font-bold text-slate-900 dark:text-white">1,240</div>
            </div>
            <div className="p-3 bg-white/5 border border-white/10 rounded-2xl">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <CreditCard size={14} />
                <span className="text-[10px] font-bold uppercase tracking-tight">Recovery Rate</span>
              </div>
              <div className="text-lg font-bold text-slate-900 dark:text-white">94.2%</div>
            </div>
          </div>
        </div>

        {/* Floating Tooltips */}
        <motion.div 
          animate={{ x: [0, 10, 0], y: [0, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-6 -right-6 p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl flex items-center gap-3 z-10"
        >
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
            <TrendingUp size={16} />
          </div>
          <div>
            <p className="text-[8px] text-slate-400 font-bold uppercase">Trending Up</p>
            <p className="text-xs font-bold text-slate-900 dark:text-white">+12% growth</p>
          </div>
        </motion.div>

        <motion.div 
          animate={{ x: [0, -8, 0], y: [0, 12, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute -bottom-4 -left-8 p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl flex items-center gap-3 z-10"
        >
          <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500">
            <Users size={16} />
          </div>
          <div>
            <p className="text-[8px] text-slate-400 font-bold uppercase">New Clients</p>
            <p className="text-xs font-bold text-slate-900 dark:text-white">+48 today</p>
          </div>
          <ArrowUpRight size={14} className="text-slate-400" />
        </motion.div>
      </motion.div>
    </div>
  );
}
