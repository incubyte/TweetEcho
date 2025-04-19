import { NextRequest, NextResponse } from "next/server";
import { extractKeyInformation } from "@/lib/firecrawl";
import { generateUserMetadata } from "@/lib/metadata-generator";
import { generatePosts } from "@/lib/openai";

export async function POST(request: NextRequest) {
  try {
    const { url, userId } = await request.json();

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

    // Generate user metadata based on the web content
    const userMetadata = await generateUserMetadata(
      userId || "user-123",
      webContent
    );

    // Generate posts using the metadata and web content
    const posts = await generatePosts(webContent, userId || "user-123");

    return NextResponse.json({
      posts,
      metadata: userMetadata,
      sourceContent: webContent,
    });
  } catch (error: any) {
    console.error("Error in scrape route:", error);
    return NextResponse.json(
      { error: error.message || "Failed to scrape and process URL" },
      { status: 500 }
    );
  }
}
