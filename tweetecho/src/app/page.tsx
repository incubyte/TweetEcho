'use client';

import Link from 'next/link';
import PageLayout from '@/components/PageLayout';
import { Button } from '@/components/ui/button';
import { useProfile } from '@/context/ProfileContext';

export default function HomePage() {
  const { profile } = useProfile();
  
  return (
    <PageLayout>
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
          <span className="block">Your Twitter Voice,</span>
          <span className="block text-blue-500">Amplified by AI</span>
        </h1>
        
        <p className="mt-6 max-w-2xl text-xl text-gray-500">
          TweetEcho learns from your best-performing tweets to create authentic content 
          that sounds like you and engages your audience.
        </p>
        
        <div className="mt-10">
          {profile?.isComplete ? (
            <Link href="/generate">
              <Button size="lg" className="rounded-md px-8 py-6 text-lg">
                Generate Tweets
              </Button>
            </Link>
          ) : (
            <Link href="/onboarding">
              <Button size="lg" className="rounded-md px-8 py-6 text-lg">
                Get Started
              </Button>
            </Link>
          )}
        </div>

        <div className="mt-20 grid gap-8 md:grid-cols-3">
          <FeatureCard 
            title="Personal Style Analysis" 
            description="Our AI analyzes your unique writing patterns, tone, hashtag usage, and emoji frequency to match your authentic voice."
            icon="🔍"
          />
          <FeatureCard 
            title="Performance Analytics" 
            description="Learn from your best-performing content. We examine which tweets received the most engagement to optimize future posts."
            icon="📊"
          />
          <FeatureCard 
            title="Save Hours on Content Creation" 
            description="Generate weeks of Twitter content in minutes, eliminating time spent staring at a blank compose box."
            icon="⏱️"
          />
        </div>
      </div>
    </PageLayout>
  );
}

function FeatureCard({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
      <div className="mb-4 text-4xl">{icon}</div>
      <h3 className="mb-2 text-xl font-medium text-gray-900">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
