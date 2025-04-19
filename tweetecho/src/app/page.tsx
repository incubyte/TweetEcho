"use client";

import Hero from "@/components/sections/Hero";
import Benefits from "@/components/sections/Benefits";
import Features from "@/components/sections/Features";
import ComparisonBanner from "@/components/sections/ComparisonBanner";
import FAQ from "@/components/sections/FAQ";
import { signIn } from "next-auth/react";

export default function HomePage() {
  const handleConnectTwitter = () => {
    signIn("twitter", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Hero handleTwitterLogin={handleConnectTwitter} />
      <Benefits />
      <Features />
      <ComparisonBanner />
      <FAQ />
    </div>
  );
}
