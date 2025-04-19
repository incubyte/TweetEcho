import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { initializeUser } from '@/lib/services/user-service';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  
  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    // If successful authentication, initialize user in database
    if (data?.user && !error) {
      try {
        console.log('Initializing user after authentication:', data.user.id);
        await initializeUser(data.user.id);
      } catch (initError) {
        console.error('Failed to initialize user after auth:', initError);
        // Continue with redirect even if initialization fails
      }
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL('/dashboard', request.url));
}