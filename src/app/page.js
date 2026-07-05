"use client";

import Banner from "@/components/Banner";
import TopCompanies from "@/components/TopCompanies";
import Stats from "@/components/Stats";
import HowItWorks from "@/components/HowItWorks";
import FeaturedJobs from "@/components/FeaturedJobs";
import Pricing from "@/components/Pricing";
import CallToAction from "@/components/CallToAction";

export default function Home() {
  return (
    <div className="bg-black grow flex flex-col">
      <Banner />
      <TopCompanies />
      <Stats />
      <FeaturedJobs />
      <HowItWorks />
      <Pricing />
      <CallToAction />
    </div>
  );
}
