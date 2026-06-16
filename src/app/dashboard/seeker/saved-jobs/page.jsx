"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import JobCard from "@/components/JobCard";
import { getSavedJobs } from "@/lib/api/saved-jobs";
import { getMyAppliedJobIds } from "@/lib/actions/applications";
import { Spinner } from "@heroui/react";
import { Bookmark, Briefcase } from "@gravity-ui/icons";
import Link from "next/link";

const colors = [
  "#635BFF", "#A259FF", "#10A37F", "#FF6B6B", "#5E6AD2", "#0088FF"
];

export default function SavedJobsPage() {
  const { data: session } = useSession();
  const [jobs, setJobs] = useState([]);
  const [appliedJobIds, setAppliedJobIds] = useState([]);
  const [loading, setLoading] = useState(true);

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
          <div className="flex flex-col gap-4">
            {jobs.map((job) => (
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
      </div>
    </div>
  );
}
