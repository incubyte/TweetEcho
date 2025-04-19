import { NextRequest, NextResponse } from 'next/server';
import * as userMetadataService from '@/lib/services/user-metadata.service';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Helper to get the current user
async function getCurrentUser() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set() {}, // No-op
        remove() {}, // No-op
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// GET - Get user metadata
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    // Only allow fetching own metadata or with admin permissions
    if (userId && userId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const metadata = await userMetadataService.getUserMetadata(userId || user.id);
    
    if (!metadata) {
      // Return 204 No Content instead of null to indicate no metadata exists yet
      return new NextResponse(null, { status: 204 });
    }
    
    return NextResponse.json(metadata);
  } catch (error: any) {
    console.error('Error getting user metadata:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get user metadata' },
      { status: 500 }
    );
  }
}

// POST - Create new user metadata
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    console.log('Received metadata POST request:', data);
    
    // Ensure the user can only create metadata for themselves
    if (data.user_id !== user.id) {
      console.error(`User ID mismatch: ${data.user_id} vs ${user.id}`);
      return NextResponse.json({ error: 'Unauthorized - user ID mismatch' }, { status: 403 });
    }

    // Validate metadata structure before saving
    if (!data.writing_style || !Array.isArray(data.writing_style) ||
        !data.hashtag_pattern || typeof data.hashtag_pattern !== 'object' ||
        !data.emoji_usage || typeof data.emoji_usage !== 'object' ||
        !data.sentence_and_vocab || typeof data.sentence_and_vocab !== 'object' ||
        !data.top_performing_tweets || typeof data.top_performing_tweets !== 'object' ||
        !data.engagement_trends || typeof data.engagement_trends !== 'object') {
      console.error('Invalid metadata structure:', data);
      return NextResponse.json({ error: 'Invalid metadata structure' }, { status: 400 });
    }

    console.log('Saving metadata for user:', user.id);
    const metadata = await userMetadataService.saveUserMetadata(data);
    
    if (!metadata) {
      console.error('Failed to save metadata - service returned null');
      return NextResponse.json({ error: 'Failed to save metadata' }, { status: 500 });
    }
    
    console.log('Metadata saved successfully:', metadata);
    return NextResponse.json(metadata);
  } catch (error: any) {
    console.error('Error saving user metadata:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to save user metadata' },
      { status: 500 }
    );
  }
}

// PUT - Update user metadata
export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    
    // Ensure the user can only update their own metadata
    if (data.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const metadata = await userMetadataService.updateUserMetadata(data);
    return NextResponse.json(metadata);
  } catch (error: any) {
    console.error('Error updating user metadata:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update user metadata' },
      { status: 500 }
    );
  }
}

// DELETE - Delete user metadata
export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await userMetadataService.deleteUserMetadata(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting user metadata:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete user metadata' },
      { status: 500 }
    );
  }
}