"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@heroui/react";
import { ArrowLeft, Briefcase, Magnifier } from "@gravity-ui/icons";
import { getAllJobs } from "@/lib/api/jobs";
import JobCard from "@/components/JobCard";

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

export default function BrowseJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 9;

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getAllJobs("active");
        if (Array.isArray(data)) {
          const formattedJobs = data.map((job, idx) => ({
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
          
          formattedJobs.forEach(job => {
            if (!job.tags || job.tags.length === 0) {
              job.tags = [job.category, job.type];
            }
          });
          
          setJobs(formattedJobs);
        }
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage) || 1;
  const displayedJobs = filteredJobs.slice(
    (currentPage - 1) * jobsPerPage,
    currentPage * jobsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };
  return (
    <div className="bg-black grow flex flex-col">
      <section className="relative overflow-hidden px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Ambient background glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#0088FF]/[0.06] rounded-full blur-[150px] pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-4xl flex flex-col items-center text-center">


          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 80, damping: 14, delay: 0.15 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-3 leading-[1.1]"
          >
            Browse{" "}
            <span className="bg-gradient-to-r from-[#0088FF] to-[#00AAFF] bg-clip-text text-transparent">
              Jobs
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 80, damping: 14, delay: 0.2 }}
            className="text-zinc-400 text-base sm:text-lg max-w-xl mb-8 leading-relaxed"
          >
            Explore thousands of opportunities from top companies. Filter by
            role, location, and salary to find your perfect match.
          </motion.p>

          {/* Search Placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 80, damping: 14, delay: 0.25 }}
            className="w-full max-w-2xl"
          >
            <div className="rounded-2xl border border-zinc-800/80 bg-[#121214]/90 backdrop-blur-md p-2 flex items-center gap-2 shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
              <div className="flex-1 flex items-center gap-3 px-3 py-3">
                <Magnifier size={18} className="text-zinc-500 shrink-0" />
                <input
                  type="text"
                  placeholder="Search jobs by title, category, or company..."
                  className="w-full bg-transparent text-white placeholder-zinc-500 text-sm focus:outline-none"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
              <Button
                className="h-11 rounded-[14px] bg-gradient-to-r from-[#0088FF] to-[#0055FF] px-5 text-sm font-bold text-white shadow-[0_4px_14px_rgba(0,136,255,0.3)] hover:from-[#339FFF] hover:to-[#2277FF]"
              >
                Search
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Jobs Grid Section */}
        <div className="relative z-10 mx-auto max-w-7xl mt-8">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0088FF]"></div>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center text-zinc-500 py-12">
              <Briefcase size={48} className="mx-auto mb-4 text-zinc-700" />
              <p className="text-lg font-semibold text-zinc-300">No jobs found</p>
              <p className="text-sm mt-2">Try adjusting your search query.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {displayedJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {!loading && totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center items-center gap-6 mt-12 mb-8"
            >
              <Button
                onClick={handlePrevPage}
                isDisabled={currentPage === 1}
                className="h-11 rounded-[14px] bg-zinc-900/60 border border-zinc-800 hover:border-[#0088FF]/40 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold text-zinc-300 hover:text-white transition-all duration-300 backdrop-blur-sm px-6"
              >
                Previous
              </Button>
              
              <span className="text-sm font-medium text-zinc-400">
                Page <span className="text-white font-bold">{currentPage}</span> of <span className="text-white font-bold">{totalPages}</span>
              </span>

              <Button
                onClick={handleNextPage}
                isDisabled={currentPage === totalPages}
                className="h-11 rounded-[14px] bg-zinc-900/60 border border-zinc-800 hover:border-[#0088FF]/40 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold text-zinc-300 hover:text-white transition-all duration-300 backdrop-blur-sm px-6"
              >
                Next
              </Button>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
