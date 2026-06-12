"use client";

import { useState, useEffect, useRef, useMemo } from "react";
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

const FilterDropdown = ({ label, options, selected, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`h-11 rounded-[14px] bg-[#121214]/90 border ${selected.length > 0 ? 'border-[#0088FF]/50 text-white' : 'border-zinc-800 text-zinc-300 hover:border-zinc-700'} text-sm font-semibold transition-all duration-300 backdrop-blur-sm px-4 flex items-center gap-2 shadow-sm`}
      >
        {label}
        {selected.length > 0 && (
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#0088FF] text-white text-[11px] font-bold">
            {selected.length}
          </span>
        )}
        <svg className={`w-4 h-4 transition-transform duration-200 opacity-70 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute top-full mt-2 left-0 w-64 bg-[#121214] border border-zinc-800 rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.5)] z-50 overflow-hidden">
          <div className="max-h-60 overflow-y-auto p-2 flex flex-col gap-1 custom-scrollbar">
            {options.map(option => (
              <label key={option} className="flex items-center gap-3 px-3 py-2.5 hover:bg-zinc-800/50 rounded-lg cursor-pointer transition-colors group">
                <input
                  type="checkbox"
                  className="hidden"
                  checked={selected.includes(option)}
                  onChange={() => onChange(option)}
                />
                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors shrink-0 ${selected.includes(option) ? 'bg-[#0088FF] border-[#0088FF]' : 'border-zinc-600 group-hover:border-zinc-500 bg-zinc-900/50'}`}>
                  {selected.includes(option) && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="text-sm text-zinc-300 group-hover:text-white transition-colors select-none line-clamp-1">{option}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default function BrowseJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedWorkTypes, setSelectedWorkTypes] = useState([]);
  const [selectedJobTypes, setSelectedJobTypes] = useState([]);
  const jobsPerPage = 9;

  const uniqueCategories = useMemo(() => {
    const ObjectCategories = new Set(jobs.map(job => job.category));
    return Array.from(ObjectCategories).filter(Boolean).sort();
  }, [jobs]);

  const uniqueJobTypes = useMemo(() => {
    const types = new Set(jobs.map(job => job.type));
    return Array.from(types).filter(Boolean).sort();
  }, [jobs]);

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
    
    // Parse URL search params for initial query
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const q = params.get("q") || "";
      const loc = params.get("loc") || "";
      if (q || loc) {
        setSearchQuery(`${q} ${loc}`.trim());
      }
    }

    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (job.location && job.location.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(job.category);
    
    const isJobRemote = job.isRemote || (job.location && job.location.toLowerCase().includes('remote'));
    const jobWorkType = isJobRemote ? 'Remote' : 'On-site';
    const matchesWorkType = selectedWorkTypes.length === 0 || selectedWorkTypes.includes(jobWorkType);

    const matchesJobType = selectedJobTypes.length === 0 || selectedJobTypes.includes(job.type);

    return matchesSearch && matchesCategory && matchesWorkType && matchesJobType;
  });

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

        <div className="relative z-30 mx-auto max-w-4xl flex flex-col items-center text-center">


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

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 80, damping: 14, delay: 0.25 }}
            className="w-full max-w-5xl flex flex-col md:flex-row items-center gap-4 justify-center"
          >
            {/* Search Input */}
            <div className="w-full md:flex-1 rounded-2xl border border-zinc-800/80 bg-[#121214]/90 backdrop-blur-md p-2 flex items-center gap-2 shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
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

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 justify-center md:justify-end shrink-0">
              {uniqueCategories.length > 0 && (
                <FilterDropdown
                  label="Category"
                  options={uniqueCategories}
                  selected={selectedCategories}
                  onChange={(cat) => {
                    setSelectedCategories(prev => 
                      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
                    );
                    setCurrentPage(1);
                  }}
                />
              )}

              <FilterDropdown
                label="Work Type"
                options={["Remote", "On-site"]}
                selected={selectedWorkTypes}
                onChange={(type) => {
                  setSelectedWorkTypes(prev => 
                    prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
                  );
                  setCurrentPage(1);
                }}
              />

              {uniqueJobTypes.length > 0 && (
                <FilterDropdown
                  label="Job Type"
                  options={uniqueJobTypes}
                  selected={selectedJobTypes}
                  onChange={(type) => {
                    setSelectedJobTypes(prev => 
                      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
                    );
                    setCurrentPage(1);
                  }}
                />
              )}

              {(selectedCategories.length > 0 || selectedWorkTypes.length > 0 || selectedJobTypes.length > 0) && (
                <button
                  onClick={() => {
                    setSelectedCategories([]);
                    setSelectedWorkTypes([]);
                    setSelectedJobTypes([]);
                    setCurrentPage(1);
                  }}
                  className="text-sm text-zinc-400 hover:text-white transition-colors underline underline-offset-4 ml-1"
                >
                  Clear
                </button>
              )}
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
