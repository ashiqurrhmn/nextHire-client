import React from "react";
import Link from "next/link";

export default function TopCompanies({ companies = [] }) {
  // Sort or just take first 4 companies
  const topCompanies = (companies || []).slice(0, 4);

  // Generate deterministic colors based on company name
  const getLogoColor = (name) => {
    const colors = [
      "bg-blue-600/10 text-blue-400 border-blue-900/30",
      "bg-emerald-600/10 text-emerald-400 border-emerald-900/30",
      "bg-purple-600/10 text-purple-400 border-purple-900/30",
      "bg-amber-600/10 text-amber-500 border-amber-900/30",
      "bg-red-600/10 text-red-500 border-red-900/30",
    ];
    if (!name) return colors[0];
    let sum = 0;
    for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i);
    return colors[sum % colors.length];
  };

  return (
    <div className="w-full lg:w-96 p-6 rounded-2xl border border-zinc-900 bg-zinc-950/40 flex flex-col justify-between shrink-0">
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white">My Top Companies</h3>
          <Link 
            href="/dashboard/recruiter/company"
            className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
          >
            View all
          </Link>
        </div>

        <div className="flex flex-col gap-3.5 mb-6">
          {topCompanies.length > 0 ? (
            topCompanies.map((comp, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl border border-zinc-900/60 bg-zinc-950/30 hover:border-zinc-800 transition-all duration-200"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`h-10 w-10 rounded-xl border flex items-center justify-center font-bold text-sm shrink-0 ${getLogoColor(comp.name)}`}>
                    {comp.name ? comp.name.charAt(0).toUpperCase() : "C"}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-semibold text-white truncate">{comp.name || "Unnamed Company"}</span>
                    <span className="text-[10px] text-zinc-500 truncate">
                      {[comp.industry, comp.location].filter(Boolean).join(" · ") || "Industry N/A"}
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[11px] font-bold text-white block">
                    {comp.activeJobs !== undefined ? comp.activeJobs : "-"}
                  </span>
                  <span className="text-[8px] font-semibold text-zinc-500 uppercase tracking-wider block">
                    Active Jobs
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-sm text-zinc-500">
              No companies found.
            </div>
          )}
        </div>
      </div>

      <Link 
        href="/dashboard/recruiter/company"
        className="w-full py-2.5 rounded-xl border border-zinc-900 text-xs font-semibold text-zinc-400 hover:text-white hover:border-zinc-800 transition-all cursor-pointer flex justify-center items-center"
      >
        View All Companies
      </Link>
    </div>
  );
}
