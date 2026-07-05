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

      <div className="flex flex-col gap-6 max-w-4xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <Skeleton className="h-8 w-48 rounded-lg bg-zinc-800 mb-2" />
            <Skeleton className="h-4 w-64 rounded-lg bg-zinc-800" />
          </div>
        </div>

        <div className="bg-[#0a0a0c] border border-zinc-900 rounded-2xl p-6">
          <div className="flex items-start gap-6 mb-8 border-b border-zinc-900 pb-8">
            <Skeleton className="h-24 w-24 rounded-2xl bg-zinc-800" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-8 w-64 rounded-lg bg-zinc-800" />
              <Skeleton className="h-4 w-48 rounded-lg bg-zinc-800" />
              <div className="flex gap-2 mt-4">
                <Skeleton className="h-8 w-24 rounded-lg bg-zinc-800" />
                <Skeleton className="h-8 w-24 rounded-lg bg-zinc-800" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24 rounded bg-zinc-800" />
              <Skeleton className="h-12 w-full rounded-xl bg-zinc-800" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24 rounded bg-zinc-800" />
              <Skeleton className="h-12 w-full rounded-xl bg-zinc-800" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Skeleton className="h-4 w-24 rounded bg-zinc-800" />
              <Skeleton className="h-32 w-full rounded-xl bg-zinc-800" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24 rounded bg-zinc-800" />
              <Skeleton className="h-12 w-full rounded-xl bg-zinc-800" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24 rounded bg-zinc-800" />
              <Skeleton className="h-12 w-full rounded-xl bg-zinc-800" />
            </div>
          </div>
          
          <div className="mt-8 flex justify-end">
            <Skeleton className="h-12 w-32 rounded-xl bg-zinc-800" />
          </div>
        </div>
      </div>
    </div>
  );
}
