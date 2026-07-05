"use client";

import { useState, useEffect, useMemo } from "react";
import { useSession } from "@/lib/auth-client";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import JobCard from "@/components/JobCard";
import { getSavedJobs } from "@/lib/api/saved-jobs";
import { getMyAppliedJobIds } from "@/lib/actions/applications";
import { Spinner, Button } from "@heroui/react";
import { Bookmark, Briefcase, Magnifier } from "@gravity-ui/icons";
import Link from "next/link";

const colors = [
  "#635BFF", "#A259FF", "#10A37F", "#FF6B6B", "#5E6AD2", "#0088FF"
];

export default function SavedJobsPage() {
  const { data: session } = useSession();
  const [jobs, setJobs] = useState([]);
  const [appliedJobIds, setAppliedJobIds] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters and Pagination State
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [applicationFilter, setApplicationFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortBy, sortOrder, applicationFilter]);

  useEffect(() => {
    const fetchData = async () => {
      if (session?.user?.id) {
        try {
          const [jobsRes, appliedRes] = await Promise.all([
            getSavedJobs(session.user.id),
            getMyAppliedJobIds(session.user.id)
          ]);
          
          if (Array.isArray(jobsRes)) {
            // Setup defaults so JobCard can render properly
            const formattedJobs = jobsRes.map((job, idx) => ({
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
              companyColor: colors[idx % colors.length],
            }));
            setJobs(formattedJobs);
          }
          if (appliedRes?.appliedJobIds) {
            setAppliedJobIds(appliedRes.appliedJobIds);
          }
        } catch (err) {
          console.error("Failed to fetch saved jobs:", err);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [session?.user?.id]);

  const handleSaveToggle = (jobId, isSaved) => {
    if (!isSaved) {
      // Remove from the list visually immediately
      setJobs(prev => prev.filter(j => (j._id || j.id) !== jobId));
    }
  };

  // Filter and Sort Logic
  const filteredJobs = useMemo(() => {
    let result = [...jobs];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (job) =>
          (job.title && job.title.toLowerCase().includes(q)) ||
          (job.company && job.company.toLowerCase().includes(q))
      );
    }

    if (applicationFilter !== "all") {
      const isApplied = applicationFilter === "applied";
      result = result.filter(job => {
        const hasApplied = appliedJobIds.includes(job._id || job.id);
        return isApplied ? hasApplied : !hasApplied;
      });
    }

    result.sort((a, b) => {
      let valA, valB;
      if (sortBy === "createdAt") {
        valA = new Date(a.createdAt || 0).getTime();
        valB = new Date(b.createdAt || 0).getTime();
      } else if (sortBy === "title") {
        valA = (a.title || "").toLowerCase();
        valB = (b.title || "").toLowerCase();
      } else if (sortBy === "company") {
        valA = (a.company || "").toLowerCase();
        valB = (b.company || "").toLowerCase();
      }

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [jobs, searchQuery, sortBy, sortOrder, applicationFilter, appliedJobIds]);

  // Pagination Logic
  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / itemsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredJobs.length);
  const currentJobs = filteredJobs.slice(startIndex, endIndex);

  const handlePrevPage = () => {
    if (safeCurrentPage > 1) setCurrentPage(safeCurrentPage - 1);
  };

  const handleNextPage = () => {
    if (safeCurrentPage < totalPages) setCurrentPage(safeCurrentPage + 1);
  };

  return (
    <div className="flex flex-col min-h-full pb-8">
      <DashboardHeader />

      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
          <Bookmark className="text-[#0088FF]" size={28} />
          Saved Jobs
        </h2>
        <p className="text-sm text-zinc-500 mt-2">
          Keep track of the jobs you are interested in.
        </p>
      </div>

      <div className="flex-1 w-full">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Spinner size="lg" color="primary" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center text-zinc-500 py-20 rounded-3xl border border-zinc-800/60 bg-zinc-950/40 shadow-xl">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 mb-6">
              <Bookmark size={32} className="text-zinc-600" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No saved jobs yet</h3>
            <p className="text-sm mb-6 max-w-sm mx-auto">
              You haven't bookmarked any opportunities. Browse our job board to find roles that match your skills.
            </p>
            <Link 
              href="/browse-jobs"
              className="inline-flex h-11 items-center justify-center rounded-[14px] bg-white px-6 text-sm font-bold text-black hover:bg-zinc-200 transition-colors"
            >
              <Briefcase size={18} className="mr-2" />
              Browse Jobs
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {/* Filters bar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
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

              {/* Dropdowns Container */}
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                {/* Application Status Dropdown */}
                <select
                  value={applicationFilter}
                  onChange={(e) => setApplicationFilter(e.target.value)}
                  className="h-11 px-4 rounded-xl border border-zinc-900 bg-zinc-950/80 text-sm text-white placeholder-zinc-500 outline-none focus:border-[#0088FF]/50 transition-colors cursor-pointer w-full sm:w-auto"
                >
                  <option value="all">All Saved Jobs</option>
                  <option value="applied">Applied</option>
                  <option value="not-applied">Not Applied</option>
                </select>

                {/* Sort Dropdown */}
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [field, order] = e.target.value.split("-");
                    setSortBy(field);
                    setSortOrder(order);
                  }}
                  className="h-11 px-4 rounded-xl border border-zinc-900 bg-zinc-950/80 text-sm text-white placeholder-zinc-500 outline-none focus:border-[#0088FF]/50 transition-colors cursor-pointer w-full sm:w-auto"
                >
                  <option value="createdAt-desc">Recently Saved</option>
                  <option value="createdAt-asc">Oldest Saved</option>
                  <option value="title-asc">Title (A-Z)</option>
                  <option value="title-desc">Title (Z-A)</option>
                  <option value="company-asc">Company (A-Z)</option>
                  <option value="company-desc">Company (Z-A)</option>
                </select>
              </div>
            </div>

            {filteredJobs.length === 0 ? (
              <div className="text-center text-zinc-500 py-12 rounded-2xl border border-zinc-800/60 bg-zinc-950/40">
                <p>No jobs found matching your search.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {currentJobs.map((job) => (
                  <JobCard 
                    key={job.id} 
                    job={job} 
                    hasApplied={appliedJobIds.includes(job._id || job.id)} 
                    isSavedProp={true}
                    onSaveToggle={handleSaveToggle}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {filteredJobs.length > 0 && (
              <div className="flex flex-col sm:flex-row justify-between items-center mt-2 pt-6 border-t border-zinc-900 gap-4">
                <p className="text-xs text-zinc-500">
                  Showing {startIndex + 1}-{endIndex} of {filteredJobs.length} saved jobs
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
            )}
          </div>
        )}
      </div>
    </div>
  );
}
