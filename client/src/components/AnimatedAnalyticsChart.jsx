import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const AnimatedAnalyticsChart = ({ data = [] }) => {
  const chartRef = useRef(null);
  const [hoveredBar, setHoveredBar] = useState(null);
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, data: null });

  // Sample data if none provided
  const chartData = data.length > 0 ? data : [
    { name: 'Jan', revenue: 45000, clients: 120 },
    { name: 'Feb', revenue: 52000, clients: 145 },
    { name: 'Mar', revenue: 48000, clients: 132 },
    { name: 'Apr', revenue: 61000, clients: 168 },
    { name: 'May', revenue: 55000, clients: 155 },
    { name: 'Jun', revenue: 67000, clients: 189 },
    { name: 'Jul', revenue: 72000, clients: 210 },
    { name: 'Aug', revenue: 68000, clients: 195 },
  ];

  const maxValue = Math.max(...chartData.map(d => d.revenue));

  useEffect(() => {
    if (!chartRef.current) return;

    // Animate bars from bottom to top
    gsap.from('.chart-bar', {
      scaleY: 0,
      transformOrigin: 'bottom',
      stagger: 0.08,
      duration: 1.2,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: chartRef.current,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    });

    // Animate line drawing
    gsap.from('.chart-line', {
      strokeDashoffset: 2000,
      duration: 2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: chartRef.current,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    });

    // Animate dots with pulse effect
    gsap.from('.chart-dot', {
      scale: 0,
      opacity: 0,
      stagger: 0.1,
      duration: 0.8,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: chartRef.current,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    });

    // Continuous pulse animation for dots
    gsap.to('.chart-dot', {
      scale: 1.2,
      opacity: 0.8,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
      stagger: {
        each: 0.2,
        from: 'center'
      }
    });

    // Animate grid lines
    gsap.from('.grid-line', {
      opacity: 0,
      x: -20,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: chartRef.current,
        start: 'top 80%',
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      gsap.killTweensOf('.chart-bar');
      gsap.killTweensOf('.chart-line');
      gsap.killTweensOf('.chart-dot');
      gsap.killTweensOf('.grid-line');
    };
  }, []);

  const handleBarHover = (index, event, data) => {
    setHoveredBar(index);
    setTooltip({
      visible: true,
      x: event.clientX,
      y: event.clientY - 80,
      data: data
    });

    // Scale up the hovered bar
    gsap.to(event.currentTarget, {
      scaleY: 1.08,
      duration: 0.3,
      ease: 'power2.out'
    });
  };

  const handleBarLeave = (event) => {
    setHoveredBar(null);
    setTooltip({ visible: false, x: 0, y: 0, data: null });

    // Reset bar scale
    gsap.to(event.currentTarget, {
      scaleY: 1,
      duration: 0.3,
      ease: 'power2.out'
    });
  };

  // Generate smooth curve path for line chart
  const generateSmoothPath = () => {
    const width = 600;
    const height = 250;
    const padding = 40;
    const barWidth = (width - padding * 2) / chartData.length;

    const points = chartData.map((d, i) => {
      const x = padding + i * barWidth + barWidth / 2;
      const y = height - padding - (d.revenue / maxValue) * (height - padding * 2);
      return { x, y };
    });

    // Create smooth bezier curve
    let path = `M ${points[0].x} ${points[0].y}`;

    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cpX = (p0.x + p1.x) / 2;
      path += ` C ${cpX} ${p0.y}, ${cpX} ${p1.y}, ${p1.x} ${p1.y}`;
    }

    return path;
  };

  const smoothPath = generateSmoothPath();

  return (
    <div ref={chartRef} className="chart-section relative w-full h-full">
      {/* Tooltip */}
      {tooltip.visible && (
        <div
          className="fixed z-50 bg-slate-900/95 dark:bg-white/95 backdrop-blur-xl border border-slate-700/50 dark:border-white/20 rounded-xl px-4 py-3 shadow-2xl pointer-events-none transition-all duration-200"
          style={{
            left: tooltip.x - 60,
            top: tooltip.y,
            transform: 'translateY(-10px)'
          }}
        >
          <div className="text-xs font-semibold text-slate-400 dark:text-slate-600 mb-1">{tooltip.data?.name}</div>
          <div className="text-lg font-bold text-white dark:text-slate-900">₹{(tooltip.data?.revenue || 0).toLocaleString()}</div>
          <div className="text-xs text-slate-400 dark:text-slate-600">{tooltip.data?.clients} clients</div>
        </div>
      )}

      <svg viewBox="0 0 600 250" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          {/* Blue gradient for left bars */}
          <linearGradient id="blueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.6" />
          </linearGradient>

          {/* Green gradient for right bars */}
          <linearGradient id="greenGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#059669" stopOpacity="0.6" />
          </linearGradient>

          {/* Glow filter */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Line gradient */}
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="50%" stopColor="#0891b2" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[...Array(5)].map((_, i) => (
          <line
            key={`grid-${i}`}
            className="grid-line"
            x1="40"
            y1={40 + i * 50}
            x2="560"
            y2={40 + i * 50}
            stroke="currentColor"
            strokeWidth="1"
            strokeOpacity="0.1"
            className="text-slate-400 dark:text-slate-600"
          />
        ))}

        {/* Bars */}
        {chartData.map((d, i) => {
          const height = (d.revenue / maxValue) * 170;
          const x = 50 + i * 70;
          const y = 210 - height;
          const isLeft = i < chartData.length / 2;

          return (
            <g key={`bar-${i}`}>
              <rect
                className="chart-bar cursor-pointer"
                x={x}
                y={y}
                width={40}
                height={height}
                rx={6}
                fill={isLeft ? 'url(#blueGradient)' : 'url(#greenGradient)'}
                filter={hoveredBar === i ? 'url(#glow)' : 'none'}
                onMouseEnter={(e) => handleBarHover(i, e, d)}
                onMouseLeave={handleBarLeave}
                style={{
                  transformOrigin: 'bottom',
                  transition: 'filter 0.3s ease'
                }}
              />

              {/* Bar label */}
              <text
                x={x + 20}
                y={230}
                textAnchor="middle"
                className="text-xs font-semibold fill-slate-500 dark:fill-slate-400"
              >
                {d.name}
              </text>
            </g>
          );
        })}

        {/* Smooth line overlay */}
        <path
          className="chart-line"
          d={smoothPath}
          fill="none"
          stroke="url(#lineGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#glow)"
          style={{
            strokeDasharray: '2000',
            strokeDashoffset: '0'
          }}
        />

        {/* Data points on line */}
        {chartData.map((d, i) => {
          const x = 50 + i * 70 + 20;
          const y = 210 - (d.revenue / maxValue) * 170;

          return (
            <g key={`dot-${i}`}>
              {/* Outer glow ring */}
              <circle
                className="chart-dot"
                cx={x}
                cy={y}
                r={8}
                fill="none"
                stroke="#06b6d4"
                strokeWidth="2"
                opacity="0.3"
              />

              {/* Inner dot */}
              <circle
                className="chart-dot"
                cx={x}
                cy={y}
                r={4}
                fill="#06b6d4"
                filter="url(#glow)"
              />
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 flex gap-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-b from-blue-500 to-blue-700" />
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Revenue</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-b from-green-500 to-green-700" />
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Growth</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-cyan-500" />
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Trend</span>
        </div>
      </div>
    </div>
  );
};

export default AnimatedAnalyticsChart;