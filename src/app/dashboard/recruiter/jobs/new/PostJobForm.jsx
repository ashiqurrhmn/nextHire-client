"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  FieldError,
  Fieldset,
  Form,
  Input,
  Label,
  ListBox,
  Select,
  Switch,
  TextArea,
  TextField,
  toast,
} from "@heroui/react";
import {
  Briefcase,
  Calendar,
  Check,
  CircleCheck,
  Clock,
  FileText,
  Globe,
  MapPin,
  Rocket,
  Sparkles,
  TagDollar,
} from "@gravity-ui/icons";
import { createJob, updateJob } from "@/lib/actions/jobs";

const categories = [
  { id: "technology", label: "Technology" },
  { id: "design", label: "Design" },
  { id: "marketing", label: "Marketing" },
  { id: "sales", label: "Sales" },
];

const jobTypes = [
  { id: "full-time", label: "Full-time" },
  { id: "part-time", label: "Part-time" },
  { id: "contract", label: "Contract" },
  { id: "internship", label: "Internship" },
];

const currencies = [
  { id: "USD", label: "USD" },
  { id: "EUR", label: "EUR" },
  { id: "GBP", label: "GBP" },
  { id: "BDT", label: "BDT" },
];

const publishingSteps = [
  "Company profile verified",
  "Role details completed",
  "Compensation range added",
  "Screening content ready",
];

function SectionHeading({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex items-start gap-3 border-b border-zinc-900 pb-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#0088FF]/25 bg-[#0088FF]/10 text-[#0088FF]">
        <Icon size={18} />
      </div>
      <div>
        <h2 className="text-base font-bold text-white">{title}</h2>
        <p className="mt-1 text-sm leading-6 text-zinc-500">{subtitle}</p>
      </div>
    </div>
  );
}

export default function PostJobForm({company, existingJob = null}) {
  const router = useRouter();
  const isEditMode = !!existingJob;

  const [isRemote, setIsRemote] = useState(existingJob?.isRemote || false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    // if (!mockCompany.isApproved) {
    //   alert("Your company profile must be approved before you can post jobs.");
    //   return;
    // }

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const newErrors = {};

    // 1. Job Title Validation
    if (!data.jobTitle) {
      newErrors.jobTitle = "Job title is required";
    } else if (data.jobTitle.trim().length < 3) {
      newErrors.jobTitle = "Job title must be at least 3 characters";
    }

    // 2. Job Category Validation
    if (!data.jobCategory) {
      newErrors.jobCategory = "Job category is required";
    }

    // 3. Job Type Validation
    if (!data.jobType) {
      newErrors.jobType = "Job type is required";
    }

    // 4. Min Salary Validation
    if (!data.minSalary) {
      newErrors.minSalary = "Minimum salary is required";
    } else {
      const minVal = Number(data.minSalary);
      if (isNaN(minVal) || minVal <= 0) {
        newErrors.minSalary = "Minimum salary must be a positive number";
      }
    }

    // 5. Max Salary Validation
    if (!data.maxSalary) {
      newErrors.maxSalary = "Maximum salary is required";
    } else {
      const maxVal = Number(data.maxSalary);
      const minVal = Number(data.minSalary);
      if (isNaN(maxVal) || maxVal <= 0) {
        newErrors.maxSalary = "Maximum salary must be a positive number";
      } else if (!isNaN(minVal) && maxVal <= minVal) {
        newErrors.maxSalary = "Maximum salary must be greater than minimum salary";
      }
    }

    // 6. Location Validation
    if (!isRemote) {
      if (!data.location) {
        newErrors.location = "Location is required for non-remote roles";
      } else if (data.location.trim().length < 3) {
        newErrors.location = "Location must be at least 3 characters";
      }
    }

    // 7. Deadline Validation
    if (!data.deadline) {
      newErrors.deadline = "Application deadline is required";
    } else {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const todayStr = `${year}-${month}-${day}`;
      if (data.deadline < todayStr) {
        newErrors.deadline = "Application deadline cannot be in the past";
      }
    }

    // 8. Responsibilities Validation
    if (!data.responsibilities) {
      newErrors.responsibilities = "Responsibilities are required";
    } else if (data.responsibilities.trim().length < 10) {
      newErrors.responsibilities = "Responsibilities must be at least 10 characters";
    }

    // 9. Requirements Validation
    if (!data.requirements) {
      newErrors.requirements = "Requirements are required";
    } else if (data.requirements.trim().length < 10) {
      newErrors.requirements = "Requirements must be at least 10 characters";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    const payload = {
      ...data,
      isRemote,
      companyId: company.id || company._id,
      companyName: company.name,
      companyLogo: company.logoUrl || company.logoBg || "",
      status: existingJob?.status || "active",
      isPubliclyVisible: true,
    };

    if (isEditMode) {
      const res = await updateJob(existingJob._id, payload);
      if (res?.error) {
        toast.error(res.error);
        return;
      }
      toast.success("Job updated successfully!");
      router.push("/dashboard/recruiter/jobs");
    } else {
      const res = await createJob(payload);
      if (res?.error) {
        toast.error(res.error);
        return;
      }
      if (res?.insertedId) {
        toast.success("Job posted successfully!");
        form.reset();
        setIsRemote(false);
        router.push("/dashboard/recruiter/jobs");
      }
    }
  };

  const getInputClass = (isInvalid) =>
    `w-full h-12 rounded-xl border bg-zinc-950/80 px-3 text-sm text-white outline-none transition-all placeholder:text-zinc-600 hover:bg-zinc-950 focus:shadow-[0_0_0_3px_rgba(0,136,255,0.12)] disabled:cursor-not-allowed disabled:opacity-60 ${
      isInvalid
        ? "border-red-500/60 hover:border-red-500 focus:border-red-500/80 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.12)]"
        : "border-zinc-800 hover:border-zinc-700 focus:border-[#0088FF]/60 focus:shadow-[0_0_0_3px_rgba(0,136,255,0.12)]"
    }`;

  const getTextAreaClass = (isInvalid) =>
    `w-full rounded-xl border bg-zinc-950/80 p-3 text-sm text-white outline-none transition-all placeholder:text-zinc-600 hover:bg-zinc-950 focus:shadow-[0_0_0_3px_rgba(0,136,255,0.12)] ${
      isInvalid
        ? "border-red-500/60 hover:border-red-500 focus:border-red-500/80 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.12)]"
        : "border-zinc-800 hover:border-zinc-700 focus:border-[#0088FF]/60 focus:shadow-[0_0_0_3px_rgba(0,136,255,0.12)]"
    }`;
  const labelClass = "text-sm font-semibold text-zinc-300";
  const helperClass = "text-xs leading-5 text-zinc-500";
  const triggerClasses =
    "flex h-12 w-full items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950/80 px-3 text-sm text-white outline-none transition-all hover:border-zinc-700 hover:bg-zinc-950 data-[focused=true]:border-[#0088FF]/60 data-[focused=true]:shadow-[0_0_0_3px_rgba(0,136,255,0.12)] data-[invalid=true]:border-red-500/60";
  const popoverClasses = "rounded-xl border border-zinc-800 bg-[#0a0a0c] p-1 text-white shadow-2xl";
  const listItemClasses =
    "flex cursor-pointer items-center justify-between rounded-lg p-2 text-sm text-zinc-300 outline-none transition-colors hover:bg-zinc-900 data-[focused=true]:bg-zinc-900";

  return (
    <div className="flex min-h-full flex-col gap-6 pb-8">
      <div className="flex flex-col gap-5 rounded-2xl border border-zinc-900 bg-zinc-950/40 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#0088FF]/25 bg-[#0088FF]/10 text-[#0088FF] sm:flex">
            <Rocket size={22} />
          </div>
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#FF5E00]/25 bg-[#FF5E00]/5 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#FF5E00]">
              <Sparkles size={13} />
              New opening
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {isEditMode ? "Edit Job Details" : "Post a New Job"}
            </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
              Create a polished public listing with role details, compensation,
              location, and applicant expectations.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:flex">
          <div className="rounded-xl border border-zinc-900 bg-black/40 px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
              Visibility
            </p>
            <p className="mt-1 text-sm font-bold text-white">Public</p>
          </div>
          <div className={`rounded-xl border px-4 py-3 ${
            company.status === 'approved' 
              ? 'border-emerald-900/50 bg-emerald-950/20' 
              : company.status === 'rejected'
              ? 'border-red-900/50 bg-red-950/20'
              : 'border-amber-900/50 bg-amber-950/20'
          }`}>
            <p className={`text-[11px] font-semibold uppercase tracking-wider ${
              company.status === 'approved' ? 'text-emerald-500' : company.status === 'rejected' ? 'text-red-500' : 'text-amber-500'
            }`}>
              Company
            </p>
            <p className={`mt-1 text-sm font-bold ${
              company.status === 'approved' ? 'text-emerald-300' : company.status === 'rejected' ? 'text-red-300' : 'text-amber-300'
            }`}>
              {company.status === 'approved' ? 'Approved' : company.status === 'rejected' ? 'Rejected' : 'Pending'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <Form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6"
          validationBehavior="aria"
          validationErrors={errors}
        >
          <Fieldset className="w-full rounded-2xl border border-zinc-900 bg-zinc-950/40 p-5 sm:p-6">
            <div className="space-y-6">
              <SectionHeading
                icon={Briefcase}
                title="Role Information"
                subtitle="Start with the role basics applicants will scan first."
              />

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <TextField
                  name="jobTitle"
                  defaultValue={existingJob?.jobTitle || ""}
                  isInvalid={!!errors.jobTitle}
                  className="flex w-full flex-col gap-2"
                >
                  <Label className={labelClass}>Job Title</Label>
                  <Input placeholder="Senior Frontend Engineer" className={getInputClass(!!errors.jobTitle)} />
                  {errors.jobTitle && (
                    <FieldError className="text-xs text-red-400">{errors.jobTitle}</FieldError>
                  )}
                </TextField>

                <Select name="jobCategory" defaultSelectedKeys={existingJob?.jobCategory ? [existingJob.jobCategory] : []} isInvalid={!!errors.jobCategory} className="w-full">
                  <Label className={`${labelClass} mb-2 block`}>Job Category</Label>
                  <Select.Trigger className={triggerClasses}>
                    <Select.Value className="text-white" />
                    <Select.Indicator />
                  </Select.Trigger>
                  {errors.jobCategory && (
                    <span className="mt-2 block text-xs text-red-400">{errors.jobCategory}</span>
                  )}
                  <Select.Popover className={popoverClasses}>
                    <ListBox className="outline-none">
                      {categories.map((item) => (
                        <ListBox.Item
                          key={item.id}
                          id={item.id}
                          textValue={item.label}
                          className={listItemClasses}
                        >
                          {item.label}
                        </ListBox.Item>
                      ))}
                    </ListBox>
                  </Select.Popover>
                </Select>
              </div>

              <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
                <Select name="jobType" defaultSelectedKeys={existingJob?.jobType ? [existingJob.jobType] : []} isInvalid={!!errors.jobType} className="w-full">
                  <Label className={`${labelClass} mb-2 block`}>Job Type</Label>
                  <Select.Trigger className={triggerClasses}>
                    <Select.Value />
                    <Select.Indicator />
                  </Select.Trigger>
                  {errors.jobType && (
                    <span className="mt-2 block text-xs text-red-400">{errors.jobType}</span>
                  )}
                  <Select.Popover className={popoverClasses}>
                    <ListBox className="outline-none">
                      {jobTypes.map((item) => (
                        <ListBox.Item
                          key={item.id}
                          id={item.id}
                          textValue={item.label}
                          className={listItemClasses}
                        >
                          {item.label}
                        </ListBox.Item>
                      ))}
                    </ListBox>
                  </Select.Popover>
                </Select>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_120px]">
                  <TextField name="minSalary" defaultValue={existingJob?.minSalary || ""} isInvalid={!!errors.minSalary} className="flex flex-col gap-2">
                    <Label className={labelClass}>Min Salary</Label>
                    <Input placeholder="60000" type="number" className={getInputClass(!!errors.minSalary)} />
                    {errors.minSalary && (
                      <FieldError className="text-xs text-red-400">{errors.minSalary}</FieldError>
                    )}
                  </TextField>

                  <TextField name="maxSalary" defaultValue={existingJob?.maxSalary || ""} isInvalid={!!errors.maxSalary} className="flex flex-col gap-2">
                    <Label className={labelClass}>Max Salary</Label>
                    <Input placeholder="95000" type="number" className={getInputClass(!!errors.maxSalary)} />
                    {errors.maxSalary && (
                      <FieldError className="text-xs text-red-400">{errors.maxSalary}</FieldError>
                    )}
                  </TextField>

                  <Select name="currency" defaultSelectedKeys={[existingJob?.currency || "USD"]} className="w-full">
                    <Label className={`${labelClass} mb-2 block`}>Currency</Label>
                    <Select.Trigger className={triggerClasses}>
                      <Select.Value />
                      <Select.Indicator />
                    </Select.Trigger>
                    <Select.Popover className={popoverClasses}>
                      <ListBox className="outline-none">
                        {currencies.map((item) => (
                          <ListBox.Item
                            key={item.id}
                            id={item.id}
                            textValue={item.label}
                            className={listItemClasses}
                          >
                            {item.label}
                          </ListBox.Item>
                        ))}
                      </ListBox>
                    </Select.Popover>
                  </Select>
                </div>
              </div>
            </div>
          </Fieldset>

          <Fieldset className="w-full rounded-2xl border border-zinc-900 bg-zinc-950/40 p-5 sm:p-6">
            <div className="space-y-6">
              <SectionHeading
                icon={MapPin}
                title="Location & Timeline"
                subtitle="Set where candidates will work and when applications close."
              />

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-4">
                    <Label className={labelClass}>Location</Label>
                    <Switch isSelected={isRemote} onChange={setIsRemote} size="sm">
                      <Switch.Control className="bg-zinc-800 data-[selected=true]:bg-[#0088FF]">
                        <Switch.Thumb className="bg-zinc-300 data-[selected=true]:bg-white" />
                      </Switch.Control>
                      <Switch.Content>
                        <Label className="text-xs font-semibold text-zinc-400">Remote</Label>
                      </Switch.Content>
                    </Switch>
                  </div>

                  <TextField
                    name="location"
                    defaultValue={existingJob?.location || ""}
                    isInvalid={!isRemote && !!errors.location}
                    className="flex w-full flex-col gap-2"
                  >
                    <div className="relative flex items-center">
                      <Globe
                        size={16}
                        className="pointer-events-none absolute left-3 z-10 text-zinc-600"
                      />
                      <Input
                        placeholder={isRemote ? "Global / Remote" : "Austin, TX"}
                        disabled={isRemote}
                        className={`${getInputClass(!isRemote && !!errors.location)} pl-10`}
                      />
                    </div>
                    {!isRemote && errors.location && (
                      <FieldError className="text-xs text-red-400">{errors.location}</FieldError>
                    )}
                  </TextField>
                  <p className={helperClass}>
                    Remote roles can still mention time zone expectations in the description.
                  </p>
                </div>

                <TextField
                  name="deadline"
                  defaultValue={existingJob?.deadline || ""}
                  isInvalid={!!errors.deadline}
                  className="flex w-full flex-col gap-2"
                >
                  <Label className={labelClass}>Application Deadline</Label>
                  <div className="relative flex items-center">
                    <Calendar
                      size={16}
                      className="pointer-events-none absolute left-3 z-10 text-zinc-600"
                    />
                    <Input type="date" className={`${getInputClass(!!errors.deadline)} pl-10`} />
                  </div>
                  {errors.deadline && (
                    <FieldError className="text-xs text-red-400">{errors.deadline}</FieldError>
                  )}
                </TextField>
              </div>
            </div>
          </Fieldset>

          <Fieldset className="w-full rounded-2xl border border-zinc-900 bg-zinc-950/40 p-5 sm:p-6">
            <div className="space-y-6">
              <SectionHeading
                icon={FileText}
                title="Job Description"
                subtitle="Give candidates a crisp view of the work, expectations, and upside."
              />

              <TextField
                name="responsibilities"
                defaultValue={existingJob?.responsibilities || ""}
                isInvalid={!!errors.responsibilities}
                className="flex w-full flex-col gap-2"
              >
                <Label className={labelClass}>Responsibilities</Label>
                <TextArea
                  placeholder="Outline the core day-to-day ownership for this role..."
                  rows={5}
                  className={getTextAreaClass(!!errors.responsibilities)}
                />
                {errors.responsibilities && (
                  <FieldError className="text-xs text-red-400">{errors.responsibilities}</FieldError>
                )}
              </TextField>

              <TextField
                name="requirements"
                defaultValue={existingJob?.requirements || ""}
                isInvalid={!!errors.requirements}
                className="flex w-full flex-col gap-2"
              >
                <Label className={labelClass}>Requirements</Label>
                <TextArea
                  placeholder="List required experience, skills, tools, and certifications..."
                  rows={5}
                  className={getTextAreaClass(!!errors.requirements)}
                />
                {errors.requirements && (
                  <FieldError className="text-xs text-red-400">{errors.requirements}</FieldError>
                )}
              </TextField>

              <TextField name="benefits" defaultValue={existingJob?.benefits || ""} className="flex w-full flex-col gap-2">
                <Label className={labelClass}>Benefits</Label>
                <TextArea
                  placeholder="Healthcare, equity, learning budget, remote stipend..."
                  rows={4}
                  className={getTextAreaClass(false)}
                />
              </TextField>
            </div>
          </Fieldset>

          <div className="sticky bottom-0 z-20 -mx-4 border-t border-zinc-900 bg-black/85 px-4 py-4 backdrop-blur-xl sm:mx-0 sm:rounded-2xl sm:border sm:bg-zinc-950/70">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
              <Button
                type="button"
                variant="bordered"
                onPress={() => router.back()}
                className="h-11 rounded-xl border-zinc-800 px-5 text-sm font-semibold text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="h-11 rounded-xl bg-gradient-to-r from-[#0088FF] to-[#0055FF] px-6 text-sm font-bold text-white shadow-lg shadow-[#0088FF]/20 transition-all hover:from-[#339FFF] hover:to-[#2277FF]"
              >
                {isEditMode ? "Save Changes" : "Post Job"}
              </Button>
            </div>
          </div>
        </Form>

        <aside className="flex flex-col gap-5 xl:sticky xl:top-8 xl:self-start">
          <div className="rounded-2xl border border-zinc-900 bg-zinc-950/40 p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Posting as
                </p>
                <h2 className="mt-1 text-lg font-bold text-white">{company.name}</h2>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-900/50 bg-emerald-950/20 text-emerald-400">
                <CircleCheck size={20} />
              </div>
            </div>
            <div className="mt-5 rounded-xl border border-zinc-900 bg-black/35 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#0088FF]/20 bg-[#0088FF]/10 text-[#0088FF]">
                  <Briefcase size={17} />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Ready for talent</p>
                  <p className="text-xs text-zinc-500">Listings publish as active by default.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-900 bg-zinc-950/40 p-5">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#FF5E00]/25 bg-[#FF5E00]/10 text-[#FF5E00]">
                <Check size={17} />
              </div>
              <h2 className="text-base font-bold text-white">Publishing Checklist</h2>
            </div>

            <div className="space-y-3">
              {publishingSteps.map((step) => (
                <div key={step} className="flex items-center gap-3 text-sm text-zinc-300">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[#0088FF]/30 bg-[#0088FF]/10 text-[#0088FF]">
                    <Check size={12} />
                  </span>
                  {step}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-900 bg-zinc-950/40 p-5">
            <h2 className="text-base font-bold text-white">Listing Snapshot</h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-zinc-900 bg-black/35 p-3">
                <TagDollar size={17} className="mb-2 text-[#0088FF]" />
                <p className="text-xs text-zinc-500">Salary</p>
                <p className="mt-1 text-sm font-bold text-white">Required</p>
              </div>
              <div className="rounded-xl border border-zinc-900 bg-black/35 p-3">
                <Clock size={17} className="mb-2 text-[#FF5E00]" />
                <p className="text-xs text-zinc-500">Deadline</p>
                <p className="mt-1 text-sm font-bold text-white">Required</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-zinc-500">
              Keep descriptions specific and skimmable so candidates can qualify
              themselves before applying.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
