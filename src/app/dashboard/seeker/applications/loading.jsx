"use client";

import React from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Skeleton } from "@heroui/react";

export default function ApplicationsLoading() {
  return (
    <div className="w-full animate-pulse">
      <DashboardHeader />
      
      {/* Header Area Skeleton */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-48 rounded-md bg-zinc-800" />
          <Skeleton className="h-4 w-72 rounded-md bg-zinc-800/50" />
        </div>
        
        <Skeleton className="h-10 w-48 rounded-lg bg-zinc-800" />
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex flex-col justify-between p-5 rounded-2xl border border-zinc-900 bg-zinc-950/40 h-[110px]">
            <div className="flex items-center justify-between mb-4 w-full">
              <Skeleton className="h-4 w-20 rounded-md bg-zinc-800" />
              <Skeleton className="h-8 w-8 rounded-lg bg-zinc-800" />
            </div>
            <Skeleton className="h-8 w-12 rounded-md bg-zinc-800" />
          </div>
        ))}
      </div>

      {/* Filter Bar Skeleton */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
        <Skeleton className="h-11 w-full md:max-w-md rounded-xl bg-zinc-800/50" />
        <Skeleton className="h-11 w-full md:w-36 rounded-xl bg-zinc-800/50" />
      </div>

      {/* Table Skeleton */}
      <div className="rounded-2xl border border-zinc-900 bg-zinc-950/40 p-6 shadow-xl mb-6">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between pb-3 border-b border-zinc-900">
             <Skeleton className="h-4 w-24 rounded bg-zinc-800" />
             <Skeleton className="h-4 w-24 rounded bg-zinc-800" />
             <Skeleton className="h-4 w-24 rounded bg-zinc-800" />
             <Skeleton className="h-4 w-24 rounded bg-zinc-800" />
             <Skeleton className="h-4 w-24 rounded bg-zinc-800" />
          </div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex justify-between items-center py-4 border-b border-zinc-900/50 last:border-0">
              <div className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-lg bg-zinc-800 shrink-0" />
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-32 rounded bg-zinc-800" />
                  <Skeleton className="h-3 w-20 rounded bg-zinc-800/50" />
                </div>
              </div>
              <Skeleton className="h-4 w-24 rounded bg-zinc-800" />
              <Skeleton className="h-4 w-24 rounded bg-zinc-800" />
              <Skeleton className="h-6 w-20 rounded-full bg-zinc-800" />
              <Skeleton className="h-4 w-16 rounded bg-zinc-800" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
