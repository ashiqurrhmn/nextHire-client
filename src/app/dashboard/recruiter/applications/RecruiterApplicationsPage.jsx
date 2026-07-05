"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Button,
  Chip,
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
  Persons,
  Xmark,
} from "@gravity-ui/icons";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

// ─── Demo Data ───────────────────────────────────────────────────
const DEMO_APPLICATIONS = [
  {
    _id: "app_001",
    fullName: "Sophia Bennett",
    email: "sophia.bennett@gmail.com",
    portfolioUrl: "https://linkedin.com/in/sophiabennett",
    coverLetter:
      "I am a highly motivated Senior Product Designer with 6+ years of experience crafting user-centered digital products. My expertise spans design systems, prototyping, and user research. I led a redesign at Stripe that increased conversion by 22%. I am passionate about creating elegant solutions to complex problems and would love to bring my skills to your growing team.",
    jobId: "job_001",
    jobTitle: "Senior Product Designer",
    jobCategory: "Design",
    companyName: "NextHire Inc.",
    applicantId: "user_101",
    status: "applied",
    createdAt: "2026-06-24T10:30:00Z",
  },
  {
    _id: "app_002",
    fullName: "Marcus Chen",
    email: "marcus.chen@outlook.com",
    portfolioUrl: "https://github.com/marcuschen",
    coverLetter:
      "Full-stack engineer with 4 years of experience building scalable web applications using React, Node.js, and PostgreSQL. Previously at Shopify, where I contributed to the checkout optimization team. I am excited about this opportunity because I thrive in fast-paced environments and love shipping impactful features.",
    jobId: "job_002",
    jobTitle: "Full Stack Engineer",
    jobCategory: "Technology",
    companyName: "NextHire Inc.",
    applicantId: "user_102",
    status: "shortlisted",
    createdAt: "2026-06-23T14:15:00Z",
  },
  {
    _id: "app_003",
    fullName: "Amara Okafor",
    email: "amara.okafor@yahoo.com",
    portfolioUrl: "",
    coverLetter:
      "I have 8 years of marketing leadership experience, having led campaigns at both Fortune 500 companies and fast-growing startups. My most recent campaign at HubSpot generated 3M+ impressions and a 45% increase in qualified leads. I am drawn to this role because of the opportunity to build a marketing function from the ground up.",
    jobId: "job_003",
    jobTitle: "Marketing Lead",
    jobCategory: "Marketing",
    companyName: "NextHire Inc.",
    applicantId: "user_103",
    status: "interviewing",
    createdAt: "2026-06-22T09:00:00Z",
  },
  {
    _id: "app_004",
    fullName: "Ethan Rodriguez",
    email: "ethan.rod@protonmail.com",
    portfolioUrl: "https://ethanrodriguez.dev",
    coverLetter:
      "DevOps engineer specializing in cloud infrastructure (AWS, GCP), CI/CD pipelines, and container orchestration with Kubernetes. At my current role, I reduced deployment times by 60% and infrastructure costs by 35%. I believe my expertise in building reliable, scalable systems would be a great asset to your engineering team.",
    jobId: "job_002",
    jobTitle: "Full Stack Engineer",
    jobCategory: "Technology",
    companyName: "NextHire Inc.",
    applicantId: "user_104",
    status: "rejected",
    createdAt: "2026-06-21T16:45:00Z",
  },
  {
    _id: "app_005",
    fullName: "Lina Johansson",
    email: "lina.j@gmail.com",
    portfolioUrl: "https://dribbble.com/linajohansson",
    coverLetter:
      "UI/UX designer with a passion for clean, accessible interfaces. Over 5 years of experience working with SaaS products. I recently redesigned the onboarding flow at Notion, which reduced drop-off by 28%. I am eager to join a team that values design thinking and user empathy.",
    jobId: "job_001",
    jobTitle: "Senior Product Designer",
    jobCategory: "Design",
    companyName: "NextHire Inc.",
    applicantId: "user_105",
    status: "hired",
    createdAt: "2026-06-20T11:30:00Z",
  },
  {
    _id: "app_006",
    fullName: "Raj Patel",
    email: "raj.patel@techmail.com",
    portfolioUrl: "https://linkedin.com/in/rajpatel-pm",
    coverLetter:
      "Product manager with 5 years of experience driving product strategy, roadmap planning, and cross-functional execution. I have shipped products used by millions at both early-stage startups and enterprise companies. I am passionate about data-driven decision making and building products that delight users.",
    jobId: "job_004",
    jobTitle: "Product Manager",
    jobCategory: "Technology",
    companyName: "NextHire Inc.",
    applicantId: "user_106",
    status: "applied",
    createdAt: "2026-06-19T08:20:00Z",
  },
  {
    _id: "app_007",
    fullName: "Isabella Martinez",
    email: "isabella.m@outlook.com",
    portfolioUrl: "https://github.com/isabellamtz",
    coverLetter:
      "Backend developer with 3 years of experience in Python, Django, and microservices architecture. I love building robust APIs and working on system design challenges. My contributions to open-source projects have been recognized with over 2K GitHub stars.",
    jobId: "job_002",
    jobTitle: "Full Stack Engineer",
    jobCategory: "Technology",
    companyName: "NextHire Inc.",
    applicantId: "user_107",
    status: "shortlisted",
    createdAt: "2026-06-18T13:10:00Z",
  },
  {
    _id: "app_008",
    fullName: "Daniel Kim",
    email: "d.kim@gmail.com",
    portfolioUrl: "",
    coverLetter:
      "Sales executive with 7 years of B2B SaaS sales experience. Consistently exceeded quota by 130%+ at Salesforce and Gong. I specialize in enterprise sales cycles, pipeline management, and building strong client relationships. Excited about the growth trajectory here.",
    jobId: "job_005",
    jobTitle: "Sales Executive",
    jobCategory: "Sales",
    companyName: "NextHire Inc.",
    applicantId: "user_108",
    status: "interviewing",
    createdAt: "2026-06-17T15:50:00Z",
  },
  {
    _id: "app_009",
    fullName: "Fatima Al-Hassan",
    email: "fatima.alhassan@mail.com",
    portfolioUrl: "https://fatimaalhassan.com",
    coverLetter:
      "Data scientist with expertise in machine learning, NLP, and statistical modeling. PhD in Computer Science from MIT. Published 12 papers in top-tier conferences. Previously led the recommendation engine team at Netflix. I am looking for an opportunity to apply my skills in a high-impact environment.",
    jobId: "job_006",
    jobTitle: "Data Scientist",
    jobCategory: "Technology",
    companyName: "NextHire Inc.",
    applicantId: "user_109",
    status: "applied",
    createdAt: "2026-06-16T10:00:00Z",
  },
  {
    _id: "app_010",
    fullName: "James O'Brien",
    email: "james.obrien@company.co",
    portfolioUrl: "https://linkedin.com/in/jamesobrien",
    coverLetter:
      "Content strategist and copywriter with 6 years of experience creating compelling content for tech companies. Managed editorial calendars, SEO strategy, and brand voice for companies like Buffer and Airtable. I love storytelling that drives engagement and conversion.",
    jobId: "job_003",
    jobTitle: "Marketing Lead",
    jobCategory: "Marketing",
    companyName: "NextHire Inc.",
    applicantId: "user_110",
    status: "rejected",
    createdAt: "2026-06-15T12:30:00Z",
  },
  {
    _id: "app_011",
    fullName: "Yuki Tanaka",
    email: "yuki.tanaka@email.jp",
    portfolioUrl: "https://behance.net/yukitanaka",
    coverLetter:
      "Motion designer and brand strategist with 4 years of experience creating stunning visual identities and micro-animations for digital products. I bring a unique blend of artistic vision and technical skills in After Effects, Figma, and Lottie animations.",
    jobId: "job_001",
    jobTitle: "Senior Product Designer",
    jobCategory: "Design",
    companyName: "NextHire Inc.",
    applicantId: "user_111",
    status: "applied",
    createdAt: "2026-06-14T09:15:00Z",
  },
  {
    _id: "app_012",
    fullName: "Noah Williams",
    email: "noah.w@techstart.io",
    portfolioUrl: "https://github.com/noahwilliams",
    coverLetter:
      "Frontend engineer specializing in React, Next.js, and TypeScript with 3 years of professional experience. Passionate about performance optimization, accessibility, and building delightful user interfaces. Contributed to major open-source design systems.",
    jobId: "job_002",
    jobTitle: "Full Stack Engineer",
    jobCategory: "Technology",
    companyName: "NextHire Inc.",
    applicantId: "user_112",
    status: "shortlisted",
    createdAt: "2026-06-13T14:45:00Z",
  },
  {
    _id: "app_013",
    fullName: "Priya Sharma",
    email: "priya.sharma@inbox.com",
    portfolioUrl: "",
    coverLetter:
      "HR and talent acquisition specialist with 5 years of experience building diverse, high-performing teams. Developed interview frameworks and employer branding strategies that reduced time-to-hire by 40% at my previous company. I am excited about shaping the people operations function at a growing company.",
    jobId: "job_004",
    jobTitle: "Product Manager",
    jobCategory: "Technology",
    companyName: "NextHire Inc.",
    applicantId: "user_113",
    status: "applied",
    createdAt: "2026-06-12T11:00:00Z",
  },
];

// ─── Helpers ─────────────────────────────────────────────────────
const STATUS_CONFIG = {
  applied: {
    label: "Applied",
    chipClass:
      "bg-emerald-950/20 text-emerald-400 border border-emerald-900/40",
    dotClass: "bg-emerald-500",
    borderActive: "border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.1)]",
    borderHover: "hover:border-emerald-900/30",
    iconBg: "border-emerald-950/50 bg-emerald-950/10 text-emerald-400",
  },
  shortlisted: {
    label: "Shortlisted",
    chipClass: "bg-amber-950/20 text-amber-500 border border-amber-900/40",
    dotClass: "bg-amber-500",
    borderActive: "border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.1)]",
    borderHover: "hover:border-amber-900/30",
    iconBg: "border-amber-950 bg-amber-950/10 text-amber-500",
  },
  interviewing: {
    label: "Interviewing",
    chipClass: "bg-blue-950/20 text-blue-400 border border-blue-900/40",
    dotClass: "bg-blue-500",
    borderActive: "border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.1)]",
    borderHover: "hover:border-blue-900/30",
    iconBg: "border-blue-950 bg-blue-950/10 text-blue-400",
  },
  rejected: {
    label: "Rejected",
    chipClass: "bg-red-950/20 text-red-400 border border-red-900/40",
    dotClass: "bg-red-500",
    borderActive: "border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.1)]",
    borderHover: "hover:border-red-900/30",
    iconBg: "border-red-950 bg-red-950/10 text-red-400",
  },
  hired: {
    label: "Hired",
    chipClass: "bg-purple-950/20 text-purple-400 border border-purple-900/40",
    dotClass: "bg-purple-500",
    borderActive: "border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.1)]",
    borderHover: "hover:border-purple-900/30",
    iconBg: "border-purple-950 bg-purple-950/10 text-purple-400",
  },
};

const getStatusChip = (status) => {
  const config = STATUS_CONFIG[status];
  if (!config) {
    return (
      <Chip
        className="bg-zinc-850 text-zinc-300 border border-zinc-800 text-[11px]"
        size="sm"
        variant="flat"
      >
        {status}
      </Chip>
    );
  }
  return (
    <Chip
      className={`${config.chipClass} text-[11px] font-semibold`}
      size="sm"
      variant="flat"
    >
      {config.label}
    </Chip>
  );
};

const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getInitials = (name) => {
  if (!name) return "??";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

// A subtle gradient palette for avatar backgrounds
const AVATAR_GRADIENTS = [
  "from-blue-600 to-indigo-700",
  "from-purple-600 to-pink-700",
  "from-emerald-600 to-teal-700",
  "from-amber-600 to-orange-700",
  "from-rose-600 to-red-700",
  "from-cyan-600 to-blue-700",
  "from-fuchsia-600 to-purple-700",
];

const getAvatarGradient = (name) => {
  let hash = 0;
  for (let i = 0; i < (name || "").length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_GRADIENTS[Math.abs(hash) % AVATAR_GRADIENTS.length];
};

// ─── Main Component ──────────────────────────────────────────────
const RecruiterApplicationsPage = ({ company, initialApplications }) => {
  const [applications, setApplications] = useState(
    initialApplications && initialApplications.length > 0
      ? initialApplications
      : DEMO_APPLICATIONS
  );
  const [loading, setLoading] = useState(false);

  // Filter & Search
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("jobTitle") || "");
  const [statusFilter, setStatusFilter] = useState("all");
  const [jobFilter, setJobFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Detail Modal
  const [selectedApp, setSelectedApp] = useState(null);

  // Reset page on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, jobFilter, sortBy, sortOrder]);

  // ─── Stats ───────────────────────────────────────────────────
  const stats = useMemo(() => {
    return {
      total: applications.length,
      applied: applications.filter((a) => a.status === "applied").length,
      shortlisted: applications.filter((a) => a.status === "shortlisted")
        .length,
      interviewing: applications.filter((a) => a.status === "interviewing")
        .length,
      rejected: applications.filter((a) => a.status === "rejected").length,
      hired: applications.filter((a) => a.status === "hired").length,
    };
  }, [applications]);

  // ─── Unique job titles for filter dropdown ───────────────────
  const uniqueJobs = useMemo(() => {
    const jobMap = new Map();
    applications.forEach((app) => {
      if (app.jobTitle && !jobMap.has(app.jobTitle)) {
        jobMap.set(app.jobTitle, app.jobId);
      }
    });
    return Array.from(jobMap.entries()); // [[title, id], ...]
  }, [applications]);

  // ─── Filtered & Sorted ──────────────────────────────────────
  const filteredApplications = useMemo(() => {
    return applications
      .filter((app) => {
        const name = (app.fullName || "").toLowerCase();
        const email = (app.email || "").toLowerCase();
        const jobTitle = (app.jobTitle || "").toLowerCase();
        const query = searchQuery.toLowerCase();

        const matchesSearch =
          !query ||
          name.includes(query) ||
          email.includes(query) ||
          jobTitle.includes(query);

        const matchesStatus =
          statusFilter === "all" || app.status === statusFilter;

        const matchesJob =
          jobFilter === "all" || app.jobTitle === jobFilter;

        return matchesSearch && matchesStatus && matchesJob;
      })
      .sort((a, b) => {
        let valA, valB;

        if (sortBy === "fullName") {
          valA = (a.fullName || "").toLowerCase();
          valB = (b.fullName || "").toLowerCase();
        } else {
          valA = a[sortBy] || "";
          valB = b[sortBy] || "";
        }

        if (valA < valB) return sortOrder === "asc" ? -1 : 1;
        if (valA > valB) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
  }, [applications, searchQuery, statusFilter, jobFilter, sortBy, sortOrder]);

  // ─── Pagination ─────────────────────────────────────────────
  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);
  const paginatedApplications = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredApplications.slice(start, start + itemsPerPage);
  }, [filteredApplications, currentPage]);

  // ─── Status Change Handler ──────────────────────────────────
  const handleStatusChange = async (appId, newStatus) => {
    setApplications((prev) =>
      prev.map((app) =>
        app._id === appId ? { ...app, status: newStatus } : app
      )
    );

    const statusLabel =
      STATUS_CONFIG[newStatus]?.label || newStatus;
    toast.success(`Application status updated to "${statusLabel}"`);

    // Attempt backend sync
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      await fetch(`${baseUrl}/api/applications/${appId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (err) {
      console.warn(
        "Failed to sync status with backend (expected in demo mode):",
        err
      );
    }

    // Update selected app if modal is open
    if (selectedApp?._id === appId) {
      setSelectedApp((prev) => ({ ...prev, status: newStatus }));
    }
  };

  // ─── Stat Card Component ────────────────────────────────────
  const StatCard = ({
    label,
    count,
    filterValue,
    icon,
    activeStyle,
    hoverStyle,
    iconBg,
  }) => (
    <button
      type="button"
      onClick={() => setStatusFilter(filterValue)}
      className={`flex flex-col justify-between p-5 rounded-2xl border text-left transition-all duration-300 cursor-pointer bg-zinc-950/40 hover:bg-zinc-950/60 ${
        statusFilter === filterValue
          ? `${activeStyle} scale-[1.02]`
          : `border-zinc-900 ${hoverStyle}`
      }`}
    >
      <div className="flex items-center justify-between mb-4 w-full">
        <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
          {label}
        </span>
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-lg border ${iconBg}`}
        >
          {icon}
        </div>
      </div>
      <span className="text-3xl font-bold text-white tracking-tight">
        {count}
      </span>
    </button>
  );

  return (
    <div className="flex flex-col min-h-full pb-8">
      {/* Search Header */}
      <DashboardHeader />

      {/* Page Title */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white tracking-tight">
          Applications
        </h2>
        <p className="text-sm text-zinc-500 mt-1">
          Review and manage all candidate applications for your job postings.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <StatCard
          label="Total"
          count={stats.total}
          filterValue="all"
          icon={<Persons size={15} />}
          activeStyle="border-[#0088FF] shadow-[0_0_15px_rgba(0,136,255,0.1)]"
          hoverStyle="hover:border-zinc-800"
          iconBg="border-zinc-800 text-zinc-400"
        />
        <StatCard
          label="Applied"
          count={stats.applied}
          filterValue="applied"
          icon={
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
          }
          activeStyle={STATUS_CONFIG.applied.borderActive}
          hoverStyle={STATUS_CONFIG.applied.borderHover}
          iconBg={STATUS_CONFIG.applied.iconBg}
        />
        <StatCard
          label="Shortlisted"
          count={stats.shortlisted}
          filterValue="shortlisted"
          icon={<div className="h-1.5 w-1.5 rounded-full bg-amber-500" />}
          activeStyle={STATUS_CONFIG.shortlisted.borderActive}
          hoverStyle={STATUS_CONFIG.shortlisted.borderHover}
          iconBg={STATUS_CONFIG.shortlisted.iconBg}
        />
        <StatCard
          label="Interviewing"
          count={stats.interviewing}
          filterValue="interviewing"
          icon={<div className="h-1.5 w-1.5 rounded-full bg-blue-500" />}
          activeStyle={STATUS_CONFIG.interviewing.borderActive}
          hoverStyle={STATUS_CONFIG.interviewing.borderHover}
          iconBg={STATUS_CONFIG.interviewing.iconBg}
        />
        <StatCard
          label="Hired"
          count={stats.hired}
          filterValue="hired"
          icon={<div className="h-1.5 w-1.5 rounded-full bg-purple-500" />}
          activeStyle={STATUS_CONFIG.hired.borderActive}
          hoverStyle={STATUS_CONFIG.hired.borderHover}
          iconBg={STATUS_CONFIG.hired.iconBg}
        />
        <StatCard
          label="Rejected"
          count={stats.rejected}
          filterValue="rejected"
          icon={<div className="h-1.5 w-1.5 rounded-full bg-red-500" />}
          activeStyle={STATUS_CONFIG.rejected.borderActive}
          hoverStyle={STATUS_CONFIG.rejected.borderHover}
          iconBg={STATUS_CONFIG.rejected.iconBg}
        />
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
        {/* Search Input */}
        <div className="relative w-full md:max-w-md">
          <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Magnifier className="h-4 w-4 text-zinc-500" />
          </span>
          <input
            type="text"
            placeholder="Search by name, email, or job title..."
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
            value={jobFilter}
            onChange={(e) => setJobFilter(e.target.value)}
            className="h-11 px-4 rounded-xl border border-zinc-900 bg-zinc-950/80 text-sm text-white outline-none focus:border-[#0088FF]/50 transition-colors cursor-pointer"
          >
            <option value="all">All Jobs</option>
            {uniqueJobs.map(([title]) => (
              <option key={title} value={title}>
                {title}
              </option>
            ))}
          </select>

          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split("-");
              setSortBy(field);
              setSortOrder(order);
            }}
            className="h-11 px-4 rounded-xl border border-zinc-900 bg-zinc-950/80 text-sm text-white outline-none focus:border-[#0088FF]/50 transition-colors cursor-pointer"
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="fullName-asc">Name (A-Z)</option>
            <option value="fullName-desc">Name (Z-A)</option>
          </select>
        </div>
      </div>

      {/* Applications Table Card */}
      <div className="rounded-2xl border border-zinc-900 bg-zinc-950/40 p-6 shadow-xl mb-6 flex flex-col">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-zinc-400">
            <Spinner size="lg" color="primary" />
            <p className="text-sm font-medium">Loading applications...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-400 border-collapse">
              <thead>
                <tr className="border-b border-zinc-900 text-zinc-500 font-semibold text-xs uppercase tracking-wider">
                  <th className="pb-3 font-semibold text-left">Candidate</th>
                  <th className="pb-3 font-semibold text-left">Applied For</th>
                  <th className="pb-3 font-semibold text-left">Date</th>
                  <th className="pb-3 font-semibold text-left">Portfolio</th>
                  <th className="pb-3 font-semibold text-left">Status</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900/50">
                {paginatedApplications.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-16 text-zinc-500">
                      <div className="flex flex-col items-center gap-3">
                        <Persons size={36} className="text-zinc-750" />
                        <p className="font-semibold text-white text-base">
                          No applications found
                        </p>
                        <p className="text-xs text-zinc-500 max-w-xs mx-auto text-center">
                          {searchQuery ||
                          statusFilter !== "all" ||
                          jobFilter !== "all"
                            ? "Try adjusting your filters or search query."
                            : "No applications have been received yet. Applications will appear here once candidates apply to your job postings."}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedApplications.map((app) => (
                    <tr
                      key={app._id}
                      className="hover:bg-zinc-900/10 transition-colors"
                    >
                      {/* Candidate */}
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr ${getAvatarGradient(
                              app.fullName
                            )} text-white text-xs font-bold shadow-md`}
                          >
                            {getInitials(app.fullName)}
                          </div>
                          <div>
                            <p className="font-bold text-white text-sm truncate max-w-[160px] md:max-w-[200px]">
                              {app.fullName}
                            </p>
                            <p className="text-[11px] text-zinc-500 truncate max-w-[160px] md:max-w-[200px]">
                              {app.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Applied For */}
                      <td className="py-4">
                        <div>
                          <p className="text-xs font-semibold text-zinc-300 truncate max-w-[140px]">
                            {app.jobTitle || "Untitled Job"}
                          </p>
                          <p className="text-[11px] text-zinc-500 capitalize mt-0.5">
                            {app.jobCategory || "General"}
                          </p>
                        </div>
                      </td>

                      {/* Date Applied */}
                      <td className="py-4">
                        <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                          <Calendar size={12} className="text-zinc-600" />
                          <span>{formatDate(app.createdAt)}</span>
                        </div>
                      </td>

                      {/* Portfolio */}
                      <td className="py-4">
                        {app.portfolioUrl ? (
                          <a
                            href={app.portfolioUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0088FF] hover:text-[#339FFF] transition-colors"
                          >
                            <Globe size={12} />
                            <span className="truncate max-w-[100px]">
                              View Link
                            </span>
                          </a>
                        ) : (
                          <span className="text-xs text-zinc-600">—</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-4">{getStatusChip(app.status)}</td>

                      {/* Actions */}
                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Status dropdown */}
                          <select
                            value={app.status}
                            onChange={(e) =>
                              handleStatusChange(app._id, e.target.value)
                            }
                            className="h-8 px-2 rounded-lg border border-zinc-800 bg-zinc-950 text-xs text-zinc-300 outline-none focus:border-[#0088FF]/50 transition-colors cursor-pointer"
                          >
                            <option value="applied">Applied</option>
                            <option value="shortlisted">Shortlisted</option>
                            <option value="interviewing">Interviewing</option>
                            <option value="hired">Hired</option>
                            <option value="rejected">Rejected</option>
                          </select>

                          {/* View Details Button */}
                          <Button
                            size="sm"
                            variant="light"
                            onPress={() => setSelectedApp(app)}
                            className="h-8 rounded-lg text-xs font-bold text-[#0088FF] hover:bg-[#0088FF]/10 hover:text-white border-0 cursor-pointer min-w-0 px-2"
                            title="View application details"
                          >
                            <Eye size={14} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 pt-6 border-t border-zinc-900 gap-4">
            <span className="text-xs text-zinc-500">
              Showing {(currentPage - 1) * itemsPerPage + 1}–
              {Math.min(currentPage * itemsPerPage, filteredApplications.length)}{" "}
              of {filteredApplications.length} applications
            </span>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="flat"
                isDisabled={currentPage === 1}
                onPress={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="bg-zinc-900 text-zinc-400 hover:bg-zinc-800 disabled:opacity-50 min-w-20"
              >
                Previous
              </Button>
              
              <div className="flex items-center gap-1 hidden sm:flex">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs transition-colors ${
                      currentPage === i + 1
                        ? "bg-[#0088FF] text-white font-bold shadow-md"
                        : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 font-semibold"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <Button
                size="sm"
                variant="flat"
                isDisabled={currentPage === totalPages}
                onPress={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                className="bg-zinc-900 text-zinc-400 hover:bg-zinc-800 disabled:opacity-50 min-w-20"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* ─── Application Detail Modal ──────────────────────────── */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedApp(null)}
          />

          {/* Modal */}
          <div className="relative bg-[#0a0a0c] border border-zinc-900 text-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between p-6 border-b border-zinc-900">
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr ${getAvatarGradient(
                    selectedApp.fullName
                  )} text-white text-sm font-bold shadow-lg`}
                >
                  {getInitials(selectedApp.fullName)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {selectedApp.fullName}
                  </h3>
                  <p className="text-xs text-zinc-500">{selectedApp.email}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-zinc-900 text-zinc-400 hover:text-white transition-colors bg-transparent border-0 cursor-pointer"
                type="button"
                title="Close"
              >
                <Xmark size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5 p-4 rounded-xl border border-zinc-900 bg-zinc-950/40">
                  <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
                    Applied For
                  </span>
                  <span className="text-sm font-bold text-white">
                    {selectedApp.jobTitle}
                  </span>
                  <span className="text-xs text-zinc-500 capitalize">
                    {selectedApp.jobCategory || "General"}
                  </span>
                </div>
                <div className="flex flex-col gap-1.5 p-4 rounded-xl border border-zinc-900 bg-zinc-950/40">
                  <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
                    Date Applied
                  </span>
                  <span className="text-sm font-bold text-white">
                    {formatDate(selectedApp.createdAt)}
                  </span>
                  <span className="text-xs text-zinc-500">
                    {new Date(selectedApp.createdAt).toLocaleTimeString(
                      "en-US",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </span>
                </div>
                <div className="flex flex-col gap-1.5 p-4 rounded-xl border border-zinc-900 bg-zinc-950/40">
                  <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
                    Current Status
                  </span>
                  <div className="mt-1">{getStatusChip(selectedApp.status)}</div>
                </div>
                <div className="flex flex-col gap-1.5 p-4 rounded-xl border border-zinc-900 bg-zinc-950/40">
                  <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
                    Portfolio / LinkedIn
                  </span>
                  {selectedApp.portfolioUrl ? (
                    <a
                      href={selectedApp.portfolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-[#0088FF] hover:text-[#339FFF] transition-colors truncate"
                    >
                      {selectedApp.portfolioUrl}
                    </a>
                  ) : (
                    <span className="text-sm text-zinc-600">
                      No link provided
                    </span>
                  )}
                </div>
              </div>

              {/* Cover Letter */}
              <div>
                <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
                  Cover Letter
                </h4>
                <div className="p-5 rounded-xl border border-zinc-900 bg-zinc-950/40">
                  {selectedApp.coverLetter ? (
                    <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
                      {selectedApp.coverLetter}
                    </p>
                  ) : (
                    <p className="text-sm text-zinc-600 italic">
                      No cover letter was submitted with this application.
                    </p>
                  )}
                </div>
              </div>

              {/* Status Change Actions */}
              <div>
                <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
                  Update Status
                </h4>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                    <button
                      key={key}
                      onClick={() =>
                        handleStatusChange(selectedApp._id, key)
                      }
                      disabled={selectedApp.status === key}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
                        selectedApp.status === key
                          ? `${config.chipClass} border-current`
                          : "bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:text-white hover:bg-zinc-900"
                      }`}
                      type="button"
                    >
                      {config.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-zinc-900 bg-zinc-950/40">
              {selectedApp.portfolioUrl && (
                <a
                  href={selectedApp.portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="bordered"
                    className="h-10 rounded-xl border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/60 px-4 text-xs font-bold text-zinc-300 transition-all cursor-pointer"
                  >
                    <Globe size={14} className="mr-1.5" />
                    Open Portfolio
                  </Button>
                </a>
              )}
              <Button
                onPress={() => setSelectedApp(null)}
                className="h-10 rounded-xl bg-gradient-to-r from-[#0088FF] to-[#0055FF] px-5 text-xs font-bold text-white shadow-lg shadow-[#0088FF]/20 transition-all hover:from-[#339FFF] hover:to-[#2277FF] hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruiterApplicationsPage;
