"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useProfile } from "@/context/ProfileContext";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TweetStyle } from "@/types";
import { toast } from "sonner";
import axios from "axios";

export default function OnboardingPage() {
  const router = useRouter();
  const { profile, updateProfile } = useProfile();

  const [formData, setFormData] = useState({
    name: profile?.name || "",
    twitterHandle: profile?.twitterHandle || "",
    preferredStyle: profile?.preferredStyle || ("informative" as TweetStyle),
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate form
    if (!formData.name || !formData.twitterHandle) {
      toast.error("Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }

    // Create a new profile object
    const newProfile = {
      id: profile?.id || `user-${Date.now()}`,
      name: formData.name,
      twitterHandle: formData.twitterHandle.replace("@", ""), // Remove @ if user included it
      preferredStyle: formData.preferredStyle,
      avatar:
        profile?.avatar ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
          formData.name
        )}&background=random`,
    };

    // Update the profile in context
    updateProfile(newProfile);

    // Show success message
    toast.success("Profile updated successfully!");

    // Navigate to generate page
    setTimeout(() => {
      router.push("/generate");
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleConnectTwitter = () => {
    axios.get("/api/auth/twitter/get-url").then((response) => {
      console.log("response: ", response);
      router.replace(response.data.authUrl);
    });
  };

  return (
    <PageLayout>
      <div className="mx-auto max-w-2xl py-8">
        <h1 className="mb-8 text-center text-3xl font-bold">
          Set Up Your TweetEcho Profile
        </h1>

        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Your Information</CardTitle>
              <CardDescription>
                Tell us about yourself so we can tailor your tweet suggestions.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </CardContent>
          </form>

          <CardFooter>
            <Button
              className="w-full"
              disabled={isSubmitting}
              onClick={handleConnectTwitter}
            >
              {isSubmitting ? "Saving..." : "Connect your Twitter account"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </PageLayout>
  );
}
