import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export async function POST() {
  try {
    // Create a Supabase client
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name) {
            return cookieStore.get(name)?.value;
          },
          set() {}, // No-op since we don't need to set cookies
          remove() {}, // No-op since we don't need to remove cookies
        },
      }
    );

    // Check user authentication
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      // Simple test query to check connection
      await prisma.$queryRaw`SELECT 1`;

      // Create database tables if they don't exist
      // Make sure the uuid-ossp extension is enabled for gen_random_uuid()
      await prisma.$executeRaw`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`;

      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS user_metadata (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID NOT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW(),
          writing_style JSONB NOT NULL,
          hashtag_pattern JSONB NOT NULL,
          emoji_usage JSONB NOT NULL,
          sentence_and_vocab JSONB NOT NULL,
          top_performing_tweets JSONB NOT NULL,
          engagement_trends JSONB NOT NULL
        );
      `;

      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS web_content (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID NOT NULL,
          url TEXT NOT NULL,
          title TEXT NOT NULL,
          description TEXT,
          content TEXT NOT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
      `;

      // Create indexes for better performance
      await prisma.$executeRaw`
        CREATE INDEX IF NOT EXISTS user_metadata_user_id_idx ON user_metadata(user_id);
        CREATE INDEX IF NOT EXISTS web_content_user_id_idx ON web_content(user_id);
      `;

      return NextResponse.json({
        success: true,
        message: "Database initialized successfully",
      });
    } catch (error) {
      console.error("Error initializing database:", error);
      return NextResponse.json(
        {
          success: false,
          error: `Failed to initialize database`,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in database initialization route:", error);
    return NextResponse.json(
      {
        success: false,
        error: `Internal server error: `,
      },
      { status: 500 }
    );
  }
}
