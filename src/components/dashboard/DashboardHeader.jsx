"use client";

import Image from "next/image";
import { useSession } from "@/lib/auth-client";

export default function DashboardHeader() {
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const userName = user?.name || user?.email || "User";
  const userImage = user?.image;
  const userRole = user?.role || "seeker";

  const userInitials = userName
    ? userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "NH";

  return (
    <header className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 mb-6 border-b border-zinc-900">
      {/* Search Input Removed */}
      <div className="flex-1"></div>

      {/* Actions */}
      <div className="flex items-center gap-4 ml-auto">
        {/* Notifications Icon */}
        <button
          className="relative flex items-center justify-center h-10 w-10 rounded-xl bg-zinc-950 border border-zinc-900 text-zinc-400 hover:text-white transition-colors"
          type="button"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span className="absolute top-2 right-2.5 h-1.5 w-1.5 rounded-full bg-[#FF5E00]" />
        </button>

        {/* User Block */}
        {!isPending && user && (
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-sm font-semibold text-white">{userName}</span>
              <span className="text-[10px] text-zinc-550 font-medium capitalize">
                {userRole === "admin" ? "Admin" : userRole === "recruiter" ? "Recruiter" : "Job Seeker"}
              </span>
            </div>
            {userImage ? (
              <Image
                src={userImage}
                alt={userName}
                width={36}
                height={36}
                className="h-9 w-9 rounded-full object-cover border border-zinc-900"
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-[#0088FF] to-[#FF5E00] text-xs font-bold text-white shadow-md">
                {userInitials}
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
