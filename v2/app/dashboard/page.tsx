'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import MetadataManager from '@/components/profile/metadata-manager';
import WebContentManager from '@/components/profile/web-content-manager';
import { getUserMetadata } from '@/lib/supabase/api';
import { getUserWebContent } from '@/lib/supabase/api';
import { UserMetadata, WebContent } from '@/lib/supabase/schemas';

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [metadata, setMetadata] = useState<UserMetadata | null>(null);
  const [webContents, setWebContents] = useState<WebContent[]>([]);
  const [dbInitializing, setDbInitializing] = useState(false);
  const [dbInitialized, setDbInitialized] = useState(true); // Assume tables exist until proven otherwise

  useEffect(() => {
    async function getUser() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        
        if (user) {
          try {
            // Fetch user metadata
            const userMetadata = await getUserMetadata(user.id);
            setMetadata(userMetadata);
            
            // Fetch web content
            const userWebContent = await getUserWebContent(user.id);
            setWebContents(userWebContent);
          } catch (error: any) {
            // Check if the error is due to missing tables
            if (error?.message?.includes('relation') && error?.message?.includes('does not exist')) {
              console.error('Database tables not found. Please initialize the database.');
              setDbInitialized(false);
            } else {
              console.error('Error fetching user data:', error);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    }

    getUser();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };
  
  const initializeDatabase = async () => {
    if (!user) return;
    
    setDbInitializing(true);
    try {
      // First create .env file with DATABASE_URL using the Supabase URL and key
      const response = await fetch('/api/db/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to initialize database');
      }
      
      // Database initialized successfully
      setDbInitialized(true);
      
      // Show success message
      alert('Database initialized successfully! The page will now reload to load your data.');
      
      // Reload the page to reflect the changes
      window.location.reload();
    } catch (error) {
      console.error('Error initializing database:', error);
      alert('Failed to initialize database. Please try again or contact support.');
    } finally {
      setDbInitializing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      {!dbInitialized && (
        <Card className="mb-8 border-orange-500">
          <CardHeader className="bg-orange-50 dark:bg-orange-950">
            <CardTitle>Database Setup Required</CardTitle>
            <CardDescription>Your database tables need to be initialized before you can use all features.</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="mb-4">The application needs to create database tables for storing user metadata and web content.</p>
            <Button 
              onClick={initializeDatabase}
              disabled={dbInitializing}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {dbInitializing ? "Initializing Database..." : "Initialize Database"}
            </Button>
          </CardContent>
        </Card>
      )}
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Your account details</CardDescription>
        </CardHeader>
        <CardContent>
          {user && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
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
              
              <div className="pt-4 border-t">
                <p><strong>User ID:</strong> {user.id}</p>
                <p><strong>Last Sign In:</strong> {new Date(user.last_sign_in_at || '').toLocaleString()}</p>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button variant="outline" onClick={handleSignOut}>Sign Out</Button>
        </CardFooter>
      </Card>
      
      {user && dbInitialized && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Metadata Manager */}
          <MetadataManager 
            userId={user.id}
            currentMetadata={metadata}
            onMetadataChange={setMetadata}
          />
          
          {/* Web Content Manager */}
          <WebContentManager 
            userId={user.id}
            webContents={webContents}
            onContentChange={setWebContents}
          />
        </div>
      )}
      
      {user && !dbInitialized && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Please initialize the database above to access profile management features.</p>
        </div>
      )}
    </div>
  );
}