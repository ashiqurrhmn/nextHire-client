import React from "react";
import Link from "next/link";


export default function RecentApplications({ applications = [] }) {
  // Get 4 most recent applications
  const recentApps = [...applications]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4);

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "shortlisted":
      case "interviewing":
        return "bg-emerald-950/30 text-emerald-400 border border-emerald-900/50";
      case "applied":
      case "new":
        return "bg-zinc-900/60 text-zinc-300 border border-zinc-800";
      case "reviewing":
        return "bg-amber-950/30 text-amber-450 border border-amber-900/50";
      case "rejected":
        return "bg-red-950/30 text-red-400 border border-red-900/50";
      case "hired":
        return "bg-blue-950/30 text-blue-400 border border-blue-900/50";
      default:
        return "bg-zinc-900 text-zinc-300";
    }
  };

  return (
    <div className="flex-1 p-6 rounded-2xl border border-zinc-900 bg-zinc-950/40">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white">Recent Applications</h3>
        <Link 
          href="/dashboard/recruiter/applications"
          className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
        >
          View all
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-zinc-400 border-collapse">
          <thead>
            <tr className="border-b border-zinc-900 text-zinc-500 font-semibold text-xs uppercase tracking-wider">
              <th className="pb-3 font-semibold">Candidate Name</th>
              <th className="pb-3 font-semibold">Role</th>
              <th className="pb-3 font-semibold">Date Applied</th>
              <th className="pb-3 font-semibold text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900">
            {recentApps.length > 0 ? (
              recentApps.map((app, idx) => (
                <tr key={idx} className="hover:bg-zinc-900/10 transition-colors">
                  <td className="py-4 font-semibold text-white flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-zinc-900 border border-zinc-850 flex items-center justify-center text-xs text-zinc-400 font-bold shrink-0">
                      {app.fullName ? app.fullName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "UN"}
                    </div>
                    <span className="truncate">{app.fullName || "Unknown Applicant"}</span>
                  </td>
                  <td className="py-4">{app.jobTitle || "Unknown Role"}</td>
                  <td className="py-4">
                    {app.createdAt ? new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "N/A"}
                  </td>
                  <td className="py-4 text-right">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${getStatusStyle(app.status)}`}>
                      {app.status || "Applied"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-8 text-center text-zinc-500">
                  No recent applications found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
