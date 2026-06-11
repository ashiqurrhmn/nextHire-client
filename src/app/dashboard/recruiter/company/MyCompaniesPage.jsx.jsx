"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Chip, Spinner, toast } from "@heroui/react";
import {
  Bell,
  Briefcase,
  Compass,
  Globe,
  Magnifier,
  MapPin,
  Plus,
  Persons,
  Xmark,
  ArrowUpFromLine,
  Sparkles,
} from "@gravity-ui/icons";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { createCompany, getCompanies } from "@/lib/actions/companies";


export default function MyCompaniesPage({recruiter, recruiterCompany}) {
  const router = useRouter();
  const [companies, setCompanies] = useState(recruiterCompany);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch companies from database on load
  React.useEffect(() => {
    const fetchCompanies = async () => {
      if (!recruiter?.id) {
        setCompanies([]);
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        const data = await getCompanies(recruiter.id);
        if (data && Array.isArray(data)) {
          setCompanies(data);
        } else if (data && data.error) {
          throw new Error(data.error);
        } else {
          setCompanies([]);
        }
      } catch (err) {
        console.warn("Failed to fetch companies from database:", err);
        setCompanies([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCompanies();
  }, [recruiter?.id]);

  // Form states
  const [companyName, setCompanyName] = useState("");
  const [category, setCategory] = useState("Technology");
  const [website, setWebsite] = useState("");
  const [location, setLocation] = useState("");
  const [employeeCount, setEmployeeCount] = useState("1-10");
  const [description, setDescription] = useState("");
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  

  // Clean up logoPreviewUrl to prevent memory leaks
  React.useEffect(() => {
    return () => {
      if (logoPreviewUrl) {
        URL.revokeObjectURL(logoPreviewUrl);
      }
    };
  }, [logoPreviewUrl]);

  // Filter companies based on search
  const filteredCompanies = useMemo(() => {
    if (!searchQuery.trim()) return companies;
    return companies.filter(
      (c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [companies, searchQuery]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!companyName.trim()) {
      toast.error("Company name is required.");
      return;
    }
    if (!location.trim()) {
      toast.error("Location is required.");
      return;
    }
    if (!description.trim()) {
      toast.error("Brief description is required.");
      return;
    }

    setIsSubmitting(true);
    let logoUrl = "";

    try {
      if (logoFile) {
        const apiKey = process.env.NEXT_PUBLIC_IMAGE_API;
        if (!apiKey) {
          throw new Error("ImgBB API key is not configured in environment variables.");
        }

        const formData = new FormData();
        formData.append("image", logoFile);

        const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`ImgBB upload failed with status ${response.status}`);
        }

        const result = await response.json();
        if (result.success && result.data && result.data.url) {
          logoUrl = result.data.url;
        } else {
          throw new Error(result.error?.message || "Failed to upload image to ImgBB.");
        }
      }

      // Auto-generate logo initials & style
      const logoInitials = companyName
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

      const randomGradients = [
        "bg-gradient-to-tr from-blue-600 to-indigo-700 text-white",
        "bg-gradient-to-tr from-purple-600 to-pink-700 text-white",
        "bg-gradient-to-tr from-emerald-600 to-teal-700 text-white",
        "bg-gradient-to-tr from-amber-600 to-orange-700 text-white",
        "bg-gradient-to-tr from-rose-600 to-red-700 text-white",
      ];
      const logoBg = randomGradients[Math.floor(Math.random() * randomGradients.length)];

      const newCompany = {
        id: `co_${Date.now()}`,
        name: companyName,
        category: category,
        description: description,
        location: location,
        size: employeeCount,
        website: website ? (website.startsWith("http") ? website : `https://${website}`) : "#",
        status: "pending", // Newly registered starts as pending
        logoText: logoInitials || "CO",
        logoBg: logoBg,
        logoUrl: logoUrl,
        recruiterId: recruiter.id,
      };

      const res = await createCompany(newCompany);
      if (res && res.error) {
        throw new Error(res.error);
      }

      const dbCompany = {
        ...newCompany,
        _id: res?.insertedId || res?.id || newCompany.id,
      };

      setCompanies((prev) => [dbCompany, ...prev]);
      toast.success("Company registered successfully!");
      
      // Reset form & close modal
      setCompanyName("");
      setCategory("Technology");
      setWebsite("");
      setLocation("");
      setEmployeeCount("1-10");
      setDescription("");
      setLogoFile(null);
      setLogoPreviewUrl("");
      setIsModalOpen(false);
    } catch (err) {
      console.error("ImgBB Upload Error:", err);
      toast.error(err.message || "Failed to register company due to logo upload issue.");
    } finally {
      setIsSubmitting(false);
    }
  
  };

  const getStatusBadge = (status) => {
    if (status === "approved") {
      return (
        <span className="bg-emerald-950/20 text-emerald-450 border border-emerald-900/40 text-[9px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full shrink-0">
          Approved
        </span>
      );
    }
    return (
      <span className="bg-amber-950/20 text-amber-500 border border-amber-900/40 text-[9px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full shrink-0">
        Pending
      </span>
    );
  };

  const getInputClass = () =>
    `w-full h-11 rounded-xl border bg-zinc-950/80 px-3 text-sm text-white placeholder-zinc-650 outline-none transition-all hover:bg-zinc-950 focus:border-[#0088FF]/50 border-zinc-800 hover:border-zinc-700`;

  const getSelectClass = () =>
    `w-full h-11 rounded-xl border bg-zinc-950/80 px-3 text-sm text-white outline-none transition-all hover:bg-zinc-950 focus:border-[#0088FF]/50 border-zinc-800 hover:border-zinc-700 cursor-pointer`;

  const getTextAreaClass = () =>
    `w-full rounded-xl border bg-zinc-950/80 p-3 text-sm text-white placeholder-zinc-650 outline-none transition-all hover:bg-zinc-950 focus:border-[#0088FF]/50 border-zinc-800 hover:border-zinc-700`;

  return (
    <div className="flex flex-col min-h-full pb-8 relative">
      {/* Dashboard Top Navigation header */}
      <DashboardHeader />

      {/* Main Page Title Header Block */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">My Companies</h2>
          <p className="text-sm text-zinc-500 mt-1">Manage your registered companies and their verification states.</p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="h-11 rounded-xl bg-white text-black hover:bg-zinc-200 px-5 text-sm font-bold shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          <Plus size={16} className="mr-2 stroke-[2.5]" />
          Register a company
        </Button>
      </div>

      {/* Custom Sub-Header for Search and Notification (Matching Screenshot) */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-900 mb-6">
        <h3 className="text-base font-bold text-white">Registered Organizations ({filteredCompanies.length})</h3>
        <div className="flex items-center gap-4">
          <div className="relative w-48 sm:w-64">
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
          <button
            className="flex items-center justify-center h-9 w-9 rounded-lg bg-zinc-950 border border-zinc-900 text-zinc-400 hover:text-white transition-colors"
            type="button"
            title="Notifications"
          >
            <Bell size={16} />
          </button>
        </div>
      </div>

      {/* Grid of Company Cards */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-zinc-400">
          <Spinner size="lg" color="primary" />
          <p className="text-sm font-medium">Loading companies...</p>
        </div>
      ) : filteredCompanies.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 border border-zinc-900 bg-zinc-950/40 rounded-2xl gap-3">
          <Compass size={40} className="text-zinc-750" />
          <p className="font-semibold text-white text-base">No companies registered</p>
          <p className="text-xs text-zinc-500 max-w-xs text-center">
            {searchQuery
              ? "No companies match your search term. Try adjusting your filter."
              : "Get started by registering your first organization to begin posting jobs."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company) => (
            <div
              key={company.id || company._id}
              className="flex flex-col justify-between p-6 rounded-2xl border border-zinc-900 bg-zinc-950/40 hover:border-zinc-800 hover:bg-zinc-950/60 transition-all duration-300 group shadow-lg"
            >
              <div>
                {/* Logo & Status Badge Row */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    {/* Company Logo representation */}
                    <div className={`h-11 w-11 rounded-xl flex items-center justify-center font-bold shrink-0 text-sm overflow-hidden border border-zinc-800/80 ${company.logoUrl ? "bg-zinc-900" : company.logoBg}`}>
                      {company.logoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={company.logoUrl}
                          alt={`${company.name} logo`}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        company.logoText
                      )}
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white group-hover:text-[#0088FF] transition-colors truncate max-w-[140px] sm:max-w-[160px]">
                        {company.name}
                      </h4>
                      <p className="text-xs text-zinc-500 mt-0.5">{company.category}</p>
                    </div>
                  </div>
                  {getStatusBadge(company.status)}
                </div>

                {/* Company Description */}
                <p className="text-xs text-zinc-400 leading-relaxed mb-6 line-clamp-3">
                  {company.description}
                </p>
              </div>

              {/* Metadata Grid */}
              <div className="border-t border-zinc-900/80 pt-4 space-y-3">
                <div className="flex items-center justify-between gap-2 text-xs text-zinc-500">
                  <div className="flex items-center gap-1.5 truncate">
                    <MapPin size={13} className="text-zinc-600" />
                    <span>{company.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Persons size={13} className="text-zinc-600" />
                    <span>{company.size} range</span>
                  </div>
                </div>

                {/* Link Row */}
                <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white transition-colors pt-1">
                  <Globe size={13} className="text-[#0088FF]" />
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline flex items-center gap-1"
                  >
                    Visit Website
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Register Company Custom Modal (Overlay) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop blur/overlay */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setIsModalOpen(false)}
          />

          {/* Modal Container Card */}
          <div className="relative bg-[#0a0a0c] border border-zinc-900 text-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between p-6 border-b border-zinc-900">
              <div>
                <h3 className="text-lg font-bold text-white">Register New Company</h3>
                <p className="text-xs text-zinc-500 mt-1">Enter your business details to start hiring on NextHire.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                disabled={isSubmitting}
                className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-zinc-900 text-zinc-455 hover:text-white transition-colors bg-transparent border-0 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                type="button"
                title="Close modal"
              >
                <Xmark size={18} />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-5">
                {/* Row 1: Company Name & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-zinc-300">Company Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Acme Corp"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className={getInputClass()}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-zinc-300">Industry / Category</label>
                    <div className="relative">
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className={getSelectClass()}
                      >
                        <option value="Technology">Technology</option>
                        <option value="Design">Design</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Sales">Sales</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Finance">Finance</option>
                      </select>
                      <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-zinc-500">
                        ▼
                      </span>
                    </div>
                  </div>
                </div>

                {/* Row 2: Website URL & Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-zinc-300">Website URL</label>
                    <div className="flex items-stretch rounded-xl overflow-hidden border border-zinc-800 focus-within:border-[#0088FF]/50 transition-all">
                      <span className="bg-zinc-900 border-r border-zinc-800 text-zinc-500 text-xs px-3.5 flex items-center font-medium">
                        https://
                      </span>
                      <input
                        type="text"
                        placeholder="www.company.com"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        className="flex-grow h-11 bg-zinc-950/80 px-3 text-sm text-white placeholder-zinc-650 outline-none hover:bg-zinc-950"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-zinc-300">Location</label>
                    <div className="relative flex items-center">
                      <MapPin size={15} className="absolute left-3.5 text-zinc-550 pointer-events-none" />
                      <input
                        type="text"
                        placeholder="City, Country"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className={`${getInputClass()} pl-10`}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Row 3: Employee Count & Company Logo */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-zinc-300">Employee Count Range</label>
                    <div className="relative">
                      <select
                        value={employeeCount}
                        onChange={(e) => setEmployeeCount(e.target.value)}
                        className={getSelectClass()}
                      >
                        <option value="1-10">1-10 employees</option>
                        <option value="11-50">11-50 employees</option>
                        <option value="51-200">51-200 employees</option>
                        <option value="201-500">201-500 employees</option>
                        <option value="501-1000">501-1000 employees</option>
                        <option value="1000+">1000+ employees</option>
                      </select>
                      <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-zinc-500">
                        ▼
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-zinc-300">Company Logo</label>
                    {logoPreviewUrl ? (
                      <div className="flex items-center justify-between border border-zinc-850 rounded-xl bg-zinc-950/80 h-11 px-3">
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          <div className="h-7 w-7 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center overflow-hidden shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={logoPreviewUrl}
                              alt="Logo Preview"
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <span className="text-xs font-semibold text-zinc-300 truncate max-w-[130px] sm:max-w-[170px]">
                            {logoFile?.name}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setLogoFile(null);
                            setLogoPreviewUrl("");
                          }}
                          className="text-zinc-500 hover:text-white transition-colors bg-transparent border-0 cursor-pointer p-1"
                          title="Remove logo"
                        >
                          <Xmark size={14} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center border border-dashed border-zinc-800 rounded-xl bg-zinc-950/40 hover:bg-zinc-950/85 hover:border-zinc-700 transition-all cursor-pointer h-11 px-3">
                        <label className="flex items-center gap-2 cursor-pointer w-full justify-center">
                          <ArrowUpFromLine size={15} className="text-[#0088FF]" />
                          <div className="flex flex-col text-left">
                            <span className="text-xs font-semibold text-white">Upload image</span>
                            <span className="text-[9px] text-zinc-550 leading-none mt-0.5">PNG, JPG up to 5MB</span>
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                const file = e.target.files[0];
                                setLogoFile(file);
                                setLogoPreviewUrl(URL.createObjectURL(file));
                                toast.success(`Logo "${file.name}" selected`);
                              }
                            }}
                          />
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                {/* Brief Description */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-300">Brief Description</label>
                  <textarea
                    rows={3}
                    placeholder="Tell us about your company's mission and culture..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className={getTextAreaClass()}
                    required
                  />
                </div>
              </div>

              {/* Modal Footer / Actions */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-zinc-900 bg-zinc-950/40">
                <Button
                  type="button"
                  variant="bordered"
                  isDisabled={isSubmitting}
                  onClick={() => setIsModalOpen(false)}
                  className="h-10 rounded-xl border-zinc-850 hover:border-zinc-700 hover:bg-zinc-900/60 px-4 text-xs font-bold text-zinc-300 transition-all cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  isDisabled={isSubmitting}
                  className="h-10 rounded-xl bg-white text-black hover:bg-zinc-200 px-5 text-xs font-bold shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? "Registering..." : "Register Company"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
