"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { getApplications } from "@/lib/api/applications";
import { getSavedJobs } from "@/lib/api/saved-jobs";
import { Briefcase, Bookmark, Clock, Sparkles } from "@gravity-ui/icons";
import { Skeleton } from "@heroui/react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";

export default function SeekerDashboardPage() {
  const { data: session } = useSession();
  const user = session?.user;
  const userName = user?.name || "Job Seeker";

  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (user?.id) {
        try {
          const [appsRes, savedRes] = await Promise.all([
            getApplications(user.id),
            getSavedJobs(user.id)
          ]);
          if (Array.isArray(appsRes)) setApplications(appsRes);
          if (Array.isArray(savedRes)) setSavedJobs(savedRes);
        } catch (error) {
          console.error("Error fetching dashboard data:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [user?.id]);

  // We use the same deterministic mock UI statuses used in ApplicationsClient
  const STATUS_KEYS = ["Applied", "Review", "Shortlisted", "Rejected", "Offered"];
  const enrichedApps = [...applications].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((app, index) => {
    const mockStatus = STATUS_KEYS[index % STATUS_KEYS.length];
    return { ...app, uiStatus: mockStatus };
  });

  const totalApplied = enrichedApps.length;
  const totalSaved = savedJobs.length;
  const interviewsCount = enrichedApps.filter(a => a.uiStatus === 'Review' || a.uiStatus === 'Offered').length;
  const successRate = totalApplied > 0 
    ? Math.round((enrichedApps.filter(a => a.uiStatus === 'Offered').length / totalApplied) * 100) 
    : 0;

  const recentApps = enrichedApps.slice(0, 5);

  const chartData = useMemo(() => {
    const data = [];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const now = new Date();
    
    // Get last 6 months
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = months[d.getMonth()];
      
      const appsInMonth = applications.filter(app => {
        const appDate = new Date(app.createdAt || Date.now());
        return appDate.getMonth() === d.getMonth() && appDate.getFullYear() === d.getFullYear();
      }).length;
      
      const savedInMonth = savedJobs.filter(job => {
        const jobDate = new Date(job.createdAt || Date.now());
        return jobDate.getMonth() === d.getMonth() && jobDate.getFullYear() === d.getFullYear();
      }).length;
      
      data.push({
        name: monthName,
        Applications: appsInMonth,
        Saved: savedInMonth
      });
    }
    return data;
  }, [applications, savedJobs]);

  const pieData = useMemo(() => {
    const COLORS = {
      "Applied": "#a1a1aa",    // zinc-400
      "Review": "#fbbf24",     // amber-400
      "Shortlisted": "#34d399",// emerald-400
      "Rejected": "#f87171",   // red-400
      "Offered": "#0088FF"     // blue primary
    };
    
    return STATUS_KEYS.map(status => ({
      name: status,
      value: enrichedApps.filter(app => app.uiStatus === status).length,
      color: COLORS[status] || "#ffffff"
    })).filter(item => item.value > 0);
  }, [enrichedApps]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Shortlisted": return "bg-emerald-950/30 text-emerald-400 border-emerald-900/50";
      case "Applied": return "bg-zinc-900/60 text-zinc-300 border-zinc-800";
      case "Review": return "bg-amber-950/30 text-amber-450 border-amber-900/50";
      case "Rejected": return "bg-red-950/30 text-red-400 border-red-900/50";
      case "Offered": return "bg-[#0088FF]/20 text-[#0088FF] border-[#0088FF]/30";
      default: return "bg-zinc-900 text-zinc-300 border-zinc-800";
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "Unknown";
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="flex flex-col min-h-full pb-8">
      <DashboardHeader />

      <h2 className="text-3xl font-bold text-white tracking-tight mb-6">
        Welcome back, {userName}
      </h2>

      {loading ? (
        <div className="animate-pulse w-full">
          {/* Stats Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col justify-between p-5 rounded-2xl border border-zinc-900 bg-zinc-950/40 h-[120px]">
                <div className="flex items-center justify-between mb-4">
                  <Skeleton className="w-24 h-4 rounded-md bg-zinc-800" />
                  <Skeleton className="w-9 h-9 rounded-xl bg-zinc-800" />
                </div>
                <Skeleton className="w-16 h-8 rounded-md bg-zinc-800" />
              </div>
            ))}
          </div>
          
          {/* Charts Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {[1, 2].map((i) => (
              <div key={i} className="p-6 rounded-2xl border border-zinc-900 bg-zinc-950/40 h-[340px] flex flex-col">
                <Skeleton className="w-40 h-6 rounded-md bg-zinc-800 mb-6" />
                <Skeleton className="w-full flex-1 rounded-xl bg-zinc-800/50" />
              </div>
            ))}
          </div>

          {/* Table Skeleton */}
          <div className="flex flex-col lg:flex-row gap-6 items-stretch">
            <div className="flex-1 p-6 rounded-2xl border border-zinc-900 bg-zinc-950/40 flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <Skeleton className="w-48 h-6 rounded-md bg-zinc-800" />
                <Skeleton className="w-16 h-4 rounded-md bg-zinc-800" />
              </div>
              <div className="flex flex-col gap-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="w-full h-14 rounded-xl bg-zinc-800/50" />
                ))}
              </div>
            </div>
            <div className="lg:w-1/3 flex flex-col gap-6">
              <Skeleton className="w-full h-full rounded-2xl bg-zinc-800/30 min-h-[250px]" />
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            <div className="flex flex-col justify-between p-5 rounded-2xl border border-zinc-900 bg-zinc-950/40 hover:border-zinc-800 hover:bg-zinc-950/60 transition-all duration-300 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Total Applied</span>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#0088FF]/25 bg-[#0088FF]/10 text-[#0088FF]">
                  <Briefcase size={16} />
                </div>
              </div>
              <span className="text-3xl font-bold text-white tracking-tight">{totalApplied}</span>
            </div>
            <div className="flex flex-col justify-between p-5 rounded-2xl border border-zinc-900 bg-zinc-950/40 hover:border-zinc-800 hover:bg-zinc-950/60 transition-all duration-300 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Saved Jobs</span>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-purple-500/25 bg-purple-500/10 text-purple-400">
                  <Bookmark size={16} />
                </div>
              </div>
              <span className="text-3xl font-bold text-white tracking-tight">{totalSaved}</span>
            </div>
            <div className="flex flex-col justify-between p-5 rounded-2xl border border-zinc-900 bg-zinc-950/40 hover:border-zinc-800 hover:bg-zinc-950/60 transition-all duration-300 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Interviews</span>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-amber-500/25 bg-amber-500/10 text-amber-500">
                  <Clock size={16} />
                </div>
              </div>
              <span className="text-3xl font-bold text-amber-500 tracking-tight">{interviewsCount}</span>
            </div>
            <div className="flex flex-col justify-between p-5 rounded-2xl border border-zinc-900 bg-zinc-950/40 hover:border-zinc-800 hover:bg-zinc-950/60 transition-all duration-300 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Success Rate</span>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/25 bg-emerald-500/10 text-emerald-500">
                  <Sparkles size={16} />
                </div>
              </div>
              <span className="text-3xl font-bold text-emerald-500 tracking-tight">{successRate}%</span>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Graph Card */}
            <div className="p-6 rounded-2xl border border-zinc-900 bg-zinc-950/40 shadow-lg">
              <h3 className="text-lg font-bold text-white mb-6">Activity Overview</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0088FF" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#0088FF" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorSaved" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                    <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#a1a1aa' }} />
                    <Area type="monotone" dataKey="Applications" stroke="#0088FF" strokeWidth={2} fillOpacity={1} fill="url(#colorApps)" />
                    <Area type="monotone" dataKey="Saved" stroke="#a855f7" strokeWidth={2} fillOpacity={1} fill="url(#colorSaved)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pie Chart Card */}
            <div className="p-6 rounded-2xl border border-zinc-900 bg-zinc-950/40 shadow-lg">
              <h3 className="text-lg font-bold text-white mb-6">Application Statuses</h3>
              <div className="h-64 w-full flex items-center justify-center relative">
                {pieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={65}
                        outerRadius={85}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                        contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px' }}
                        itemStyle={{ color: '#fff' }}
                      />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-zinc-500 text-sm">No application data yet.</p>
                )}
                
                {pieData.length > 0 && (
                  <div className="absolute top-[45%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                    <span className="text-2xl font-bold text-white">{totalApplied}</span>
                    <span className="text-xs text-zinc-500">Total</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Recent Applications Table */}
          <div className="flex flex-col lg:flex-row gap-6 mb-8 items-stretch">
            <div className="flex-1 p-6 rounded-2xl border border-zinc-900 bg-zinc-950/40 flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white">Recent Applications</h3>
                <Link href="/dashboard/seeker/applications" className="text-xs font-semibold text-[#0088FF] hover:text-[#339FFF] transition-colors">
                  View all
                </Link>
              </div>

              {recentApps.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center py-10 text-zinc-500">
                  <p>You haven't applied to any jobs yet.</p>
                  <Link href="/browse-jobs" className="text-[#0088FF] hover:underline mt-2 text-sm font-semibold">Browse Jobs</Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-zinc-400 border-collapse min-w-[500px]">
                    <thead>
                      <tr className="border-b border-zinc-900 text-zinc-500 font-semibold text-xs uppercase tracking-wider">
                        <th className="pb-3 pr-6 font-semibold">Job Title</th>
                        <th className="pb-3 px-6 font-semibold">Company</th>
                        <th className="pb-3 px-6 font-semibold">Applied</th>
                        <th className="pb-3 pl-6 font-semibold text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900/50">
                      {recentApps.map((app, idx) => (
                        <tr key={idx} className="hover:bg-zinc-900/20 transition-colors group">
                          <td className="py-4 pr-6 font-semibold text-white">
                            {app.jobTitle || "Untitled Job"}
                          </td>
                          <td className="py-4 px-6">{app.companyName || "Unknown Company"}</td>
                          <td className="py-4 px-6">{formatDate(app.createdAt)}</td>
                          <td className="py-4 pl-6 text-right">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide border ${getStatusStyle(app.uiStatus)}`}>
                              {app.uiStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            
            {/* Find Jobs Call to Action */}
            <div className="lg:w-1/3 flex flex-col gap-6">
              <div className="rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900/80 to-zinc-950/80 p-6 flex flex-col items-center justify-center text-center h-full">
                <div className="w-16 h-16 rounded-full bg-[#0088FF]/10 flex items-center justify-center mb-4 border border-[#0088FF]/20">
                  <Briefcase size={28} className="text-[#0088FF]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Find Your Next Role</h3>
                <p className="text-zinc-400 text-sm mb-6 px-4">
                  Discover opportunities that match your skills and career goals.
                </p>
                <Link 
                  href="/browse-jobs"
                  className="w-full h-11 rounded-[12px] bg-white text-black font-bold text-sm flex items-center justify-center hover:bg-zinc-200 transition-colors"
                >
                  Browse Jobs
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
