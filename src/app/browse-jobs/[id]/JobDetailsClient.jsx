"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@heroui/react";
import { ArrowLeft, Briefcase, Clock, MapPin, TagDollar, OfficeBadge, Check, Star, Globe } from "@gravity-ui/icons";
import Link from "next/link";
import ApplyModal from "@/components/ApplyModal";
import { useSession } from "@/lib/auth-client";
import { useRouter, useParams } from "next/navigation";
import { getPlanById } from "@/lib/api/plans";

export default function JobDetailsClient({ job, initialHasApplied = false, totalApplicationsCount = 0 }) {
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [hasApplied, setHasApplied] = useState(initialHasApplied);

  useEffect(() => {
    setHasApplied(initialHasApplied);
  }, [initialHasApplied]);

  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [plan, setPlan] = useState(null);
  
  useEffect(() => {
    if (session?.user?.plan) {
      getPlanById(session.user.plan).then(data => {
        console.log("Fetched plan:", data);
        setPlan(data);
      }).catch(err => console.error("Error fetching plan:", err));
    }
  }, [session?.user?.plan]);

  // Determine limit from plan data or fallback based on plan id
  const planLimit = plan?.application_limit !== undefined 
    ? plan.application_limit 
    : (session?.user?.plan === 'seeker_premium' ? Infinity : session?.user?.plan === 'seeker_pro' ? 30 : 3);
  const isUnlimited = planLimit === Infinity || planLimit === -1;

  const handleApplyClick = () => {
    if (!session?.user) {
      router.push(`/auth/signin?redirect=/browse-jobs/${id}`);
      return;
    }
    
    if (session?.user?.role !== "seeker") {
      alert("Only job seekers can apply for jobs.");
      return;
    }

    if (!isUnlimited && totalApplicationsCount >= planLimit) {
      router.push("/pricing");
      return;
    }

    setIsApplyModalOpen(true);
  };

  if (!job) {
    return (
      <div className="bg-black min-h-screen flex flex-col items-center justify-center text-white px-4">
        <h2 className="text-3xl font-bold mb-4">Job Not Found</h2>
        <p className="text-zinc-400 mb-8">The job you are looking for might have been removed.</p>
        <Link href="/browse-jobs">
          <Button className="bg-[#0088FF] text-white font-bold">Browse Other Jobs</Button>
        </Link>
      </div>
    );
  }

  // Format arrays or multiline strings
  const formatList = (strOrArr) => {
    if (!strOrArr) return [];
    if (Array.isArray(strOrArr)) return strOrArr;
    return strOrArr.split(',').filter(Boolean).map(s => s.trim());
  };

  const formatLines = (str) => {
    if (!str) return [];
    return str.split('\n').filter(Boolean).map(s => s.replace(/^[-•*]\s*/, '').trim());
  };

  const title = job.title || job.jobTitle || "Untitled Job";
  const company = job.company || job.companyName || "Unknown Company";
  const location = job.location || "N/A";
  const type = job.jobType || job.type || "Full-time";
  const category = job.jobCategory || job.category || "General";
  const minSalary = job.minSalary || job.salaryMin || "0";
  const maxSalary = job.maxSalary || job.salaryMax || "0";

  return (
    <div className="bg-black min-h-screen pt-10 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="relative z-10 max-w-4xl mx-auto">
        {(!session?.user || session?.user?.role === "seeker") && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 bg-gradient-to-r from-[#0088FF]/10 to-purple-500/10 border border-[#0088FF]/20 rounded-[16px] p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 backdrop-blur-md"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-[#0088FF]/20 flex items-center justify-center shrink-0">
              <Briefcase size={20} className="text-[#0088FF]" />
            </div>
            <div>
              <p className="text-sm sm:text-base font-semibold text-white mb-0.5">{plan?.name || "Free"} Plan Quota</p>
              <p className="text-xs sm:text-sm text-zinc-400">
                {isUnlimited 
                  ? `You have applied to ${totalApplicationsCount} jobs (Unlimited).`
                  : `You have applied to ${totalApplicationsCount} out of ${planLimit} jobs.`}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-start sm:items-end w-full sm:w-auto">
            {!isUnlimited && (
              <div className="flex gap-[2px] sm:gap-1 mb-1.5 w-full sm:w-[280px] justify-start sm:justify-end">
                {Array.from({ length: planLimit }).map((_, i) => {
                  const num = i + 1;
                  return (
                    <div key={num} className={`h-1.5 flex-1 max-w-[32px] rounded-full transition-all duration-500 ${num <= totalApplicationsCount ? 'bg-gradient-to-r from-[#0088FF] to-[#0055FF] shadow-[0_0_8px_rgba(0,136,255,0.5)]' : 'bg-zinc-800'}`} />
                  );
                })}
              </div>
            )}
            {!isUnlimited && totalApplicationsCount >= planLimit ? (
              <Link href="/pricing" className="text-[11px] font-bold tracking-wider uppercase text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1">
                Upgrade Plan 
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
              </Link>
            ) : isUnlimited ? (
              <span className="text-[11px] font-bold tracking-wider uppercase text-[#0088FF]">Unlimited applications</span>
            ) : (
              <span className="text-[11px] font-bold tracking-wider uppercase text-[#0088FF]">{Math.max(0, planLimit - totalApplicationsCount)} remaining</span>
            )}
          </div>
        </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link href="/browse-jobs" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to jobs</span>
          </Link>
        </motion.div>

        {/* Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-b from-[#16161a]/90 to-[#0a0a0c]/90 backdrop-blur-xl border border-zinc-800/80 rounded-[24px] p-6 sm:p-8 mb-6 shadow-2xl relative overflow-hidden"
        >
          {/* Subtle flare inside card */}
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-[#0088FF]/10 rounded-full blur-[60px] pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
            <div className="flex items-center gap-5">
              {job.companyLogo || job.logo ? (
                <img 
                  src={job.companyLogo || job.logo} 
                  alt={`${company} logo`} 
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-[16px] object-cover bg-white/5 border border-white/10 shadow-lg shrink-0" 
                />
              ) : (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-[16px] bg-[#1a1a1e] border border-white/10 shadow-lg flex items-center justify-center text-2xl font-bold text-white shrink-0">
                  {company.charAt(0)}
                </div>
              )}
              
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-1.5 leading-tight">
                  {title}
                </h1>
                <p className="text-base text-zinc-400 flex flex-wrap items-center gap-2 sm:gap-2.5">
                  <span className="font-semibold text-zinc-200">{company}</span>
                  <span className="text-zinc-600">•</span>
                  <span className="flex items-center gap-1.5"><MapPin size={14} /> {location}</span>
                </p>
              </div>
            </div>

            {session?.user?.role === "recruiter" ? (
              <div className="text-sm font-medium text-red-400 bg-red-400/10 border border-red-400/20 px-4 py-2.5 rounded-xl text-center md:text-left shrink-0">
                Recruiters cannot apply for jobs.
              </div>
            ) : (
              <Button
                onPress={handleApplyClick}
                isDisabled={hasApplied}
                className={`w-full md:w-auto h-11 px-6 rounded-xl font-bold text-sm shadow-[0_6px_20px_rgba(0,136,255,0.3)] transition-all shrink-0 data-[disabled=true]:opacity-50 text-white ${!isUnlimited && totalApplicationsCount >= planLimit && !hasApplied ? 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 shadow-[0_6px_20px_rgba(168,85,247,0.3)]' : 'bg-gradient-to-r from-[#0088FF] to-[#0055FF] hover:from-[#339FFF] hover:to-[#2277FF]'}`}
              >
                {hasApplied ? "Applied" : (!isUnlimited && totalApplicationsCount >= planLimit) ? "Upgrade to Apply" : "Apply Now"}
              </Button>
            )}
          </div>

          <div className="relative z-10 flex flex-wrap gap-2 mt-6 pt-6 border-t border-zinc-800/60">
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-900/50 border border-zinc-800 text-zinc-300 font-medium text-sm">
              <Briefcase size={16} className="text-[#0088FF]" /> {category}
            </div>
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-900/50 border border-zinc-800 text-zinc-300 font-medium text-sm">
              <Clock size={16} className="text-purple-400" /> {type}
            </div>
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-900/50 border border-zinc-800 text-zinc-300 font-medium text-sm">
              <TagDollar size={16} className="text-emerald-400" /> ${minSalary} - ${maxSalary}/yr
            </div>
            {job.isRemote && (
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-900/50 border border-zinc-800 text-zinc-300 font-medium text-sm">
                <Globe size={16} className="text-pink-400" /> Remote OK
              </div>
            )}
          </div>
        </motion.div>

        {/* Content Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#121214] border border-zinc-800/80 rounded-[24px] p-6 sm:p-8 mb-12 shadow-xl"
        >
          <div className="space-y-10">
            {job.description && (
              <section>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Star size={20} className="text-[#0088FF]" /> About the Role
                </h3>
                <div className="prose prose-invert max-w-none text-zinc-300 leading-relaxed text-sm sm:text-base">
                  {job.description.split('\n').map((paragraph, i) => (
                    <p key={i} className="mb-3">{paragraph}</p>
                  ))}
                </div>
              </section>
            )}

            {job.responsibilities && (
              <section>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <OfficeBadge size={20} className="text-emerald-400" /> Key Responsibilities
                </h3>
                <ul className="space-y-3">
                  {formatLines(job.responsibilities).map((res, i) => (
                    <li key={i} className="flex items-start gap-3 text-zinc-300 text-sm sm:text-base">
                      <span className="text-emerald-500 mt-1 flex-shrink-0">•</span> <span>{res}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {job.requirements && (
              <section>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Check size={20} className="text-purple-400" /> Requirements
                </h3>
                <ul className="space-y-3">
                  {formatList(job.requirements).map((req, i) => (
                    <li key={i} className="flex items-start gap-3 text-zinc-300 text-sm sm:text-base">
                      <span className="text-purple-500 mt-1 flex-shrink-0">•</span> <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {job.benefits && (
              <section>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Star size={20} className="text-pink-400" /> Benefits & Perks
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {formatList(job.benefits).map((ben, i) => (
                    <li key={i} className="flex items-center gap-2.5 p-3 rounded-xl bg-zinc-900/40 border border-zinc-800/60 text-zinc-300 text-sm sm:text-base">
                      <span className="text-pink-500 flex-shrink-0"><Check size={16} /></span> <span>{ben}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </motion.div>
      </div>

      <ApplyModal 
        job={job} 
        isOpen={isApplyModalOpen} 
        onClose={() => setIsApplyModalOpen(false)} 
        onApplied={() => setHasApplied(true)}
        user={session?.user}
      />
    </div>
  );
}
