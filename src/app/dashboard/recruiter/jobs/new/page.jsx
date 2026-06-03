"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Card, Input, Label, TextField } from "@heroui/react";
import {
  ArrowLeft,
  Briefcase,
  House,
  Calendar,
  Tag,
  Globe,
  CircleCheck,
  CircleExclamation
} from "@gravity-ui/icons";
import { useSession } from "@/lib/auth-client";

const JOB_TYPES = [
  { id: "Full-time", label: "Full-time", description: "Standard hours" },
  { id: "Part-time", label: "Part-time", description: "Flexible hours" },
  { id: "Remote", label: "Remote", description: "Work from anywhere" },
  { id: "Contract", label: "Contract", description: "Project-based" },
  { id: "Internship", label: "Internship", description: "For students" },
];

const CURRENCIES = [
  { id: "USD", symbol: "$", name: "US Dollar" },
  { id: "EUR", symbol: "€", name: "Euro" },
  { id: "GBP", symbol: "£", name: "British Pound" },
  { id: "BDT", symbol: "৳", name: "Bangladeshi Taka" },
  { id: "INR", symbol: "₹", name: "Indian Rupee" },
  { id: "CAD", symbol: "C$", name: "Canadian Dollar" },
];

export default function NewJobPage() {
  const router = useRouter();
  const { data: session, isPending: isSessionLoading } = useSession();
  
  // Loading & State
  const [isCompanyLoading, setIsCompanyLoading] = useState(true);
  const [company, setCompany] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Company registration state (if recruiter has no company)
  const [companyName, setCompanyName] = useState("");
  const [companyCategory, setCompanyCategory] = useState("");
  const [isRegisteringCompany, setIsRegisteringCompany] = useState(false);

  // Job form state
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [jobType, setJobType] = useState("Full-time");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [isRemote, setIsRemote] = useState(false);
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [deadline, setDeadline] = useState("");
  const [responsibilities, setResponsibilities] = useState("");
  const [requirements, setRequirements] = useState("");
  const [benefits, setBenefits] = useState("");

  // Fetch recruiter's company
  useEffect(() => {
    if (session?.user && session.user.role === "recruiter") {
      fetchCompany();
    } else if (!isSessionLoading && !session?.user) {
      setIsCompanyLoading(false);
    } else {
      setIsCompanyLoading(false);
    }
  }, [session, isSessionLoading]);

  const fetchCompany = async () => {
    setIsCompanyLoading(true);
    try {
      const res = await fetch("/api/recruiter/company");
      if (res.ok) {
        const data = await res.json();
        setCompany(data.company);
      }
    } catch (err) {
      console.error("Error fetching company:", err);
    } finally {
      setIsCompanyLoading(false);
    }
  };

  // Register a mock company for the recruiter
  const handleRegisterCompany = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    if (!companyName.trim() || !companyCategory.trim()) {
      setErrorMessage("Please fill in all company fields.");
      return;
    }

    setIsRegisteringCompany(true);
    try {
      const res = await fetch("/api/recruiter/company", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: companyName.trim(),
          category: companyCategory.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to register company.");
      }

      setCompany(data.company);
      setSuccessMessage("Company profile registered and approved successfully!");
      // clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setErrorMessage(err.message || "An error occurred during registration.");
    } finally {
      setIsRegisteringCompany(false);
    }
  };

  // Submit the Job post
  const handleSubmitJob = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    // Validations
    if (!title.trim()) return setErrorMessage("Job Title is required.");
    if (!category.trim()) return setErrorMessage("Job Category is required.");
    if (!jobType) return setErrorMessage("Job Type is required.");
    if (!deadline) return setErrorMessage("Application Deadline is required.");
    if (!responsibilities.trim()) return setErrorMessage("Responsibilities are required.");
    if (!requirements.trim()) return setErrorMessage("Requirements are required.");

    if (salaryMin && salaryMax && Number(salaryMin) > Number(salaryMax)) {
      return setErrorMessage("Minimum salary cannot be greater than maximum salary.");
    }

    if (!isRemote && (!city.trim() || !country.trim())) {
      return setErrorMessage("Location (City and Country) is required for non-remote positions.");
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          category,
          type: jobType,
          salaryMin: salaryMin ? Number(salaryMin) : null,
          salaryMax: salaryMax ? Number(salaryMax) : null,
          currency,
          isRemote,
          location: isRemote ? null : { city: city.trim(), country: country.trim() },
          deadline,
          responsibilities,
          requirements,
          benefits,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to post job.");
      }

      setSuccessMessage("Job posted successfully! Redirecting...");
      // console.log(data);
      setTimeout(() => {
        router.push("");
      }, 2000);
    } catch (err) {
      setErrorMessage(err.message || "An error occurred while posting the job.");
    } finally {
      setIsSubmitting(false);
    }
  };
  

  // 1. Session Loading State
  if (isSessionLoading || (session?.user && isCompanyLoading)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <svg className="animate-spin h-8 w-8 text-[#0088FF]" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <span className="text-sm font-medium text-zinc-400">Loading your profile...</span>
      </div>
    );
  }

  // 2. Unauthenticated State
  if (!session?.user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 max-w-md mx-auto text-center px-4">
        <div className="h-16 w-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 text-3xl">
          <CircleExclamation />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-sm text-zinc-400">
            You must be logged in as a recruiter to post jobs on NextHire.
          </p>
        </div>
        <Link href="/auth/signin" className="w-full">
          <Button className="w-full h-12 bg-gradient-to-r from-[#0088FF] to-[#0055FF] text-white font-semibold shadow-lg shadow-[#0088FF]/20">
            Sign In to Your Account
          </Button>
        </Link>
      </div>
    );
  }

  // 3. Unauthorized State (Not Recruiter)
  if (session.user.role !== "recruiter") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 max-w-md mx-auto text-center px-4">
        <div className="h-16 w-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 text-3xl">
          <CircleExclamation />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Recruiter Access Only</h2>
          <p className="text-sm text-zinc-400">
            Your account is registered as a {session.user.role || "seeker"}. Only recruiters can publish new job opportunities.
          </p>
        </div>
        <Link href="/" className="w-full">
          <Button className="w-full h-12 border border-zinc-800 text-zinc-300 hover:text-white font-semibold transition-colors">
            Go back to Homepage
          </Button>
        </Link>
      </div>
    );
  }

  // 4. Recruiter has NO company profile
  if (!company) {
    return (
      <section className="relative isolate py-6 max-w-2xl mx-auto px-4">
        {/* Glow Background Elements */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-1/2 top-10 h-[350px] w-[350px] -translate-x-1/2 rounded-full bg-[#0088FF]/10 blur-[100px]" />
          <div className="absolute -left-20 bottom-10 h-44 w-44 rounded-full bg-[#FF5E00]/10 blur-[80px]" />
        </div>

        {/* Back Link */}
        <Link href="/dashboard/recruiter" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white text-sm mb-6 transition-colors">
          <ArrowLeft className="size-4" />
          <span>Back to Dashboard</span>
        </Link>

        <Card className="border border-zinc-800/80 bg-zinc-900/40 p-8 shadow-2xl backdrop-blur-md">
          <Card.Header className="pb-4 border-b border-zinc-850 flex flex-col gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0088FF]/10 border border-[#0088FF]/30 text-[#0088FF] text-2xl">
              <House />
            </div>
            <h1 className="text-2xl font-bold text-white mt-2">Set up Company Profile</h1>
            <p className="text-sm text-zinc-400">
              NextHire requires an active, approved company profile to list your job posts. Create one in seconds to proceed.
            </p>
          </Card.Header>

          <Card.Content className="pt-6">
            <form onSubmit={handleRegisterCompany} className="space-y-5">
              <TextField className="w-full" name="companyName" isRequired>
                <Label className="mb-1.5 text-sm font-medium text-zinc-200 block">Company Name</Label>
                <Input
                  id="companyName"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Stripe Inc."
                  className="h-12 w-full rounded-xl border border-zinc-700/70 bg-zinc-950/70 px-4 text-sm text-white outline-none transition-colors placeholder:text-zinc-550 focus:border-[#0088FF]/70"
                />
              </TextField>

              <TextField className="w-full" name="companyCategory" isRequired>
                <Label className="mb-1.5 text-sm font-medium text-zinc-200 block">Company Category</Label>
                <Input
                  id="companyCategory"
                  value={companyCategory}
                  onChange={(e) => setCompanyCategory(e.target.value)}
                  placeholder="e.g. Fintech, Software, Biotech"
                  className="h-12 w-full rounded-xl border border-zinc-700/70 bg-zinc-950/70 px-4 text-sm text-white outline-none transition-colors placeholder:text-zinc-550 focus:border-[#0088FF]/70"
                />
              </TextField>

              {errorMessage && (
                <div className="flex items-center gap-2.5 p-3.5 rounded-xl border border-red-500/25 bg-red-500/5 text-red-400 text-xs leading-relaxed">
                  <CircleExclamation className="shrink-0 size-4" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {successMessage && (
                <div className="flex items-center gap-2.5 p-3.5 rounded-xl border border-emerald-500/25 bg-emerald-500/5 text-emerald-400 text-xs leading-relaxed">
                  <CircleCheck className="shrink-0 size-4" />
                  <span>{successMessage}</span>
                </div>
              )}

              <Button
                type="submit"
                isDisabled={isRegisteringCompany || !companyName.trim() || !companyCategory.trim()}
                className="w-full h-12 bg-gradient-to-r from-[#0088FF] to-[#0055FF] text-white font-semibold shadow-lg shadow-[#0088FF]/20"
              >
                {isRegisteringCompany ? "Registering & Approving..." : "Register & Approve Company"}
              </Button>
            </form>
          </Card.Content>
        </Card>
      </section>
    );
  }

  // 5. Active Recruiter with Approved Company Profile - SHOW JOB POST FORM
  return (
    <section className="relative isolate py-6 max-w-6xl mx-auto px-4">
      {/* Background Glows */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute right-10 top-10 h-[400px] w-[400px] rounded-full bg-[#0088FF]/10 blur-[120px]" />
        <div className="absolute left-10 bottom-10 h-[300px] w-[300px] rounded-full bg-[#FF5E00]/5 blur-[100px]" />
      </div>

      {/* Back Link */}
      <Link href="/dashboard/recruiter" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white text-sm mb-6 transition-colors">
        <ArrowLeft className="size-4" />
        <span>Back to Dashboard</span>
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0088FF]/10 border border-[#0088FF]/25 text-[#0088FF]">
            <Briefcase />
          </span>
          Post a New Job
        </h1>
        <p className="text-sm text-zinc-400 mt-2">
          List a new opening. Fill in the parameters, requirements, and job description to publish.
        </p>
      </div>

      <form onSubmit={handleSubmitJob} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Main Form Fields */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section 1: Job Info */}
          <Card className="border border-zinc-800/80 bg-zinc-900/30 p-6 shadow-xl backdrop-blur-md">
            <Card.Header className="pb-4 border-b border-zinc-850 flex items-center gap-3">
              <span className="text-sm font-bold text-white bg-zinc-800 h-6 w-6 rounded-full flex items-center justify-center">1</span>
              <h2 className="text-lg font-bold text-white">Job Details</h2>
            </Card.Header>

            <Card.Content className="pt-6 space-y-5">
              
              {/* Job Title */}
              <TextField className="w-full" name="title" isRequired>
                <Label className="mb-1.5 text-sm font-medium text-zinc-200 block">Job Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Senior Full Stack Engineer"
                  className="h-12 w-full rounded-xl border border-zinc-700/70 bg-zinc-950/70 px-4 text-sm text-white outline-none transition-colors placeholder:text-zinc-550 focus:border-[#0088FF]/70"
                />
              </TextField>

              {/* Job Category */}
              <TextField className="w-full" name="category" isRequired>
                <Label className="mb-1.5 text-sm font-medium text-zinc-200 block">Job Category</Label>
                <Input
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Engineering, Product Design, Marketing"
                  className="h-12 w-full rounded-xl border border-zinc-700/70 bg-zinc-950/70 px-4 text-sm text-white outline-none transition-colors placeholder:text-zinc-550 focus:border-[#0088FF]/70"
                />
              </TextField>

              {/* Job Type Grid */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-zinc-200 block">Job Type</Label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {JOB_TYPES.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setJobType(t.id)}
                      className={`p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                        jobType === t.id
                          ? "border-[#0088FF] bg-[#0088FF]/10 text-white shadow-md shadow-[#0088FF]/5"
                          : "border-zinc-800 bg-zinc-950/40 text-zinc-400 hover:border-zinc-700 hover:text-white"
                      }`}
                    >
                      <span className="text-xs font-bold block">{t.label}</span>
                      <span className="text-[9px] text-zinc-500 block mt-0.5">{t.description}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Salary details & Currency */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <TextField className="w-full" name="salaryMin">
                  <Label className="mb-1.5 text-sm font-medium text-zinc-200 block">Min Salary</Label>
                  <div className="relative">
                    <div className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-zinc-500 text-sm">
                      <Tag className="size-4" />
                    </div>
                    <Input
                      id="salaryMin"
                      type="number"
                      value={salaryMin}
                      onChange={(e) => setSalaryMin(e.target.value)}
                      placeholder="e.g. 80000"
                      className="h-12 w-full rounded-xl border border-zinc-700/70 bg-zinc-950/70 pl-10 pr-4 text-sm text-white outline-none transition-colors placeholder:text-zinc-550 focus:border-[#0088FF]/70"
                    />
                  </div>
                </TextField>

                <TextField className="w-full" name="salaryMax">
                  <Label className="mb-1.5 text-sm font-medium text-zinc-200 block">Max Salary</Label>
                  <div className="relative">
                    <div className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-zinc-500 text-sm">
                      <Tag className="size-4" />
                    </div>
                    <Input
                      id="salaryMax"
                      type="number"
                      value={salaryMax}
                      onChange={(e) => setSalaryMax(e.target.value)}
                      placeholder="e.g. 120000"
                      className="h-12 w-full rounded-xl border border-zinc-700/70 bg-zinc-950/70 pl-10 pr-4 text-sm text-white outline-none transition-colors placeholder:text-zinc-550 focus:border-[#0088FF]/70"
                    />
                  </div>
                </TextField>

                <div className="flex flex-col">
                  <Label className="mb-1.5 text-sm font-medium text-zinc-200 block">Currency</Label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="h-12 w-full rounded-xl border border-zinc-700/70 bg-zinc-950/70 px-4 text-sm text-white outline-none transition-colors focus:border-[#0088FF]/70 cursor-pointer"
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c.id} value={c.id} className="bg-zinc-950">
                        {c.id} ({c.symbol})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Location details */}
              <div className="space-y-4">
                {/* Remote toggle switch */}
                <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-800 bg-zinc-950/40">
                  <div className="flex items-center gap-3">
                    <span className="text-zinc-400 text-lg">
                      <Globe />
                    </span>
                    <div>
                      <span className="text-sm font-semibold text-white block">Remote Toggle</span>
                      <span className="text-xs text-zinc-500 block">Is this a remote position?</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsRemote(!isRemote)}
                    className={`relative inline-flex h-6.5 w-11.5 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-250 ease-in-out focus:outline-none ${
                      isRemote ? "bg-[#0088FF]" : "bg-zinc-800"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5.5 w-5.5 transform rounded-full bg-white shadow ring-0 transition duration-250 ease-in-out ${
                        isRemote ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* City & Country Row */}
                {!isRemote && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <TextField className="w-full" name="city" isRequired>
                      <Label className="mb-1.5 text-sm font-medium text-zinc-200 block">City</Label>
                      <Input
                        id="city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. San Francisco"
                        className="h-12 w-full rounded-xl border border-zinc-700/70 bg-zinc-950/70 px-4 text-sm text-white outline-none transition-colors placeholder:text-zinc-550 focus:border-[#0088FF]/70"
                      />
                    </TextField>

                    <TextField className="w-full" name="country" isRequired>
                      <Label className="mb-1.5 text-sm font-medium text-zinc-200 block">Country</Label>
                      <Input
                        id="country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder="e.g. United States"
                        className="h-12 w-full rounded-xl border border-zinc-700/70 bg-zinc-950/70 px-4 text-sm text-white outline-none transition-colors placeholder:text-zinc-550 focus:border-[#0088FF]/70"
                      />
                    </TextField>
                  </div>
                )}
              </div>

              {/* Application Deadline */}
              <TextField className="w-full" name="deadline" isRequired>
                <Label className="mb-1.5 text-sm font-medium text-zinc-200 block">Application Deadline</Label>
                <div className="relative">
                  <div className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-zinc-500 text-sm">
                    <Calendar className="size-4" />
                  </div>
                  <Input
                    id="deadline"
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="h-12 w-full rounded-xl border border-zinc-700/70 bg-zinc-950/70 pl-10 pr-4 text-sm text-white outline-none transition-colors focus:border-[#0088FF]/70 cursor-pointer"
                  />
                </div>
              </TextField>

            </Card.Content>
          </Card>

          {/* Section 2: Job Description */}
          <Card className="border border-zinc-800/80 bg-zinc-900/30 p-6 shadow-xl backdrop-blur-md">
            <Card.Header className="pb-4 border-b border-zinc-850 flex items-center gap-3">
              <span className="text-sm font-bold text-white bg-zinc-800 h-6 w-6 rounded-full flex items-center justify-center">2</span>
              <h2 className="text-lg font-bold text-white">Job Description</h2>
            </Card.Header>

            <Card.Content className="pt-6 space-y-5">
              
              {/* Responsibilities */}
              <div className="flex flex-col">
                <Label htmlFor="responsibilities" className="mb-1.5 text-sm font-medium text-zinc-200 block">
                  Responsibilities <span className="text-red-500">*</span>
                </Label>
                <textarea
                  id="responsibilities"
                  required
                  rows={6}
                  value={responsibilities}
                  onChange={(e) => setResponsibilities(e.target.value)}
                  placeholder="Outline the daily tasks, milestones, and scope of this role..."
                  className="w-full rounded-xl border border-zinc-700/70 bg-zinc-950/70 p-4 text-sm text-white outline-none transition-colors placeholder:text-zinc-550 focus:border-[#0088FF]/70 resize-y min-h-[120px]"
                />
              </div>

              {/* Requirements */}
              <div className="flex flex-col">
                <Label htmlFor="requirements" className="mb-1.5 text-sm font-medium text-zinc-200 block">
                  Requirements <span className="text-red-500">*</span>
                </Label>
                <textarea
                  id="requirements"
                  required
                  rows={6}
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  placeholder="List the required skills, degrees, experience level, and tools..."
                  className="w-full rounded-xl border border-zinc-700/70 bg-zinc-950/70 p-4 text-sm text-white outline-none transition-colors placeholder:text-zinc-550 focus:border-[#0088FF]/70 resize-y min-h-[120px]"
                />
              </div>

              {/* Benefits */}
              <div className="flex flex-col">
                <Label htmlFor="benefits" className="mb-1.5 text-sm font-medium text-zinc-250 block">
                  Benefits <span className="text-zinc-500 font-normal">(Optional)</span>
                </Label>
                <textarea
                  id="benefits"
                  rows={4}
                  value={benefits}
                  onChange={(e) => setBenefits(e.target.value)}
                  placeholder="e.g. Full health insurance, 401(k) matching, flexible PTO, wellness budget..."
                  className="w-full rounded-xl border border-zinc-700/70 bg-zinc-950/70 p-4 text-sm text-white outline-none transition-colors placeholder:text-zinc-550 focus:border-[#0088FF]/70 resize-y min-h-[100px]"
                />
              </div>

            </Card.Content>
          </Card>

          {/* Action Alerts & Buttons */}
          <div className="space-y-4">
            {errorMessage && (
              <div className="flex items-center gap-2.5 p-4 rounded-xl border border-red-500/25 bg-red-500/5 text-red-400 text-sm leading-relaxed">
                <CircleExclamation className="shrink-0 size-4" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="flex items-center gap-2.5 p-4 rounded-xl border border-emerald-500/25 bg-emerald-500/5 text-emerald-400 text-sm leading-relaxed">
                <CircleCheck className="shrink-0 size-4" />
                <span>{successMessage}</span>
              </div>
            )}

            <div className="flex items-center gap-4">
              <Button
                type="submit"
                isDisabled={isSubmitting}
                className="flex-1 h-12 bg-gradient-to-r from-[#0088FF] to-[#0055FF] text-white font-semibold rounded-xl shadow-lg shadow-[#0088FF]/20"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Publishing Job...
                  </span>
                ) : (
                  "Submit & Post Job"
                )}
              </Button>
              <Link href="/dashboard/recruiter" className="w-28">
                <Button className="w-full h-12 border border-zinc-800 hover:border-zinc-700 bg-zinc-950 text-zinc-450 hover:text-white font-semibold rounded-xl transition-all">
                  Cancel
                </Button>
              </Link>
            </div>
          </div>

        </div>

        {/* Sidebar Summary Card */}
        <div className="space-y-6">
          <Card className="border border-zinc-800/80 bg-zinc-900/30 p-6 shadow-xl backdrop-blur-md sticky top-6">
            <Card.Header className="pb-4 border-b border-zinc-850 flex flex-col gap-1">
              <span className="text-[10px] font-bold text-zinc-555 uppercase tracking-wider">Active Recruiter Profile</span>
              <h2 className="text-lg font-bold text-white">Posting Company</h2>
            </Card.Header>

            <Card.Content className="pt-6 space-y-6">
              
              {/* Linked Company Details */}
              <div className="flex items-center gap-4 p-4 rounded-xl border border-zinc-850 bg-zinc-950/30">
                <div className={`h-12 w-12 rounded-xl border flex items-center justify-center font-bold text-base shrink-0 ${company.logoColor}`}>
                  {company.letter}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-base font-bold text-white truncate">{company.name}</span>
                  <span className="text-[11px] text-zinc-500 truncate">{company.category}</span>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex justify-between items-center py-2 px-3.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-emerald-400">
                <span className="text-xs font-bold uppercase tracking-wider">Company Status</span>
                <span className="flex items-center gap-1.5 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-emerald-450 animate-pulse" />
                  Approved
                </span>
              </div>

              <div className="space-y-3.5 text-xs leading-relaxed text-zinc-450 pt-2 border-t border-zinc-850">
                <div className="flex items-start gap-2.5">
                  <span className="text-[#0088FF] text-sm mt-0.5"><CircleCheck /></span>
                  <p>Linked to <strong className="text-zinc-300">{company.name}</strong> as the posting company.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-[#0088FF] text-sm mt-0.5"><CircleCheck /></span>
                  <p>Status will automatically set to <span className="px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-[#0088FF] font-semibold text-[10px]">ACTIVE</span>.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-[#0088FF] text-sm mt-0.5"><CircleCheck /></span>
                  <p>Job will be immediately search-discoverable to all Job Seekers.</p>
                </div>
              </div>

            </Card.Content>
          </Card>
        </div>
      </form>
    </section>
  );
}
