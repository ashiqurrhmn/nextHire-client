import React from "react";

export default function RecentApplications() {
  const applications = [
    {
      name: "Julianne Moore",
      role: "Senior Product Designer",
      date: "Oct 24, 2023",
      experience: "6 years",
      status: "Interviewing",
    },
    {
      name: "Robert Downey",
      role: "Backend Engineer",
      date: "Oct 23, 2023",
      experience: "4 years",
      status: "New",
    },
    {
      name: "Emma Stone",
      role: "Marketing Lead",
      date: "Oct 22, 2023",
      experience: "8 years",
      status: "Reviewing",
    },
    {
      name: "Chris Pratt",
      role: "Product Manager",
      date: "Oct 21, 2023",
      experience: "5 years",
      status: "Rejected",
    },
  ];

  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case "interviewing":
        return "bg-emerald-950/30 text-emerald-400 border border-emerald-900/50";
      case "new":
        return "bg-zinc-900/60 text-zinc-300 border border-zinc-800";
      case "reviewing":
        return "bg-amber-950/30 text-amber-450 border border-amber-900/50";
      case "rejected":
        return "bg-red-950/30 text-red-400 border border-red-900/50";
      default:
        return "bg-zinc-900 text-zinc-300";
    }
  };

  return (
    <div className="flex-1 p-6 rounded-2xl border border-zinc-900 bg-zinc-950/40">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white">Recent Applications</h3>
        <button className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors" type="button">
          View all
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-zinc-400 border-collapse">
          <thead>
            <tr className="border-b border-zinc-900 text-zinc-500 font-semibold text-xs uppercase tracking-wider">
              <th className="pb-3 font-semibold">Candidate Name</th>
              <th className="pb-3 font-semibold">Role</th>
              <th className="pb-3 font-semibold">Date Applied</th>
              <th className="pb-3 font-semibold">Experience</th>
              <th className="pb-3 font-semibold text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900">
            {applications.map((app, idx) => (
              <tr key={idx} className="hover:bg-zinc-900/10 transition-colors">
                <td className="py-4 font-semibold text-white flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-zinc-900 border border-zinc-850 flex items-center justify-center text-xs text-zinc-400 font-bold shrink-0">
                    {app.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <span className="truncate">{app.name}</span>
                </td>
                <td className="py-4">{app.role}</td>
                <td className="py-4">{app.date}</td>
                <td className="py-4">{app.experience}</td>
                <td className="py-4 text-right">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${getStatusStyle(app.status)}`}>
                    {app.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
