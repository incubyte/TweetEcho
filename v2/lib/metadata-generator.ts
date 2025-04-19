import OpenAI from 'openai';

// Create an OpenAI API client (that uses OpenRouter)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
  baseURL: process.env.OPENAI_BASE_URL,
  defaultHeaders: {
    'HTTP-Referer': 'https://yourapp.com',
    'X-Title': 'NextJS Demo App'
  }
});

interface UserMetadata {
  user_id: string;
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
}

export async function generateUserMetadata(userId: string, topic: string): Promise<UserMetadata> {
  try {
    const response = await openai.chat.completions.create({
      model: 'anthropic/claude-3-opus-20240229',
      messages: [
        {
          role: 'system',
          content: `You are an AI assistant that generates user metadata profiles for content personalization. 
          Based on the provided topic, generate a realistic user metadata profile in JSON format.
          This profile should include styles, patterns, and preferences that would make generated content more engaging.
          The metadata should be varied, realistic, and tailored to optimize engagement on the given topic.
          Return ONLY valid JSON with no explanations.`
        },
        {
          role: 'user',
          content: `Generate a detailed user metadata profile for content related to the topic: "${topic}". 
          Include writing style, hashtag patterns, emoji usage, sentence structures, and engagement trends.
          Use this template structure:
          {
            "user_id": "${userId}",
            "writing_style": ["style1", "style2"],
            "hashtag_pattern": {
              "common_hashtags": ["hashtag1", "hashtag2"],
              "usage_frequency": "low/moderate/high",
              "positioning": "start/middle/end"
            },
            "emoji_usage": {
              "used": true/false,
              "common_emojis": ["emoji1", "emoji2"],
              "positioning": "start/middle/end",
              "frequency": "low/moderate/high"
            },
            "sentence_and_vocab": {
              "avg_length_chars": 100-200,
              "avg_length_words": 15-30,
              "common_structures": ["question", "statement", "etc"],
              "frequent_words": ["word1", "word2", "word3"]
            },
            "top_performing_tweets": {
              "likes_threshold": 50-500,
              "retweets_threshold": 10-100,
              "engagement_traits": {
                "style": ["style1", "style2"],
                "length_range": "100-200 characters",
                "topics": ["related topic1", "related topic2"]
              }
            },
            "engagement_trends": {
              "best_days": ["day1", "day2"],
              "best_times": ["timerange1", "timerange2"],
              "hot_topics": ["related hot topic1", "related hot topic2"]
            }
          }`
        }
      ],
      temperature: 0.7,
      max_tokens: 800,
      response_format: { type: "json_object" }
    });

    const content = response.choices[0]?.message.content || '';
    return JSON.parse(content);
  } catch (error) {
    console.error('Error generating user metadata:', error);
    // Return default metadata
    return {
      user_id: userId,
      writing_style: ["casual", "informative"],
      hashtag_pattern: {
        common_hashtags: ["#TechTalk", "#Innovation"],
        usage_frequency: "moderate",
        positioning: "end"
      },
      emoji_usage: {
        used: true,
        common_emojis: ["💡", "✨"],
        positioning: "end",
        frequency: "low"
      },
      sentence_and_vocab: {
        avg_length_chars: 140,
        avg_length_words: 22,
        common_structures: ["question", "statement"],
        frequent_words: ["innovation", "discover", "learn"]
      },
      top_performing_tweets: {
        likes_threshold: 100,
        retweets_threshold: 20,
        engagement_traits: {
          style: ["informative", "thought-provoking"],
          length_range: "120-160 characters",
          topics: ["technology trends", "innovation insights"]
        }
      },
      engagement_trends: {
        best_days: ["Tuesday", "Thursday"],
        best_times: ["10am-12pm", "5pm-7pm"],
        hot_topics: ["emerging technology", "industry insights"]
      }
    };
  }
}