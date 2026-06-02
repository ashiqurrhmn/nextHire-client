import React from "react";

export default function TopCompanies() {
  const companies = [
    {
      name: "Google Inc.",
      category: "Technology · Mountain View",
      activeJobs: 24,
      logoColor: "bg-blue-600/10 text-blue-400 border-blue-900/30",
      letter: "G",
    },
    {
      name: "Meta Platforms",
      category: "Social Media · Menlo Park",
      activeJobs: 18,
      logoColor: "bg-blue-500/10 text-blue-400 border-blue-900/30",
      letter: "M",
    },
    {
      name: "Stripe",
      category: "Fintech · San Francisco",
      activeJobs: 12,
      logoColor: "bg-purple-600/10 text-purple-400 border-purple-900/30",
      letter: "S",
    },
    {
      name: "Tesla",
      category: "Automotive · Austin",
      activeJobs: 31,
      logoColor: "bg-red-600/10 text-red-500 border-red-900/30",
      letter: "T",
    },
  ];

  return (
    <div className="w-full lg:w-96 p-6 rounded-2xl border border-zinc-900 bg-zinc-950/40 flex flex-col justify-between shrink-0">
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white">My Top Companies</h3>
          <button className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors" type="button">
            View all
          </button>
        </div>

        <div className="flex flex-col gap-3.5 mb-6">
          {companies.map((comp, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-xl border border-zinc-900/60 bg-zinc-950/30 hover:border-zinc-800 transition-all duration-200"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`h-10 w-10 rounded-xl border flex items-center justify-center font-bold text-sm shrink-0 ${comp.logoColor}`}>
                  {comp.letter}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold text-white truncate">{comp.name}</span>
                  <span className="text-[10px] text-zinc-500 truncate">{comp.category}</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[11px] font-bold text-white block">
                  {comp.activeJobs}
                </span>
                <span className="text-[8px] font-semibold text-zinc-500 uppercase tracking-wider block">
                  Active Jobs
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button className="w-full py-2.5 rounded-xl border border-zinc-900 text-xs font-semibold text-zinc-400 hover:text-white hover:border-zinc-800 transition-all cursor-pointer" type="button">
        View All Companies
      </button>
    </div>
  );
}
