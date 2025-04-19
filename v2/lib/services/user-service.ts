import prisma from '@/lib/prisma';

/**
 * Initialize a new user in the database
 * Creates default empty records for a new user
 */
export async function initializeUser(userId: string): Promise<boolean> {
  try {
    console.log(`Initializing user ${userId}`);
    
    // Check if user metadata already exists
    const existingMetadata = await prisma.userMetadata.findFirst({
      where: { userId }
    });
    
    // If metadata exists, user is already initialized
    if (existingMetadata) {
      console.log(`User ${userId} already has metadata - no initialization needed`);
      return true;
    }
    
    // Create default user metadata
    await prisma.userMetadata.create({
      data: {
        userId: userId,
        writingStyle: ["conversational", "friendly", "informative"],
        hashtagPattern: {
          common_hashtags: ["#tech", "#news", "#innovation"],
          hashtags_per_post: 2,
          placement: "end"
        },
        emojiUsage: {
          frequency: "moderate",
          common_emojis: ["👍", "🙂", "🚀"],
          placement: "throughout"
        },
        sentenceAndVocab: {
          avg_sentence_length: 15,
          preferred_sentence_types: ["statement", "question"],
          vocabulary_level: "general",
          recurring_phrases: ["Thanks for sharing", "Interesting point"]
        },
        topPerformingTweets: {
          topics: ["technology", "current_events", "personal_updates"],
          formats: ["questions", "lists", "opinions"]
        },
        engagementTrends: {
          hot_topics: ["AI", "climate", "productivity"],
          best_posting_times: ["morning", "evening"],
          engagement_patterns: ["replies", "retweets"]
        }
      }
    });
    
    console.log(`User ${userId} initialized successfully`);
    return true;
  } catch (error) {
    console.error('Error initializing user:', error);
    throw error;
  }
}