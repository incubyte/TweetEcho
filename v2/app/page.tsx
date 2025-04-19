'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import SignInButton from "@/components/auth/signin-button";
import { supabase } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "@supabase/supabase-js";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{text: string, timestamp: string}[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function getUser() {
      try {
        const { data } = await supabase.auth.getUser();
        setUser(data.user);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    }

    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    setIsSubmitting(true);
    
    // Add the message to the list
    const newMessage = {
      text: message,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, newMessage]);
    setMessage("");
    setIsSubmitting(false);
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
          <Button variant="outline" onClick={handleSignOut}>Sign Out</Button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Welcome, {user.user_metadata?.full_name || 'User'}</CardTitle>
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
                  <p className="font-medium">{user.user_metadata?.full_name || 'User'}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Share your thoughts
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    placeholder="What's on your mind?"
                    className="w-full rounded-md border border-[hsl(var(--border))] bg-transparent p-3 text-sm shadow-sm focus:border-[hsl(var(--ring))] focus:outline-none focus:ring-1 focus:ring-[hsl(var(--ring))]"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isSubmitting || !message.trim()}
                >
                  {isSubmitting ? "Submitting..." : "Post Message"}
                </Button>
              </form>

              {messages.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4">Your Messages</h3>
                  <div className="space-y-4">
                    {messages.map((msg, index) => (
                      <div key={index} className="border border-[hsl(var(--border))] rounded-md p-4">
                        <p>{msg.text}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(msg.timestamp).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p><strong>User ID:</strong> {user.id.substring(0, 8)}...</p>
              <p><strong>Last Sign In:</strong> {new Date(user.last_sign_in_at || '').toLocaleString()}</p>
              <p><strong>Created At:</strong> {new Date(user.created_at || '').toLocaleDateString()}</p>
              <p><strong>Provider:</strong> {user.app_metadata?.provider || 'Google'}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        
        <div className="text-center sm:text-left max-w-md">
          <h1 className="text-3xl font-bold mb-4">Welcome to our App</h1>
          <p className="mb-8 text-muted-foreground">
            Sign in with Google to get started and access your personalized dashboard.
          </p>
        </div>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <SignInButton />
          
          <Button variant="outline" asChild>
            <Link href="/shadcn-demo">View UI Demo</Link>
          </Button>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
