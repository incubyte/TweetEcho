import { createClient } from '@supabase/supabase-js';
import { Database } from './types';

// Create a serverless function to check and initiate database tables if needed
export async function checkDatabaseTables() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase environment variables');
      return;
    }

    const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);

    // Check if the user_metadata table exists
    const { error: metadataQueryError, count: metadataCount } = await supabase
      .from('user_metadata')
      .select('*', { count: 'exact', head: true });

    // Check if the web_content table exists
    const { error: webContentQueryError, count: webContentCount } = await supabase
      .from('web_content')
      .select('*', { count: 'exact', head: true });

    // If we got PostgreSQL errors for "relation does not exist", tables need to be created
    const needsTableCreation =
      (metadataQueryError?.message?.includes('relation "user_metadata" does not exist') ||
       webContentQueryError?.message?.includes('relation "web_content" does not exist'));

    if (needsTableCreation) {
      console.log('Database tables not found. Please run "npm run setup-db" to set up the database.');
      return { tablesExist: false };
    }

    return { tablesExist: true };
  } catch (error) {
    console.error('Error checking database tables:', error);
    return { tablesExist: false, error };
  }
}

// Define the database types for better type safety
export type Database = {
  public: {
    Tables: {
      user_metadata: {
        Row: {
          id: string;
          user_id: string;
          created_at: string;
          updated_at: string;
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
        Insert: {
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
        Update: {
          id?: string;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
          writing_style?: string[];
          hashtag_pattern?: {
            common_hashtags: string[];
            usage_frequency: string;
            positioning: string;
          };
          emoji_usage?: {
            used: boolean;
            common_emojis: string[];
            positioning: string;
            frequency: string;
          };
          sentence_and_vocab?: {
            avg_length_chars: number;
            avg_length_words: number;
            common_structures: string[];
            frequent_words: string[];
          };
          top_performing_tweets?: {
            likes_threshold: number;
            retweets_threshold: number;
            engagement_traits: {
              style: string[];
              length_range: string;
              topics: string[];
            };
          };
          engagement_trends?: {
            best_days: string[];
            best_times: string[];
            hot_topics: string[];
          };
        };
      };
      web_content: {
        Row: {
          id: string;
          user_id: string;
          url: string;
          title: string;
          description: string;
          content: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          url: string;
          title: string;
          description?: string;
          content: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          url?: string;
          title?: string;
          description?: string;
          content?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};