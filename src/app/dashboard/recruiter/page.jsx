import React from "react";
import Link from "next/link";
import { getUserSession } from "@/lib/core/session";
import { getCompanyByUser } from "@/lib/api/companies";
import { getCompanyApplications } from "@/lib/api/applications";
import { getCompanyJobs, getCompanyJobViews } from "@/lib/api/jobs";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatsSection from "@/components/dashboard/StatsSection";
import RecentApplications from "@/components/dashboard/RecentApplications";
import TopCompanies from "@/components/dashboard/TopCompanies";
import DashboardCharts from "@/components/dashboard/DashboardCharts";

export default async function RecruiterDashboardPage() {
  const user = await getUserSession();
  const userName = user?.name || "Recruiter";
  
  // Fetch companies for this recruiter
  const companies = user ? await getCompanyByUser(user.id) : [];
  
  // Fetch jobs, applications and views for the first company
  let applications = [];
  let jobs = [];
  let views = [];
  if (companies && companies.length > 0) {
    const companyId = companies[0].id || companies[0]._id;
    [applications, jobs, views] = await Promise.all([
      getCompanyApplications(companyId),
      getCompanyJobs(companyId),
      getCompanyJobViews(companyId)
    ]);
  }

  // Ensure arrays
  const safeApps = Array.isArray(applications) ? applications : [];
  const safeJobs = Array.isArray(jobs) ? jobs : [];
  const safeViews = Array.isArray(views) ? views : [];

  // ─── Compute Stats ─────────────────────────────────────────
  const totalJobs = safeJobs.length;
  const totalApplicants = safeApps.length;
  const activeJobs = safeJobs.filter(j => j.status === "active").length;
  const closedJobs = safeJobs.filter(j => j.status === "closed").length;

  // ─── Compute Area Chart Data (applications & views per day of week, last 7 days) ──
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const now = new Date();
  const areaData = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const dayEnd = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
    
    const appsCount = safeApps.filter(a => {
      const created = new Date(a.createdAt);
      return created >= dayStart && created < dayEnd;
    }).length;

    const viewsCount = safeViews.filter(v => {
      const created = new Date(v.createdAt);
      return created >= dayStart && created < dayEnd;
    }).length;

    areaData.push({
      name: dayNames[d.getDay()],
      applications: appsCount,
      views: viewsCount,
    });
  }

  // ─── Compute Bar Chart Data (jobs by category) ────────────
  const categoryMap = {};
  safeJobs.forEach(job => {
    const cat = job.category || job.jobCategory || "Other";
    const capCat = cat.charAt(0).toUpperCase() + cat.slice(1);
    if (!categoryMap[capCat]) categoryMap[capCat] = { active: 0, closed: 0 };
    if (job.status === "active") categoryMap[capCat].active++;
    else if (job.status === "closed") categoryMap[capCat].closed++;
  });
  const barData = Object.entries(categoryMap).map(([name, counts]) => ({
    name,
    active: counts.active,
    closed: counts.closed,
  }));

  return (
    <div className="flex flex-col min-h-full">
      {/* Header Search & Profile */}
      <DashboardHeader />

      {/* Welcome Title */}
      <h2 className="text-3xl font-bold text-white tracking-tight mb-6">
        Welcome back, {userName}
      </h2>

      {/* Stats Section Cards */}
      <StatsSection
        totalJobs={totalJobs}
        totalApplicants={totalApplicants}
        activeJobs={activeJobs}
        closedJobs={closedJobs}
      />

      {/* Charts Section */}
      <DashboardCharts areaData={areaData} barData={barData} />

      {/* Bottom Main Content Columns */}
      <div className="flex flex-col lg:flex-row gap-6 mb-8 items-stretch">
        <RecentApplications applications={applications} />
        <TopCompanies companies={companies} />
      </div>

      {/* Floating Action Button */}
      <Link href="/dashboard/recruiter/jobs/new">
        <button
          className="fixed bottom-6 right-6 h-12 w-12 rounded-full bg-gradient-to-r from-[#0088FF] to-[#0055FF] text-white hover:from-[#339FFF] hover:to-[#2277FF] flex items-center justify-center shadow-lg shadow-[#0088FF]/30 transition-all hover:scale-105 active:scale-95 text-2xl font-normal z-30 cursor-pointer border-0"
          type="button"
          title="Add New Post"
        >
          +
        </button>
      </Link>
    </div>
  );
}