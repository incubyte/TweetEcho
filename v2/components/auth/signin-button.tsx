'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase/client';

export default function SignInButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
    } catch (error) {
      console.error('Error signing in:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleSignIn}
      disabled={isLoading}
      size="lg"
      className="w-full"
    >
      {isLoading ? 'Loading...' : 'Sign in with Google'}
    </Button>
  );
}