'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserMetadata } from '@/lib/supabase/schemas';
import { saveUserMetadata, deleteUserMetadata } from '@/lib/supabase/api';
import { generateUserMetadata } from '@/lib/metadata-generator';

interface MetadataManagerProps {
  userId: string;
  currentMetadata: UserMetadata | null;
  onMetadataChange: (metadata: UserMetadata | null) => void;
}

export default function MetadataManager({ 
  userId, 
  currentMetadata, 
  onMetadataChange 
}: MetadataManagerProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const generateNewMetadata = async () => {
    if (!userId) return;
    
    setIsGenerating(true);
    try {
      // Generate new metadata using a default topic if no existing metadata
      const topic = currentMetadata ? 
        currentMetadata.engagement_trends.hot_topics.join(', ') : 
        'social media, content creation, digital marketing';
      
      // If regenerating, pass the current metadata
      const newMetadata = await generateUserMetadata(
        userId, 
        topic, 
        currentMetadata
      );
      
      // Save to Supabase
      const savedMetadata = await saveUserMetadata(newMetadata);
      
      // Log the result for debugging
      console.log('Saved metadata result:', savedMetadata);
      
      if (!savedMetadata) {
        throw new Error('Failed to save metadata to database');
      }
      
      // Update parent component
      onMetadataChange(savedMetadata);
    } catch (error) {
      console.error('Error generating new metadata:', error);
      alert('Failed to generate new metadata. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const deleteMetadata = async () => {
    if (!userId || !currentMetadata?.id) return;
    
    setIsDeleting(true);
    try {
      // Delete from Supabase
      await deleteUserMetadata(currentMetadata.id);
      
      // Update parent component
      onMetadataChange(null);
    } catch (error) {
      console.error('Error deleting metadata:', error);
      alert('Failed to delete metadata. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Persona</CardTitle>
        <CardDescription>
          Your content persona helps generate personalized content
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentMetadata ? (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Your content persona was created{' '}
              {new Date(currentMetadata.created_at || '').toLocaleDateString()}
            </p>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={generateNewMetadata}
                disabled={isGenerating}
              >
                {isGenerating ? "Regenerating..." : "Regenerate Persona"}
              </Button>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={deleteMetadata}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete Persona"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              You don't have a content persona yet. 
              Generate one to get personalized content recommendations.
            </p>
            <Button 
              onClick={generateNewMetadata}
              disabled={isGenerating}
            >
              {isGenerating ? "Generating..." : "Generate Persona"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}