"use client";

import React from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Sparkles, Envelope, Calendar, ArrowRight, ShieldCheck, Bell } from "@gravity-ui/icons";

export default function SeekerSettingsPage() {
  const upcomingFeatures = [
    {
      id: "ai-resume",
      title: "AI Resume Reviewer",
      description: "Get instant AI-driven feedback on your resume to increase your chances of landing interviews.",
      icon: <Sparkles className="text-purple-400" size={24} />,
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20"
    },
    {
      id: "interview-prep",
      title: "Interview Scheduling & Prep",
      description: "Seamlessly schedule interviews directly with recruiters and access tailored prep materials.",
      icon: <Calendar className="text-[#0088FF]" size={24} />,
      bgColor: "bg-[#0088FF]/10",
      borderColor: "border-[#0088FF]/20"
    },
    {
      id: "advanced-tracking",
      title: "Advanced App Tracking",
      description: "Track exactly when recruiters view your application and download your resume.",
      icon: <Envelope className="text-emerald-400" size={24} />,
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20"
    },
    {
      id: "skill-assessments",
      title: "Skill Assessment Tests",
      description: "Prove your skills with certified assessments that make your profile stand out to top employers.",
      icon: <ShieldCheck className="text-amber-400" size={24} />,
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20"
    },
    {
      id: "notifications",
      title: "Real-time Alerts",
      description: "Instant SMS and push notifications the moment a job matching your exact criteria is posted.",
      icon: <Bell className="text-rose-400" size={24} />,
      bgColor: "bg-rose-500/10",
      borderColor: "border-rose-500/20"
    }
  ];

  return (
    <div className="flex flex-col min-h-full pb-8">
      <DashboardHeader />

      <h2 className="text-3xl font-bold text-white tracking-tight mb-8">
        Settings <span className="ml-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#0088FF]/10 text-[#0088FF] border border-[#0088FF]/30 align-middle">Coming Soon</span>
      </h2>

      {/* Upcoming Features Section (Full Width) */}
      <div className="rounded-2xl border border-zinc-900 bg-zinc-950/40 p-8 shadow-xl relative overflow-hidden flex-1">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#0088FF]/5 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -z-10 -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>
        
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#0088FF]/30 bg-[#0088FF]/20 text-[#0088FF]">
            <Sparkles size={20} />
          </div>
          <h3 className="text-2xl font-bold text-white">We're building something awesome</h3>
        </div>
        <p className="text-base text-zinc-400 mb-10 max-w-2xl">
          The Settings dashboard is currently under construction. In the future, you'll be able to manage your account preferences, security settings, and notifications here. Here is a sneak peek at other capabilities coming to NextHire very soon!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingFeatures.map((feature) => (
            <div 
              key={feature.id} 
              className={`p-6 rounded-2xl border ${feature.borderColor} ${feature.bgColor} backdrop-blur-sm flex flex-col gap-4 transition-transform hover:-translate-y-1`}
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-zinc-950/50 rounded-xl shadow-inner">
                  {feature.icon}
                </div>
                <h4 className="font-semibold text-white text-lg">{feature.title}</h4>
              </div>
              <p className="text-sm text-zinc-300 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
