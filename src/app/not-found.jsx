"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="bg-black min-h-[90vh] grow flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#0088FF]/[0.08] rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 80, damping: 15 }}
        className="relative z-10 w-full max-w-md flex flex-col items-center text-center bg-[#121214]/80 backdrop-blur-xl border border-zinc-800/80 rounded-[32px] p-10 sm:p-12 shadow-[0_20px_80px_rgba(0,136,255,0.1)]"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 10, delay: 0.1 }}
          className="w-24 h-24 mb-8 flex items-center justify-center rounded-[24px] bg-[#0088FF]/10 border border-[#0088FF]/20 shadow-[0_0_40px_rgba(0,136,255,0.2)]"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            className="w-12 h-12 text-[#0088FF]"
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M16 16s-1.5-2-4-2-4 2-4 2"></path>
            <line x1="9" y1="9" x2="9.01" y2="9"></line>
            <line x1="15" y1="9" x2="15.01" y2="9"></line>
          </svg>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight"
        >
          Page Not Found
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-zinc-400 text-base sm:text-lg mb-10 leading-relaxed"
        >
          The page you are looking for doesn't exist or has been moved to another universe.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full flex justify-center"
        >
          <Link
            href="/"
            className="flex w-full items-center justify-center h-12 rounded-[14px] bg-gradient-to-r from-[#0088FF] to-[#0055FF] hover:from-[#339FFF] hover:to-[#2277FF] text-white font-bold text-sm shadow-[0_4px_14px_rgba(0,136,255,0.3)] transition-all cursor-pointer"
          >
            Go Back Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
