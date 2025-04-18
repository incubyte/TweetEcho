'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProfile } from '@/context/ProfileContext';
import PageLayout from '@/components/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { TweetSuggestion, TweetStyle } from '@/types';
import { Progress } from '@/components/ui/progress';

export default function GeneratePage() {
  const router = useRouter();
  const { profile } = useProfile();
  
  const [topic, setTopic] = useState('');
  const [tweetStyle, setTweetStyle] = useState<TweetStyle | undefined>(
    profile?.preferredStyle
  );
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [suggestions, setSuggestions] = useState<TweetSuggestion[]>([]);
  const [selectedTweet, setSelectedTweet] = useState<string | null>(null);

  // Redirect to onboarding if no profile exists
  if (!profile) {
    if (typeof window !== 'undefined') {
      router.push('/onboarding');
    }
    return null;
  }

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!topic) {
      toast.error('Please enter a topic for your tweet');
      return;
    }
    
    setIsGenerating(true);
    setSuggestions([]);
    setSelectedTweet(null);
    
    // Simulate progress for better UX
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 300);
    
    try {
      const response = await fetch('/api/generate-tweets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic,
          twitterHandle: profile.twitterHandle,
          tweetStyle,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate tweets');
      }
      
      const data = await response.json();
      setSuggestions(data.suggestions);
      
      // Complete progress bar
      clearInterval(progressInterval);
      setProgress(100);
      
      // Reset progress after a moment
      setTimeout(() => setProgress(0), 500);
    } catch (error) {
      toast.error('Error generating tweets. Please try again.');
      console.error('Error generating tweets:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectTweet = (tweetId: string) => {
    const selectedSuggestion = suggestions.find(s => s.id === tweetId);
    if (selectedSuggestion) {
      setSelectedTweet(selectedSuggestion.content);
      // Navigate to edit page with the selected tweet content
      router.push(`/edit?content=${encodeURIComponent(selectedSuggestion.content)}`);
    }
  };

  return (
    <PageLayout>
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-center text-3xl font-bold">Generate Tweet Ideas</h1>
        
        <Card className="mb-8">
          <form onSubmit={handleGenerate}>
            <CardHeader>
              <CardTitle>What would you like to tweet about?</CardTitle>
              <CardDescription>
                Enter a topic, and we&apos;ll generate tweet suggestions based on your profile and preferences.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="topic">Topic or Idea</Label>
                <Textarea
                  id="topic"
                  placeholder="E.g., New product launch, Industry news, Personal achievement..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="min-h-24"
                  required
                />
              </div>
              
              <div className="space-y-3">
                <Label>Tweet Style</Label>
                <RadioGroup 
                  value={tweetStyle || 'informative'} 
                  onValueChange={(value) => setTweetStyle(value as TweetStyle)}
                  className="grid grid-cols-1 gap-4 pt-2 md:grid-cols-3"
                >
                  <StyleOption 
                    value="informative" 
                    label="Informative" 
                    description="Educational and insightful"
                    emoji="📊"
                    currentValue={tweetStyle || 'informative'}
                  />
                  <StyleOption 
                    value="humorous" 
                    label="Humorous" 
                    description="Witty and entertaining"
                    emoji="😂"
                    currentValue={tweetStyle || 'informative'}
                  />
                  <StyleOption 
                    value="professional" 
                    label="Professional" 
                    description="Polished and authoritative"
                    emoji="💼"
                    currentValue={tweetStyle || 'informative'}
                  />
                </RadioGroup>
              </div>
            </CardContent>
            
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isGenerating}
              >
                {isGenerating ? 'Generating...' : 'Generate Tweet Ideas'}
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        {/* Progress bar */}
        {isGenerating && (
          <div className="mb-8 space-y-2">
            <Progress value={progress} className="h-2 w-full" />
            <p className="text-center text-sm text-gray-500">
              Analyzing your Twitter style and generating suggestions...
            </p>
          </div>
        )}
        
        {/* Tweet Suggestions */}
        {suggestions.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Choose a Tweet</h2>
            <p className="text-gray-600">
              Select the tweet you like best. You&apos;ll be able to edit it before publishing.
            </p>
            
            <div className="grid gap-4 md:grid-cols-1">
              {suggestions.map((suggestion) => (
                <TweetCard
                  key={suggestion.id}
                  tweet={suggestion}
                  onSelect={handleSelectTweet}
                  isSelected={selectedTweet === suggestion.content}
                  profile={profile}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}

interface StyleOptionProps {
  value: string;
  label: string;
  description: string;
  emoji: string;
  currentValue: string;
}

function StyleOption({ value, label, description, emoji, currentValue }: StyleOptionProps) {
  const isSelected = value === currentValue;
  
  return (
    <div className={`relative rounded-lg border p-4 ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
      <RadioGroupItem 
        value={value} 
        id={`style-${value}`}
        className="absolute right-4 top-4"
      />
      <div className="mb-2 text-2xl">{emoji}</div>
      <Label 
        htmlFor={`style-${value}`}
        className="text-base font-medium"
      >
        {label}
      </Label>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
    </div>
  );
}

interface TweetCardProps {
  tweet: TweetSuggestion;
  onSelect: (id: string) => void;
  isSelected: boolean;
  profile: any;
}

function TweetCard({ tweet, onSelect, isSelected, profile }: TweetCardProps) {
  return (
    <Card className={`cursor-pointer transition-all hover:shadow-md ${isSelected ? 'border-blue-500 ring-1 ring-blue-500' : ''}`}>
      <CardContent className="pt-6">
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
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-bold">{profile.name}</span>
              <span className="text-sm text-gray-500">@{profile.twitterHandle}</span>
            </div>
            <p className="mt-1 whitespace-pre-wrap text-gray-900">{tweet.content}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t bg-gray-50">
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => onSelect(tweet.id)}
        >
          Select & Edit
        </Button>
      </CardFooter>
    </Card>
  );
} 