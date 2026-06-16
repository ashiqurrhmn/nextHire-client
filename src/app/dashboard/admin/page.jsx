import Link from "next/link";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const AdminPage = async () => {
  let pendingCount = 0;
  let totalUsers = 0;
  let totalJobs = 0;
  let activeJobs = 0;

  try {
    const [companiesRes, usersRes, jobsRes] = await Promise.all([
      fetch(`${baseUrl}/api/companies?status=pending`, { cache: 'no-store' }),
      fetch(`${baseUrl}/api/users`, { cache: 'no-store' }),
      fetch(`${baseUrl}/api/jobs`, { cache: 'no-store' }),
    ]);

    const companies = await companiesRes.json();
    const users = await usersRes.json();
    const jobs = await jobsRes.json();

    pendingCount = Array.isArray(companies) ? companies.length : 0;
    totalUsers = Array.isArray(users) ? users.length : 0;
    totalJobs = Array.isArray(jobs) ? jobs.length : 0;
    activeJobs = Array.isArray(jobs) ? jobs.filter(j => j.status === 'active').length : 0;
  } catch (e) {
    console.error("Failed to fetch admin stats:", e);
  }

  return (
    <div className="flex flex-col min-h-full pb-8">
      <DashboardHeader />

      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white tracking-tight">Admin Dashboard</h2>
        <p className="text-sm text-zinc-500 mt-1">Manage platform operations, users, companies, and jobs.</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="flex flex-col justify-between p-5 rounded-2xl border border-zinc-900 bg-zinc-950/40">
          <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">
            Total Users
          </span>
          <span className="text-3xl font-bold text-white tracking-tight">{totalUsers}</span>
        </div>
        <div className="flex flex-col justify-between p-5 rounded-2xl border border-zinc-900 bg-zinc-950/40">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Pending Companies
            </span>
            {pendingCount > 0 && (
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-black animate-pulse">
                {pendingCount}
              </span>
            )}
          </div>
          <span className="text-3xl font-bold text-white tracking-tight">{pendingCount}</span>
        </div>
        <div className="flex flex-col justify-between p-5 rounded-2xl border border-zinc-900 bg-zinc-950/40">
          <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">
            Total Jobs
          </span>
          <span className="text-3xl font-bold text-white tracking-tight">{totalJobs}</span>
        </div>
        <div className="flex flex-col justify-between p-5 rounded-2xl border border-zinc-900 bg-zinc-950/40">
          <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">
            Active Jobs
          </span>
          <span className="text-3xl font-bold text-white tracking-tight">{activeJobs}</span>
        </div>
      </div>

      {/* Quick Actions */}
      <h3 className="text-base font-bold text-white mb-4 pb-3 border-b border-zinc-900">Quick Actions</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Company Approvals Card */}
        <Link href="/dashboard/admin/companies" className="group">
          <div className="flex flex-col justify-between p-6 rounded-2xl border border-zinc-900 bg-zinc-950/40 hover:border-zinc-800 hover:bg-zinc-950/60 transition-all duration-300 min-h-[180px]">
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#0088FF]/25 bg-[#0088FF]/10 text-[#0088FF]">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                </svg>
              </div>
              {pendingCount > 0 && (
                <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-black px-2 animate-pulse">
                  {pendingCount}
                </span>
              )}
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-bold text-white group-hover:text-[#0088FF] transition-colors">
                Company Approvals
              </h3>
              <p className="text-xs text-zinc-500 mt-1">
                {pendingCount > 0
                  ? `${pendingCount} company registration${pendingCount > 1 ? "s" : ""} awaiting review`
                  : "Review and manage registered companies"}
              </p>
            </div>
          </div>
        </Link>

        {/* Users Management Card */}
        <Link href="/dashboard/admin/users" className="group">
          <div className="flex flex-col justify-between p-6 rounded-2xl border border-zinc-900 bg-zinc-950/40 hover:border-zinc-800 hover:bg-zinc-950/60 transition-all duration-300 min-h-[180px]">
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-purple-500/25 bg-purple-500/10 text-purple-400">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                </svg>
              </div>
              <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-zinc-800 text-xs font-bold text-zinc-300 px-2">
                {totalUsers}
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors">
                User Management
              </h3>
              <p className="text-xs text-zinc-500 mt-1">
                View all users, manage roles and access control
              </p>
            </div>
          </div>
        </Link>

        {/* Jobs Management Card */}
        <Link href="/dashboard/admin/jobs" className="group">
          <div className="flex flex-col justify-between p-6 rounded-2xl border border-zinc-900 bg-zinc-950/40 hover:border-zinc-800 hover:bg-zinc-950/60 transition-all duration-300 min-h-[180px]">
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-500/25 bg-emerald-500/10 text-emerald-400">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
              </div>
              <div className="flex items-center gap-2">
                {activeJobs > 0 && (
                  <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-emerald-900/40 text-xs font-bold text-emerald-400 px-2 border border-emerald-900/50">
                    {activeJobs} active
                  </span>
                )}
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                Jobs Management
              </h3>
              <p className="text-xs text-zinc-500 mt-1">
                {totalJobs > 0
                  ? `${totalJobs} total job posting${totalJobs > 1 ? "s" : ""} across all companies`
                  : "Monitor and manage all job postings"}
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default AdminPage;
