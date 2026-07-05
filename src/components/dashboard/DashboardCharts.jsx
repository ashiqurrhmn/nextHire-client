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
      <div className="bg-[#0a0a0c] border border-zinc-800 p-3 rounded-xl shadow-xl">
        <p className="text-zinc-300 text-xs font-semibold mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center justify-between gap-4 text-xs mt-1">
            <span className="text-zinc-500 font-medium">
              {entry.name}
            </span>
            <span className="font-bold text-white" style={{ color: entry.color }}>{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function DashboardCharts({ areaData = [], barData = [] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Area Chart: Applications Over Time */}
      <div className="lg:col-span-2 bg-[#0a0a0c] border border-zinc-900 rounded-2xl p-6 relative overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-[#0088FF]/10 blur-3xl" />
        
        <div className="mb-6 relative z-10">
          <h3 className="text-lg font-bold text-white">Engagement Overview</h3>
          <p className="text-sm text-zinc-500">Applications and listing views over the past 7 days</p>
        </div>
        <div className="h-[280px] w-full relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={areaData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0088FF" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#0088FF" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis dataKey="name" stroke="#52525b" fontSize={11} tickLine={false} axisLine={false} dy={10} />
              <YAxis stroke="#52525b" fontSize={11} tickLine={false} axisLine={false} dx={-10} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="views" name="Profile Views" stroke="#10B981" fillOpacity={1} fill="url(#colorViews)" />
              <Area type="monotone" dataKey="applications" name="Applications" stroke="#0088FF" strokeWidth={2} fillOpacity={1} fill="url(#colorApps)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar Chart: Jobs by Department */}
      <div className="bg-[#0a0a0c] border border-zinc-900 rounded-2xl p-6 relative overflow-hidden">
        <div className="mb-6 relative z-10">
          <h3 className="text-lg font-bold text-white">Jobs by Category</h3>
          <p className="text-sm text-zinc-500">Active vs closed job listings</p>
        </div>
        <div className="h-[280px] w-full relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis dataKey="name" stroke="#52525b" fontSize={11} tickLine={false} axisLine={false} dy={10} />
              <YAxis stroke="#52525b" fontSize={11} tickLine={false} axisLine={false} dx={-10} />
              <Tooltip content={<CustomTooltip />} cursor={{fill: '#27272a', opacity: 0.3}} />
              <Legend wrapperStyle={{ fontSize: '11px', color: '#a1a1aa', paddingTop: '10px' }} iconType="circle" />
              <Bar dataKey="active" name="Active" fill="#0088FF" radius={[4, 4, 0, 0]} barSize={16} />
              <Bar dataKey="closed" name="Closed" fill="#3f3f46" radius={[4, 4, 0, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
