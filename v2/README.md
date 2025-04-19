# TweetEcho - AI-Powered Social Media Content Generator

This application uses AI to generate personalized social media content based on your unique content profile and interests. It leverages Supabase for authentication and database storage, OpenRouter for AI content generation, and Firecrawl for web content analysis.

## Getting Started

### Environment Setup

1. Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# OpenAI/OpenRouter Configuration
OPENAI_API_KEY=your_openrouter_api_key
OPENAI_BASE_URL=https://openrouter.ai/api/v1

# Firecrawl API Key
FIRECRAWL_API_KEY=your_firecrawl_api_key
```

### Database Setup

This application uses Prisma ORM to work with the Supabase database. Setup is simple:

1. Create a `.env.local` file with your Supabase credentials (see `.env.example`).

2. Log in to the application and click the "Initialize Database" button in the dashboard. This will create the necessary tables automatically.

That's it! No complex migrations or setup scripts required.

Optional commands:
```bash
# Generate Prisma client (done automatically in build)
npm run prisma:generate

# View/edit your data with Prisma Studio
npm run prisma:studio
```

### Running the Application

Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Database Schema

This application uses Prisma with Supabase PostgreSQL for data storage:

### Prisma Schema

```prisma
model UserMetadata {
  id                  String   @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  userId              String   @map("user_id") @db.Uuid
  createdAt           DateTime @default(now()) @map("created_at") @db.Timestamptz
  updatedAt           DateTime @default(now()) @map("updated_at") @db.Timestamptz
  writingStyle        Json     @map("writing_style")
  hashtagPattern      Json     @map("hashtag_pattern")
  emojiUsage          Json     @map("emoji_usage")
  sentenceAndVocab    Json     @map("sentence_and_vocab")
  topPerformingTweets Json     @map("top_performing_tweets")
  engagementTrends    Json     @map("engagement_trends")

  @@map("user_metadata")
}

model WebContent {
  id          String   @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  userId      String   @map("user_id") @db.Uuid
  url         String
  title       String
  description String?
  content     String
  createdAt   DateTime @default(now()) @map("created_at") @db.Timestamptz
  updatedAt   DateTime @default(now()) @map("updated_at") @db.Timestamptz

  @@map("web_content")
}
```

The schema uses the following mapping between Prisma and PostgreSQL:

1. `UserMetadata`: Stores user content profiles for personalized content generation.
2. `WebContent`: Stores web content analyzed by users for content generation.

All database operations are performed through Prisma client, which provides type safety and query building capabilities.

## Features

- **Google Authentication**: Sign in with your Google account
- **Content Profile Generation**: Create a personalized content profile based on your interests
- **Web Content Analysis**: Analyze web pages to inform content generation
- **AI-Powered Content Generation**: Generate engaging social media posts based on your profile
- **Content Management**: Save and manage your content profiles and web sources

## Technology Stack

- **Next.js**: React framework for building the web application
- **TypeScript**: Type-safe JavaScript
- **Prisma**: ORM for database access and type safety
- **Supabase**: Authentication and PostgreSQL database
- **OpenRouter**: AI model access for content generation
- **Firecrawl**: Web scraping API for content analysis
- **ShadCN UI**: Component library for UI elements
- **Tailwind CSS**: Utility-first CSS framework

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Supabase Documentation](https://supabase.io/docs)
- [OpenRouter Documentation](https://openrouter.ai/docs)
- [Firecrawl Documentation](https://firecrawl.dev/docs)
- [ShadCN UI Documentation](https://ui.shadcn.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
