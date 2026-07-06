"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="bg-black min-h-[90vh] grow flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#FF5E00]/[0.08] rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 80, damping: 15 }}
        className="relative z-10 w-full max-w-md flex flex-col items-center text-center bg-[#121214]/80 backdrop-blur-xl border border-zinc-800/80 rounded-[32px] p-10 sm:p-12 shadow-[0_20px_80px_rgba(255,94,0,0.1)]"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 10, delay: 0.1 }}
          className="w-24 h-24 mb-8 flex items-center justify-center rounded-[24px] bg-[#FF5E00]/10 border border-[#FF5E00]/20 shadow-[0_0_40px_rgba(255,94,0,0.2)]"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            className="w-12 h-12 text-[#FF5E00]"
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight"
        >
          Something went wrong
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-zinc-400 text-base sm:text-lg mb-10 leading-relaxed"
        >
          We hit an unexpected snag while processing your request. Don't worry, we've been notified.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full flex flex-col sm:flex-row gap-4"
        >
          <Link
            href="/"
            className="flex flex-1 items-center justify-center h-12 rounded-[14px] bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white font-bold text-sm transition-all"
          >
            Go to Home
          </Link>
          <button
            onClick={() => reset()}
            className="flex flex-1 items-center justify-center h-12 rounded-[14px] bg-gradient-to-r from-[#FF5E00] to-[#FFA000] hover:from-[#FFA000] hover:to-[#FFB000] text-white font-bold text-sm shadow-[0_4px_14px_rgba(255,94,0,0.3)] transition-all cursor-pointer border-0"
          >
            Try Again
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
