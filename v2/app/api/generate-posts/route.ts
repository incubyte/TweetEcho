import { NextRequest, NextResponse } from 'next/server';
import { generatePosts, getMetadata } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const { prompt, userId } = await request.json();
    
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt is required and must be a string' },
        { status: 400 }
      );
    }

    // Generate user metadata first
    const userMetadata = await getMetadata(prompt, userId || 'user-123');
    
    // Generate posts using the metadata
    const posts = await generatePosts(prompt, userId || 'user-123');
    
    return NextResponse.json({ 
      posts,
      metadata: userMetadata
    });
  } catch (error) {
    console.error('Error in generate-posts route:', error);
    return NextResponse.json(
      { error: 'Failed to generate posts' },
      { status: 500 }
    );
  }
}