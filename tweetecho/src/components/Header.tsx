'use client';

import Link from 'next/link';
import { useProfile } from '@/context/ProfileContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSession, signIn, signOut } from 'next-auth/react';
import { Twitter } from 'lucide-react';

export default function Header() {
  const { profile } = useProfile();
  const { data: session, status } = useSession();

  return (
    <header className="w-full border-b border-gray-200 bg-white py-4">
      <div className="container mx-auto flex items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-blue-500">TweetEcho</span>
          </div>
        </Link>

        <nav className="hidden md:flex space-x-6">
          {session && (
            <>
              <Link href="/dashboard" className="text-gray-600 hover:text-blue-500">
                Dashboard
              </Link>
              <Link href="/dashboard/profile" className="text-gray-600 hover:text-blue-500">
                Profile
              </Link>
            </>
          )}
        </nav>

        {session ? (
          <div className="flex items-center gap-3">
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium">{session.user.name}</p>
            </div>
            <Avatar className="h-8 w-8">
              <AvatarImage src={session.user.image || ''} alt={session.user.name || ''} />
              <AvatarFallback>
                {session.user.name ? session.user.name.charAt(0).toUpperCase() : 'U'}
              </AvatarFallback>
            </Avatar>
            <button 
              onClick={() => signOut({ callbackUrl: '/' })}
              className="text-sm text-gray-600 hover:text-red-500"
            >
              Sign out
            </button>
          </div>
        ) : (
          <button 
            onClick={() => signIn('twitter', { callbackUrl: '/dashboard' })}
            className="flex items-center gap-2 rounded-md bg-[#1DA1F2] px-4 py-2 text-sm font-medium text-white hover:bg-[#1A91DA]"
          >
            <Twitter className="h-4 w-4" />
            Sign in
          </button>
        )}
      </div>
    </header>
  );
} 