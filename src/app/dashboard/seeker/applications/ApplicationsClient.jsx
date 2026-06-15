"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@heroui/react";
import { Briefcase } from "@gravity-ui/icons";

const STATUS_CONFIG = {
  Applied: { color: "text-zinc-300", border: "border-zinc-500" },
  Review: { color: "text-amber-400", border: "border-amber-500/50" },
  Shortlisted: { color: "text-emerald-400", border: "border-emerald-500/50" },
  Rejected: { color: "text-red-500", border: "border-red-500/50" },
  Offered: { color: "text-zinc-100", border: "border-zinc-300" }
};

const STATUS_KEYS = Object.keys(STATUS_CONFIG);

export default function ApplicationsClient({ applications }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  if (!applications || applications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center rounded-[24px] border border-zinc-800/60 bg-[#121214]/80 backdrop-blur-xl">
        <div className="w-16 h-16 rounded-full bg-zinc-800/50 flex items-center justify-center mb-4">
          <Briefcase size={32} className="text-zinc-500" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">No applications yet</h3>
        <p className="text-zinc-400 mb-6 max-w-md">
          You haven't applied to any jobs yet. Start exploring opportunities and your applications will appear here.
        </p>
        <Button
          as={Link}
          href="/browse-jobs"
          className="h-11 rounded-[14px] bg-gradient-to-r from-[#0088FF] to-[#0055FF] hover:from-[#339FFF] hover:to-[#2277FF] text-white font-bold text-sm transition-all px-6"
        >
          Browse Jobs
        </Button>
      </div>
    );
  }

  // Sort by most recent
  const sortedApplications = [...applications].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Generate deterministic mock statuses for UI demonstration
  const enrichedApps = sortedApplications.map((app, index) => {
    // We use a simple hash of the index to pick a status so it's stable
    const mockStatus = STATUS_KEYS[index % STATUS_KEYS.length];
    return { ...app, uiStatus: mockStatus };
  });

  const totalApplied = enrichedApps.length;
  const shortlistedCount = enrichedApps.filter(a => a.uiStatus === 'Shortlisted').length;
  const interviewsCount = enrichedApps.filter(a => a.uiStatus === 'Review' || a.uiStatus === 'Offered').length;
  const successRate = totalApplied > 0 
    ? Math.round((enrichedApps.filter(a => a.uiStatus === 'Offered').length / totalApplied) * 100) 
    : 0;

  const formatDateString = (dateStr) => {
    if (!dateStr) return "Unknown";
    const date = new Date(dateStr);
    const now = new Date();
    const diffTime = Math.max(0, now - date);
    
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 14) return "1 week ago";
    if (diffDays < 21) return "2 weeks ago";
    if (diffDays < 30) return "3 weeks ago";
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(enrichedApps.length / itemsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, enrichedApps.length);
  const currentApps = enrichedApps.slice(startIndex, endIndex);

  const handlePrevPage = () => {
    if (safeCurrentPage > 1) setCurrentPage(safeCurrentPage - 1);
  };

  const handleNextPage = () => {
    if (safeCurrentPage < totalPages) setCurrentPage(safeCurrentPage + 1);
  };

  return (
    <div className="w-full">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">My Applications</h1>
          <p className="text-zinc-400 text-sm">Track your job applications and interview progress in real-time.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-[#1e1e24] rounded-lg p-1 border border-zinc-800">
            <button className="px-4 py-1.5 rounded-md bg-[#2d2d33] text-sm font-medium text-white shadow-sm">
              Active
            </button>
            <button className="px-4 py-1.5 rounded-md text-sm font-medium text-zinc-400 hover:text-zinc-200 transition-colors">
              Archived
            </button>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white text-black text-sm font-semibold rounded-lg hover:bg-zinc-200 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Export PDF
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#1c1c21] border border-zinc-800 rounded-xl p-5 flex flex-col justify-center">
          <p className="text-zinc-400 text-sm font-medium mb-1">Total Applied</p>
          <p className="text-2xl font-bold text-white">{totalApplied}</p>
        </div>
        <div className="bg-[#1c1c21] border border-zinc-800 rounded-xl p-5 flex flex-col justify-center">
          <p className="text-zinc-400 text-sm font-medium mb-1">Shortlisted</p>
          <p className="text-2xl font-bold text-white">{shortlistedCount}</p>
        </div>
        <div className="bg-[#1c1c21] border border-zinc-800 rounded-xl p-5 flex flex-col justify-center">
          <p className="text-zinc-400 text-sm font-medium mb-1">Interviews</p>
          <p className="text-2xl font-bold text-amber-500">{interviewsCount}</p>
        </div>
        <div className="bg-[#1c1c21] border border-zinc-800 rounded-xl p-5 flex flex-col justify-center">
          <p className="text-zinc-400 text-sm font-medium mb-1">Success Rate</p>
          <p className="text-2xl font-bold text-emerald-500">{successRate}%</p>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-[#16161a] border border-zinc-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="py-4 px-6 text-sm font-medium text-zinc-300">Job Title</th>
                <th className="py-4 px-6 text-sm font-medium text-zinc-300">Company</th>
                <th className="py-4 px-6 text-sm font-medium text-zinc-300">Applied</th>
                <th className="py-4 px-6 text-sm font-medium text-zinc-300">Status</th>
                <th className="py-4 px-6 text-sm font-medium text-zinc-300 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentApps.map((app, index) => {
                const statusStyle = STATUS_CONFIG[app.uiStatus];
                
                return (
                  <motion.tr 
                    key={app._id || index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-zinc-800/50 hover:bg-white/[0.02] transition-colors"
                  >
                    {/* Job Title & Logo */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="relative shrink-0">
                          {app.companyLogo ? (
                            <img 
                              src={app.companyLogo} 
                              alt={`${app.companyName} logo`} 
                              className="h-10 w-10 rounded-lg object-cover border border-white/10 bg-[#1a1a1e]"
                            />
                          ) : (
                            <div
                              className="flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold border border-white/10"
                              style={{
                                backgroundColor: app.companyColor ? `${app.companyColor}20` : '#27272a',
                                color: app.companyColor === "#ffffff" ? "#bbb" : (app.companyColor || '#d4d4d8'),
                              }}
                            >
                              {(app.companyName || "C").charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <p className="text-sm font-semibold text-white">{app.jobTitle || "Untitled Job"}</p>
                          <p className="text-[12px] text-zinc-500 mt-0.5">Full-time • Remote</p>
                        </div>
                      </div>
                    </td>

                    {/* Company */}
                    <td className="py-4 px-6 text-sm text-zinc-300">
                      {app.companyName || "Unknown Company"}
                    </td>

                    {/* Applied Date */}
                    <td className="py-4 px-6 text-sm text-zinc-400">
                      {formatDateString(app.createdAt)}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border bg-transparent ${statusStyle.color} ${statusStyle.border}`}>
                        {app.uiStatus}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-4 px-6 text-right">
                      <Link 
                        href={`/browse-jobs/${app.jobId}`}
                        className="inline-flex items-center justify-end gap-1 text-sm font-medium text-white hover:text-[#0088FF] transition-colors"
                      >
                        Details
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                      </Link>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="border-t border-zinc-800 p-4 flex items-center justify-between bg-[#1a1a1f]">
          <p className="text-xs text-zinc-500">
            Showing {enrichedApps.length === 0 ? 0 : startIndex + 1}-{endIndex} of {enrichedApps.length} applications
          </p>
          
          <div className="flex items-center gap-1">
            <button 
              onClick={handlePrevPage}
              disabled={safeCurrentPage === 1}
              className="p-1 rounded text-zinc-500 hover:text-white transition-colors disabled:opacity-30 disabled:hover:text-zinc-500 cursor-pointer disabled:cursor-default"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            
            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNum = i + 1;
              const isActive = pageNum === safeCurrentPage;
              return (
                <button 
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-6 h-6 flex items-center justify-center rounded text-xs font-medium transition-colors ${
                    isActive 
                      ? 'bg-white text-black font-bold' 
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button 
              onClick={handleNextPage}
              disabled={safeCurrentPage === totalPages}
              className="p-1 rounded text-zinc-500 hover:text-white transition-colors disabled:opacity-30 disabled:hover:text-zinc-500 cursor-pointer disabled:cursor-default"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
