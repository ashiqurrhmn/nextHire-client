"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Button,
  Chip,
  Dropdown,
  DropdownTrigger,
  DropdownPopover,
  DropdownMenu,
  DropdownItem,
  Pagination,
  Spinner,
  toast,
} from "@heroui/react";
import {
  Briefcase,
  Calendar,
  Clock,
  Eye,
  Globe,
  Magnifier,
  MapPin,
  Pencil,
  Plus,
  TrashBin,
  TagDollar,
  Sparkles,
} from "@gravity-ui/icons";
import { getCompanyJobs } from "@/lib/api/jobs";
import DashboardHeader from "@/components/dashboard/DashboardHeader";


const RecruiterJobsPage = ({ company, initialJobs }) => {
  const router = useRouter();

  const [jobs, setJobs] = useState(initialJobs || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Fetch jobs on load / company change
  useEffect(() => {
    const fetchJobs = async () => {
      if (!company?._id) return;
      try {
        setLoading(true);
        const data = await getCompanyJobs(company?.id);
        if (data && Array.isArray(data)) {
          setJobs(data);
        } else if (data && data.error) {
          throw new Error(data.error);
        } else {
          setJobs([]);
        }
      } catch (err) {
        console.warn("Failed to fetch jobs from API:", err.message);
        setError("Could not connect to the job database.");
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [company?.id]);

  // Handlers for action column
  const handleDeleteJob = async (jobId) => {
    setJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
    toast.success("Job listing deleted successfully!");

    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      await fetch(`${baseUrl}/api/jobs/${jobId}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.warn("Failed to sync delete with backend API (expected in development):", err);
    }
  };

  const handleToggleStatus = async (jobId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "closed" : "active";
    setJobs((prevJobs) =>
      prevJobs.map((job) =>
        job._id === jobId ? { ...job, status: newStatus } : job
      )
    );
    toast.success(`Job status changed to ${newStatus}!`);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      await fetch(`${baseUrl}/api/jobs/${jobId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (err) {
      console.warn("Failed to sync status update with backend API (expected in development):", err);
    }
  };

  const handleDuplicateJob = (job) => {
    const title = job.jobTitle || job.title || "Untitled Job";
    const duplicated = {
      ...job,
      _id: `job_${Date.now()}`,
      jobTitle: `${title} (Copy)`,
      applicantsCount: 0,
      createdAt: new Date().toISOString().split("T")[0],
      status: "draft",
    };
    setJobs((prevJobs) => [duplicated, ...prevJobs]);
    toast.success(`Duplicated "${title}" as a Draft!`);
  };

  const handleAction = (key, job) => {
    const title = job.jobTitle || job.title || "Untitled Job";
    switch (key) {
      case "view_apps":
        router.push(`/dashboard/recruiter/applications?jobId=${job._id}`);
        break;
      case "edit":
        toast.error(`Editing details for "${title}" is disabled in demo mode.`);
        break;
      case "toggle_status":
        handleToggleStatus(job._id, job.status);
        break;
      case "duplicate":
        handleDuplicateJob(job);
        break;
      case "delete":
        if (confirm(`Are you sure you want to delete the job posting for "${title}"?`)) {
          handleDeleteJob(job._id);
        }
        break;
      default:
        break;
    }
  };

  // Stats counters
  const stats = useMemo(() => {
    return {
      total: jobs.length,
      active: jobs.filter((j) => j.status === "active").length,
      closed: jobs.filter((j) => j.status === "closed").length,
      draft: jobs.filter((j) => j.status === "draft").length,
    };
  }, [jobs]);

  // Filtered & Sorted jobs list
  const filteredJobs = useMemo(() => {
    return jobs
      .filter((job) => {
        const title = (job.jobTitle || job.title || "").toLowerCase();
        const category = (job.jobCategory || job.category || "").toLowerCase();
        const loc = (job.location || "").toLowerCase();

        const matchesSearch =
          title.includes(searchQuery.toLowerCase()) ||
          loc.includes(searchQuery.toLowerCase()) ||
          category.includes(searchQuery.toLowerCase());

        const matchesStatus =
          statusFilter === "all" || job.status === statusFilter;

        const matchesCategory =
          categoryFilter === "all" ||
          (job.jobCategory || job.category || "").toLowerCase() === categoryFilter.toLowerCase();

        return matchesSearch && matchesStatus && matchesCategory;
      })
      .sort((a, b) => {
        let valA = a[sortBy];
        let valB = b[sortBy];

        if (sortBy === "jobTitle") {
          valA = a.jobTitle || a.title || "";
          valB = b.jobTitle || b.title || "";
        } else if (sortBy === "jobCategory") {
          valA = a.jobCategory || a.category || "";
          valB = b.jobCategory || b.category || "";
        }

        if (valA === undefined || valA === null) valA = "";
        if (valB === undefined || valB === null) valB = "";

        if (typeof valA === "string") {
          valA = valA.toLowerCase();
        }
        if (typeof valB === "string") {
          valB = valB.toLowerCase();
        }

        if (valA < valB) return sortOrder === "asc" ? -1 : 1;
        if (valA > valB) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
  }, [jobs, searchQuery, statusFilter, categoryFilter, sortBy, sortOrder]);

  // Paginated list
  const paginatedJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredJobs.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredJobs, currentPage]);

  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);

  const formatSalary = (min, max, currency = "USD") => {
    const sym = currency === "EUR" ? "€" : currency === "GBP" ? "£" : "$";
    const formatNum = (num) => {
      const n = Number(num);
      if (isNaN(n)) return num;
      if (n >= 1000) return `${(n / 1000).toFixed(0)}k`;
      return num;
    };
    return `${sym}${formatNum(min)} – ${sym}${formatNum(max)}`;
  };

  const getStatusChip = (status) => {
    switch (status) {
      case "active":
        return (
          <Chip
            className="bg-emerald-950/20 text-emerald-450 border border-emerald-900/40 text-[11px] font-semibold"
            size="sm"
            variant="flat"
          >
            Active
          </Chip>
        );
      case "closed":
        return (
          <Chip
            className="bg-red-950/20 text-red-405 border border-red-900/40 text-[11px] font-semibold"
            size="sm"
            variant="flat"
          >
            Closed
          </Chip>
        );
      case "draft":
        return (
          <Chip
            className="bg-amber-950/20 text-amber-500 border border-amber-900/40 text-[11px] font-semibold"
            size="sm"
            variant="flat"
          >
            Draft
          </Chip>
        );
      default:
        return (
          <Chip className="bg-zinc-850 text-zinc-300 border border-zinc-800 text-[11px]" size="sm" variant="flat">
            {status}
          </Chip>
        );
    }
  };

  return (
    <div className="flex flex-col min-h-full pb-8">
      {/* Search Header */}
      <DashboardHeader />

      {/* Page Title & Post Button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Manage Job Openings</h2>
          <p className="text-sm text-zinc-500 mt-1">Review active, closed, and draft job postings for your organization.</p>
        </div>
        {company?.status === 'approved' ? (
          <Link href="/dashboard/recruiter/jobs/new">
            <Button className="h-11 rounded-xl bg-gradient-to-r from-[#0088FF] to-[#0055FF] px-5 text-sm font-bold text-white shadow-lg shadow-[#0088FF]/20 transition-all hover:from-[#339FFF] hover:to-[#2277FF] hover:scale-[1.02] active:scale-[0.98] cursor-pointer">
              <Plus size={16} className="mr-2" />
              Post a New Job
            </Button>
          </Link>
        ) : (
          <div className="relative group">
            <Button 
              isDisabled
              className="h-11 rounded-xl bg-zinc-800 px-5 text-sm font-bold text-zinc-500 cursor-not-allowed opacity-60"
            >
              <Plus size={16} className="mr-2" />
              Post a New Job
            </Button>
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block z-50">
              <div className="bg-zinc-900 border border-amber-900/50 text-amber-400 text-xs font-medium px-3 py-2 rounded-lg shadow-xl whitespace-nowrap">
                Company must be approved by admin first
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Company Not Approved Warning */}
      {company && company.status !== 'approved' && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-amber-900/50 bg-amber-950/10 p-4 text-sm text-amber-400 backdrop-blur-sm">
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="shrink-0">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
          <span>
            Your company <strong>&quot;{company.name}&quot;</strong> is <span className="inline-flex items-center ml-1 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border border-amber-900/40 bg-amber-950/30 text-amber-500">{company.status || 'pending'}</span>. Job posting is disabled until an admin approves your company.
          </span>
        </div>
      )}

      {/* Demo Mode Notice */}
      {error && (
        <div className="mb-6 flex items-center justify-between rounded-xl border border-amber-950 bg-amber-950/10 p-4 text-xs sm:text-sm text-amber-550 backdrop-blur-sm animate-pulse">
          <div className="flex items-center gap-2">
            <Sparkles size={16} />
            <span>{error}</span>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-xs font-bold text-amber-500 hover:text-amber-300 underline bg-transparent border-0 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Stats Counter Section (Clickable to Filter) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <button
          type="button"
          onClick={() => setStatusFilter("all")}
          className={`flex flex-col justify-between p-5 rounded-2xl border text-left transition-all duration-300 cursor-pointer bg-zinc-950/40 hover:bg-zinc-950/60 ${
            statusFilter === "all"
              ? "border-[#0088FF] shadow-[0_0_15px_rgba(0,136,255,0.1)] scale-[1.02]"
              : "border-zinc-900 hover:border-zinc-800"
          }`}
        >
          <div className="flex items-center justify-between mb-4 w-full">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Total Openings</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 text-zinc-400">
              <Briefcase size={15} />
            </div>
          </div>
          <span className="text-3xl font-bold text-white tracking-tight">{stats.total}</span>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter("active")}
          className={`flex flex-col justify-between p-5 rounded-2xl border text-left transition-all duration-300 cursor-pointer bg-zinc-950/40 hover:bg-zinc-950/60 ${
            statusFilter === "active"
              ? "border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.1)] scale-[1.02]"
              : "border-zinc-900 hover:border-emerald-900/30"
          }`}
        >
          <div className="flex items-center justify-between mb-4 w-full">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Active</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-950/50 bg-emerald-950/10 text-emerald-450">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            </div>
          </div>
          <span className="text-3xl font-bold text-white tracking-tight">{stats.active}</span>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter("closed")}
          className={`flex flex-col justify-between p-5 rounded-2xl border text-left transition-all duration-300 cursor-pointer bg-zinc-950/40 hover:bg-zinc-950/60 ${
            statusFilter === "closed"
              ? "border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.1)] scale-[1.02]"
              : "border-zinc-900 hover:border-red-900/30"
          }`}
        >
          <div className="flex items-center justify-between mb-4 w-full">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Closed</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-950 bg-red-950/10 text-red-450">
              <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
            </div>
          </div>
          <span className="text-3xl font-bold text-white tracking-tight">{stats.closed}</span>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter("draft")}
          className={`flex flex-col justify-between p-5 rounded-2xl border text-left transition-all duration-300 cursor-pointer bg-zinc-950/40 hover:bg-zinc-950/60 ${
            statusFilter === "draft"
              ? "border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.1)] scale-[1.02]"
              : "border-zinc-900 hover:border-amber-900/30"
          }`}
        >
          <div className="flex items-center justify-between mb-4 w-full">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Drafts</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-amber-950 bg-amber-950/10 text-amber-500">
              <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            </div>
          </div>
          <span className="text-3xl font-bold text-white tracking-tight">{stats.draft}</span>
        </button>
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
            placeholder="Search jobs by title, category, or location..."
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
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-11 px-4 rounded-xl border border-zinc-900 bg-zinc-950/80 text-sm text-white placeholder-zinc-500 outline-none focus:border-[#0088FF]/50 transition-colors cursor-pointer"
          >
            <option value="all">All Categories</option>
            <option value="technology">Technology</option>
            <option value="design">Design</option>
            <option value="marketing">Marketing</option>
            <option value="sales">Sales</option>
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
            <option value="createdAt-desc">Newest Posted</option>
            <option value="createdAt-asc">Oldest Posted</option>
            <option value="jobTitle-asc">Title (A-Z)</option>
            <option value="jobTitle-desc">Title (Z-A)</option>
            <option value="applicantsCount-desc">Most Applicants</option>
            <option value="applicantsCount-asc">Least Applicants</option>
            <option value="deadline-asc">Deadline (Soonest)</option>
            <option value="deadline-desc">Deadline (Furthest)</option>
          </select>
        </div>
      </div>

      {/* Jobs Table Card wrapper */}
      <div className="rounded-2xl border border-zinc-900 bg-zinc-950/40 p-6 shadow-xl mb-6 flex flex-col">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-zinc-400">
            <Spinner size="lg" color="primary" />
            <p className="text-sm font-medium">Loading your job postings...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-400 border-collapse">
              <thead>
                <tr className="border-b border-zinc-900 text-zinc-500 font-semibold text-xs uppercase tracking-wider">
                  <th className="pb-3 font-semibold text-left">JOB DETAILS</th>
                  <th className="pb-3 font-semibold text-left">TYPE & LOCATION</th>
                  <th className="pb-3 font-semibold text-left">SALARY</th>
                  <th className="pb-3 font-semibold text-left">APPLICANTS</th>
                  <th className="pb-3 font-semibold text-left">STATUS</th>
                  <th className="pb-3 font-semibold text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900/50">
                {paginatedJobs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-16 text-zinc-500">
                      <div className="flex flex-col items-center gap-3">
                        <Briefcase size={36} className="text-zinc-750" />
                        <p className="font-semibold text-white text-base">No jobs found</p>
                        <p className="text-xs text-zinc-500 max-w-xs mx-auto text-center">
                          {searchQuery || statusFilter !== "all" || categoryFilter !== "all"
                            ? "Try adjusting your filters or search query to find what you are looking for."
                            : "You haven't posted any jobs yet. Get started by posting a new job."}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedJobs.map((job) => (
                    <tr key={job._id} className="hover:bg-zinc-900/10 transition-colors">
                      <td className="py-4">
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-850 bg-zinc-900/60 text-zinc-400">
                            <Briefcase size={16} />
                          </div>
                          <div>
                            <p className="font-bold text-white hover:text-[#0088FF] transition-colors truncate max-w-[200px] md:max-w-[280px]">
                              {job.jobTitle || job.title || "Untitled Job"}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[11px] font-medium text-zinc-500 capitalize">{job.jobCategory || job.category || "General"}</span>
                              <span className="h-1 w-1 rounded-full bg-zinc-700" />
                              <span className="text-[11px] text-zinc-500">Posted {new Date(job.createdAt || "2026-06-06").toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="py-4">
                        <div>
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300 capitalize">
                            <Clock size={12} className="text-[#0088FF]" />
                            {(job.jobType || job.type || "Full-time").replace("-", " ")}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-zinc-500 mt-1">
                            {job.isRemote ? (
                              <>
                                <Globe size={12} className="text-emerald-500" />
                                <span>Remote</span>
                              </>
                            ) : (
                              <>
                                <MapPin size={12} className="text-zinc-650" />
                                <span className="truncate max-w-[120px]">{job.location || "N/A"}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-white">
                            {formatSalary(job.minSalary || job.salaryMin, job.maxSalary || job.salaryMax, job.currency)}
                          </span>
                          <span className="text-[10px] text-zinc-500 mt-0.5 uppercase tracking-wider">Estimated</span>
                        </div>
                      </td>

                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex h-7 px-2.5 items-center justify-center rounded-full text-xs font-bold bg-zinc-900/60 border border-zinc-850 text-zinc-300">
                            {job.applicantsCount || 0}
                          </span>
                          <span className="text-xs text-zinc-550 hidden sm:inline">applicants</span>
                        </div>
                      </td>

                      <td className="py-4">
                        {getStatusChip(job.status)}
                      </td>

                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Primary action button */}
                          <Button
                            size="sm"
                            variant="light"
                            onClick={() => router.push(`/dashboard/recruiter/applications?jobId=${job._id}`)}
                            className="h-8 rounded-lg text-xs font-bold text-[#0088FF] hover:bg-[#0088FF]/10 hover:text-white border-0 cursor-pointer"
                          >
                            Applicants
                          </Button>

                          {/* Action Dropdown */}
                          <Dropdown>
                            <DropdownTrigger
                              className="h-8 w-8 flex items-center justify-center rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 border-0 cursor-pointer outline-none bg-transparent"
                              title="Actions"
                            >
                              <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                              </svg>
                            </DropdownTrigger>
                            <DropdownPopover className="rounded-xl border border-zinc-900 bg-[#0a0a0c] p-1 text-white shadow-2xl min-w-[160px]">
                              <DropdownMenu
                                aria-label="Job actions"
                                className="outline-none"
                                onAction={(key) => handleAction(key, job)}
                              >
                                <DropdownItem
                                  key="view_apps"
                                  className="flex cursor-pointer items-center rounded-lg p-2 text-sm text-zinc-300 hover:bg-zinc-900 outline-none data-[focused=true]:bg-zinc-900"
                                >
                                  <div className="flex items-center gap-2">
                                    <Eye size={14} />
                                    <span>View Applicants</span>
                                  </div>
                                </DropdownItem>
                                <DropdownItem
                                  key="edit"
                                  className="flex cursor-pointer items-center rounded-lg p-2 text-sm text-zinc-300 hover:bg-zinc-900 outline-none data-[focused=true]:bg-zinc-900"
                                >
                                  <div className="flex items-center gap-2">
                                    <Pencil size={14} />
                                    <span>Edit Details</span>
                                  </div>
                                </DropdownItem>
                                <DropdownItem
                                  key="toggle_status"
                                  className="flex cursor-pointer items-center rounded-lg p-2 text-sm text-zinc-300 hover:bg-zinc-900 outline-none data-[focused=true]:bg-zinc-900"
                                >
                                  <div className="flex items-center gap-2">
                                    <Clock size={14} />
                                    <span>{job.status === "active" ? "Close Opening" : "Activate Listing"}</span>
                                  </div>
                                </DropdownItem>
                                <DropdownItem
                                  key="duplicate"
                                  className="flex cursor-pointer items-center rounded-lg p-2 text-sm text-zinc-300 hover:bg-zinc-900 outline-none data-[focused=true]:bg-zinc-900"
                                >
                                  <div className="flex items-center gap-2">
                                    <Plus size={14} />
                                    <span>Duplicate Post</span>
                                  </div>
                                </DropdownItem>
                                <DropdownItem
                                  key="delete"
                                  className="flex cursor-pointer items-center rounded-lg p-2 text-sm text-red-400 hover:bg-red-950/20 hover:text-red-350 outline-none border-t border-zinc-900 data-[focused=true]:bg-red-950/25"
                                >
                                  <div className="flex items-center gap-2">
                                    <TrashBin size={14} />
                                    <span>Delete Listing</span>
                                  </div>
                                </DropdownItem>
                              </DropdownMenu>
                            </DropdownPopover>
                          </Dropdown>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Section */}
        {!loading && totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 pt-6 border-t border-zinc-900 gap-4">
            <span className="text-xs text-zinc-500">
              Showing {(currentPage - 1) * itemsPerPage + 1}–
              {Math.min(currentPage * itemsPerPage, filteredJobs.length)} of{" "}
              {filteredJobs.length} job postings
            </span>
            <Pagination
              total={totalPages}
              page={currentPage}
              onChange={setCurrentPage}
              color="primary"
              variant="flat"
              size="sm"
              className="[&_[data-slot=wrapper]]:gap-1 [&_[data-slot=wrapper]]:bg-transparent [&_[data-slot=wrapper]]:border-0 [&_[data-slot=item]]:bg-zinc-900 [&_[data-slot=item]]:text-zinc-400 hover:[&_[data-slot=item]]:bg-zinc-800 [&_[data-slot=item]]:border-zinc-800 [&_[data-slot=item]]:rounded-lg [&_[data-slot=item]]:text-xs [&_[data-slot=item]]:font-semibold [&_[data-slot=cursor]]:bg-[#0088FF] [&_[data-slot=cursor]]:text-white [&_[data-slot=cursor]]:font-bold [&_[data-slot=cursor]]:rounded-lg [&_[data-slot=cursor]]:shadow-md"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default RecruiterJobsPage;
