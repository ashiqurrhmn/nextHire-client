"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Chip, Button } from "@heroui/react";
import { Briefcase, Clock, Globe, MapPin, TagDollar, OfficeBadge, Check, Star } from "@gravity-ui/icons";

export default function JobCard({ job }) {
  const [isOpen, setIsOpen] = useState(false);

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
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ type: "spring", stiffness: 70, damping: 16 }}
        whileHover={{
          y: -8,
          transition: { type: "spring", stiffness: 300, damping: 20 },
        }}
        className="group relative flex flex-col rounded-[24px] border border-zinc-800/60 bg-gradient-to-b from-[#16161a]/90 to-[#0a0a0c]/90 backdrop-blur-xl p-5 sm:p-6 transition-all duration-500 hover:border-[#0088FF]/30 hover:shadow-[0_20px_80px_rgba(0,136,255,0.08),0_0_0_1px_rgba(0,136,255,0.1)] cursor-pointer overflow-hidden"
      >
        {/* Decorative background flare */}
        <div className="absolute -top-24 -right-24 w-56 h-56 bg-gradient-to-bl from-[#0088FF]/10 to-transparent rounded-full blur-[50px] group-hover:from-[#0088FF]/20 transition-all duration-700 pointer-events-none" />

        <div className="relative z-10 flex flex-col h-full">
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-4">
              <div className="relative">
                {job.companyLogo || job.logo ? (
                  <img 
                    src={job.companyLogo || job.logo} 
                    alt={`${job.company} logo`} 
                    className="h-12 w-12 sm:h-14 sm:w-14 rounded-[14px] object-cover border border-white/10 bg-[#1a1a1e] shadow-lg group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div
                    className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-[14px] text-base font-bold border border-white/10 shadow-lg group-hover:scale-105 transition-transform duration-500"
                    style={{
                      backgroundColor: `${job.companyColor}20`,
                      color: job.companyColor === "#ffffff" ? "#bbb" : job.companyColor,
                    }}
                  >
                    {job.company.charAt(0)}
                  </div>
                )}
                {/* Status indicator dot */}
                <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#0a0a0c]">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                </span>
              </div>
              <div>
                <p className="text-sm font-bold text-zinc-200 group-hover:text-white transition-colors">{job.company}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[11px] font-medium text-zinc-500">{job.postedAgo}</span>
                  <span className="h-1 w-1 rounded-full bg-zinc-700" />
                  <span className="text-[11px] font-medium text-zinc-500 flex items-center gap-1">
                    {job.isRemote ? <Globe size={10} className="text-emerald-500/70" /> : <MapPin size={10} className="text-[#0088FF]/70" />}
                    {job.isRemote ? "Remote" : "On-site"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-white/5 border border-white/5 text-zinc-400 group-hover:bg-[#0088FF]/10 group-hover:text-[#0088FF] group-hover:border-[#0088FF]/20 transition-all shadow-inner">
              <OfficeBadge size={14} />
            </div>
          </div>

          <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight mb-4 group-hover:text-[#0088FF] transition-colors duration-300 leading-snug line-clamp-2">
            {job.title}
          </h3>

          <div className="flex flex-wrap items-center gap-2 mb-5">
            <Chip size="sm" variant="flat" className="bg-[#0088FF]/10 text-[#0088FF] border border-[#0088FF]/20 font-semibold px-2 py-4 rounded-lg">
              <span className="flex items-center gap-1.5"><Briefcase size={12} /> {job.category}</span>
            </Chip>
            <Chip size="sm" variant="flat" className="bg-purple-500/10 text-purple-400 border border-purple-500/20 font-semibold px-2 py-4 rounded-lg">
              <span className="flex items-center gap-1.5"><Clock size={12} /> {job.type}</span>
            </Chip>
          </div>

          

          <div className="mt-auto pt-4 border-t border-zinc-800/60 flex items-center justify-between mb-6">
            <div>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Salary Range</p>
              <div className="flex items-center gap-1.5">
                <TagDollar size={16} className="text-[#0088FF]" />
                <span className="text-base sm:text-lg font-bold text-white">${job.minSalary}</span>
                <span className="text-xs text-zinc-600">–</span>
                <span className="text-base sm:text-lg font-bold text-white">${job.maxSalary}</span>
              </div>
            </div>
            
            {!job.isRemote && (
              <div className="text-right">
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Location</p>
                <span className="text-sm font-semibold text-zinc-300">
                  {job.location?.split(",")[0] || "N/A"}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Button 
              onPress={() => setIsOpen(true)}
              className="flex-1 h-11 rounded-xl bg-zinc-800/50 hover:bg-zinc-700 border border-zinc-700/50 hover:border-zinc-500 text-white font-semibold text-sm transition-all shadow-sm"
            >
              Details
            </Button>
            <Button 
              className="flex-1 h-11 rounded-xl bg-gradient-to-r from-[#0088FF] to-[#0055FF] hover:from-[#339FFF] hover:to-[#2277FF] text-white font-bold text-sm shadow-[0_4px_14px_rgba(0,136,255,0.3)] transition-all"
            >
              Apply Now
            </Button>
          </div>
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
                <Button className="h-12 rounded-xl bg-gradient-to-r from-[#0088FF] to-[#0055FF] hover:from-[#339FFF] hover:to-[#2277FF] text-white font-bold px-10 shadow-[0_4px_14px_rgba(0,136,255,0.3)] text-base">
                  Apply for this job
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
