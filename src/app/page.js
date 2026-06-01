"use client";

import Banner from "@/components/Banner";
import Stats from "@/components/Stats";

export default function Home() {
  return (
    <div className="bg-black grow flex flex-col">
      <Banner />
      <Stats />
    </div>
  );
}
