import React from 'react';
import { Skeleton } from "@heroui/react";

export default function Loading() {
  return (
    <div className="flex flex-col min-h-full pb-8">
      {/* Dashboard Header Skeleton */}
      <header className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 pt-0 mb-6 border-b border-zinc-900">
        <div className="flex-1"></div>
        <div className="flex items-center gap-4 ml-auto">
          <Skeleton className="h-10 w-10 rounded-xl bg-zinc-950 border border-zinc-900" />
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end gap-1">
              <Skeleton className="h-4 w-24 rounded bg-zinc-800" />
              <Skeleton className="h-3 w-16 rounded bg-zinc-800" />
            </div>
            <Skeleton className="h-9 w-9 rounded-full bg-zinc-800 border border-zinc-900" />
          </div>
        </div>
      </header>

      {/* Page Title */}
      <div className="mb-8">
        <Skeleton className="h-8 w-64 rounded-lg bg-zinc-800 mb-2" />
        <Skeleton className="h-4 w-96 rounded-lg bg-zinc-800" />
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex flex-col justify-between p-5 rounded-2xl border border-zinc-900 bg-zinc-950/40 h-[104px]">
            <Skeleton className="h-3 w-24 rounded bg-zinc-800 mb-4" />
            <Skeleton className="h-8 w-16 rounded-lg bg-zinc-800" />
          </div>
        ))}
      </div>

      {/* Charts area skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 p-6 rounded-2xl border border-zinc-900 bg-zinc-950/40 h-[400px]">
          <Skeleton className="h-full w-full rounded-xl bg-zinc-800/50" />
        </div>
        <div className="p-6 rounded-2xl border border-zinc-900 bg-zinc-950/40 h-[400px]">
          <Skeleton className="h-full w-full rounded-xl bg-zinc-800/50" />
        </div>
      </div>

      {/* Quick Actions */}
      <Skeleton className="h-6 w-32 rounded-lg bg-zinc-800 mb-4 pb-3" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col justify-between p-6 rounded-2xl border border-zinc-900 bg-zinc-950/40 min-h-[180px]">
            <div className="flex items-start justify-between">
              <Skeleton className="h-11 w-11 rounded-xl bg-zinc-800" />
              <Skeleton className="h-7 w-7 rounded-full bg-zinc-800" />
            </div>
            <div className="mt-4">
              <Skeleton className="h-6 w-40 rounded-lg bg-zinc-800 mb-2" />
              <Skeleton className="h-4 w-full rounded bg-zinc-800" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
