"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-zinc-950/80 backdrop-blur-xl border border-zinc-800/60 p-4 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.5)]">
        <p className="text-zinc-300 text-xs font-semibold mb-3 tracking-wide">{label}</p>
        <div className="flex flex-col gap-2">
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div 
                  className="w-2.5 h-2.5 rounded-full shadow-sm" 
                  style={{ backgroundColor: entry.color, boxShadow: `0 0 8px ${entry.color}` }}
                />
                <span className="text-zinc-400 font-medium capitalize">
                  {entry.name}
                </span>
              </div>
              <span className="font-bold text-white tracking-tight">{entry.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default function AdminDashboardCharts({ growthData = [], categoryData = [] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Area Chart: Platform Growth */}
      <div className="lg:col-span-2 bg-[#0a0a0c]/80 backdrop-blur-sm border border-zinc-900/80 rounded-3xl p-6 relative overflow-hidden group hover:border-zinc-800 transition-colors duration-500">
        {/* Subtle Background Glows */}
        <div className="absolute -top-32 -right-32 h-64 w-64 rounded-full bg-[#0088FF]/10 blur-[80px] transition-opacity duration-500 group-hover:bg-[#0088FF]/20" />
        <div className="absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-[#10B981]/5 blur-[80px] transition-opacity duration-500 group-hover:bg-[#10B981]/15" />
        
        <div className="mb-8 relative z-10">
          <h3 className="text-xl font-bold text-white tracking-tight">Platform Growth</h3>
          <p className="text-sm text-zinc-500 mt-1 font-medium">New users, companies, and jobs over the past 7 days</p>
        </div>
        
        <div className="h-[300px] w-full relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={growthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0088FF" stopOpacity={0.4}/>
                  <stop offset="100%" stopColor="#0088FF" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorCompanies" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity={0.3}/>
                  <stop offset="100%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorJobs" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.3}/>
                  <stop offset="100%" stopColor="#F59E0B" stopOpacity={0}/>
                </linearGradient>
                <filter id="glowUsers" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <filter id="glowCompanies" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <filter id="glowJobs" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              <CartesianGrid strokeDasharray="4 4" stroke="#27272a" vertical={false} opacity={0.4} />
              <XAxis 
                dataKey="name" 
                stroke="#71717a" 
                fontSize={12}
                fontWeight={500} 
                tickLine={false} 
                axisLine={false} 
                dy={12} 
              />
              <YAxis 
                stroke="#71717a" 
                fontSize={12} 
                fontWeight={500}
                tickLine={false} 
                axisLine={false} 
                dx={-8}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#3f3f46', strokeWidth: 1, strokeDasharray: '4 4' }} />
              <Area
                type="monotone"
                dataKey="users"
                stroke="#0088FF"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorUsers)"
                name="New Users"
                filter="url(#glowUsers)"
                activeDot={{ r: 6, fill: "#0088FF", stroke: "#fff", strokeWidth: 2, shadowColor: "#0088FF", shadowBlur: 10 }}
              />
              <Area
                type="monotone"
                dataKey="companies"
                stroke="#10B981"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorCompanies)"
                name="New Companies"
                filter="url(#glowCompanies)"
                activeDot={{ r: 6, fill: "#10B981", stroke: "#fff", strokeWidth: 2 }}
              />
              <Area
                type="monotone"
                dataKey="jobs"
                stroke="#F59E0B"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorJobs)"
                name="New Jobs"
                filter="url(#glowJobs)"
                activeDot={{ r: 6, fill: "#F59E0B", stroke: "#fff", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar Chart: Jobs by Category */}
      <div className="bg-[#0a0a0c]/80 backdrop-blur-sm border border-zinc-900/80 rounded-3xl p-6 flex flex-col relative overflow-hidden group hover:border-zinc-800 transition-colors duration-500">
        <div className="absolute -top-32 -right-32 h-64 w-64 rounded-full bg-[#F59E0B]/10 blur-[80px] transition-opacity duration-500 group-hover:bg-[#F59E0B]/20" />
        
        <div className="mb-8 relative z-10">
          <h3 className="text-xl font-bold text-white tracking-tight">Jobs by Category</h3>
          <p className="text-sm text-zinc-500 mt-1 font-medium">Distribution of platform-wide jobs</p>
        </div>
        <div className="h-[300px] w-full flex-1 relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={categoryData}
              layout="vertical"
              margin={{ top: 0, right: 10, left: -10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="4 4" stroke="#27272a" horizontal={true} vertical={false} opacity={0.4} />
              <XAxis 
                type="number" 
                stroke="#71717a" 
                fontSize={12} 
                fontWeight={500}
                tickLine={false} 
                axisLine={false} 
              />
              <YAxis 
                dataKey="name" 
                type="category" 
                stroke="#71717a" 
                fontSize={12} 
                fontWeight={500}
                tickLine={false} 
                axisLine={false} 
                width={85}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#27272a', opacity: 0.15 }} />
              <Legend 
                iconType="circle" 
                wrapperStyle={{ fontSize: '13px', color: '#a1a1aa', fontWeight: 500, paddingTop: '10px' }} 
              />
              <Bar dataKey="active" stackId="a" fill="#0088FF" radius={[0, 0, 0, 0]} name="Active" barSize={16} />
              <Bar dataKey="closed" stackId="a" fill="#3f3f46" radius={[0, 4, 4, 0]} name="Closed" barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
