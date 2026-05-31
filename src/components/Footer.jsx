"use client";

import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative mt-auto w-full bg-[#0B0B0C] border-t border-zinc-900 pt-16 pb-8 overflow-hidden">
      {/* Background glowing ambient light */}
      <div className="absolute top-0 left-1/4 -translate-y-1/2 w-72 h-72 bg-[#0088FF]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-0 right-1/4 -translate-y-1/2 w-72 h-72 bg-[#FF5E00]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-12 border-b border-zinc-800/60">
          
          {/* Logo & Description Column */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-2 outline-none self-start">
              <Image
                src="/Assets/logo.png"
                alt="Hireloop"
                width={160}
                height={40}
                className="h-14 w-auto object-contain transition-transform duration-300 hover:scale-[1.02]"
              />
            </Link>
            <p className="text-zinc-400 text-[14px] leading-relaxed max-w-sm">
              Connecting exceptional talent with world-class opportunities. Discover your next career breakthrough or hire elite industry professionals.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="flex items-center justify-center w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800/80 text-zinc-400 hover:text-[#0088FF] hover:border-[#0088FF]/30 transition-all duration-300 hover:-translate-y-0.5"
                aria-label="Twitter"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="#"
                className="flex items-center justify-center w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800/80 text-zinc-400 hover:text-[#FF5E00] hover:border-[#FF5E00]/30 transition-all duration-300 hover:-translate-y-0.5"
                aria-label="LinkedIn"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              <a
                href="#"
                className="flex items-center justify-center w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800/80 text-zinc-400 hover:text-[#0088FF] hover:border-[#0088FF]/30 transition-all duration-300 hover:-translate-y-0.5"
                aria-label="GitHub"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Links Column 1 */}
          <div className="flex flex-col gap-4">
            <h3 className="text-white text-[15px] font-semibold tracking-wider uppercase">Product</h3>
            <ul className="flex flex-col gap-2.5">
              <li>
                <Link href="#" className="text-zinc-400 hover:text-white text-[14px] transition-colors">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link href="#" className="text-zinc-400 hover:text-white text-[14px] transition-colors">
                  Talent Search
                </Link>
              </li>
              <li>
                <Link href="#" className="text-zinc-400 hover:text-white text-[14px] transition-colors">
                  Pricing Plans
                </Link>
              </li>
              <li>
                <Link href="#" className="text-zinc-400 hover:text-white text-[14px] transition-colors">
                  Enterprise
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div className="flex flex-col gap-4">
            <h3 className="text-white text-[15px] font-semibold tracking-wider uppercase">Company</h3>
            <ul className="flex flex-col gap-2.5">
              <li>
                <Link href="#" className="text-zinc-400 hover:text-white text-[14px] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-zinc-400 hover:text-white text-[14px] flex items-center gap-2 transition-colors">
                  Careers
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-[#FF5E00]/10 text-[#FF5E00] border border-[#FF5E00]/20">
                    Hiring
                  </span>
                </Link>
              </li>
              <li>
                <Link href="#" className="text-zinc-400 hover:text-white text-[14px] transition-colors">
                  Press Kit
                </Link>
              </li>
              <li>
                <Link href="#" className="text-zinc-400 hover:text-white text-[14px] transition-colors">
                  Contact Sales
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="flex flex-col gap-4">
            <h3 className="text-white text-[15px] font-semibold tracking-wider uppercase">Stay Updated</h3>
            <p className="text-zinc-400 text-[13px] leading-relaxed">
              Subscribe to get the latest job postings and career insights right in your inbox.
            </p>
            <form className="flex flex-col gap-2.5" onSubmit={(e) => e.preventDefault()}>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2.5 bg-zinc-950/60 border border-zinc-800/80 rounded-xl text-white text-[14px] placeholder-zinc-500 focus:outline-none focus:border-[#0088FF]/50 focus:ring-1 focus:ring-[#0088FF]/30 transition-all duration-300"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 text-center text-sm font-semibold text-white bg-gradient-to-r from-[#0088FF] to-[#0055FF] hover:from-[#339FFF] hover:to-[#2277FF] rounded-xl shadow-[0_4px_14px_rgba(0,136,255,0.2)] hover:shadow-[0_6px_20px_rgba(0,136,255,0.35)] transition-all duration-300 active:scale-[0.98]"
              >
                Subscribe
              </button>
            </form>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-[13px] text-zinc-500">
          <p>© {new Date().getFullYear()} NextHire. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-zinc-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-zinc-300 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-zinc-300 transition-colors">Cookie Settings</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
