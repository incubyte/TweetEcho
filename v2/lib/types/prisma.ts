// UserMetadata types
export type WritingStyle = string[];

export type HashtagPattern = {
  common_hashtags: string[];
  usage_frequency: string;
  positioning: string;
};

export type EmojiUsage = {
  used: boolean;
  common_emojis: string[];
  positioning: string;
  frequency: string;
};

export type SentenceAndVocab = {
  avg_length_chars: number;
  avg_length_words: number;
  common_structures: string[];
  frequent_words: string[];
};

export type EngagementTraits = {
  style: string[];
  length_range: string;
  topics: string[];
};

export type TopPerformingTweets = {
  likes_threshold: number;
  retweets_threshold: number;
  engagement_traits: EngagementTraits;
};

export type EngagementTrends = {
  best_days: string[];
  best_times: string[];
  hot_topics: string[];
};

export type UserMetadataInput = {
  userId: string;
  writingStyle: WritingStyle;
  hashtagPattern: HashtagPattern;
  emojiUsage: EmojiUsage;
  sentenceAndVocab: SentenceAndVocab;
  topPerformingTweets: TopPerformingTweets;
  engagementTrends: EngagementTrends;
};

export type WebContentInput = {
  userId: string;
  url: string;
  title: string;
  description?: string;
  content: string;
};
