"use client";

import React, { useState, useMemo } from "react";
import { Button, Spinner, toast } from "@heroui/react";
import {
  Magnifier,
  MapPin,
  Persons,
  Globe,
  CircleCheck,
  CircleXmark,
  Clock,
} from "@gravity-ui/icons";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export default function AdminCompaniesPage({ initialCompanies }) {
  const [companies, setCompanies] = useState(initialCompanies || []);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loadingId, setLoadingId] = useState(null);

  const filteredCompanies = useMemo(() => {
    return companies.filter((c) => {
      const matchesSearch =
        !searchQuery.trim() ||
        c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.location?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || c.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [companies, searchQuery, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: companies.length,
      pending: companies.filter((c) => c.status === "pending").length,
      approved: companies.filter((c) => c.status === "approved").length,
      rejected: companies.filter((c) => c.status === "rejected").length,
    };
  }, [companies]);

  const handleStatusChange = async (companyId, newStatus) => {
    setLoadingId(companyId);
    try {
      const res = await fetch(`${baseUrl}/api/companies/${companyId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update status");
      }

      setCompanies((prev) =>
        prev.map((c) =>
          (c._id === companyId || c.id === companyId)
            ? { ...c, status: newStatus }
            : c
        )
      );
      toast.success(`Company ${newStatus} successfully!`);
    } catch (err) {
      console.error("Status update error:", err);
      toast.error(err.message || "Failed to update company status.");
    } finally {
      setLoadingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return (
          <span className="inline-flex items-center gap-1.5 bg-emerald-950/20 text-emerald-400 border border-emerald-900/40 text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full">
            <CircleCheck size={12} />
            Approved
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1.5 bg-red-950/20 text-red-400 border border-red-900/40 text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full">
            <CircleXmark size={12} />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 bg-amber-950/20 text-amber-500 border border-amber-900/40 text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full">
            <Clock size={12} />
            Pending
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col min-h-full pb-8">
      <DashboardHeader />

      {/* Page Title */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white tracking-tight">
          Company Management
        </h2>
        <p className="text-sm text-zinc-500 mt-1">
          Review and approve company registrations from recruiters.
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
          <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">
            Total
          </span>
          <span className="text-3xl font-bold text-white tracking-tight">
            {stats.total}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter("pending")}
          className={`flex flex-col justify-between p-5 rounded-2xl border text-left transition-all duration-300 cursor-pointer bg-zinc-950/40 hover:bg-zinc-950/60 ${
            statusFilter === "pending"
              ? "border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.1)] scale-[1.02]"
              : "border-zinc-900 hover:border-amber-900/30"
          }`}
        >
          <div className="flex items-center justify-between mb-4 w-full">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Pending
            </span>
            {stats.pending > 0 && (
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-black animate-pulse">
                {stats.pending}
              </span>
            )}
          </div>
          <span className="text-3xl font-bold text-white tracking-tight">
            {stats.pending}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter("approved")}
          className={`flex flex-col justify-between p-5 rounded-2xl border text-left transition-all duration-300 cursor-pointer bg-zinc-950/40 hover:bg-zinc-950/60 ${
            statusFilter === "approved"
              ? "border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.1)] scale-[1.02]"
              : "border-zinc-900 hover:border-emerald-900/30"
          }`}
        >
          <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">
            Approved
          </span>
          <span className="text-3xl font-bold text-white tracking-tight">
            {stats.approved}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter("rejected")}
          className={`flex flex-col justify-between p-5 rounded-2xl border text-left transition-all duration-300 cursor-pointer bg-zinc-950/40 hover:bg-zinc-950/60 ${
            statusFilter === "rejected"
              ? "border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.1)] scale-[1.02]"
              : "border-zinc-900 hover:border-red-900/30"
          }`}
        >
          <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">
            Rejected
          </span>
          <span className="text-3xl font-bold text-white tracking-tight">
            {stats.rejected}
          </span>
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-zinc-900 mb-6">
        <h3 className="text-base font-bold text-white">
          All Companies ({filteredCompanies.length})
        </h3>
        <div className="relative w-48 sm:w-72">
          <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Magnifier className="h-4 w-4 text-zinc-500" />
          </span>
          <input
            type="text"
            placeholder="Search companies..."
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

      {/* Company List */}
      {filteredCompanies.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 border border-zinc-900 bg-zinc-950/40 rounded-2xl gap-3">
          <Persons size={40} className="text-zinc-750" />
          <p className="font-semibold text-white text-base">No companies found</p>
          <p className="text-xs text-zinc-500 max-w-xs text-center">
            {searchQuery || statusFilter !== "all"
              ? "Try adjusting your filters or search term."
              : "No companies have been registered yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCompanies.map((company) => {
            const companyId = company._id || company.id;
            const isLoading = loadingId === companyId;

            return (
              <div
                key={companyId}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl border border-zinc-900 bg-zinc-950/40 hover:border-zinc-800 hover:bg-zinc-950/60 transition-all duration-300"
              >
                {/* Company Info */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div
                    className={`h-12 w-12 rounded-xl flex items-center justify-center font-bold shrink-0 text-sm overflow-hidden border border-zinc-800/80 ${
                      company.logoUrl ? "bg-zinc-900" : company.logoBg || "bg-zinc-800"
                    }`}
                  >
                    {company.logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={company.logoUrl}
                        alt={`${company.name} logo`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-white">{company.logoText || company.name?.charAt(0)?.toUpperCase()}</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="text-sm font-bold text-white truncate max-w-[200px]">
                        {company.name}
                      </h4>
                      {getStatusBadge(company.status)}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-zinc-500">
                      <span className="flex items-center gap-1">
                        <MapPin size={11} className="text-zinc-600" />
                        {company.location || "N/A"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Persons size={11} className="text-zinc-600" />
                        {company.size || "N/A"}
                      </span>
                      <span className="capitalize">{company.category}</span>
                      {company.website && company.website !== "#" && (
                        <a
                          href={company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-[#0088FF] hover:underline"
                        >
                          <Globe size={11} />
                          Website
                        </a>
                      )}
                    </div>
                    {company.description && (
                      <p className="text-xs text-zinc-500 mt-1.5 line-clamp-1 max-w-md">
                        {company.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  {isLoading ? (
                    <Spinner size="sm" color="primary" />
                  ) : (
                    <>
                      {company.status !== "approved" && (
                        <Button
                          size="sm"
                          onPress={() => handleStatusChange(companyId, "approved")}
                          className="h-9 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 transition-all cursor-pointer border-0"
                        >
                          <CircleCheck size={14} className="mr-1.5" />
                          Approve
                        </Button>
                      )}
                      {company.status !== "rejected" && (
                        <Button
                          size="sm"
                          onPress={() => handleStatusChange(companyId, "rejected")}
                          className="h-9 rounded-lg bg-red-600/80 hover:bg-red-500 text-white text-xs font-bold px-4 transition-all cursor-pointer border-0"
                        >
                          <CircleXmark size={14} className="mr-1.5" />
                          Reject
                        </Button>
                      )}
                      {company.status !== "pending" && (
                        <Button
                          size="sm"
                          variant="bordered"
                          onPress={() => handleStatusChange(companyId, "pending")}
                          className="h-9 rounded-lg border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white text-xs font-bold px-4 transition-all cursor-pointer"
                        >
                          <Clock size={14} className="mr-1.5" />
                          Reset
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
