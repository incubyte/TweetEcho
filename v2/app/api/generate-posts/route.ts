import { NextRequest, NextResponse } from 'next/server';
import { generatePosts, getMetadata } from '@/lib/openai';
import { getUserMetadata } from '@/lib/supabase/api';

export async function POST(request: NextRequest) {
  try {
    const { prompt, userId, useStoredMetadata = true } = await request.json();
    
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt is required and must be a string' },
        { status: 400 }
      );
    }

    // Check if we should use stored metadata (if available)
    let userMetadata;
    let needsMetadataGeneration = true;
    
    if (useStoredMetadata && userId) {
      // Try to get stored metadata
      const storedMetadata = await getUserMetadata(userId);
      if (storedMetadata) {
        userMetadata = storedMetadata;
        needsMetadataGeneration = false;
      }
    }
    
    // Generate metadata if needed
    if (needsMetadataGeneration) {
      userMetadata = await getMetadata(prompt, userId || 'user-123');
    }
    
    // Generate posts using the metadata
    const posts = await generatePosts(prompt, userMetadata);
    
    return NextResponse.json({ 
      posts,
      metadata: userMetadata,
      usedStoredMetadata: !needsMetadataGeneration
    });
  } catch (error) {
    console.error('Error in generate-posts route:', error);
    return NextResponse.json(
      { error: 'Failed to generate posts' },
      { status: 500 }
    );
  }
}