"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useSession } from "@/lib/auth-client";

export default function CallToAction() {
  const { data: session } = useSession();

  if (session?.user) {
    return null;
  }

  return (
    <div className="w-full bg-black py-24 relative overflow-hidden flex justify-center px-4 sm:px-6">
      
      {/* Glow Backdrop */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[300px] bg-gradient-to-r from-[#0088FF]/20 via-[#FF5E00]/20 to-[#0088FF]/20 blur-[100px] rounded-full opacity-60" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 w-full max-w-4xl bg-zinc-950/60 backdrop-blur-xl border border-zinc-800 rounded-[2rem] p-10 md:p-16 text-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden"
      >
        {/* Subtle grid pattern inside card */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '30px 30px' }}
        />

        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
          Ready to Accelerate Your <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0088FF] to-[#339FFF]">
            Career
          </span> 
          {" "}or{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5E00] to-[#FFA000]">
            Hiring
          </span>?
        </h2>
        
        <p className="text-zinc-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
          Join thousands of professionals and top companies already using NextHire to find their perfect match.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/auth/signup"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white text-black font-semibold hover:bg-zinc-200 transition-colors duration-300 text-center"
          >
            Join as a Seeker
          </Link>
          <Link
            href="/auth/signup"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-zinc-700 text-white font-semibold hover:bg-zinc-900 transition-colors duration-300 text-center"
          >
            Post a Job Today
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
