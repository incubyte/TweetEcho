"use client";

import Hero from "@/components/sections/Hero";
import Benefits from "@/components/sections/Benefits";
import Features from "@/components/sections/Features";
import ComparisonBanner from "@/components/sections/ComparisonBanner";
import FAQ from "@/components/sections/FAQ";
import axios from "axios";

export default function HomePage() {
  const handleConnectTwitter = async () => {
    try {
      const response = await axios.get("/api/auth/twitter/get-url");

      // Store in localStorage instead of sessionStorage
      localStorage.setItem("codeVerifier", response.data.codeVerifier);

      window.location.href = response.data.authUrl;
    } catch (error) {
      console.error("Error getting Twitter auth URL:", error);
    }
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
