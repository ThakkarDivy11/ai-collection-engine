import React from 'react';
import {
  ComposedChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

const AnimatedAnalyticsChart = ({ data = [] }) => {
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

  return (
    <div className="w-full h-full relative font-sans">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2d84ca" stopOpacity={0.5}/>
              <stop offset="95%" stopColor="#2d84ca" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="opacity-10 text-slate-300 dark:text-slate-800" />
          <XAxis 
            dataKey="name" 
            stroke="#64748b" 
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12 }}
            dy={10}
          />
          <YAxis 
            yAxisId="left"
            stroke="#64748b" 
            tickFormatter={(value) => `₹${value >= 1000 ? (value / 1000).toFixed(0) + 'k' : value}`}
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            yAxisId="right"
            orientation="right"
            stroke="#64748b" 
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12 }}
            hide={true}
          />
          <Tooltip
            contentStyle={{ 
              backgroundColor: "rgba(15, 23, 42, 0.9)", 
              border: "1px solid rgba(255,255,255,0.1)", 
              borderRadius: "16px", 
              color: "#fff",
              backdropFilter: "blur(10px)",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
            }}
            itemStyle={{ color: "#fff", fontWeight: "bold" }}
            formatter={(value, name) => [name === 'revenue' ? `₹${value.toLocaleString()}` : value, name.charAt(0).toUpperCase() + name.slice(1)]}
          />
          <Area 
            yAxisId="left"
            type="monotone" 
            dataKey="revenue" 
            stroke="#2d84ca" 
            strokeWidth={4}
            fillOpacity={1} 
            fill="url(#colorRevenue)" 
            animationDuration={1500}
            animationEasing="ease-out"
          />
          <Bar 
            yAxisId="left"
            dataKey="clients" 
            barSize={20} 
            fill="#10b981" 
            radius={[4, 4, 0, 0]}
            opacity={0.6}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnimatedAnalyticsChart;
