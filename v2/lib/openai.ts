import OpenAI from 'openai';
import { generateUserMetadata } from './metadata-generator';

// Create an OpenAI API client (that uses OpenRouter)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
  baseURL: process.env.OPENAI_BASE_URL,
  defaultHeaders: {
    'HTTP-Referer': 'https://yourapp.com', // Optional, helps OpenRouter track usage
    'X-Title': 'NextJS Demo App' // Optional, helps OpenRouter track usage
  }
});

export async function generatePosts(
  prompt: string, 
  userMetadata: any
): Promise<string[]> {
  try {
    // If userMetadata is a string (user ID), generate metadata first
    if (typeof userMetadata === 'string') {
      userMetadata = await generateUserMetadata(userMetadata, prompt);
    }
    
    // Use the provided metadata to generate personalized posts
    const response = await openai.chat.completions.create({
      model: 'anthropic/claude-3-opus-20240229',
      messages: [
        {
          role: 'system',
          content: `You are a creative writing assistant that generates thought-provoking and engaging social media posts. 
          Generate exactly THREE unique posts based on the user's input topic and metadata profile.
          
          IMPORTANT - Personalize your response based on the user metadata. Consider:
          - Writing style: ${userMetadata.writing_style.join(', ')}
          - Hashtag pattern: ${userMetadata.hashtag_pattern.common_hashtags.join(', ')} (${userMetadata.hashtag_pattern.usage_frequency} frequency, positioned at ${userMetadata.hashtag_pattern.positioning})
          - Emoji usage: ${userMetadata.emoji_usage.used ? 'Yes' : 'No'} (${userMetadata.emoji_usage.common_emojis.join(', ')}, ${userMetadata.emoji_usage.frequency} frequency, positioned at ${userMetadata.emoji_usage.positioning})
          - Sentence style: Average length ${userMetadata.sentence_and_vocab.avg_length_words} words, common structures: ${userMetadata.sentence_and_vocab.common_structures.join(', ')}
          - Top-performing content: ${userMetadata.top_performing_tweets.engagement_traits.style.join(', ')} style, length range ${userMetadata.top_performing_tweets.engagement_traits.length_range}
          - Hot topics: ${userMetadata.engagement_trends.hot_topics.join(', ')}
          
          Each post should be:
          1. Different in style, tone, and perspective
          2. Concise (1-3 sentences only)
          3. Thought-provoking and conversation-starting
          4. Not directly quote or mention the user's exact prompt
          5. Match the user's writing style and preferences from metadata
          
          Return only the three generated posts, each on its own line. Do not include any explanatory text, post numbers, or formatting.`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 800,
      n: 1,
    });

    const content = response.choices[0]?.message.content || '';
    
    // Split the content into three posts
    const posts = content
      .split(/\n+/)
      .filter(line => line.trim())
      .slice(0, 3);
    
    // If we don't have exactly 3 posts, generate default ones
    if (posts.length !== 3) {
      return [
        "What if the conventional wisdom on this topic has been wrong all along?",
        "Sometimes the most valuable insights come from questioning our most basic assumptions.",
        "The intersection of different perspectives often reveals surprising truths."
      ];
    }
    
    return posts;
  } catch (error) {
    console.error('Error generating posts:', error);
    return [
      "What if the conventional wisdom on this topic has been wrong all along?",
      "Sometimes the most valuable insights come from questioning our most basic assumptions.",
      "The intersection of different perspectives often reveals surprising truths."
    ];
  }
}

export async function getMetadata(prompt: string, userId: string = 'user-123') {
  return generateUserMetadata(userId, prompt);
}

export default openai;