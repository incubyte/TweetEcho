import { NextRequest, NextResponse } from 'next/server';
import * as webContentService from '@/lib/services/web-content.service';
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
        async get(name) {
          const cookie = await cookieStore.get(name);
          return cookie?.value;
        },
        set() {}, // No-op
        remove() {}, // No-op
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// GET - Get user web content
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const url = searchParams.get('url');

    // Only allow fetching own content
    if (userId && userId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // If URL is provided, get specific content
    if (url) {
      const content = await webContentService.getWebContentByUrl(userId || user.id, url);
      
      if (!content) {
        // Return 204 No Content instead of null
        return new NextResponse(null, { status: 204 });
      }
      
      return NextResponse.json(content);
    }

    // Otherwise get all content for the user
    const contents = await webContentService.getUserWebContent(userId || user.id);
    
    if (!contents || contents.length === 0) {
      // Return empty array with 204 status to indicate no content exists yet
      return new NextResponse(JSON.stringify([]), { 
        status: 204,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return NextResponse.json(contents);
  } catch (error: any) {
    console.error('Error getting web content:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get web content' },
      { status: 500 }
    );
  }
}

// POST - Create new web content
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    
    // Ensure the user can only create content for themselves
    if (data.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const content = await webContentService.saveWebContent(data);
    return NextResponse.json(content);
  } catch (error: any) {
    console.error('Error saving web content:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to save web content' },
      { status: 500 }
    );
  }
}

// DELETE - Delete web content
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

    await webContentService.deleteWebContent(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting web content:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete web content' },
      { status: 500 }
    );
  }
}