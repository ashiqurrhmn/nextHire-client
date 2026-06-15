"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button, Chip } from "@heroui/react";
import { Briefcase, Calendar, Check, Envelope, Globe } from "@gravity-ui/icons";

export default function ApplicationsClient({ applications }) {
  if (!applications || applications.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center p-12 text-center rounded-[24px] border border-zinc-800/60 bg-[#121214]/80 backdrop-blur-xl"
      >
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
          className="h-11 rounded-[14px] bg-gradient-to-r from-[#0088FF] to-[#0055FF] hover:from-[#339FFF] hover:to-[#2277FF] text-white font-bold text-sm shadow-[0_4px_14px_rgba(0,136,255,0.3)] transition-all px-6"
        >
          Browse Jobs
        </Button>
      </motion.div>
    );
  }

  // Sort applications by most recent first
  const sortedApplications = [...applications].sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return "Unknown date";
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {sortedApplications.map((app, index) => (
        <motion.div
          key={app._id || index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05, type: "spring", stiffness: 70, damping: 15 }}
          className="group relative flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-[20px] border border-zinc-800/60 bg-gradient-to-b from-[#16161a]/90 to-[#0a0a0c]/90 backdrop-blur-xl p-4 sm:p-5 transition-all duration-300 hover:border-[#0088FF]/30 hover:shadow-[0_12px_40px_rgba(0,136,255,0.08)] overflow-hidden gap-4 sm:gap-6"
        >
          {/* Left part: Logo, Title, Company, Date, Status */}
          <div className="flex items-start gap-4 flex-1 w-full">
            <div className="relative shrink-0">
              {app.companyLogo ? (
                <img 
                  src={app.companyLogo} 
                  alt={`${app.companyName} logo`} 
                  className="h-12 w-12 rounded-[12px] object-cover border border-white/10 bg-[#1a1a1e] shadow-sm mt-0.5"
                />
              ) : (
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-[12px] text-lg font-bold border border-white/10 shadow-sm mt-0.5"
                  style={{
                    backgroundColor: app.companyColor ? `${app.companyColor}20` : '#27272a',
                    color: app.companyColor === "#ffffff" ? "#bbb" : (app.companyColor || '#d4d4d8'),
                  }}
                >
                  {(app.companyName || "C").charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            
            <div className="flex flex-col gap-1.5 flex-1 overflow-hidden">
              <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-[#0088FF] transition-colors leading-tight truncate">
                {app.jobTitle || "Untitled Job"}
              </h3>
              
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <p className="text-sm font-medium text-zinc-400">
                  {app.companyName || "Unknown Company"}
                </p>
                <span className="hidden sm:block w-1 h-1 rounded-full bg-zinc-700"></span>
                <span className="flex items-center gap-1.5 text-[13px] font-medium text-zinc-300">
                  <Calendar size={14} className="text-zinc-500" />
                  {formatDate(app.createdAt)}
                </span>
                <Chip size="sm" variant="flat" className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold h-6 px-2 sm:ml-1">
                  <span className="flex items-center gap-1 text-[11px]"><Check size={10} /> Applied</span>
                </Chip>
              </div>
            </div>
          </div>

          {/* Right part: Contact Details & Action Button */}
          <div className="shrink-0 flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-zinc-800/60">
            {/* Applicant details */}
            <div className="flex flex-col gap-1.5 sm:border-r border-zinc-800/60 sm:pr-6 w-full sm:w-auto">
              <div className="flex items-center gap-2 text-[13px]">
                <Envelope size={14} className="text-zinc-500 shrink-0" />
                <span className="text-zinc-400 max-w-full sm:max-w-[160px] truncate">{app.email}</span>
              </div>
              {app.portfolioUrl && (
                <div className="flex items-center gap-2 text-[13px]">
                  <Globe size={14} className="text-zinc-500 shrink-0" />
                  <a href={app.portfolioUrl} target="_blank" rel="noopener noreferrer" className="text-[#0088FF] hover:underline max-w-full sm:max-w-[160px] truncate">
                    Portfolio Link
                  </a>
                </div>
              )}
            </div>

            <Link 
              href={`/browse-jobs/${app.jobId}`}
              className="w-full sm:w-auto h-10 rounded-[10px] bg-zinc-800/50 hover:bg-zinc-700 border border-zinc-700/50 hover:border-zinc-500 text-white font-semibold text-sm transition-all shadow-sm px-6 flex justify-center items-center"
            >
              View Job
            </Link>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
