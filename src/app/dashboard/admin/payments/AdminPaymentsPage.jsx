"use client";

import React, { useState, useMemo } from "react";
import { Chip, Pagination, Spinner } from "@heroui/react";
import {
  CreditCard,
  Magnifier,
  Receipt,
  Persons,
  Briefcase,
  Star,
  ShieldCheck,
  Diamond,
} from "@gravity-ui/icons";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

// ─── Constants & Mapping ──────────────────────────────────────────
const PLAN_MAPPING = {
  seeker_free: { name: "Seeker Free", price: 0, role: "seeker", gradient: "from-zinc-500 to-zinc-700", icon: <Star size={14} /> },
  seeker_pro: { name: "Seeker Pro", price: 19, role: "seeker", gradient: "from-[#0088FF] to-[#0055FF]", icon: <ShieldCheck size={14} /> },
  seeker_premium: { name: "Seeker Premium", price: 39, role: "seeker", gradient: "from-purple-500 to-indigo-600", icon: <Diamond size={14} /> },
  recruiter_free: { name: "Recruiter Free", price: 0, role: "recruiter", gradient: "from-zinc-500 to-zinc-700", icon: <Star size={14} /> },
  recruiter_growth: { name: "Recruiter Growth", price: 49, role: "recruiter", gradient: "from-[#0088FF] to-[#0055FF]", icon: <ShieldCheck size={14} /> },
  recruiter_enterprise: { name: "Recruiter Enterprise", price: 149, role: "recruiter", gradient: "from-purple-500 to-indigo-600", icon: <Diamond size={14} /> },
  
  // Stripe Price IDs mapped to their corresponding plans
  price_1TiKAB3pA2swKjtHCOXIL4bn: { name: "Seeker Pro", price: 19, role: "seeker", gradient: "from-[#0088FF] to-[#0055FF]", icon: <ShieldCheck size={14} /> },
  price_1TiT8G3pA2swKjtHSJJXzFZo: { name: "Seeker Premium", price: 39, role: "seeker", gradient: "from-purple-500 to-indigo-600", icon: <Diamond size={14} /> },
  price_1TiT8x3pA2swKjtHqiI1VYsn: { name: "Recruiter Growth", price: 49, role: "recruiter", gradient: "from-[#0088FF] to-[#0055FF]", icon: <ShieldCheck size={14} /> },
  price_1TiT9b3pA2swKjtHGbuqI3mh: { name: "Recruiter Enterprise", price: 149, role: "recruiter", gradient: "from-purple-500 to-indigo-600", icon: <Diamond size={14} /> },
};

const getPlanInfo = (planId) => {
  return PLAN_MAPPING[planId] || { name: planId, price: 0, role: "unknown", gradient: "from-zinc-500 to-zinc-700", icon: <Star size={14} /> };
};



const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
};

// ─── Main Component ──────────────────────────────────────────────
export default function AdminPaymentsPage({ initialPayments }) {
  // Use DB data. Exclude free plans and empty plan records from payments list.
  const allPayments = (initialPayments || [])
    .filter(p => p.planId && !p.planId.includes('free'))
    .map(p => {
      let normalized = p.planId;
      if (p.planId === 'price_1TiKAB3pA2swKjtHCOXIL4bn') normalized = 'seeker_pro';
      else if (p.planId === 'price_1TiT8G3pA2swKjtHSJJXzFZo') normalized = 'seeker_premium';
      else if (p.planId === 'price_1TiT8x3pA2swKjtHqiI1VYsn') normalized = 'recruiter_growth';
      else if (p.planId === 'price_1TiT9b3pA2swKjtHGbuqI3mh') normalized = 'recruiter_enterprise';
      
      return { ...p, planId: normalized };
    });

  const [searchQuery, setSearchQuery] = useState("");
  const [planFilter, setPlanFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt-desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // ─── Stats ───────────────────────────────────────────────────
  const stats = useMemo(() => {
    let revenue = 0;
    let seekerCount = 0;
    let recruiterCount = 0;

    allPayments.forEach(payment => {
      const info = getPlanInfo(payment.planId);
      revenue += info.price;
      if (info.role === "seeker") seekerCount++;
      if (info.role === "recruiter") recruiterCount++;
    });

    return {
      revenue,
      transactions: allPayments.length,
      seekerCount,
      recruiterCount,
    };
  }, [allPayments]);

  // ─── Filtered & Sorted ──────────────────────────────────────
  const filteredPayments = useMemo(() => {
    return allPayments
      .filter((payment) => {
        const email = (payment.email || "").toLowerCase();
        const planId = (payment.planId || "").toLowerCase();
        const query = searchQuery.toLowerCase();

        const matchesSearch = !query || email.includes(query);
        const matchesPlan = planFilter === "all" || planId === planFilter;

        return matchesSearch && matchesPlan;
      })
      .sort((a, b) => {
        const [field, order] = sortBy.split("-");
        
        if (field === "createdAt") {
          const dateA = new Date(a.createdAt || 0).getTime();
          const dateB = new Date(b.createdAt || 0).getTime();
          return order === "asc" ? dateA - dateB : dateB - dateA;
        } else if (field === "amount") {
          const priceA = getPlanInfo(a.planId).price;
          const priceB = getPlanInfo(b.planId).price;
          return order === "asc" ? priceA - priceB : priceB - priceA;
        }
        return 0;
      });
  }, [allPayments, searchQuery, planFilter, sortBy]);

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, planFilter, sortBy]);

  // ─── Pagination ─────────────────────────────────────────────
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const paginatedPayments = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredPayments.slice(start, start + itemsPerPage);
  }, [filteredPayments, currentPage]);

  return (
    <div className="flex flex-col min-h-full pb-8">
      <DashboardHeader />

      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white tracking-tight">Payments & Revenue</h2>
        <p className="text-sm text-zinc-500 mt-1">
          Monitor subscription transactions and platform revenue in real-time.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="flex flex-col justify-between p-6 rounded-2xl border border-zinc-900 bg-gradient-to-br from-zinc-950/40 to-[#0088FF]/5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Total Revenue
            </span>
            <div className="h-8 w-8 rounded-lg bg-[#0088FF]/10 text-[#0088FF] flex items-center justify-center border border-[#0088FF]/20">
              <CreditCard size={16} />
            </div>
          </div>
          <span className="text-4xl font-extrabold text-white tracking-tight">
            ${stats.revenue.toLocaleString()}
          </span>
        </div>
        
        <div className="flex flex-col justify-between p-6 rounded-2xl border border-zinc-900 bg-zinc-950/40">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Transactions
            </span>
            <div className="h-8 w-8 rounded-lg bg-zinc-900 text-zinc-400 flex items-center justify-center border border-zinc-800">
              <Receipt size={16} />
            </div>
          </div>
          <span className="text-3xl font-bold text-white tracking-tight">
            {stats.transactions.toLocaleString()}
          </span>
        </div>

        <div className="flex flex-col justify-between p-6 rounded-2xl border border-zinc-900 bg-zinc-950/40">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Seeker Plans
            </span>
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Persons size={16} />
            </div>
          </div>
          <span className="text-3xl font-bold text-white tracking-tight">
            {stats.seekerCount.toLocaleString()}
          </span>
        </div>

        <div className="flex flex-col justify-between p-6 rounded-2xl border border-zinc-900 bg-zinc-950/40">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Recruiter Plans
            </span>
            <div className="h-8 w-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
              <Briefcase size={16} />
            </div>
          </div>
          <span className="text-3xl font-bold text-white tracking-tight">
            {stats.recruiterCount.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
        <div className="relative w-full md:max-w-md">
          <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Magnifier className="h-4 w-4 text-zinc-500" />
          </span>
          <input
            type="text"
            placeholder="Search by user email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-10 pr-10 rounded-xl border border-zinc-900 bg-zinc-950/80 text-sm text-white placeholder-zinc-500 outline-none focus:border-[#0088FF]/50 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-3 flex items-center text-zinc-500 hover:text-white text-xs bg-transparent border-0 cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="h-11 px-4 rounded-xl border border-zinc-900 bg-zinc-950/80 text-sm text-white outline-none focus:border-[#0088FF]/50 transition-colors cursor-pointer"
          >
            <option value="all">All Plans</option>
            <optgroup label="Seeker Plans">
              <option value="seeker_pro">Seeker Pro</option>
              <option value="seeker_premium">Seeker Premium</option>
            </optgroup>
            <optgroup label="Recruiter Plans">
              <option value="recruiter_growth">Recruiter Growth</option>
              <option value="recruiter_enterprise">Recruiter Enterprise</option>
            </optgroup>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="h-11 px-4 rounded-xl border border-zinc-900 bg-zinc-950/80 text-sm text-white outline-none focus:border-[#0088FF]/50 transition-colors cursor-pointer"
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="amount-desc">Amount (High to Low)</option>
            <option value="amount-asc">Amount (Low to High)</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="rounded-2xl border border-zinc-900 bg-zinc-950/40 p-6 shadow-xl mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-400 border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-zinc-900 text-zinc-500 font-semibold text-xs uppercase tracking-wider">
                <th className="pb-3 font-semibold text-left w-1/3">User / Customer</th>
                <th className="pb-3 font-semibold text-left">Plan</th>
                <th className="pb-3 font-semibold text-left">Amount</th>
                <th className="pb-3 font-semibold text-left">Date</th>
                <th className="pb-3 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900/50">
              {paginatedPayments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-16 text-zinc-500">
                    <div className="flex flex-col items-center gap-3">
                      <CreditCard size={36} className="text-zinc-700" />
                      <p className="font-semibold text-white text-base">
                        No transactions found
                      </p>
                      <p className="text-xs text-zinc-500">
                        Try adjusting your filters or search query.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedPayments.map((payment) => {
                  const info = getPlanInfo(payment.planId);
                  return (
                    <tr key={payment._id} className="hover:bg-zinc-900/10 transition-colors group">
                      {/* User */}
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className={`h-8 w-8 rounded-lg bg-gradient-to-br ${info.gradient} flex items-center justify-center text-white shrink-0 shadow-lg opacity-80 group-hover:opacity-100 transition-opacity`}>
                            {info.icon}
                          </div>
                          <div>
                            <p className="font-medium text-white text-sm truncate max-w-[200px]">
                              {payment.email}
                            </p>
                            <p className="text-[11px] text-zinc-500 uppercase mt-0.5 tracking-wider">
                              {info.role}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Plan */}
                      <td className="py-4">
                        <span className="font-bold text-white tracking-wide">
                          {info.name}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="py-4">
                        <span className="text-[15px] font-bold text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-md border border-emerald-400/20 inline-block">
                          ${info.price.toLocaleString()}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-4">
                        <span className="text-zinc-400 font-medium">
                          {formatDate(payment.createdAt)}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 text-right">
                         <Chip
                          className="bg-emerald-950/30 text-emerald-400 border border-emerald-900/50 text-[11px] font-bold tracking-wider uppercase px-2"
                          size="sm"
                          variant="flat"
                        >
                          Active
                        </Chip>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 pt-6 border-t border-zinc-900 gap-4">
            <span className="text-xs text-zinc-500">
              Showing {(currentPage - 1) * itemsPerPage + 1}–
              {Math.min(currentPage * itemsPerPage, filteredPayments.length)}{" "}
              of {filteredPayments.length} transactions
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
}
