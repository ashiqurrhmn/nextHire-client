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

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex flex-col justify-between p-5 rounded-2xl border border-zinc-900 bg-zinc-950/40 h-[104px]">
            <Skeleton className="h-3 w-24 rounded bg-zinc-800 mb-4" />
            <Skeleton className="h-8 w-16 rounded-lg bg-zinc-800" />
          </div>
        ))}
      </div>

      {/* Search Bar Skeleton */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-zinc-900 mb-6">
        <Skeleton className="h-6 w-32 rounded-lg bg-zinc-800" />
        <Skeleton className="h-9 w-48 sm:w-72 rounded-lg bg-zinc-800" />
      </div>

      {/* List Items */}
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl border border-zinc-900 bg-zinc-950/40">
            <div className="flex items-center gap-4 flex-1 w-full">
              <Skeleton className="h-12 w-12 rounded-xl bg-zinc-800 shrink-0" />
              <div className="flex-1">
                <Skeleton className="h-5 w-48 rounded bg-zinc-800 mb-2" />
                <Skeleton className="h-4 w-64 rounded bg-zinc-800" />
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
              <Skeleton className="h-9 w-24 rounded-lg bg-zinc-800" />
              <Skeleton className="h-9 w-24 rounded-lg bg-zinc-800" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
