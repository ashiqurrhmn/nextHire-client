"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Chip } from "@heroui/react";
import {
  Briefcase,
  Clock,
  Globe,
  MapPin,
  TagDollar,
  ArrowRight,
  Sparkles,
} from "@gravity-ui/icons";
import { getAllJobs } from "@/lib/api/jobs";
import JobCard from "@/components/JobCard";
import { useSession } from "@/lib/auth-client";
import { getMyAppliedJobIds } from "@/lib/actions/applications";

const colors = [
  "#635BFF", "#A259FF", "#10A37F", "#FF6B6B", "#5E6AD2", "#0088FF"
];

const calculateTimeAgo = (dateStr) => {
  if (!dateStr) return "Just now";
  const date = new Date(dateStr);
  const now = new Date();
  const diffInMs = now - date;
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  if (diffInDays === 0) {
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    return diffInHours > 0 ? `${diffInHours}h ago` : "Just now";
  }
  return `${diffInDays}d ago`;
};

const headingVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 14,
    },
  },
};

export default function FeaturedJobs() {
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appliedJobIds, setAppliedJobIds] = useState([]);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getAllJobs("active");
        if (Array.isArray(data)) {
          // Add extra frontend-only properties for display
          const formattedJobs = data.slice(0, 6).map((job, idx) => ({
            ...job,
            id: job._id || idx,
            company: job.companyName || "Unknown Company",
            title: job.jobTitle || job.title || "Untitled Job",
            category: job.jobCategory || job.category || "General",
            type: job.jobType || job.type || "Full-time",
            location: job.location || "N/A",
            isRemote: job.isRemote || false,
            minSalary: job.minSalary || job.salaryMin || "0",
            maxSalary: job.maxSalary || job.salaryMax || "0",
            currency: job.currency || "USD",
            postedAgo: calculateTimeAgo(job.createdAt),
            companyColor: colors[idx % colors.length],
            tags: job.requirements 
              ? job.requirements.split(',').map(t => t.trim()).slice(0,3).filter(t => t.length > 0 && t.length < 15)
              : [job.jobCategory || "Tech"],
          }));
          
          // Ensure we always have some tags
          formattedJobs.forEach(job => {
            if (!job.tags || job.tags.length === 0) {
              job.tags = [job.category, job.type];
            }
          });
          
          setFeaturedJobs(formattedJobs);
        }
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    const fetchApplied = async () => {
      if (session?.user?.id) {
        try {
          const res = await getMyAppliedJobIds(session.user.id);
          if (res?.appliedJobIds) setAppliedJobIds(res.appliedJobIds);
        } catch (err) {
          console.error("Failed to fetch applied jobs:", err);
        }
      }
    };
    fetchApplied();
  }, [session?.user?.id]);

  return (
    <section className="relative overflow-hidden bg-black px-4 sm:px-6 lg:px-8 pt-24 sm:py-32">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#0088FF]/[0.04] rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[300px] bg-[#FF5E00]/[0.03] rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-50px" }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12"
        >
          <div>
            <motion.div
              variants={headingVariants}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0088FF]/[0.08] border border-[#0088FF]/20 mb-5"
            >
              <Sparkles size={14} className="text-[#0088FF]" />
              <span className="text-[12px] font-semibold tracking-wider text-[#0088FF] uppercase">
                Curated for you
              </span>
            </motion.div>

            <motion.h2
              variants={headingVariants}
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.15]"
            >
              Featured{" "}
              <span className="bg-gradient-to-r from-[#0088FF] to-[#00AAFF] bg-clip-text text-transparent">
                Job Openings
              </span>
            </motion.h2>

            <motion.p
              variants={headingVariants}
              className="mt-4 text-zinc-400 text-base sm:text-lg max-w-xl leading-relaxed"
            >
              Handpicked opportunities from the world's most innovative
              companies. Your next career move starts here.
            </motion.p>
          </div>

          <motion.div variants={headingVariants}>
            <Link
              href="/browse-jobs"
              className="group inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-zinc-900/60 border border-zinc-800 hover:border-[#0088FF]/40 text-sm font-semibold text-zinc-300 hover:text-white transition-all duration-300 hover:shadow-[0_4px_20px_rgba(0,136,255,0.15)] backdrop-blur-sm"
            >
              View All Jobs
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </motion.div>
        </motion.div>

        {/* Jobs Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0088FF]"></div>
          </div>
        ) : featuredJobs.length === 0 ? (
          <div className="text-center text-zinc-500 py-12">No active jobs found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredJobs.map((job) => (
              <JobCard key={job.id} job={job} hasApplied={appliedJobIds.includes(job._id)} />
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ type: "spring", stiffness: 60, damping: 15, delay: 0.3 }}
          className="flex justify-center mt-14"
        >
          <Link href="/browse-jobs">
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#0088FF] to-[#0055FF] hover:from-[#339FFF] hover:to-[#2277FF] text-base font-semibold text-white shadow-[0_8px_25px_rgba(0,136,255,0.25)] hover:shadow-[0_10px_30px_rgba(0,136,255,0.4)] transition-all duration-300 cursor-pointer"
            >
              Browse All Openings
              <ArrowRight size={18} />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
