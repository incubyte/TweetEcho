import { NextRequest, NextResponse } from "next/server";
import { extractKeyInformation } from "@/lib/firecrawl";
import { generateUserMetadata } from "@/lib/metadata-generator";
import { generatePosts } from "@/lib/openai";
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Helper function to check if user is authenticated
async function checkUserAuth(userIdFromRequest: string | null) {
  try {
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
    
    // If we have a user and it matches the requested userId, it's authorized
    if (user && userIdFromRequest && user.id === userIdFromRequest) {
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Auth check error:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { url, userId, useStoredMetadata = true } = await request.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "URL is required and must be a string" },
        { status: 400 }
      );
    }

    // Validate the URL
    try {
      new URL(url);
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      );
    }

    // Extract key information from the webpage
    const webContent = await extractKeyInformation(url);
    
    // Parse the web content to get title and description
    const contentParts = webContent.split('\n\n');
    const title = contentParts[0]?.replace('Title: ', '') || 'No title';
    const description = contentParts[1]?.replace('Description: ', '') || 'No description';
    
    // Check if we should use stored metadata (if available)
    let userMetadata;
    let needsMetadataGeneration = true;
    
    if (useStoredMetadata && userId) {
      // Try to get metadata through a direct query rather than using the API
      try {
        // This is server-side, so we should import the service directly
        const { getUserMetadata } = await import('@/lib/services/user-metadata.service');
        const storedMetadata = await getUserMetadata(userId);
        if (storedMetadata) {
          userMetadata = storedMetadata;
          needsMetadataGeneration = false;
        }
      } catch (error) {
        console.error('Error fetching metadata from service:', error);
        // Continue with metadata generation
      }
    }
    
    // Generate metadata if needed
    if (needsMetadataGeneration) {
      // Generate new metadata
      const newMetadata = await generateUserMetadata(
        userId || "user-123",
        webContent
      );
      
      // If there's a logged-in user, save or update the metadata
      if (userId) {
        const isAuthenticated = await checkUserAuth(userId);
        if (isAuthenticated) {
          try {
            // Import user metadata service
            const { getUserMetadata, saveUserMetadata, updateUserMetadata } = 
              await import('@/lib/services/user-metadata.service');
            
            // Check if user has existing metadata
            const existingMetadata = await getUserMetadata(userId);
            
            if (existingMetadata) {
              // Update existing metadata with new values
              console.log('Updating existing metadata with newly generated data');
              const updateData = {
                ...existingMetadata,
                writing_style: newMetadata.writing_style,
                hashtag_pattern: newMetadata.hashtag_pattern,
                emoji_usage: newMetadata.emoji_usage,
                sentence_and_vocab: newMetadata.sentence_and_vocab,
                top_performing_tweets: newMetadata.top_performing_tweets,
                engagement_trends: newMetadata.engagement_trends
              };
              
              userMetadata = await updateUserMetadata(updateData);
            } else {
              // Save new metadata
              console.log('Saving newly generated metadata');
              newMetadata.user_id = userId;
              userMetadata = await saveUserMetadata(newMetadata);
            }
          } catch (error) {
            console.error('Error saving/updating metadata:', error);
            // Use the generated metadata directly if saving fails
            userMetadata = newMetadata;
          }
        } else {
          userMetadata = newMetadata;
        }
      } else {
        userMetadata = newMetadata;
      }
    }

    // Generate posts using the metadata and web content
    const posts = await generatePosts(webContent, userMetadata);
    
    // Save the web content to the database if the user is logged in and authenticated
    if (userId) {
      // Check if the user is authenticated
      const isAuthenticated = await checkUserAuth(userId);
      
      if (isAuthenticated) {
        const webContentObj = {
          user_id: userId,
          url: url,
          title: title,
          description: description,
          content: webContent
        };
        
        try {
          // Use the service directly
          const { saveWebContent } = await import('@/lib/services/web-content.service');
          await saveWebContent(webContentObj);
        } catch (error) {
          console.error('Error saving web content:', error);
          // Continue even if saving fails
        }
      } else {
        console.log('User not authenticated, skipping web content save');
      }
    }

    return NextResponse.json({
      posts,
      metadata: userMetadata,
      sourceContent: webContent,
      title: title,
      description: description,
      usedStoredMetadata: !needsMetadataGeneration
    });
  } catch (error: any) {
    console.error("Error in scrape route:", error);
    return NextResponse.json(
      { error: error.message || "Failed to scrape and process URL" },
      { status: 500 }
    );
  }
}
