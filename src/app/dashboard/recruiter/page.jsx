"use client";

import React from "react";
import { useSession } from "@/lib/auth-client";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatsSection from "@/components/dashboard/StatsSection";
import RecentApplications from "@/components/dashboard/RecentApplications";
import TopCompanies from "@/components/dashboard/TopCompanies";

export default function RecruiterDashboardPage() {
  const { data: session } = useSession();
  const user = session?.user;
  const userName = user?.name || "Recruiter";

  return (
    <div className="flex flex-col min-h-full">
      {/* Header Search & Profile */}
      <DashboardHeader />

      {/* Welcome Title */}
      <h2 className="text-3xl font-bold text-white tracking-tight mb-6">
        Welcome back, {userName}
      </h2>

      {/* Stats Section Cards */}
      <StatsSection />

      {/* Bottom Main Content Columns */}
      <div className="flex flex-col lg:flex-row gap-6 mb-8 items-stretch">
        <RecentApplications />
        <TopCompanies />
      </div>

      {/* Floating Action Button */}
      <button
        className="fixed bottom-6 right-6 h-12 w-12 rounded-full bg-gradient-to-r from-[#0088FF] to-[#0055FF] text-white hover:from-[#339FFF] hover:to-[#2277FF] flex items-center justify-center shadow-lg shadow-[#0088FF]/30 transition-all hover:scale-105 active:scale-95 text-2xl font-normal z-30 cursor-pointer border-0"
        type="button"
        title="Add New Post"
      >
        +
      </button>
    </div>
  );
}