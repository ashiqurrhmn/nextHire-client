"use client";

import { motion } from "framer-motion";
import { 
  LogoGithub, LogoFigma, LogoSlack, LogoNotion, 
  LogoDocker, LogoGitlab, LogoMacos, LogoWindows 
} from "@gravity-ui/icons";

export default function TopCompanies() {
  const companies = [
    { name: "GitHub", icon: <LogoGithub width={32} height={32} />, color: "text-white", glow: "hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.6)]" },
    { name: "Figma", icon: <LogoFigma width={32} height={32} />, color: "text-[#F24E1E]", glow: "hover:drop-shadow-[0_0_15px_rgba(242,78,30,0.6)]" },
    { name: "Slack", icon: <LogoSlack width={32} height={32} />, color: "text-[#4A154B]", glow: "hover:drop-shadow-[0_0_15px_rgba(74,21,75,0.6)]" },
    { name: "Notion", icon: <LogoNotion width={32} height={32} />, color: "text-white", glow: "hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.6)]" },
    { name: "Docker", icon: <LogoDocker width={32} height={32} />, color: "text-[#2496ED]", glow: "hover:drop-shadow-[0_0_15px_rgba(36,150,237,0.6)]" },
    { name: "GitLab", icon: <LogoGitlab width={32} height={32} />, color: "text-[#FCA121]", glow: "hover:drop-shadow-[0_0_15px_rgba(252,161,33,0.6)]" },
    { name: "Apple", icon: <LogoMacos width={32} height={32} />, color: "text-white", glow: "hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.6)]" },
    { name: "Microsoft", icon: <LogoWindows width={32} height={32} />, color: "text-[#00A4EF]", glow: "hover:drop-shadow-[0_0_15px_rgba(0,164,239,0.6)]" },
  ];

  return (
    <div className="w-full py-16 overflow-hidden relative">
      {/* Gradients on edges for smooth fade into the main page background */}
      <div className="absolute top-0 bottom-0 left-0 w-32 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 bottom-0 right-0 w-32 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />
      
      <div className="flex flex-col items-center mb-10 px-4 text-center">
        <h3 className="text-zinc-500 font-medium text-sm tracking-widest uppercase">
          Trusted by innovative engineering teams
        </h3>
      </div>

      <div className="flex whitespace-nowrap overflow-hidden">
        <motion.div
          animate={{ x: [0, -1000] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 25,
              ease: "linear",
            },
          }}
          className="flex items-center gap-12 min-w-full pl-6"
        >
          {/* Double the array for seamless looping */}
          {[...companies, ...companies].map((company, index) => (
            <div 
              key={index} 
              className={`group flex items-center gap-3 px-4 py-2 transition-all duration-300 cursor-pointer opacity-80 hover:opacity-100 ${company.color} ${company.glow}`}
            >
              <div className="transition-transform duration-300 group-hover:scale-110">
                {company.icon}
              </div>
              <span className="text-2xl font-bold tracking-tight">
                {company.name}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
