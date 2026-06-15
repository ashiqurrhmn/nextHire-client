"use client";

import React from "react";
import { useSession } from "@/lib/auth-client";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

export default function SeekerDashboardPage() {
  const { data: session } = useSession();
  const user = session?.user;
  const userName = user?.name || "Job Seeker";

  return (
    <div className="flex flex-col min-h-full">
      {/* Header Search & Profile */}
      <DashboardHeader />

      {/* Welcome Title */}
      <h2 className="text-3xl font-bold text-white tracking-tight mb-6">
        Welcome back, {userName}
      </h2>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 flex items-center justify-center min-h-[300px]">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-white mb-2">
            Your Dashboard is Ready
          </h3>
          <p className="text-zinc-400">
            More features coming soon to help you find your dream job!
          </p>
        </div>
      </div>
    </div>
  );
}
