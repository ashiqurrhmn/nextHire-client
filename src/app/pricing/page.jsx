"use client";

import Pricing from "@/components/Pricing";

export default function PricingPage() {
  return (
    <div className="bg-black flex flex-col font-sans text-white w-full">
      <main className="flex-grow flex flex-col items-center">
        <Pricing />
      </main>
    </div>
  );
}
