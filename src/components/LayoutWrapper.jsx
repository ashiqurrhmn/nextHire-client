"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ToastProvider } from "@heroui/react";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");

  return (
    <>
      <ToastProvider 
        placement="bottom"
        toastProps={{
          classNames: {
            base: "bg-[#121214] border border-zinc-800 text-zinc-100 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.5)] p-4 font-sans backdrop-blur-xl",
            title: "text-sm font-bold text-white",
            description: "text-xs text-zinc-400",
            closeButton: "hover:bg-zinc-800/50 text-zinc-400 hover:text-white transition-colors",
          }
        }}
      />
      {!isDashboard && <Navbar />}
      <main className="flex-grow flex flex-col">{children}</main>
      {!isDashboard && <Footer />}
    </>
  );
}
