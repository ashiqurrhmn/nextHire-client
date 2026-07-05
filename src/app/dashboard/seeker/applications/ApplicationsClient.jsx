"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@heroui/react";
import { Briefcase, Magnifier } from "@gravity-ui/icons";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

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
  const itemsPerPage = 10;
  
  // Filter & Sort states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, sortBy, sortOrder]);

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

  // Filter and Sort logic
  const filteredApplications = useMemo(() => {
    let result = [...enrichedApps];

    // Filter by search query (job title or company name)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (app) =>
          (app.jobTitle && app.jobTitle.toLowerCase().includes(q)) ||
          (app.companyName && app.companyName.toLowerCase().includes(q))
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      result = result.filter((app) => app.uiStatus === statusFilter);
    }

    // Sort
    result.sort((a, b) => {
      let valA, valB;
      if (sortBy === "createdAt") {
        valA = new Date(a.createdAt || 0).getTime();
        valB = new Date(b.createdAt || 0).getTime();
      } else if (sortBy === "jobTitle") {
        valA = (a.jobTitle || "").toLowerCase();
        valB = (b.jobTitle || "").toLowerCase();
      } else if (sortBy === "companyName") {
        valA = (a.companyName || "").toLowerCase();
        valB = (b.companyName || "").toLowerCase();
      }

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [enrichedApps, searchQuery, statusFilter, sortBy, sortOrder]);

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
  const totalPages = Math.max(1, Math.ceil(filteredApplications.length / itemsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredApplications.length);
  const currentApps = filteredApplications.slice(startIndex, endIndex);

  const handlePrevPage = () => {
    if (safeCurrentPage > 1) setCurrentPage(safeCurrentPage - 1);
  };

  const handleNextPage = () => {
    if (safeCurrentPage < totalPages) setCurrentPage(safeCurrentPage + 1);
  };

  return (
    <div className="w-full">
      <DashboardHeader />
      
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
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="flex flex-col justify-between p-5 rounded-2xl border border-zinc-900 bg-zinc-950/40 hover:bg-zinc-950/60 transition-colors text-left">
          <div className="flex items-center justify-between mb-4 w-full">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Total Applied</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 text-zinc-400">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            </div>
          </div>
          <span className="text-3xl font-bold text-white tracking-tight">{totalApplied}</span>
        </div>

        <div className="flex flex-col justify-between p-5 rounded-2xl border border-zinc-900 bg-zinc-950/40 hover:bg-zinc-950/60 transition-colors text-left">
          <div className="flex items-center justify-between mb-4 w-full">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Shortlisted</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-950/50 bg-emerald-950/10 text-emerald-450">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
          </div>
          <span className="text-3xl font-bold text-white tracking-tight">{shortlistedCount}</span>
        </div>

        <div className="flex flex-col justify-between p-5 rounded-2xl border border-zinc-900 bg-zinc-950/40 hover:bg-zinc-950/60 transition-colors text-left">
          <div className="flex items-center justify-between mb-4 w-full">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Interviews</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-amber-950/50 bg-amber-950/10 text-amber-500">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            </div>
          </div>
          <span className="text-3xl font-bold text-amber-500 tracking-tight">{interviewsCount}</span>
        </div>

        <div className="flex flex-col justify-between p-5 rounded-2xl border border-zinc-900 bg-zinc-950/40 hover:bg-zinc-950/60 transition-colors text-left">
          <div className="flex items-center justify-between mb-4 w-full">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Success Rate</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-950/50 bg-emerald-950/10 text-emerald-500">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="20" x2="12" y2="10"></line><line x1="18" y1="20" x2="18" y2="4"></line><line x1="6" y1="20" x2="6" y2="16"></line></svg>
            </div>
          </div>
          <span className="text-3xl font-bold text-emerald-500 tracking-tight">{successRate}%</span>
        </div>
      </div>

      {/* Filters bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
        {/* Search input */}
        <div className="relative w-full md:max-w-md">
          <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Magnifier className="h-4 w-4 text-zinc-500" />
          </span>
          <input
            type="text"
            placeholder="Search by job title or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-10 pr-10 rounded-xl border border-zinc-900 bg-zinc-950/80 text-sm text-white placeholder-zinc-500 outline-none focus:border-[#0088FF]/50 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-3 flex items-center text-zinc-500 hover:text-white text-xs bg-transparent border-0 cursor-pointer"
              type="button"
            >
              ✕
            </button>
          )}
        </div>

        {/* Dropdowns */}
        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-11 px-4 rounded-xl border border-zinc-900 bg-zinc-950/80 text-sm text-white placeholder-zinc-500 outline-none focus:border-[#0088FF]/50 transition-colors cursor-pointer"
          >
            <option value="all">All Statuses</option>
            {STATUS_KEYS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split("-");
              setSortBy(field);
              setSortOrder(order);
            }}
            className="h-11 px-4 rounded-xl border border-zinc-900 bg-zinc-950/80 text-sm text-white placeholder-zinc-500 outline-none focus:border-[#0088FF]/50 transition-colors cursor-pointer"
          >
            <option value="createdAt-desc">Newest Applied</option>
            <option value="createdAt-asc">Oldest Applied</option>
            <option value="jobTitle-asc">Title (A-Z)</option>
            <option value="jobTitle-desc">Title (Z-A)</option>
            <option value="companyName-asc">Company (A-Z)</option>
            <option value="companyName-desc">Company (Z-A)</option>
          </select>
        </div>
      </div>

      {/* Table Section */}
      <div className="rounded-2xl border border-zinc-900 bg-zinc-950/40 p-6 shadow-xl mb-6 flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-400 border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-zinc-900 text-zinc-500 font-semibold text-xs uppercase tracking-wider">
                <th className="pb-3 pr-6 font-semibold text-left">Job Title</th>
                <th className="pb-3 px-6 font-semibold text-left">Company</th>
                <th className="pb-3 px-6 font-semibold text-left">Applied</th>
                <th className="pb-3 px-6 font-semibold text-left">Status</th>
                <th className="pb-3 px-6 font-semibold text-right">Action</th>
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
                    className="border-b border-zinc-900 hover:bg-white/[0.02] transition-colors"
                  >
                    {/* Job Title & Logo */}
                    <td className="py-4 pr-6">
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
                    <td className="py-4 px-6 text-sm">
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
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 pt-6 border-t border-zinc-900 gap-4">
          <p className="text-xs text-zinc-500">
            Showing {filteredApplications.length === 0 ? 0 : startIndex + 1}-{endIndex} of {filteredApplications.length} applications
          </p>
          
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="flat"
              isDisabled={safeCurrentPage === 1}
              onPress={handlePrevPage}
              className="bg-zinc-900 text-zinc-400 hover:bg-zinc-800 disabled:opacity-50 min-w-20"
            >
              Previous
            </Button>
            
            <div className="flex items-center gap-1 hidden sm:flex">
              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs transition-colors ${
                      safeCurrentPage === pageNum
                        ? "bg-[#0088FF] text-white font-bold shadow-md"
                        : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 font-semibold"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <Button
              size="sm"
              variant="flat"
              isDisabled={safeCurrentPage === totalPages}
              onPress={handleNextPage}
              className="bg-zinc-900 text-zinc-400 hover:bg-zinc-800 disabled:opacity-50 min-w-20"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
