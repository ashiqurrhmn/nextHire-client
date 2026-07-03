"use client";

import { useState } from "react";
import { useSession } from "@/lib/auth-client";
import { motion, AnimatePresence } from "framer-motion";
import { Chip, Button, toast } from "@heroui/react";
import { Briefcase, Clock, Globe, MapPin, TagDollar, OfficeBadge, Check, Star, Bookmark } from "@gravity-ui/icons";
import Link from "next/link";
import { toggleSaveJob } from "@/lib/api/saved-jobs";

export default function JobCard({ job, hasApplied = false, isSavedProp = false, onSaveToggle = () => {} }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(isSavedProp);
  const [isSaving, setIsSaving] = useState(false);
  const { data: session } = useSession();

  const handleSaveToggle = async (e) => {
    e.stopPropagation();
    if (!session?.user?.id) {
       toast.error("Please log in to save jobs");
       return;
    }
    if (isSaving) return;

    setIsSaving(true);
    const newStatus = !isSaved;
    setIsSaved(newStatus);
    onSaveToggle(job._id || job.id, newStatus);
    
    try {
      await toggleSaveJob(session.user.id, job._id || job.id);
      toast.success(newStatus ? "Job saved" : "Job removed from saved");
    } catch(err) {
      console.error(err);
      setIsSaved(!newStatus);
      onSaveToggle(job._id || job.id, !newStatus);
      toast.error("Failed to save job");
    } finally {
      setIsSaving(false);
    }
  };

  // Helper to format tags string or array
  const formatList = (strOrArr) => {
    if (!strOrArr) return [];
    if (Array.isArray(strOrArr)) return strOrArr;
    return strOrArr.split(',').filter(Boolean).map(s => s.trim());
  };

  // Helper to format multiline text
  const formatLines = (str) => {
    if (!str) return [];
    return str.split('\n').filter(Boolean).map(s => s.replace(/^[-•*]\s*/, '').trim());
  };

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ type: "spring", stiffness: 70, damping: 16 }}
        className="group relative flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-[16px] border border-zinc-800/60 bg-[#121214]/80 backdrop-blur-xl p-4 sm:p-5 transition-all duration-300 hover:border-[#0088FF]/30 hover:bg-[#16161a] cursor-pointer overflow-hidden gap-4 sm:gap-6"
      >
        <div className="flex items-start gap-4 flex-1">
          {/* Logo */}
          <div className="relative shrink-0">
            {job.companyLogo || job.logo ? (
              <img 
                src={job.companyLogo || job.logo} 
                alt={`${job.company} logo`} 
                className="h-12 w-12 rounded-[12px] object-cover border border-white/10 bg-[#1a1a1e] shadow-sm"
              />
            ) : (
              <div
                className="flex h-12 w-12 items-center justify-center rounded-[12px] text-lg font-bold border border-white/10 shadow-sm"
                style={{
                  backgroundColor: `${job.companyColor}20`,
                  color: job.companyColor === "#ffffff" ? "#bbb" : job.companyColor,
                }}
              >
                {job.company.charAt(0)}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col gap-1.5 flex-1 mt-0.5">
            <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-[#0088FF] transition-colors line-clamp-1">
              {job.title}
            </h3>
            <p className="text-sm font-medium text-zinc-400">
              {job.company} <span className="mx-1.5">•</span> {job.location || (job.isRemote ? "Remote" : "N/A")}
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-2">
              <span className="flex items-center gap-1.5 text-[13px] font-medium text-zinc-300">
                <TagDollar size={14} className="text-zinc-500" />
                ${job.minSalary} - ${job.maxSalary}
              </span>
              <span className="flex items-center gap-1.5 text-[13px] font-medium text-zinc-300">
                <Clock size={14} className="text-zinc-500" />
                {job.type}
              </span>
              <span className="flex items-center gap-1.5 text-[13px] font-medium text-zinc-300">
                <Briefcase size={14} className="text-zinc-500" />
                {job.category}
              </span>
            </div>
          </div>
        </div>

        {/* View Button & Save Action */}
        <div className="shrink-0 w-full sm:w-auto mt-2 sm:mt-0 flex items-center gap-2">
          {session?.user?.role !== "recruiter" && session?.user?.role !== "admin" && (
            <button
              onClick={handleSaveToggle}
              className={`flex h-10 w-10 items-center justify-center rounded-[10px] transition-all border ${
                isSaved 
                  ? "bg-[#0088FF]/10 border-[#0088FF]/30 text-[#0088FF] hover:bg-[#0088FF]/20" 
                  : "bg-zinc-800/50 border-zinc-700/50 text-zinc-400 hover:text-white hover:bg-zinc-700"
              }`}
              title={isSaved ? "Remove from saved" : "Save job"}
            >
              <Bookmark size={18} className={isSaved ? "fill-current" : ""} />
            </button>
          )}
          <Button 
            onPress={() => setIsOpen(true)}
            className="flex-1 sm:flex-none h-10 rounded-[10px] bg-zinc-800/50 hover:bg-zinc-700 border border-zinc-700/50 text-white font-semibold text-sm transition-all shadow-sm px-5 flex justify-center items-center gap-2"
          >
            View <span className="text-lg leading-none mb-0.5">→</span>
          </Button>
        </div>
      </motion.article>

      {/* Custom Framer Motion Details Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-3xl max-h-[70vh] mt-24 overflow-y-auto flex flex-col bg-[#131315] border border-zinc-800/80 rounded-2xl shadow-2xl z-10 custom-scrollbar"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors z-20"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>

              <div className="flex flex-col gap-1 pt-8 px-6 sm:px-10 pb-6 border-b border-zinc-800/60">
                <div className="flex items-center gap-5 mb-5 pr-12">
                  {job.companyLogo || job.logo ? (
                    <img src={job.companyLogo || job.logo} alt="logo" className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl object-cover bg-white/5 border border-white/10 shadow-lg" />
                  ) : (
                    <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl text-xl sm:text-2xl font-bold border border-white/10 shadow-lg flex-shrink-0" style={{ backgroundColor: `${job.companyColor}20`, color: job.companyColor }}>
                      {job.company.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-1">{job.title}</h2>
                    <p className="text-zinc-400 font-medium text-sm sm:text-base">{job.company} • {job.location || "Remote"}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Chip variant="flat" className="bg-[#0088FF]/10 text-[#0088FF] border border-[#0088FF]/20 font-semibold px-2 py-4 rounded-lg">{job.category}</Chip>
                  <Chip variant="flat" className="bg-purple-500/10 text-purple-400 border border-purple-500/20 font-semibold px-2 py-4 rounded-lg">{job.type}</Chip>
                  <Chip variant="flat" className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold px-2 py-4 rounded-lg">${job.minSalary} - ${job.maxSalary}/yr</Chip>
                </div>
              </div>

              <div className="px-6 sm:px-10 py-8 text-zinc-300">
                <div className="space-y-10">
                  {job.description && (
                    <section>
                      <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Star size={20} className="text-[#0088FF]" /> About the Role
                      </h4>
                      <p className="text-[15px] leading-relaxed text-zinc-400 whitespace-pre-wrap">{job.description}</p>
                    </section>
                  )}

                  {job.responsibilities && (
                    <section>
                      <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <OfficeBadge size={20} className="text-emerald-400" /> Key Responsibilities
                      </h4>
                      <ul className="space-y-3">
                        {formatLines(job.responsibilities).map((res, i) => (
                          <li key={i} className="flex items-start gap-3 text-[15px] text-zinc-400">
                            <span className="text-emerald-500 mt-1 flex-shrink-0">•</span> <span>{res}</span>
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}

                  {job.requirements && (
                    <section>
                      <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Check size={20} className="text-purple-400" /> Requirements
                      </h4>
                      <ul className="space-y-3">
                        {formatList(job.requirements).map((req, i) => (
                          <li key={i} className="flex items-start gap-3 text-[15px] text-zinc-400">
                            <span className="text-purple-500 mt-1 flex-shrink-0">•</span> <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}

                  {job.benefits && (
                    <section>
                      <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Star size={20} className="text-pink-400" /> Benefits
                      </h4>
                      <ul className="space-y-3">
                        {formatList(job.benefits).map((ben, i) => (
                          <li key={i} className="flex items-start gap-3 text-[15px] text-zinc-400">
                            <span className="text-pink-500 mt-1 flex-shrink-0">•</span> <span>{ben}</span>
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}
                </div>
              </div>

              <div className="px-6 sm:px-10 pb-8 pt-6 flex justify-between items-center border-t border-zinc-800/60 bg-[#0a0a0c]/50">
                <Button variant="light" onPress={() => setIsOpen(false)} className="text-zinc-400 hover:text-white font-semibold px-4">
                  Close Details
                </Button>
                {hasApplied ? (
                  <div className="h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold px-10 text-base flex justify-center items-center gap-2 cursor-default">
                    <Check size={16} /> Applied
                  </div>
                ) : session?.user?.role === "recruiter" ? (
                  <div className="h-12 rounded-xl bg-red-400/10 border border-red-400/20 text-red-400 font-bold px-6 sm:px-10 text-sm sm:text-base flex justify-center items-center cursor-not-allowed text-center">
                    Recruiters cannot apply
                  </div>
                ) : (
                  <Link href={`/browse-jobs/${job._id || job.id}`} className="h-12 rounded-xl bg-gradient-to-r from-[#0088FF] to-[#0055FF] hover:from-[#339FFF] hover:to-[#2277FF] text-white font-bold px-10 shadow-[0_4px_14px_rgba(0,136,255,0.3)] text-base flex justify-center items-center">
                    Apply for this job
                  </Link>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
