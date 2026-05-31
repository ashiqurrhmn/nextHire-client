"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full bg-transparent px-4 sm:px-6 lg:px-8 py-4">
      {/* Floating Glassmorphic Container */}
      <div className="mx-auto max-w-7xl rounded-[20px] bg-[#161618] border border-zinc-800/70 backdrop-blur-md px-6 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-300">
        <div className="flex items-center justify-between">
          {/* Logo on the left */}
          <Link href="/" className="flex items-center gap-2 outline-none">
            <Image
              src="/Assets/logo.png"
              alt="Hireloop"
              width={140}
              height={36}
              priority
              className="h-10 w-auto object-contain transition-transform duration-300 hover:scale-[1.02]"
            />
          </Link>

          {/* Navigation & Action buttons on the right (Desktop) */}
          <div className="hidden md:flex items-center gap-6">
            <ul className="flex items-center gap-7">
              <li>
                <Link
                  href="#"
                  className="text-[14px] font-medium text-zinc-300 hover:text-white transition-colors duration-200"
                >
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-[14px] font-medium text-zinc-300 hover:text-white transition-colors duration-200"
                >
                  Company
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-[14px] font-medium text-zinc-300 hover:text-white transition-colors duration-200"
                >
                  Pricing
                </Link>
              </li>
            </ul>

            {/* Vertical Separator */}
            <div className="h-4 w-[1px] bg-zinc-800" />

            {/* Actions */}
            <div className="flex items-center gap-5">
              <Link
                href="#"
                className="text-[14px] font-semibold text-[#FF5E00] hover:text-[#FFA000] transition-colors duration-200"
              >
                Sign In
              </Link>
              <Link
                href="#"
                className="inline-flex items-center justify-center px-5 py-2.5 text-[14px] font-semibold text-white bg-gradient-to-r from-[#0088FF] to-[#0055FF] rounded-xl hover:from-[#339FFF] hover:to-[#2277FF] active:scale-98 shadow-[0_4px_14px_rgba(0,136,255,0.25)] hover:shadow-[0_6px_20px_rgba(0,136,255,0.4)] transition-all duration-300"
              >
                Get Started
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="flex items-center justify-center p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900/60 md:hidden transition-colors focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="h-6 w-6 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Dropdown Menu with animation */}
        {isMenuOpen && (
          <div className="mt-4 border-t border-zinc-800/80 pt-4 md:hidden transition-all duration-300">
            <ul className="flex flex-col gap-3 pb-3">
              <li>
                <Link
                  href="#"
                  onClick={() => setIsMenuOpen(false)}
                  className="block py-2 text-base font-medium text-zinc-300 hover:text-white hover:bg-zinc-900/40 px-3 rounded-lg transition-colors"
                >
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  onClick={() => setIsMenuOpen(false)}
                  className="block py-2 text-base font-medium text-zinc-300 hover:text-white hover:bg-zinc-900/40 px-3 rounded-lg transition-colors"
                >
                  Company
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  onClick={() => setIsMenuOpen(false)}
                  className="block py-2 text-base font-medium text-zinc-300 hover:text-white hover:bg-zinc-900/40 px-3 rounded-lg transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <div className="h-[1px] bg-zinc-800/80 my-1 mx-3" />
              <li className="flex flex-col gap-2.5 px-3 pt-2">
                <Link
                  href="#"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-center py-2.5 text-base font-semibold text-[#FF5E00] hover:text-[#FFA000] transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="#"
                  onClick={() => setIsMenuOpen(false)}
                  className="inline-flex items-center justify-center w-full py-3 text-sm font-medium text-white bg-gradient-to-r from-[#0088FF] to-[#0055FF] rounded-xl hover:from-[#339FFF] hover:to-[#2277FF] shadow-lg transition-all"
                >
                  Get Started
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}
