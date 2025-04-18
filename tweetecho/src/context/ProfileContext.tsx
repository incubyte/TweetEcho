'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';
import { UserProfile, TweetStyle } from '@/types';

interface ProfileContextType {
  profile: UserProfile | null;
  updateProfile: (profile: UserProfile) => void;
  updatePreferredStyle: (style: TweetStyle) => void;
  isComplete: boolean;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  // Check if profile has all required fields
  const isComplete = Boolean(
    profile && profile.name && profile.twitterHandle
  );

  // Update the entire profile
  const updateProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
  };

  // Update just the preferred style
  const updatePreferredStyle = (style: TweetStyle) => {
    if (profile) {
      setProfile({ ...profile, preferredStyle: style });
    }
  };

  return (
    <ProfileContext.Provider
      value={{ profile, updateProfile, updatePreferredStyle, isComplete }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
} 