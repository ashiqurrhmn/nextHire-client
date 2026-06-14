"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@heroui/react";
import { Check } from "@gravity-ui/icons";
import { createApplication } from "@/lib/actions/applications";

export default function ApplyModal({ job, isOpen, onClose, onApplied, user }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    portfolioUrl: "",
    coverLetter: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);
    
    try {
      const applicationData = {
        ...formData,
        jobId: job._id || job.id,
        jobTitle: job.jobTitle,
        companyName: job.companyName,
        applicantId: user?.id,
      };
      const res = await createApplication(applicationData);
      
      if (res?.error) {
        setErrorMessage(res.error);
      } else {
        setIsSuccess(true);
        if (onApplied) onApplied();
        setTimeout(() => {
          onClose();
          setIsSuccess(false);
          setFormData({ fullName: "", email: "", portfolioUrl: "", coverLetter: "" });
        }, 3000);
      }
    } catch (err) {
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[#131315] border border-zinc-800/80 rounded-2xl shadow-2xl z-[101] custom-scrollbar p-6 sm:p-8"
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            {isSuccess ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-6">
                  <Check size={32} className="text-emerald-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Application Submitted!</h3>
                <p className="text-zinc-400 text-sm sm:text-base">
                  Your application for <strong className="text-white">{job.title || job.jobTitle}</strong> at <strong className="text-white">{job.company || job.companyName}</strong> has been successfully sent.
                </p>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-white mb-2">Apply for this role</h2>
                <p className="text-zinc-400 mb-8 text-sm">
                  {job.title || job.jobTitle} at {job.company || job.companyName}
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1.5">Full Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full bg-[#1c1c1f] border border-zinc-800 text-white placeholder-zinc-500 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#0088FF]/50 focus:ring-1 focus:ring-[#0088FF]/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1.5">Email Address <span className="text-red-500">*</span></label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className="w-full bg-[#1c1c1f] border border-zinc-800 text-white placeholder-zinc-500 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#0088FF]/50 focus:ring-1 focus:ring-[#0088FF]/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1.5">Portfolio / LinkedIn URL</label>
                    <input
                      type="url"
                      name="portfolioUrl"
                      value={formData.portfolioUrl}
                      onChange={handleChange}
                      placeholder="https://linkedin.com/in/johndoe"
                      className="w-full bg-[#1c1c1f] border border-zinc-800 text-white placeholder-zinc-500 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#0088FF]/50 focus:ring-1 focus:ring-[#0088FF]/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1.5">Cover Letter (Optional)</label>
                    <textarea
                      name="coverLetter"
                      value={formData.coverLetter}
                      onChange={handleChange}
                      placeholder="Tell us why you are a great fit..."
                      rows={4}
                      className="w-full bg-[#1c1c1f] border border-zinc-800 text-white placeholder-zinc-500 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#0088FF]/50 focus:ring-1 focus:ring-[#0088FF]/50 transition-all custom-scrollbar resize-none"
                    />
                  </div>
                  {errorMessage ? (
                    <p className="text-sm text-red-400">{errorMessage}</p>
                  ) : null}
                  <Button
                    type="submit"
                    isLoading={isSubmitting}
                    className="w-full h-12 rounded-xl bg-gradient-to-r from-[#0088FF] to-[#0055FF] hover:from-[#339FFF] hover:to-[#2277FF] text-white font-bold text-base shadow-[0_4px_14px_rgba(0,136,255,0.3)] transition-all mt-4"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Application"}
                  </Button>
                </form>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
