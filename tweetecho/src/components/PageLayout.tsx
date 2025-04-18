'use client';

import React from 'react';
import Header from '@/components/Header';

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageLayout({ children, className = '' }: PageLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className={`flex-1 container mx-auto px-4 py-8 ${className}`}>
        {children}
      </main>
      <footer className="border-t border-gray-200 bg-white py-6">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} TweetEcho. All rights reserved.</p>
          <p className="mt-1">Crafted during a 2-day AI Hackathon</p>
        </div>
      </footer>
    </div>
  );
} 