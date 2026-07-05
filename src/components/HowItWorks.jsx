"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Person, Briefcase, Magnifier, Rocket, Target, ThumbsUp } from "@gravity-ui/icons";

export default function HowItWorks() {
  const [activeTab, setActiveTab] = useState("seekers"); // 'seekers' | 'recruiters'

  const seekerSteps = [
    {
      id: 1,
      title: "Create Your Profile",
      description: "Build a standout profile highlighting your skills, experience, and what you're looking for.",
      icon: <Person width={32} height={32} className="text-[#0088FF]" />,
      color: "from-[#0088FF]/20 to-transparent",
      borderColor: "border-[#0088FF]/30",
    },
    {
      id: 2,
      title: "Discover Matches",
      description: "Our algorithm curates jobs that perfectly align with your background and career goals.",
      icon: <Magnifier width={32} height={32} className="text-[#0088FF]" />,
      color: "from-[#0088FF]/20 to-transparent",
      borderColor: "border-[#0088FF]/30",
    },
    {
      id: 3,
      title: "Apply & Get Hired",
      description: "Apply with a single click, track your status, and land your dream job faster.",
      icon: <Rocket width={32} height={32} className="text-[#0088FF]" />,
      color: "from-[#0088FF]/20 to-transparent",
      borderColor: "border-[#0088FF]/30",
    },
  ];

  const recruiterSteps = [
    {
      id: 1,
      title: "Post a Job",
      description: "Create detailed job listings in minutes to attract the best talent on the market.",
      icon: <Briefcase width={32} height={32} className="text-[#FF5E00]" />,
      color: "from-[#FF5E00]/20 to-transparent",
      borderColor: "border-[#FF5E00]/30",
    },
    {
      id: 2,
      title: "Target Top Candidates",
      description: "Instantly see candidates who match your criteria and invite them to apply.",
      icon: <Target width={32} height={32} className="text-[#FF5E00]" />,
      color: "from-[#FF5E00]/20 to-transparent",
      borderColor: "border-[#FF5E00]/30",
    },
    {
      id: 3,
      title: "Interview & Hire",
      description: "Manage applications seamlessly and hire the perfect fit for your team.",
      icon: <ThumbsUp width={32} height={32} className="text-[#FF5E00]" />,
      color: "from-[#FF5E00]/20 to-transparent",
      borderColor: "border-[#FF5E00]/30",
    },
  ];

  const activeSteps = activeTab === "seekers" ? seekerSteps : recruiterSteps;

  return (
    <div className="w-full bg-black py-24 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#0088FF]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#FF5E00]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4"
          >
            How NextHire Works
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-zinc-400 max-w-2xl mx-auto text-lg"
          >
            A seamless experience engineered to connect top talent with industry-leading companies.
          </motion.p>
        </div>

        {/* Custom Toggle Switch */}
        <div className="flex justify-center mb-16">
          <div className="bg-zinc-900/80 backdrop-blur-md p-1.5 rounded-2xl border border-zinc-800 flex relative">
            <button
              onClick={() => setActiveTab("seekers")}
              className={`relative z-10 px-8 py-3 text-sm font-semibold rounded-xl transition-colors duration-300 ${
                activeTab === "seekers" ? "text-white" : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              For Job Seekers
            </button>
            <button
              onClick={() => setActiveTab("recruiters")}
              className={`relative z-10 px-8 py-3 text-sm font-semibold rounded-xl transition-colors duration-300 ${
                activeTab === "recruiters" ? "text-white" : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              For Recruiters
            </button>

            {/* Sliding Active Pill */}
            <motion.div
              className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] rounded-xl bg-zinc-800/80 border ${activeTab === "seekers" ? "border-[#0088FF]/30" : "border-[#FF5E00]/30"}`}
              initial={false}
              animate={{
                x: activeTab === "seekers" ? "0%" : "100%"
              }}
              style={{ left: "0.375rem" }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            />
          </div>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10">
          <AnimatePresence mode="wait">
            {activeSteps.map((step, index) => (
              <motion.div
                key={`${activeTab}-${step.id}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={`relative bg-zinc-950/50 backdrop-blur-xl border border-zinc-800/60 hover:${step.borderColor} rounded-[2rem] p-8 md:p-10 overflow-hidden group hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-all duration-500 cursor-default`}
              >
                {/* Subtle grid pattern inside card */}
                <div 
                  className="absolute inset-0 opacity-[0.02] pointer-events-none transition-opacity duration-500 group-hover:opacity-[0.06]"
                  style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '24px 24px' }}
                />

                {/* Step Gradient Glow */}
                <div className={`absolute top-0 inset-x-0 h-40 bg-gradient-to-b ${step.color} opacity-30 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className={`absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t ${step.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                
                <div className="relative z-10 flex flex-col items-start h-full">
                  <div className={`w-16 h-16 rounded-2xl bg-zinc-900/80 backdrop-blur-md border border-zinc-700/50 group-hover:${step.borderColor} flex items-center justify-center mb-8 shadow-xl transition-colors duration-500`}>
                    {step.icon}
                  </div>
                  
                  <div className="text-zinc-500 font-mono text-xs font-bold tracking-widest mb-3 uppercase">
                    Step 0{step.id}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-zinc-400 transition-all duration-300">
                    {step.title}
                  </h3>
                  
                  <p className="text-zinc-400 leading-relaxed text-base">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
