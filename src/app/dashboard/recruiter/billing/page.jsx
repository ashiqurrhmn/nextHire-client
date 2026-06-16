"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Spinner, Chip } from "@heroui/react";
import { Receipt } from "@gravity-ui/icons";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";

export default function RecruiterBillingPage() {
  const { data: session } = useSession();
  const user = session?.user;
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      fetch(`${baseUrl}/api/subscriptions?email=${user.email}`)
        .then(res => res.json())
        .then(data => {
          setHistory(data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Failed to load plan history:", err);
          setLoading(false);
        });
    } else if (session) {
      setLoading(false);
    }
  }, [user?.email, session]);

  // Format the current plan
  const userPlan = user?.plan || "recruiter_free";
  const normalizedPlan = userPlan.toLowerCase();
  
  let planName = "FREE";
  if (normalizedPlan.includes("pro") || normalizedPlan.includes("growth")) planName = "GROWTH";
  else if (normalizedPlan.includes("enterprise")) planName = "ENTERPRISE";
  else if (normalizedPlan.includes("premium")) planName = "PREMIUM";

  const getPlanDisplayName = (planId) => {
    if (!planId) return "Unknown";
    const lower = planId.toLowerCase();
    if (lower.includes("pro") || lower.includes("growth")) return "GROWTH";
    if (lower.includes("enterprise")) return "ENTERPRISE";
    if (lower.includes("premium")) return "PREMIUM";
    return "FREE";
  };

  return (
    <div className="flex flex-col min-h-full pb-8">
      <DashboardHeader />

      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white tracking-tight">Billing & Plans</h2>
        <p className="text-sm text-zinc-500 mt-1">
          Manage your organization's subscription and view your billing history.
        </p>
      </div>

      <div className="bg-zinc-950/50 border border-zinc-900 rounded-2xl p-6 mb-8 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white mb-1">Current Plan</h3>
          <p className="text-sm text-zinc-400">You are currently on the <strong className="text-[#0088FF]">{planName}</strong> plan.</p>
        </div>
        <div className="bg-zinc-900 px-4 py-2 rounded-xl border border-zinc-800">
           <span className="text-sm font-bold text-white uppercase">{planName}</span>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Receipt size={20} className="text-zinc-400" />
          Plan History
        </h3>
      </div>

      <div className="rounded-2xl border border-zinc-900 bg-zinc-950/40 p-6 shadow-xl mb-6">
        {loading ? (
          <div className="flex justify-center py-10">
            <Spinner size="lg" color="primary" />
          </div>
        ) : history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-zinc-500">
            <Receipt size={48} className="mb-4 text-zinc-700" />
            <p>No billing history found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
            <table className="w-full min-w-[500px] text-left text-sm text-zinc-400 border-collapse">
              <thead>
                <tr className="border-b border-zinc-900 text-zinc-500 font-semibold text-xs uppercase tracking-wider">
                  <th className="pb-3 font-semibold text-left">Date</th>
                  <th className="pb-3 font-semibold text-left">Plan Type</th>
                  <th className="pb-3 font-semibold text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900/50">
                {history.map((sub, index) => (
                  <tr key={index} className="hover:bg-zinc-900/10 transition-colors">
                    <td className="py-4 font-medium text-white">
                      {new Date(sub.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                    </td>
                    <td className="py-4">
                      <span className="text-xs font-bold text-white bg-zinc-800 px-2.5 py-1 rounded-md border border-zinc-700 uppercase">
                        {getPlanDisplayName(sub.planId)}
                      </span>
                    </td>
                    <td className="py-4">
                      <Chip
                        className="bg-emerald-950/20 text-emerald-450 border border-emerald-900/40 text-[11px] font-semibold"
                        size="sm"
                        variant="flat"
                      >
                        Active
                      </Chip>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
