'use client';

import Link from 'next/link';
import { useProfile } from '@/context/ProfileContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function Header() {
  const { profile } = useProfile();

  return (
    <header className="w-full border-b border-gray-200 bg-white py-4">
      <div className="container mx-auto flex items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-blue-500">TweetEcho</span>
          </div>
        </Link>

        <nav className="hidden md:flex space-x-6">
          <Link href="/onboarding" className="text-gray-600 hover:text-blue-500">
            Profile
          </Link>
          <Link href="/generate" className="text-gray-600 hover:text-blue-500">
            Generate Tweets
          </Link>
        </nav>

        {profile ? (
          <div className="flex items-center gap-3">
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium">{profile.name}</p>
              <p className="text-xs text-gray-500">@{profile.twitterHandle}</p>
            </div>
            <Avatar className="h-8 w-8">
              <AvatarImage src={profile.avatar || ''} alt={profile.name} />
              <AvatarFallback>
                {profile.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        ) : (
          <Link 
            href="/onboarding" 
            className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
          >
            Get Started
          </Link>
        )}
      </div>
    </header>
  );
} 