"use client";
// import { useProfile } from "@/context/ProfileContext";
import Hero from "@/components/sections/Hero";
import Benefits from "@/components/sections/Benefits";
import Features from "@/components/sections/Features";
import ComparisonBanner from "@/components/sections/ComparisonBanner";
import FAQ from "@/components/sections/FAQ";

export default function HomePage() {
  // const { profile } = useProfile();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Hero />
      <Benefits />
      <Features />
      <ComparisonBanner />
      <FAQ />
    </div>
  );
}
