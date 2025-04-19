'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { WebContent } from '@/lib/supabase/schemas';
import { saveWebContent, deleteWebContent } from '@/lib/supabase/api';
import { extractKeyInformation } from '@/lib/firecrawl';

interface WebContentManagerProps {
  userId: string;
  webContents: WebContent[];
  onContentChange: (webContents: WebContent[]) => void;
}

export default function WebContentManager({ 
  userId, 
  webContents, 
  onContentChange 
}: WebContentManagerProps) {
  const [url, setUrl] = useState('');
  const [isScrapingUrl, setIsScrapingUrl] = useState(false);
  const [selectedContent, setSelectedContent] = useState<WebContent | null>(null);

  const scrapeNewContent = async () => {
    if (!userId || !url.trim()) return;
    
    setIsScrapingUrl(true);
    try {
      // Extract content from the URL
      const scrapedContent = await extractKeyInformation(url);
      
      // Parse the structured content
      const contentParts = scrapedContent.split('\n\n');
      const title = contentParts[0]?.replace('Title: ', '') || 'No title';
      const description = contentParts[1]?.replace('Description: ', '') || 'No description';
      const content = contentParts.slice(2).join('\n\n').replace('Content: ', '');
      
      // Create the web content object
      const webContent: WebContent = {
        user_id: userId,
        url: url,
        title,
        description,
        content,
      };
      
      // Save to Supabase
      const savedContent = await saveWebContent(webContent);
      
      if (savedContent) {
        // Update the list
        const newContents = [savedContent, ...webContents.filter(c => c.id !== savedContent.id)];
        onContentChange(newContents);
        setUrl('');
      }
    } catch (error) {
      console.error('Error scraping URL:', error);
      alert(`Failed to scrape URL: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsScrapingUrl(false);
    }
  };

  const deleteContent = async (contentId: string) => {
    if (!contentId) return;
    
    try {
      // Delete from Supabase
      await deleteWebContent(contentId);
      
      // Update the list
      const newContents = webContents.filter(c => c.id !== contentId);
      onContentChange(newContents);
    } catch (error) {
      console.error('Error deleting web content:', error);
      alert('Failed to delete content. Please try again.');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Sources</CardTitle>
        <CardDescription>
          Manage your saved web content for AI-powered insights
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="Enter a webpage URL to analyze..."
              className="flex-1 rounded-md border border-[hsl(var(--border))] bg-transparent px-3 py-2 text-sm shadow-sm focus:border-[hsl(var(--ring))] focus:outline-none focus:ring-1 focus:ring-[hsl(var(--ring))]"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <Button 
              onClick={scrapeNewContent}
              disabled={isScrapingUrl || !url.trim()}
              size="sm"
            >
              {isScrapingUrl ? "Processing..." : "Add"}
            </Button>
          </div>
        </div>
        
        {webContents.length > 0 ? (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Saved Sources</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {webContents.map((content) => (
                <div 
                  key={content.id} 
                  className="border border-[hsl(var(--border))] rounded-md p-3 text-sm"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <h5 className="font-medium truncate">{content.title}</h5>
                      <p className="text-xs text-muted-foreground truncate">{content.url}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0 rounded-full"
                      onClick={() => deleteContent(content.id!)}
                    >
                      &times;
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-1">
                    {content.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No content sources saved yet. Add a URL to get started.
          </p>
        )}
        
        {selectedContent && (
          <div className="border-t border-[hsl(var(--border))] pt-3 mt-3">
            <h4 className="text-sm font-medium mb-2">{selectedContent.title}</h4>
            <div className="text-xs text-muted-foreground bg-[hsla(var(--muted),0.5)] rounded p-2 max-h-24 overflow-y-auto">
              {selectedContent.content.substring(0, 200)}... 
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}