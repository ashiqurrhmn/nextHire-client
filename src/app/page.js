"use client";

import Banner from "@/components/Banner";
import Stats from "@/components/Stats";
import FeaturedJobs from "@/components/FeaturedJobs";
import Pricing from "@/components/Pricing";

export default function Home() {
  return (
    <div className="bg-black grow flex flex-col">
      <Banner />
      <Stats />
      <FeaturedJobs />
      <Pricing />
    </div>
  );
}
