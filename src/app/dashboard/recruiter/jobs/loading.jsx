import React from 'react';
import { Skeleton } from "@heroui/react";

export default function Loading() {
  return (
    <div className="flex flex-col min-h-full pb-8">
      {/* Search Header Skeleton */}
      <div className="flex items-center justify-between border-b border-zinc-900 bg-black/60 px-6 py-4 mb-6 -mx-6 sm:-mx-8 -mt-6 sm:-mt-8">
        <Skeleton className="h-10 w-64 rounded-xl bg-zinc-800" />
        <div className="flex gap-4">
          <Skeleton className="h-10 w-10 rounded-full bg-zinc-800" />
          <Skeleton className="h-10 w-10 rounded-full bg-zinc-800" />
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <Skeleton className="h-8 w-48 rounded-lg bg-zinc-800 mb-2" />
            <Skeleton className="h-4 w-64 rounded-lg bg-zinc-800" />
          </div>
          <Skeleton className="h-10 w-32 rounded-xl bg-zinc-800" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-5">
              <Skeleton className="h-4 w-20 rounded-lg bg-zinc-800 mb-3" />
              <Skeleton className="h-8 w-12 rounded-lg bg-zinc-800" />
            </div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          <Skeleton className="h-12 w-full lg:w-96 rounded-xl bg-zinc-800" />
          <div className="flex gap-2 w-full lg:w-auto">
            <Skeleton className="h-12 w-32 rounded-xl bg-zinc-800" />
            <Skeleton className="h-12 w-32 rounded-xl bg-zinc-800" />
            <Skeleton className="h-12 w-32 rounded-xl bg-zinc-800" />
          </div>
        </div>

        <div className="bg-[#0a0a0c] border border-zinc-900 rounded-2xl overflow-hidden hidden md:block">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="p-4 border-b border-zinc-900 flex gap-4 items-center">
              <div className="w-1/3 flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-xl bg-zinc-800" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-3/4 rounded bg-zinc-800 mb-2" />
                  <Skeleton className="h-3 w-1/2 rounded bg-zinc-800" />
                </div>
              </div>
              <Skeleton className="h-4 w-1/6 rounded bg-zinc-800" />
              <Skeleton className="h-4 w-1/6 rounded bg-zinc-800" />
              <Skeleton className="h-6 w-16 rounded-full bg-zinc-800" />
              <div className="w-1/6 flex justify-end">
                <Skeleton className="h-8 w-24 rounded-lg bg-zinc-800" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
