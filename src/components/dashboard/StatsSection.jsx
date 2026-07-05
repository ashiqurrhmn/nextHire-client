import React from "react";

export default function StatsSection({ totalJobs = 0, totalApplicants = 0, activeJobs = 0, closedJobs = 0 }) {
  const stats = [
    {
      title: "Total Job Posts",
      value: totalJobs.toLocaleString(),
      iconClass: "bg-[#0088FF]/10 border-[#0088FF]/25 text-[#0088FF]",
      icon: (
        <svg
          viewBox="0 0 24 24"
          width="18"
          height="18"
          stroke="currentColor"
          strokeWidth="2.2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      ),
    },
    {
      title: "Total Applicants",
      value: totalApplicants.toLocaleString(),
      iconClass: "bg-[#FF5E00]/10 border-[#FF5E00]/25 text-[#FF5E00]",
      icon: (
        <svg
          viewBox="0 0 24 24"
          width="18"
          height="18"
          stroke="currentColor"
          strokeWidth="2.2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      title: "Active Jobs",
      value: activeJobs.toLocaleString(),
      iconClass: "bg-[#0088FF]/15 border-[#0088FF]/30 text-[#0088FF] shadow-[0_0_12px_rgba(0,136,255,0.1)]",
      icon: (
        <svg
          viewBox="0 0 24 24"
          width="18"
          height="18"
          stroke="currentColor"
          strokeWidth="2.2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      ),
    },
    {
      title: "Jobs Closed",
      value: closedJobs.toLocaleString(),
      iconClass: "bg-zinc-800/40 border-zinc-700/50 text-zinc-350",
      icon: (
        <svg
          viewBox="0 0 24 24"
          width="18"
          height="18"
          stroke="currentColor"
          strokeWidth="2.2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      {stats.map((item, idx) => (
        <div
          key={idx}
          className="flex flex-col justify-between p-5 rounded-2xl border border-zinc-900 bg-zinc-950/40 hover:border-zinc-800 hover:bg-zinc-950/60 transition-all duration-300 group shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-zinc-450">{item.title}</span>
            <div className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-all duration-300 ${item.iconClass}`}>
              {item.icon}
            </div>
          </div>
          <span className="text-3xl font-bold text-white tracking-tight">
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
}
