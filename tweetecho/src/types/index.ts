/**
 * User profile information
 */
export interface UserProfile {
  id: string;
  name: string;
  twitterHandle: string;
  avatar?: string;
  preferredStyle?: TweetStyle;
}

/**
 * Tweet style options
 */
export type TweetStyle = 'informative' | 'humorous' | 'professional';

/**
 * Generated tweet suggestion
 */
export interface TweetSuggestion {
  id: string;
  content: string;
}

/**
 * Form data for tweet generation
 */
export interface TweetGenerationFormData {
  topic: string;
  tweetStyle?: TweetStyle;
}

/**
 * Response from the generate tweets API
 */
export interface GenerateTweetsResponse {
  suggestions: TweetSuggestion[];
}

/**
 * Response from the publish tweet API
 */
export interface PublishTweetResponse {
  success: boolean;
  message: string;
  publishedAt: string;
  tweetUrl: string;
} 