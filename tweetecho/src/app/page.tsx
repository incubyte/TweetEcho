"use client";

import Hero from "@/components/sections/Hero";
import Benefits from "@/components/sections/Benefits";
import Features from "@/components/sections/Features";
import ComparisonBanner from "@/components/sections/ComparisonBanner";
import FAQ from "@/components/sections/FAQ";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  const handleConnectTwitter = () => {
    axios.get("/api/auth/twitter/get-url").then((response) => {
      router.replace(response.data.authUrl);
    });
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
