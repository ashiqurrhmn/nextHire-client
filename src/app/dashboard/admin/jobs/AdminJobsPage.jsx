"use client";

import React, { useState, useMemo } from "react";
import { Button, Chip, Spinner, toast } from "@heroui/react";
import {
  Briefcase,
  Clock,
  Globe,
  Magnifier,
  MapPin,
  TrashBin,
  TagDollar,
} from "@gravity-ui/icons";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export default function AdminJobsPage({ initialJobs }) {
  const [jobs, setJobs] = useState(initialJobs || []);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loadingId, setLoadingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Load More
  const [visibleCount, setVisibleCount] = useState(10);
  const itemsPerPage = 10;

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const title = (job.jobTitle || job.title || "").toLowerCase();
      const company = (job.companyName || "").toLowerCase();
      const location = (job.location || "").toLowerCase();
      const category = (job.jobCategory || job.category || "").toLowerCase();

      const matchesSearch =
        !searchQuery.trim() ||
        title.includes(searchQuery.toLowerCase()) ||
        company.includes(searchQuery.toLowerCase()) ||
        location.includes(searchQuery.toLowerCase()) ||
        category.includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || job.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [jobs, searchQuery, statusFilter]);

  const visibleJobs = useMemo(() => {
    return filteredJobs.slice(0, visibleCount);
  }, [filteredJobs, visibleCount]);

  // Reset count when filters change
  React.useEffect(() => {
    setVisibleCount(8);
  }, [searchQuery, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: jobs.length,
      active: jobs.filter((j) => j.status === "active").length,
      closed: jobs.filter((j) => j.status === "closed").length,
      draft: jobs.filter((j) => j.status === "draft").length,
    };
  }, [jobs]);

  const handleStatusChange = async (jobId, newStatus) => {
    setLoadingId(jobId);
    try {
      const res = await fetch(`${baseUrl}/api/jobs/${jobId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update status");
      }

      setJobs((prev) =>
        prev.map((j) =>
          j._id === jobId ? { ...j, status: newStatus } : j
        )
      );
      toast.success(`Job status updated to ${newStatus}!`);
    } catch (err) {
      console.error("Status update error:", err);
      toast.error(err.message || "Failed to update job status.");
    } finally {
      setLoadingId(null);
    }
  };

  const handleDeleteJob = async (jobId, jobTitle) => {
    if (!confirm(`Are you sure you want to delete "${jobTitle}"? This action cannot be undone.`)) {
      return;
    }
    setDeletingId(jobId);
    try {
      const res = await fetch(`${baseUrl}/api/jobs/${jobId}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete job");
      }

      setJobs((prev) => prev.filter((j) => j._id !== jobId));
      toast.success("Job deleted successfully!");
    } catch (err) {
      console.error("Delete job error:", err);
      toast.error(err.message || "Failed to delete job.");
    } finally {
      setDeletingId(null);
    }
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

  const formatSalary = (min, max, currency = "USD") => {
    const sym = currency === "EUR" ? "€" : currency === "GBP" ? "£" : currency === "BDT" ? "৳" : "$";
    const formatNum = (num) => {
      const n = Number(num);
      if (isNaN(n)) return num || "–";
      if (n >= 1000) return `${(n / 1000).toFixed(0)}k`;
      return num;
    };
    if (!min && !max) return "N/A";
    return `${sym}${formatNum(min)} – ${sym}${formatNum(max)}`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="flex flex-col min-h-full pb-8">
      <DashboardHeader />

      {/* Page Title */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white tracking-tight">
          Jobs Management
        </h2>
        <p className="text-sm text-zinc-500 mt-1">
          View and manage all job postings across the platform.
        </p>
      </div>

      {/* Stats Cards */}
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
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Total Jobs
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 text-zinc-400">
              <Briefcase size={15} />
            </div>
          </div>
          <span className="text-3xl font-bold text-white tracking-tight">
            {stats.total}
          </span>
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
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Active
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-950/50 bg-emerald-950/10 text-emerald-450">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            </div>
          </div>
          <span className="text-3xl font-bold text-white tracking-tight">
            {stats.active}
          </span>
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
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Closed
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-950 bg-red-950/10 text-red-450">
              <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
            </div>
          </div>
          <span className="text-3xl font-bold text-white tracking-tight">
            {stats.closed}
          </span>
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
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Drafts
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-amber-950 bg-amber-950/10 text-amber-500">
              <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            </div>
          </div>
          <span className="text-3xl font-bold text-white tracking-tight">
            {stats.draft}
          </span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-zinc-900 mb-6">
        <h3 className="text-base font-bold text-white">
          All Jobs ({filteredJobs.length})
        </h3>
        <div className="relative w-48 sm:w-72">
          <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Magnifier className="h-4 w-4 text-zinc-500" />
          </span>
          <input
            type="text"
            placeholder="Search by title, company, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-8 rounded-lg border border-zinc-900 bg-zinc-950/80 text-xs text-white placeholder-zinc-500 outline-none focus:border-[#0088FF]/50 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-2.5 flex items-center text-zinc-500 hover:text-white text-xs bg-transparent border-0 cursor-pointer"
              type="button"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Jobs Table */}
      <div className="rounded-2xl border border-zinc-900 bg-zinc-950/40 p-6 shadow-xl mb-6 flex flex-col">
        {filteredJobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Briefcase size={40} className="text-zinc-750" />
            <p className="font-semibold text-white text-base">No jobs found</p>
            <p className="text-xs text-zinc-500 max-w-xs text-center">
              {searchQuery || statusFilter !== "all"
                ? "Try adjusting your filters or search term."
                : "No jobs have been posted yet."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-400 border-collapse">
              <thead>
                <tr className="border-b border-zinc-900 text-zinc-500 font-semibold text-xs uppercase tracking-wider">
                  <th className="pb-3 font-semibold text-left">Job Details</th>
                  <th className="pb-3 font-semibold text-left">Company</th>
                  <th className="pb-3 font-semibold text-left">Type & Location</th>
                  <th className="pb-3 font-semibold text-left">Salary</th>
                  <th className="pb-3 font-semibold text-left">Status</th>
                  <th className="pb-3 font-semibold text-left">Posted</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900/50">
                {visibleJobs.map((job) => {
                  const isLoading = loadingId === job._id;
                  const isDeleting = deletingId === job._id;
                  const title = job.jobTitle || job.title || "Untitled Job";

                  return (
                    <tr key={job._id} className="hover:bg-zinc-900/10 transition-colors">
                      {/* Job Details */}
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-850 bg-zinc-900/60 text-zinc-400">
                            <Briefcase size={16} />
                          </div>
                          <div>
                            <p className="font-bold text-white truncate max-w-[180px]">
                              {title}
                            </p>
                            <span className="text-[11px] font-medium text-zinc-500 capitalize">
                              {job.jobCategory || job.category || "General"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Company */}
                      <td className="py-4">
                        <span className="text-xs font-semibold text-zinc-300 truncate block max-w-[120px]">
                          {job.companyName || "Unknown"}
                        </span>
                      </td>

                      {/* Type & Location */}
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
                                <span className="truncate max-w-[100px]">{job.location || "N/A"}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Salary */}
                      <td className="py-4">
                        <div className="flex items-center gap-1.5">
                          <TagDollar size={13} className="text-zinc-600" />
                          <span className="text-xs font-semibold text-zinc-300">
                            {formatSalary(job.minSalary || job.salaryMin, job.maxSalary || job.salaryMax, job.currency)}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4">
                        {getStatusChip(job.status)}
                      </td>

                      {/* Posted Date */}
                      <td className="py-4">
                        <span className="text-xs text-zinc-500">
                          {formatDate(job.createdAt)}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {isLoading || isDeleting ? (
                            <Spinner size="sm" color="primary" />
                          ) : (
                            <>
                              {/* Status Change Dropdown */}
                              <select
                                value={job.status || "active"}
                                onChange={(e) => handleStatusChange(job._id, e.target.value)}
                                className="h-8 px-2 rounded-lg border border-zinc-800 bg-zinc-950 text-xs text-zinc-300 outline-none focus:border-[#0088FF]/50 transition-colors cursor-pointer"
                              >
                                <option value="active">Active</option>
                                <option value="closed">Closed</option>
                                <option value="draft">Draft</option>
                              </select>

                              {/* Delete Button */}
                              <Button
                                size="sm"
                                isIconOnly
                                onPress={() => handleDeleteJob(job._id, title)}
                                className="h-8 w-8 rounded-lg bg-transparent hover:bg-red-950/20 text-zinc-500 hover:text-red-400 transition-all cursor-pointer border-0 min-w-0"
                                title="Delete job"
                              >
                                <TrashBin size={14} />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Load More */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 pt-6 border-t border-zinc-900 gap-4">
          <span className="text-xs text-zinc-500">
            Showing {visibleJobs.length > 0 ? 1 : 0}–{visibleJobs.length} of {filteredJobs.length} jobs
          </span>
          {visibleCount < filteredJobs.length && (
            <Button
              size="sm"
              variant="bordered"
              onPress={() => setVisibleCount((prev) => prev + itemsPerPage)}
              className="border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 bg-zinc-900/50"
            >
              Load More
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
