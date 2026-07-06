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

      {/* Table Skeleton (For Jobs) */}
      <div className="rounded-2xl border border-zinc-900 bg-zinc-950/40 p-6 shadow-xl mb-6 flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-900">
                <th className="pb-3"><Skeleton className="h-4 w-24 rounded bg-zinc-800" /></th>
                <th className="pb-3"><Skeleton className="h-4 w-20 rounded bg-zinc-800" /></th>
                <th className="pb-3"><Skeleton className="h-4 w-24 rounded bg-zinc-800" /></th>
                <th className="pb-3"><Skeleton className="h-4 w-16 rounded bg-zinc-800" /></th>
                <th className="pb-3"><Skeleton className="h-4 w-16 rounded bg-zinc-800" /></th>
                <th className="pb-3"><Skeleton className="h-4 w-20 rounded bg-zinc-800" /></th>
                <th className="pb-3 text-right"><Skeleton className="h-4 w-16 rounded bg-zinc-800 ml-auto" /></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900/50">
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i}>
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-xl bg-zinc-800 shrink-0" />
                      <div>
                        <Skeleton className="h-4 w-32 rounded bg-zinc-800 mb-1" />
                        <Skeleton className="h-3 w-20 rounded bg-zinc-800" />
                      </div>
                    </div>
                  </td>
                  <td className="py-4"><Skeleton className="h-4 w-24 rounded bg-zinc-800" /></td>
                  <td className="py-4">
                    <Skeleton className="h-4 w-20 rounded bg-zinc-800 mb-1" />
                    <Skeleton className="h-3 w-16 rounded bg-zinc-800" />
                  </td>
                  <td className="py-4"><Skeleton className="h-4 w-20 rounded bg-zinc-800" /></td>
                  <td className="py-4"><Skeleton className="h-6 w-16 rounded-full bg-zinc-800" /></td>
                  <td className="py-4"><Skeleton className="h-4 w-20 rounded bg-zinc-800" /></td>
                  <td className="py-4">
                    <div className="flex justify-end gap-2">
                      <Skeleton className="h-8 w-20 rounded-lg bg-zinc-800" />
                      <Skeleton className="h-8 w-8 rounded-lg bg-zinc-800" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
