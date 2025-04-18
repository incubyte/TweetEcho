'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useProfile } from '@/context/ProfileContext';
import PageLayout from '@/components/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export default function EditPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { profile } = useProfile();
  
  const [tweetContent, setTweetContent] = useState('');
  const [characterCount, setCharacterCount] = useState(0);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const MAX_CHARACTERS = 280;

  // Redirect to onboarding if no profile exists
  useEffect(() => {
    if (!profile && typeof window !== 'undefined') {
      router.push('/onboarding');
    }
    
    // Get the content from the URL
    const content = searchParams.get('content');
    if (content) {
      setTweetContent(decodeURIComponent(content));
      setCharacterCount(decodeURIComponent(content).length);
    }
  }, [profile, router, searchParams]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = e.target.value;
    setTweetContent(content);
    setCharacterCount(content.length);
  };

  const handlePublish = async () => {
    if (!tweetContent) {
      toast.error('Please enter tweet content');
      return;
    }
    
    if (characterCount > MAX_CHARACTERS) {
      toast.error(`Tweet is too long. Please reduce to ${MAX_CHARACTERS} characters.`);
      return;
    }
    
    setIsPublishing(true);
    
    try {
      const response = await fetch('/api/publish-tweet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: tweetContent
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to publish tweet');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setIsSuccess(true);
        toast.success('Tweet published successfully!');
      } else {
        throw new Error(data.error || 'Failed to publish tweet');
      }
    } catch (error) {
      toast.error('Error publishing tweet. Please try again.');
      console.error('Error publishing tweet:', error);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleGenerateNew = () => {
    router.push('/generate');
  };

  return (
    <PageLayout>
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 text-center text-3xl font-bold">
          {isSuccess ? 'Tweet Published!' : 'Edit Your Tweet'}
        </h1>
        
        {isSuccess ? (
          <SuccessCard handleGenerateNew={handleGenerateNew} />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Fine-tune your tweet</CardTitle>
              <CardDescription>
                Make any edits to perfect your tweet before publishing.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label htmlFor="tweetContent" className="text-sm font-medium">
                    Tweet Content
                  </label>
                  <span className={`text-sm ${characterCount > MAX_CHARACTERS ? 'text-red-500 font-bold' : 'text-gray-500'}`}>
                    {characterCount}/{MAX_CHARACTERS}
                  </span>
                </div>
                <Textarea
                  id="tweetContent"
                  placeholder="Enter your tweet content..."
                  value={tweetContent}
                  onChange={handleContentChange}
                  className="min-h-32"
                  required
                />
              </div>
              
              <TweetPreview content={tweetContent} profile={profile} />
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:space-x-4 sm:space-y-0">
              <Button 
                variant="outline" 
                className="w-full sm:w-auto"
                onClick={handleGenerateNew}
              >
                Generate New Ideas
              </Button>
              
              <Button 
                className="w-full sm:w-auto"
                onClick={handlePublish}
                disabled={isPublishing || characterCount > MAX_CHARACTERS || characterCount === 0}
              >
                {isPublishing ? 'Publishing...' : 'Publish Tweet'}
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </PageLayout>
  );
}

function TweetPreview({ content, profile }: { content: string; profile: any }) {
  if (!profile) return null;
  
  return (
    <div className="rounded-lg border border-gray-200 p-4">
      <h3 className="mb-4 text-sm font-medium text-gray-500">Preview</h3>
      
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 overflow-hidden rounded-full bg-gray-200">
          {profile.avatar ? (
            <img src={profile.avatar} alt={profile.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-blue-500 text-white">
              {profile.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold">{profile.name}</span>
            <span className="text-sm text-gray-500">@{profile.twitterHandle}</span>
          </div>
          
          <p className="mt-1 whitespace-pre-wrap text-gray-900">{content || 'Your tweet will appear here...'}</p>
          
          <div className="mt-4 flex gap-6 text-gray-500">
            <div className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
              </svg>
              <span className="text-xs">0</span>
            </div>
            
            <div className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 2.1l4 4-4 4"/>
                <path d="M3 12.2v-2a4 4 0 0 1 4-4h12.8M7 21.9l-4-4 4-4"/>
                <path d="M21 11.8v2a4 4 0 0 1-4 4H4.2"/>
              </svg>
              <span className="text-xs">0</span>
            </div>
            
            <div className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              <span className="text-xs">0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SuccessCard({ handleGenerateNew }: { handleGenerateNew: () => void }) {
  return (
    <Card className="border-green-100 bg-green-50">
      <CardContent className="pt-6 text-center">
        <div className="mb-4 text-center text-5xl">🎉</div>
        <h2 className="mb-2 text-2xl font-bold text-green-700">Tweet Published Successfully!</h2>
        <p className="mb-6 text-green-600">Your tweet has been published to your Twitter account.</p>
        
        <div className="mx-auto max-w-md space-y-4">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={handleGenerateNew}
          >
            Generate Another Tweet
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 