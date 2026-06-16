"use client";

import React, { useState, useMemo } from "react";
import { Button, Spinner, toast } from "@heroui/react";
import {
  Magnifier,
  Persons,
  TrashBin,
  Clock,
} from "@gravity-ui/icons";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

// Custom SVG icons
const ShieldIcon = (props) => (
  <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const UserIcon = (props) => (
  <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const BriefcaseSmIcon = (props) => (
  <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

export default function AdminUsersPage({ initialUsers }) {
  const [users, setUsers] = useState(initialUsers || []);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [loadingId, setLoadingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        !searchQuery.trim() ||
        (u.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.email || "").toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole =
        roleFilter === "all" || u.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, roleFilter]);

  const stats = useMemo(() => {
    return {
      total: users.length,
      seekers: users.filter((u) => u.role === "seeker" || !u.role).length,
      recruiters: users.filter((u) => u.role === "recruiter").length,
      admins: users.filter((u) => u.role === "admin").length,
    };
  }, [users]);

  const handleRoleChange = async (userId, newRole) => {
    setLoadingId(userId);
    try {
      const res = await fetch(`${baseUrl}/api/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update role");
      }

      setUsers((prev) =>
        prev.map((u) =>
          (u._id === userId || u.id === userId)
            ? { ...u, role: newRole }
            : u
        )
      );
      toast.success(`User role updated to ${newRole}!`);
    } catch (err) {
      console.error("Role update error:", err);
      toast.error(err.message || "Failed to update user role.");
    } finally {
      setLoadingId(null);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
      return;
    }
    setDeletingId(userId);
    try {
      const res = await fetch(`${baseUrl}/api/users/${userId}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete user");
      }

      setUsers((prev) => prev.filter((u) => u._id !== userId && u.id !== userId));
      toast.success("User deleted successfully!");
    } catch (err) {
      console.error("Delete user error:", err);
      toast.error(err.message || "Failed to delete user.");
    } finally {
      setDeletingId(null);
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case "admin":
        return (
          <span className="inline-flex items-center gap-1 bg-purple-950/20 text-purple-400 border border-purple-900/40 text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full">
            <ShieldIcon />
            Admin
          </span>
        );
      case "recruiter":
        return (
          <span className="inline-flex items-center gap-1 bg-blue-950/20 text-blue-400 border border-blue-900/40 text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full">
            <BriefcaseSmIcon />
            Recruiter
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-zinc-900/60 text-zinc-400 border border-zinc-800 text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full">
            <UserIcon />
            Seeker
          </span>
        );
    }
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
          User Management
        </h2>
        <p className="text-sm text-zinc-500 mt-1">
          View and manage all registered platform users.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <button
          type="button"
          onClick={() => setRoleFilter("all")}
          className={`flex flex-col justify-between p-5 rounded-2xl border text-left transition-all duration-300 cursor-pointer bg-zinc-950/40 hover:bg-zinc-950/60 ${
            roleFilter === "all"
              ? "border-[#0088FF] shadow-[0_0_15px_rgba(0,136,255,0.1)] scale-[1.02]"
              : "border-zinc-900 hover:border-zinc-800"
          }`}
        >
          <div className="flex items-center justify-between mb-4 w-full">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Total Users
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 text-zinc-400">
              <Persons size={15} />
            </div>
          </div>
          <span className="text-3xl font-bold text-white tracking-tight">
            {stats.total}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setRoleFilter("seeker")}
          className={`flex flex-col justify-between p-5 rounded-2xl border text-left transition-all duration-300 cursor-pointer bg-zinc-950/40 hover:bg-zinc-950/60 ${
            roleFilter === "seeker"
              ? "border-zinc-500 shadow-[0_0_15px_rgba(161,161,170,0.1)] scale-[1.02]"
              : "border-zinc-900 hover:border-zinc-800"
          }`}
        >
          <div className="flex items-center justify-between mb-4 w-full">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Seekers
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 text-zinc-400">
              <UserIcon className="w-[15px] h-[15px]" />
            </div>
          </div>
          <span className="text-3xl font-bold text-white tracking-tight">
            {stats.seekers}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setRoleFilter("recruiter")}
          className={`flex flex-col justify-between p-5 rounded-2xl border text-left transition-all duration-300 cursor-pointer bg-zinc-950/40 hover:bg-zinc-950/60 ${
            roleFilter === "recruiter"
              ? "border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.1)] scale-[1.02]"
              : "border-zinc-900 hover:border-blue-900/30"
          }`}
        >
          <div className="flex items-center justify-between mb-4 w-full">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Recruiters
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-blue-950/50 bg-blue-950/10 text-blue-400">
              <BriefcaseSmIcon className="w-[15px] h-[15px]" />
            </div>
          </div>
          <span className="text-3xl font-bold text-white tracking-tight">
            {stats.recruiters}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setRoleFilter("admin")}
          className={`flex flex-col justify-between p-5 rounded-2xl border text-left transition-all duration-300 cursor-pointer bg-zinc-950/40 hover:bg-zinc-950/60 ${
            roleFilter === "admin"
              ? "border-purple-500 shadow-[0_0_15px_rgba(147,51,234,0.1)] scale-[1.02]"
              : "border-zinc-900 hover:border-purple-900/30"
          }`}
        >
          <div className="flex items-center justify-between mb-4 w-full">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Admins
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-purple-950/50 bg-purple-950/10 text-purple-400">
              <ShieldIcon className="w-[15px] h-[15px]" />
            </div>
          </div>
          <span className="text-3xl font-bold text-white tracking-tight">
            {stats.admins}
          </span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-zinc-900 mb-6">
        <h3 className="text-base font-bold text-white">
          All Users ({filteredUsers.length})
        </h3>
        <div className="relative w-48 sm:w-72">
          <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Magnifier className="h-4 w-4 text-zinc-500" />
          </span>
          <input
            type="text"
            placeholder="Search by name or email..."
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

      {/* Users Table */}
      <div className="rounded-2xl border border-zinc-900 bg-zinc-950/40 shadow-xl">
        {filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Persons size={40} className="text-zinc-750" />
            <p className="font-semibold text-white text-base">No users found</p>
            <p className="text-xs text-zinc-500 max-w-xs text-center">
              {searchQuery || roleFilter !== "all"
                ? "Try adjusting your filters or search term."
                : "No users have registered yet."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-400 border-collapse">
              <thead>
                <tr className="border-b border-zinc-900 text-zinc-500 font-semibold text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold text-left">User</th>
                  <th className="px-6 py-4 font-semibold text-left">Role</th>
                  <th className="px-6 py-4 font-semibold text-left">Plan</th>
                  <th className="px-6 py-4 font-semibold text-left">Joined</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900/50">
                {filteredUsers.map((user) => {
                  const userId = user._id || user.id;
                  const isLoading = loadingId === userId;
                  const isDeleting = deletingId === userId;
                  const initials = (user.name || user.email || "U")
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2);

                  return (
                    <tr key={userId} className="hover:bg-zinc-900/10 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-[#0088FF]/80 to-[#FF5E00]/60 text-xs font-bold text-white overflow-hidden">
                            {user.image ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={user.image} alt={user.name} className="h-full w-full object-cover" />
                            ) : (
                              initials
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-white truncate max-w-[200px]">
                              {user.name || "Unnamed User"}
                            </p>
                            <p className="text-xs text-zinc-500 truncate max-w-[200px]">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        {getRoleBadge(user.role)}
                      </td>

                      <td className="px-6 py-4">
                        <span className="text-xs font-medium text-zinc-400 capitalize">
                          {(user.plan || "free").replace(/_/g, " ")}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                          <Clock size={12} className="text-zinc-600" />
                          {formatDate(user.createdAt)}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {isLoading || isDeleting ? (
                            <Spinner size="sm" color="primary" />
                          ) : (
                            <>
                              {/* Role Change Dropdown */}
                              <select
                                value={user.role || "seeker"}
                                onChange={(e) => handleRoleChange(userId, e.target.value)}
                                className="h-8 px-2 rounded-lg border border-zinc-800 bg-zinc-950 text-xs text-zinc-300 outline-none focus:border-[#0088FF]/50 transition-colors cursor-pointer"
                              >
                                <option value="seeker">Seeker</option>
                                <option value="recruiter">Recruiter</option>
                                <option value="admin">Admin</option>
                              </select>

                              {/* Delete Button */}
                              {user.role !== "admin" && (
                                <Button
                                  size="sm"
                                  isIconOnly
                                  onPress={() => handleDeleteUser(userId, user.name || user.email)}
                                  className="h-8 w-8 rounded-lg bg-transparent hover:bg-red-950/20 text-zinc-500 hover:text-red-400 transition-all cursor-pointer border-0 min-w-0"
                                  title="Delete user"
                                >
                                  <TrashBin size={14} />
                                </Button>
                              )}
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
      </div>
    </div>
  );
}
