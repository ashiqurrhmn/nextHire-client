import React from "react";
import { Gear } from "@gravity-ui/icons";

export default function SettingsPage() {
  return (
    <div className="flex flex-col min-h-[70vh] items-center justify-center p-6 text-center animate-in fade-in zoom-in-95 duration-500">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900/50 shadow-2xl">
        <Gear className="h-10 w-10 text-zinc-400 animate-[spin_4s_linear_infinite]" />
      </div>
      
      <h1 className="mb-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
        Settings
      </h1>
      
      <div className="mx-auto max-w-md rounded-2xl border border-zinc-800 bg-black/40 p-6 backdrop-blur-xl">
        <p className="text-zinc-400 text-lg">
          This feature is <span className="font-bold text-[#0088FF]">coming soon</span>! 
        </p>
        <p className="mt-2 text-sm text-zinc-500">
          We're working hard to bring you advanced configuration options, team management, and billing settings. Stay tuned!
        </p>
      </div>
    </div>
  );
}
