import prisma from "@/lib/prisma";
import { UserMetadataInput } from "@/lib/types/prisma";
import { UserMetadata } from "@/lib/supabase/schemas";

/**
 * Gets the latest user metadata for a user
 */
export async function getUserMetadata(userId: string) {
  try {
    const metadata = await prisma.userMetadata.findFirst({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!metadata) return null;

    // Convert Prisma model to our application schema
    return {
      id: metadata.id,
      user_id: metadata.userId,
      created_at: metadata.createdAt.toISOString(),
      updated_at: metadata.updatedAt.toISOString(),
      writing_style: metadata.writingStyle,
      hashtag_pattern: metadata.hashtagPattern,
      emoji_usage: metadata.emojiUsage,
      sentence_and_vocab: metadata.sentenceAndVocab,
      top_performing_tweets: metadata.topPerformingTweets,
      engagement_trends: metadata.engagementTrends,
    } as UserMetadata;
  } catch (error) {
    console.error("Error fetching user metadata:", error);
    throw error;
  }
}

/**
 * Saves new user metadata
 */
export async function saveUserMetadata(metadata: UserMetadata) {
  try {
    console.log("Saving user metadata in service:", metadata);

    // Convert application schema to Prisma input
    const input: UserMetadataInput = {
      userId: metadata.user_id,
      writingStyle: metadata.writing_style,
      hashtagPattern: metadata.hashtag_pattern,
      emojiUsage: metadata.emoji_usage,
      sentenceAndVocab: metadata.sentence_and_vocab,
      topPerformingTweets: metadata.top_performing_tweets,
      engagementTrends: metadata.engagement_trends,
    };

    console.log("Converted to Prisma input:", input);

    // Create new record
    console.log("Creating new record in database...");
    const savedMetadata = await prisma.userMetadata.create({
      data: input,
    });

    console.log("Record created successfully:", savedMetadata);

    // Convert back to application schema
    return {
      id: savedMetadata.id,
      user_id: savedMetadata.userId,
      created_at: savedMetadata.createdAt.toISOString(),
      updated_at: savedMetadata.updatedAt.toISOString(),
      writing_style: savedMetadata.writingStyle,
      hashtag_pattern: savedMetadata.hashtagPattern,
      emoji_usage: savedMetadata.emojiUsage,
      sentence_and_vocab: savedMetadata.sentenceAndVocab,
      top_performing_tweets: savedMetadata.topPerformingTweets,
      engagement_trends: savedMetadata.engagementTrends,
    } as UserMetadata;
  } catch (error) {
    console.error("Error saving user metadata:", error);
    throw error;
  }
}

/**
 * Updates existing user metadata
 */
export async function updateUserMetadata(metadata: UserMetadata) {
  try {
    if (!metadata.id) {
      throw new Error("Cannot update metadata without ID");
    }

    // Convert application schema to Prisma input
    const input: UserMetadataInput = {
      userId: metadata.user_id,
      writingStyle: metadata.writing_style,
      hashtagPattern: metadata.hashtag_pattern,
      emojiUsage: metadata.emoji_usage,
      sentenceAndVocab: metadata.sentence_and_vocab,
      topPerformingTweets: metadata.top_performing_tweets,
      engagementTrends: metadata.engagement_trends,
    };

    // Update record
    const updatedMetadata = await prisma.userMetadata.update({
      where: {
        id: metadata.id,
      },
      data: {
        ...input,
        updatedAt: new Date(),
      },
    });

    // Convert back to application schema
    return {
      id: updatedMetadata.id,
      user_id: updatedMetadata.userId,
      created_at: updatedMetadata.createdAt.toISOString(),
      updated_at: updatedMetadata.updatedAt.toISOString(),
      writing_style: updatedMetadata.writingStyle,
      hashtag_pattern: updatedMetadata.hashtagPattern,
      emoji_usage: updatedMetadata.emojiUsage,
      sentence_and_vocab: updatedMetadata.sentenceAndVocab,
      top_performing_tweets: updatedMetadata.topPerformingTweets,
      engagement_trends: updatedMetadata.engagementTrends,
    } as UserMetadata;
  } catch (error) {
    console.error("Error updating user metadata:", error);
    throw error;
  }
}

/**
 * Deletes user metadata by ID
 */
export async function deleteUserMetadata(id: string) {
  try {
    await prisma.userMetadata.delete({
      where: {
        id,
      },
    });
    return true;
  } catch (error) {
    console.error("Error deleting user metadata:", error);
    throw error;
  }
}
