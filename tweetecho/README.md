# TweetEcho

TweetEcho is an AI-powered Twitter assistant that analyzes users' past Twitter performance to generate personalized content that matches their unique voice and maximizes engagement.

![TweetEcho Logo](https://ui-avatars.com/api/?name=TweetEcho&background=1DA1F2&color=fff&size=220)

## 🌟 Features

- **Personal Style Analysis**: Analyzes tone, hashtag usage, and emoji frequency
- **Performance Analytics Integration**: Learns from your best-performing content
- **Voice Matching Technology**: Generates content that sounds like you
- **Topic-Based Tweet Suggestions**: Get multiple options for every topic
- **Engagement Optimization**: Maximize your Twitter impact

## 🚀 Quick Start

### Prerequisites

- Node.js 18.0.0 or higher
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/tweetecho.git
cd tweetecho
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Start the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📱 Usage Guide

### 1. Onboarding

- Create your profile with your name and Twitter handle
- Select your preferred tweet style (Informative, Humorous, or Professional)

### 2. Generate Tweets

- Enter a topic or idea for your tweet
- Select the style for this specific tweet (or use your default)
- View and select from multiple AI-generated tweet suggestions

### 3. Edit & Publish

- Refine your selected tweet with the built-in editor
- See a real-time preview of how your tweet will look
- Publish directly to your Twitter account

## 🔧 Tech Stack

- **Frontend**: Next.js, TypeScript, TailwindCSS
- **UI Components**: shadcn/ui (based on Radix UI)
- **Testing**: Jest
- **API**: Next.js API Routes

## 🧪 Testing

Run tests with:

```bash
npm test
# or
yarn test
```

## 🛠️ Project Structure

```
tweetecho/
├── src/
│   ├── app/           # Next.js App Router
│   │   ├── api/       # API routes
│   │   ├── onboarding/# User profile setup
│   │   ├── generate/  # Tweet generation
│   │   └── edit/      # Tweet editing & publishing
│   ├── components/    # UI components
│   │   ├── ui/        # shadcn/ui components
│   │   └── ...        # Custom components
│   ├── context/       # React context providers
│   ├── lib/           # Utility functions
│   └── types/         # TypeScript type definitions
├── public/            # Static assets
└── ...                # Config files
```

## 🌐 Environment Variables

No environment variables are required to run the development build. In a production environment, you would need to configure Twitter API credentials.

## 📝 License

This project was created during a 2-day AI Hackathon and is available for educational purposes.

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Radix UI](https://www.radix-ui.com/)
