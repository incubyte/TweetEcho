import { NextRequest, NextResponse } from "next/server";
import { extractKeyInformation } from "@/lib/firecrawl";
import { generateUserMetadata } from "@/lib/metadata-generator";
import { generatePosts } from "@/lib/openai";
import { getUserMetadata, saveWebContent } from "@/lib/supabase/api";

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
      // Try to get stored metadata
      const storedMetadata = await getUserMetadata(userId);
      if (storedMetadata) {
        userMetadata = storedMetadata;
        needsMetadataGeneration = false;
      }
    }
    
    // Generate metadata if needed
    if (needsMetadataGeneration) {
      userMetadata = await generateUserMetadata(
        userId || "user-123",
        webContent
      );
    }

    // Generate posts using the metadata and web content
    const posts = await generatePosts(webContent, userMetadata);
    
    // Save the web content to the database if the user is logged in
    if (userId) {
      const webContentObj = {
        user_id: userId,
        url: url,
        title: title,
        description: description,
        content: webContent
      };
      
      try {
        await saveWebContent(webContentObj);
      } catch (error) {
        console.error('Error saving web content:', error);
        // Continue even if saving fails
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
