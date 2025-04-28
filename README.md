# TweetEcho

TweetEcho is an AI-powered social media content generation platform that creates authentic posts matching your unique writing style and voice. The platform features two main approaches to generate personalized content:

1. **URL Analysis**: Enter links to your existing web content (articles, blog posts, or other online writing), and TweetEcho will scrape and analyze the data to identify your writing style, tone, emoji usage, and hashtag patterns. Based on this analysis, it generates tailored social media posts that maintain your authentic voice.

2. **Direct Text Input**: Alternatively, you can paste your knowledge base or text directly into the platform. TweetEcho analyzes this content to understand your writing style and generates optimized social media posts ready for publishing.

After generating content, you can publish posts directly to multiple social media platforms from within the application, streamlining your content workflow.

Key features include:
- Web scraping to analyze your existing online content
- Text-based content analysis of your knowledge base
- AI identification of your unique writing style, tone, and patterns
- Personalized content generation that maintains your authentic voice


## Technologies
- **Frontend**: Next.js (App Router), TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Authentication**: Supabase Auth (Google OAuth integration)
- **Database**: Supabase PostgreSQL
- **API**: Next.js API routes
- **AI Integration**: Using OpenAI SDK with Claude
- **Web Scrapping**: FireCrawl
- **Deployment**: Vercel

## Tools
- **Lovable**: AI-powered design review and optimization tool for creating more intuitive and user-friendly interfaces.
- **Cursor**: An AI-powered code editor that enhances developer productivity through intelligent code assistance.
- **Claude Code**: Anthropic's Claude AI model optimized for understanding and generating high-quality code.
- **ChatGPT**: OpenAI's large language model for natural language processing and text generation tasks.
- **V0.dev**: Vercel's AI-powered UI component generation platform for rapidly creating React components.
- **FireCrawl**: Web scraping tool for efficiently extracting and analyzing content from online sources.
- **OpenAI SDK**: Software development kit for integrating OpenAI's API services into applications.

## How to Run Locally
1. **Clone the repository**
   ```
   git clone https://github.com/incubyte/TweetEcho.git
   cd TweetEcho/v2
   ```

2. **Install dependencies**
   ```
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   Rename `.env.example` to `.env.local` and fill all env values

4. **Run the development server**
   ```
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Access the application**
   Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Takeaways

