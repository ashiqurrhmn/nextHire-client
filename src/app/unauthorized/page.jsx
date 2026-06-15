"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@heroui/react";

export default function UnauthorizedPage() {
  return (
    <div className="bg-black min-h-screen grow flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-500/[0.08] rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 80, damping: 15 }}
        className="relative z-10 w-full max-w-md flex flex-col items-center text-center bg-[#121214]/80 backdrop-blur-xl border border-zinc-800/80 rounded-[32px] p-10 sm:p-12 shadow-[0_20px_80px_rgba(239,68,68,0.1)]"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 10, delay: 0.1 }}
          className="w-24 h-24 mb-8 flex items-center justify-center rounded-[24px] bg-red-500/10 border border-red-500/20 shadow-[0_0_40px_rgba(239,68,68,0.2)]"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            className="w-12 h-12 text-red-500"
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight"
        >
          Access Denied
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-zinc-400 text-base sm:text-lg mb-10 leading-relaxed"
        >
          You do not have the required permissions to view this page. Please ensure you are logged in with the correct account role.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full flex flex-col sm:flex-row gap-4"
        >
          <Button
            as={Link}
            href="/"
            className="flex-1 h-12 rounded-[14px] bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white font-bold text-sm transition-all"
          >
            Go to Home
          </Button>
          <Button
            as={Link}
            href="/dashboard"
            className="flex-1 h-12 rounded-[14px] bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-bold text-sm shadow-[0_4px_14px_rgba(239,68,68,0.3)] transition-all"
          >
            My Dashboard
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
