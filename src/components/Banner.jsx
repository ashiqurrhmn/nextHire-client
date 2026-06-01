"use client";

import { useState } from "react";
import Link from "next/link";

export default function Banner() {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", keyword, "in:", location);
  };

  return (
    <div className="relative min-h-[85vh] flex flex-col justify-center items-center overflow-hidden px-4 sm:px-6 lg:px-8 py-20 bg-black">
      
      {/* Background radial glowing ambient glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#0088FF]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 -translate-y-1/2 w-[400px] h-[400px] bg-[#FF5E00]/5 rounded-full blur-[100px] pointer-events-none" />
      
      {/* Premium subtle background grid pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.02),transparent_50%)] pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center text-center">
        
        {/* Glowing Announcement Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-800 backdrop-blur-md mb-8 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF5E00] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF5E00]"></span>
          </span>
          <span className="text-[12px] font-semibold tracking-wider text-zinc-300 uppercase">
            🚀 Introducing NextHire v1.0
          </span>
        </div>

        {/* Big Bold Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.1] max-w-4xl">
          Hire Elite Talent. <br className="hidden sm:inline" />
          Find Your Next <span className="bg-gradient-to-r from-[#FF5E00] to-[#FFA000] bg-clip-text text-transparent">Breakthrough</span>
        </h1>

        {/* Elegant Supporting Subhead */}
        <p className="text-zinc-400 text-lg sm:text-xl max-w-2xl mb-12 leading-relaxed font-normal">
          NextHire bridges the gap between exceptional industry professionals and high-growth companies. Explore tech roles or recruit the top 1% with smart matching.
        </p>

        {/* Premium Glassmorphic Search Bar */}
        <div className="w-full max-w-3xl mx-auto mb-12">
          <form
            onSubmit={handleSearch}
            className="w-full rounded-[20px] bg-[#121214]/90 border border-zinc-800/80 backdrop-blur-md p-2 flex flex-col md:flex-row items-center gap-2 shadow-[0_12px_40px_rgba(0,0,0,0.5)] focus-within:border-[#0088FF]/40 transition-all duration-300"
          >
            {/* Left Input: Keyword */}
            <div className="flex-1 w-full flex items-center gap-3 px-3 py-2">
              <svg
                className="w-5 h-5 text-zinc-400 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Job title, skill or company"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full bg-transparent text-white placeholder-zinc-500 text-sm focus:outline-none"
              />
            </div>

            {/* Divider */}
            <div className="hidden md:block h-7 w-[1px] bg-zinc-850" />

            {/* Right Input: Location */}
            <div className="flex-1 w-full flex items-center gap-3 px-3 py-2">
              <svg
                className="w-5 h-5 text-zinc-400 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Location or Remote"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-transparent text-white placeholder-zinc-500 text-sm focus:outline-none"
              />
            </div>

            {/* Search Action Button */}
            <button
              type="submit"
              className="w-full md:w-12 h-12 rounded-[14px] bg-gradient-to-r from-[#0088FF] to-[#0055FF] hover:from-[#339FFF] hover:to-[#2277FF] flex items-center justify-center text-white transition-all shadow-[0_4px_14px_rgba(0,136,255,0.3)] hover:shadow-[0_6px_20px_rgba(0,136,255,0.45)] active:scale-95 cursor-pointer shrink-0"
              aria-label="Search"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </form>

          {/* Trending Positions */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            <span className="text-zinc-500 text-sm font-normal mr-1">Trending Position</span>
            <button className="px-4 py-1.5 rounded-full border border-zinc-800 bg-zinc-950/40 text-zinc-300 hover:text-white hover:border-[#0088FF]/40 hover:bg-zinc-900/10 transition-all duration-300 text-[13px] cursor-pointer">
              Product Designer
            </button>
            <button className="px-4 py-1.5 rounded-full border border-zinc-800 bg-zinc-950/40 text-zinc-300 hover:text-white hover:border-[#FF5E00]/40 hover:bg-zinc-900/10 transition-all duration-300 text-[13px] cursor-pointer">
              AI Engineering
            </button>
            <button className="px-4 py-1.5 rounded-full border border-zinc-800 bg-zinc-950/40 text-zinc-300 hover:text-white hover:border-[#0088FF]/40 hover:bg-zinc-900/10 transition-all duration-300 text-[13px] cursor-pointer">
              Dev-ops Engineer
            </button>
          </div>
        </div>

        {/* Dual Actions with Hover Glows */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="#"
            className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-white bg-gradient-to-r from-[#0088FF] to-[#0055FF] rounded-xl hover:from-[#339FFF] hover:to-[#2277FF] shadow-[0_8px_25px_rgba(0,136,255,0.3)] hover:shadow-[0_10px_30px_rgba(0,136,255,0.45)] transition-all duration-300 active:scale-[0.98]"
          >
            Explore Hot Jobs
          </Link>
          <Link
            href="#"
            className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-zinc-300 bg-zinc-950/40 border border-zinc-800 hover:border-[#FF5E00]/40 hover:text-white rounded-xl backdrop-blur-md transition-all duration-300 hover:shadow-[0_6px_20px_rgba(255,94,0,0.15)] active:scale-[0.98]"
          >
            Post a Job
          </Link>
        </div>

      </div>

    </div>
  );
}
