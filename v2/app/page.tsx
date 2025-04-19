"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "@supabase/supabase-js";
import { getUserMetadata, getUserWebContent } from "@/lib/supabase/api";
import { UserMetadata, WebContent } from "@/lib/supabase/schemas";
import Benefits from "@/components/sections/Benefits";
import Hero from "@/components/sections/Hero";
import Features from "@/components/sections/Features";
import ComparisonBanner from "@/components/sections/ComparisonBanner";
import FAQ from "@/components/sections/FAQ";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [messages, setMessages] = useState<
    { text: string; timestamp: string; isAiGenerated?: boolean }[]
  >([]);
  const [metadata, setMetadata] = useState<UserMetadata | null>(null);
  const [webContent, setWebContent] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isScrapingUrl, setIsScrapingUrl] = useState(false);

  // Supabase integration states
  const [savedMetadata, setSavedMetadata] = useState<UserMetadata | null>(null);
  const [savedWebContents, setSavedWebContents] = useState<WebContent[]>([]);
  const [selectedWebContent, setSelectedWebContent] =
    useState<WebContent | null>(null);

  useEffect(() => {
    async function getUser() {
      try {
        const { data } = await supabase.auth.getUser();
        setUser(data.user);

        // If user is authenticated, fetch their saved data
        if (data.user) {
          fetchUserData(data.user.id);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    }

    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const newUser = session?.user ?? null;
        setUser(newUser);

        // If user logged in, fetch their data
        if (newUser && event === "SIGNED_IN") {
          fetchUserData(newUser.id);
        }

        // If user logged out, clear saved data
        if (event === "SIGNED_OUT") {
          setSavedMetadata(null);
          setSavedWebContents([]);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Function to fetch user's data from Supabase
  const fetchUserData = async (userId: string) => {
    try {
      // Fetch user metadata (content persona)
      const userMetadata = await getUserMetadata(userId);
      setSavedMetadata(userMetadata);

      if (userMetadata) {
        // Use the saved metadata for content generation
        setMetadata(userMetadata);
      }

      // Fetch user web content sources
      const webContents = await getUserWebContent(userId);
      setSavedWebContents(webContents);

      if (webContents.length > 0) {
        // Use the most recent web content for content generation
        setWebContent(webContents[0].content);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);

    try {
      // Call the API to generate posts with metadata
      // Add origin to make it an absolute URL when running on server
      const baseUrl =
        typeof window !== "undefined"
          ? window.location.origin
          : "http://localhost:3000";

      const response = await fetch(`${baseUrl}/api/generate-posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: message,
          userId: user?.id || "user-123",
          useStoredMetadata: true, // Try to use stored metadata if available
        }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to generate posts");
      }

      const data = await response.json();

      // Store the metadata
      setMetadata(data.metadata);

      // If we're using stored metadata, show this in the UI
      if (data.usedStoredMetadata) {
        setSavedMetadata(data.metadata);
      }

      // Get current timestamp to ensure posts appear together
      const currentTime = new Date().toISOString();

      // Add the AI-generated posts
      const aiPosts = data.posts.map((post: string) => ({
        text: post,
        timestamp: currentTime,
        isAiGenerated: true,
        usedStoredMetadata: data.usedStoredMetadata,
      }));

      // Add AI-generated messages to the state
      setMessages((prev) => [...prev, ...aiPosts]);
      setMessage("");
    } catch (error) {
      console.error("Error generating AI posts:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (user) {
    return (
      <div className="container mx-auto py-10 px-4">
        <header className="flex justify-between items-center mb-8">
          <Image
            className="dark:invert"
            src="/next.svg"
            alt="Next.js logo"
            width={120}
            height={25}
            priority
          />
          <div className="space-x-2">
            <Button variant="secondary" asChild>
              <Link href="/dashboard">Manage Profile</Link>
            </Button>
            <Button variant="outline" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>
                Welcome, {user.user_metadata?.full_name || "User"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-6">
                {user.user_metadata?.avatar_url && (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt="Profile"
                    className="rounded-full w-16 h-16"
                  />
                )}
                <div>
                  <p className="font-medium">
                    {user.user_metadata?.full_name || "User"}
                  </p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>

              <div className="space-y-6 mt-6">
                <div className="rounded-lg border border-[hsl(var(--border))] p-4">
                  <h4 className="text-sm font-medium mb-3">
                    Option 1: Enter URL to analyze
                  </h4>
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="Enter a webpage URL to analyze..."
                        className="flex-1 rounded-md border border-[hsl(var(--border))] bg-transparent px-3 py-2 text-sm shadow-sm focus:border-[hsl(var(--ring))] focus:outline-none focus:ring-1 focus:ring-[hsl(var(--ring))]"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                      />
                      <Button
                        onClick={async (e) => {
                          e.preventDefault();
                          if (!urlInput.trim()) return;

                          setIsScrapingUrl(true);
                          try {
                            // Add origin to make it an absolute URL when running on server
                            const baseUrl =
                              typeof window !== "undefined"
                                ? window.location.origin
                                : "http://localhost:3000";

                            const response = await fetch(
                              `${baseUrl}/api/scrape`,
                              {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                  url: urlInput,
                                  userId: user?.id || "user-123",
                                  useStoredMetadata: true, // Try to use stored metadata if available
                                }),
                                credentials: "include",
                              }
                            );

                            if (!response.ok) {
                              const errorData = await response.json();
                              console.error("Scrape error:", errorData);
                              throw new Error(
                                errorData.error || "Failed to scrape URL"
                              );
                            }

                            const data = await response.json();

                            // Store the web content and metadata
                            setWebContent(data.sourceContent);
                            setMetadata(data.metadata);

                            // If using stored metadata, note this
                            if (data.usedStoredMetadata) {
                              setSavedMetadata(data.metadata);
                            }

                            // Save the web content to selectedWebContent for display
                            if (user?.id && data.sourceContent) {
                              const webContentObj = {
                                id: `temp-${Date.now()}`,
                                user_id: user.id,
                                url: urlInput,
                                title: data.title || "Analyzed Web Content",
                                description:
                                  data.description ||
                                  "No description available",
                                content: data.sourceContent,
                                created_at: new Date().toISOString(),
                              };
                              setSelectedWebContent(webContentObj);
                            }

                            // Get current timestamp
                            const currentTime = new Date().toISOString();

                            // Add the AI-generated posts
                            const aiPosts = data.posts.map((post: string) => ({
                              text: post,
                              timestamp: currentTime,
                              isAiGenerated: true,
                              usedStoredMetadata: data.usedStoredMetadata,
                              usedWebContent: true,
                            }));

                            // Add AI-generated messages to the state
                            setMessages((prev) => [...prev, ...aiPosts]);
                            setUrlInput("");
                          } catch (error) {
                            console.error("Error scraping URL:", error);
                            alert(`Failed to scrape the URL`);
                          } finally {
                            setIsScrapingUrl(false);
                          }
                        }}
                        disabled={isScrapingUrl || !urlInput.trim()}
                        size="sm"
                      >
                        {isScrapingUrl ? "Processing..." : "Analyze"}
                      </Button>
                    </div>
                    {webContent && (
                      <div className="text-xs text-muted-foreground">
                        <p>✓ Webpage content analyzed</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="relative rounded-lg border border-[hsl(var(--border))] p-4">
                  <h4 className="text-sm font-medium mb-3">
                    Option 2: Enter a topic directly
                  </h4>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <textarea
                      id="message"
                      rows={3}
                      placeholder="Enter a topic, concept, or question..."
                      className="w-full rounded-md border border-[hsl(var(--border))] bg-transparent p-3 text-sm shadow-sm focus:border-[hsl(var(--ring))] focus:outline-none focus:ring-1 focus:ring-[hsl(var(--ring))]"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isSubmitting || !message.trim()}
                    >
                      {isSubmitting
                        ? "Generating posts..."
                        : "Generate AI Posts"}
                    </Button>
                  </form>
                </div>
              </div>

              {messages.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4">
                    Personalized Content Suggestions
                  </h3>
                  <div className="space-y-4">
                    {messages.map((msg, index) => (
                      <div
                        key={index}
                        className="border-[hsl(var(--primary))] bg-[hsla(var(--primary),0.05)] border rounded-md p-4"
                      >
                        <p className="font-medium text-md">{msg.text}</p>
                        <div className="flex justify-between items-center mt-3">
                          <div className="flex flex-wrap gap-1">
                            <span className="text-xs font-medium px-2 py-1 rounded-full bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]">
                              AI Generated
                            </span>
                            {webContent && (
                              <span className="text-xs font-medium px-2 py-1 rounded-full bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))]">
                                Web-Informed
                              </span>
                            )}
                          </div>
                          <button
                            className="text-xs text-[hsl(var(--primary))] hover:underline"
                            onClick={() => {
                              // Implement social sharing or saving functionality in the future
                              alert("Share feature coming soon!");
                            }}
                          >
                            Share
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Profile & Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="space-y-2">
                <h4 className="font-medium text-base">Account Info</h4>
                <p>
                  <strong>User ID:</strong> {user.id.substring(0, 8)}...
                </p>
                <p>
                  <strong>Provider:</strong>{" "}
                  {user.app_metadata?.provider || "Google"}
                </p>
              </div>

              {metadata ? (
                <>
                  <div className="space-y-3 mt-4 pt-4 border-t border-[hsl(var(--border))]">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-base">Content Profile</h4>
                      <div className="flex gap-2 items-center">
                        {savedMetadata && (
                          <span className="text-xs px-2 py-1 bg-[hsla(var(--primary),0.1)] text-[hsl(var(--primary))] rounded-full">
                            Saved
                          </span>
                        )}
                        {webContent && (
                          <span className="text-xs px-2 py-1 bg-[hsla(var(--secondary),0.1)] text-[hsl(var(--secondary-foreground))] rounded-full">
                            Web-Informed
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="font-medium mb-1">Writing Style</p>
                      <div className="flex flex-wrap gap-1">
                        {metadata.writing_style.map(
                          (style: string, i: number) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 bg-[hsla(var(--primary),0.1)] text-[hsl(var(--primary))] rounded-full text-xs"
                            >
                              {style}
                            </span>
                          )
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="font-medium mb-1">Common Hashtags</p>
                      <div className="flex flex-wrap gap-1">
                        {metadata.hashtag_pattern.common_hashtags.map(
                          (tag: string, i: number) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 bg-[hsla(var(--secondary),0.1)] text-[hsl(var(--primary))] rounded-full text-xs"
                            >
                              {tag}
                            </span>
                          )
                        )}
                      </div>
                    </div>

                    {metadata.emoji_usage.used && (
                      <div>
                        <p className="font-medium mb-1">Emoji Usage</p>
                        <p className="text-lg">
                          {metadata.emoji_usage.common_emojis.join("  ")}
                        </p>
                      </div>
                    )}

                    <div>
                      <p className="font-medium mb-1">Hot Topics</p>
                      <ul className="list-disc pl-5 space-y-1">
                        {metadata.engagement_trends.hot_topics.map(
                          (topic: string, i: number) => (
                            <li key={i}>{topic}</li>
                          )
                        )}
                      </ul>
                    </div>

                    <div className="pt-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href="/dashboard">
                          {savedMetadata
                            ? "Manage Content Profile"
                            : "Save This Profile"}
                        </Link>
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-3 mt-4 pt-4 border-t border-[hsl(var(--border))]">
                    <h4 className="font-medium text-base">Content Profile</h4>
                    <p className="text-sm text-muted-foreground">
                      You don&apos;t have a content profile yet. Generate one by
                      analyzing a webpage or entering a topic above.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Or, you can create and save a personalized content profile
                      in your dashboard.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="mt-2"
                    >
                      <Link href="/dashboard">Create Content Profile</Link>
                    </Button>
                  </div>
                </>
              )}

              {webContent || selectedWebContent ? (
                <div className="mt-4 pt-4 border-t border-[hsl(var(--border))]">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium text-base">Content Source</h4>
                    {savedWebContents.length > 0 && (
                      <select
                        className="text-xs border rounded px-2 py-1"
                        value={selectedWebContent?.id || ""}
                        onChange={(e) => {
                          const selected = savedWebContents.find(
                            (c) => c.id === e.target.value
                          );
                          setSelectedWebContent(selected || null);
                          if (selected) {
                            setWebContent(selected.content);
                          }
                        }}
                      >
                        <option value="">Current Source</option>
                        {savedWebContents.map((content) => (
                          <option key={content.id} value={content.id}>
                            {content.title}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground bg-[hsla(var(--muted),0.5)] rounded p-2 max-h-24 overflow-y-auto">
                    {(selectedWebContent?.content || webContent)?.substring(
                      0,
                      200
                    )}
                    ...
                  </div>
                  {savedWebContents.length > 0 && (
                    <div className="mt-2 flex justify-end">
                      <Button variant="link" size="sm" asChild>
                        <Link href="/dashboard">Manage Content Sources</Link>
                      </Button>
                    </div>
                  )}
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
