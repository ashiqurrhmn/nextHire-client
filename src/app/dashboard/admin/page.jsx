import Link from "next/link";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const AdminPage = async () => {
  let pendingCount = 0;
  try {
    const res = await fetch(`${baseUrl}/api/companies?status=pending`, { cache: 'no-store' });
    const companies = await res.json();
    pendingCount = Array.isArray(companies) ? companies.length : 0;
  } catch (e) {
    console.error("Failed to fetch pending companies:", e);
  }

  return (
    <div className="flex flex-col min-h-full pb-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white tracking-tight">Admin Dashboard</h2>
        <p className="text-sm text-zinc-500 mt-1">Manage platform operations and company approvals.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Company Management Card */}
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
      </div>
    </div>
  );
};

export default AdminPage;
