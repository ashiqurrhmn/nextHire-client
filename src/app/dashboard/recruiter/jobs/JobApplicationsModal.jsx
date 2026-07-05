import React, { useState, useEffect } from "react";
import { Button, Spinner, Chip, toast } from "@heroui/react";
import { Xmark } from "@gravity-ui/icons";

const STATUS_CONFIG = {
  applied: {
    label: "Applied",
    chipClass: "bg-emerald-950/20 text-emerald-400 border-emerald-900/40",
  },
  shortlisted: {
    label: "Shortlisted",
    chipClass: "bg-amber-950/20 text-amber-500 border-amber-900/40",
  },
  interviewing: {
    label: "Interviewing",
    chipClass: "bg-blue-950/20 text-blue-400 border-blue-900/40",
  },
  rejected: {
    label: "Rejected",
    chipClass: "bg-red-950/20 text-red-400 border-red-900/40",
  },
  hired: {
    label: "Hired",
    chipClass: "bg-purple-950/20 text-purple-400 border-purple-900/40",
  },
};

const getStatusChip = (status) => {
  const config = STATUS_CONFIG[status?.toLowerCase()] || {
    label: status,
    chipClass: "bg-zinc-850 text-zinc-300 border-zinc-800",
  };
  return (
    <Chip
      className={`border ${config.chipClass} text-[11px] font-semibold`}
      size="sm"
      variant="flat"
    >
      {config.label}
    </Chip>
  );
};

export default function JobApplicationsModal({ job, onClose }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
        const res = await fetch(`${baseUrl}/api/applications?jobId=${job._id || job.id}`);
        const data = await res.json();
        setApplications(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch job applications:", err);
        toast.error("Failed to load applications");
      } finally {
        setLoading(false);
      }
    };

    if (job) {
      fetchApplications();
    }
  }, [job]);

  const handleStatusChange = async (appId, newStatus) => {
    setApplications((prev) =>
      prev.map((app) => (app._id === appId ? { ...app, status: newStatus } : app))
    );

    const statusLabel = STATUS_CONFIG[newStatus]?.label || newStatus;
    toast.success(`Status updated to "${statusLabel}"`);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
      await fetch(`${baseUrl}/api/applications/${appId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (err) {
      console.warn("Failed to sync status with backend:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative flex flex-col bg-[#0a0a0c] border border-zinc-900 text-white rounded-2xl w-full max-w-4xl max-h-[90vh] shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-zinc-900 shrink-0">
          <div>
            <h3 className="text-xl font-bold text-white">
              Applicants for "{job.jobTitle || job.title}"
            </h3>
            <p className="text-sm text-zinc-500 mt-1">
              Manage candidates who applied for this role.
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-zinc-900 text-zinc-400 hover:text-white transition-colors bg-transparent border-0 cursor-pointer"
          >
            <Xmark size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Spinner color="primary" />
              <p className="text-zinc-500 text-sm">Loading applications...</p>
            </div>
          ) : applications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center border border-zinc-900 border-dashed rounded-xl bg-zinc-950/50">
              <p className="text-zinc-400 font-medium">No applicants yet</p>
              <p className="text-xs text-zinc-600 mt-1">Applications for this job will appear here.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {applications.map((app) => (
                <div key={app._id} className="flex flex-col md:flex-row md:items-start justify-between gap-4 p-5 rounded-xl border border-zinc-900 bg-zinc-950/40 hover:bg-zinc-950/60 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#0088FF] to-[#0055FF] text-white font-bold shadow-md">
                        {(app.fullName || app.name || "U").charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-white">
                          {app.fullName || app.name || "Unknown Applicant"}
                        </h4>
                        <p className="text-xs text-zinc-400">
                          {app.email || "No email provided"}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                      <div>
                        <span className="text-[10px] text-zinc-500 uppercase font-semibold tracking-wider block mb-1">Applied On</span>
                        <span className="text-zinc-300">
                          {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : "N/A"}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-500 uppercase font-semibold tracking-wider block mb-1">Links</span>
                        {app.portfolioUrl || app.resumeUrl ? (
                          <a href={app.portfolioUrl || app.resumeUrl} target="_blank" rel="noreferrer" className="text-[#0088FF] hover:underline">
                            View Portfolio/Resume
                          </a>
                        ) : (
                          <span className="text-zinc-600">None</span>
                        )}
                      </div>
                    </div>
                    
                    {app.coverLetter && (
                      <div className="mt-4">
                        <span className="text-[10px] text-zinc-500 uppercase font-semibold tracking-wider block mb-1">Cover Letter</span>
                        <p className="text-xs text-zinc-400 bg-zinc-900/50 p-3 rounded-lg leading-relaxed line-clamp-3 hover:line-clamp-none transition-all">
                          {app.coverLetter}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col items-end gap-3 shrink-0 border-t border-zinc-900 md:border-0 pt-4 md:pt-0">
                    <div className="mb-2">
                      <span className="text-[10px] text-zinc-500 uppercase font-semibold tracking-wider block mb-1 text-right">Current Status</span>
                      {getStatusChip(app.status)}
                    </div>
                    <div className="flex flex-wrap items-center justify-end gap-1.5 w-full max-w-[250px]">
                      {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                        <button
                          key={key}
                          onClick={() => handleStatusChange(app._id, key)}
                          disabled={app.status === key}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all border cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
                            app.status === key
                              ? `${config.chipClass} border-current`
                              : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white"
                          }`}
                        >
                          {config.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
