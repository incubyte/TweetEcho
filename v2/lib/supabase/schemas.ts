export type UserMetadata = {
  id?: string;
  user_id: string;
  created_at?: string;
  updated_at?: string;
  writing_style: string[];
  hashtag_pattern: {
    common_hashtags: string[];
    usage_frequency: string;
    positioning: string;
  };
  emoji_usage: {
    used: boolean;
    common_emojis: string[];
    positioning: string;
    frequency: string;
  };
  sentence_and_vocab: {
    avg_length_chars: number;
    avg_length_words: number;
    common_structures: string[];
    frequent_words: string[];
  };
  top_performing_tweets: {
    likes_threshold: number;
    retweets_threshold: number;
    engagement_traits: {
      style: string[];
      length_range: string;
      topics: string[];
    };
  };
  engagement_trends: {
    best_days: string[];
    best_times: string[];
    hot_topics: string[];
  };
};

export type WebContent = {
  id?: string;
  user_id: string;
  url: string;
  title: string;
  description: string;
  content: string;
  created_at?: string;
  updated_at?: string;
};