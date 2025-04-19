import OpenAI from 'openai';

// Create an OpenAI API client (that uses OpenRouter)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
  baseURL: process.env.OPENAI_BASE_URL,
  defaultHeaders: {
    'HTTP-Referer': 'https://yourapp.com', // Optional, helps OpenRouter track usage
    'X-Title': 'NextJS Demo App' // Optional, helps OpenRouter track usage
  }
});

export async function generatePosts(prompt: string): Promise<string[]> {
  try {
    const response = await openai.chat.completions.create({
      model: 'anthropic/claude-3-opus-20240229',
      messages: [
        {
          role: 'system',
          content: 'You are a creative writing assistant. Generate two unique, creative, and engaging social media posts based on the user\'s input. Make the posts different in style and tone. Each post should be concise (1-3 sentences only) and suitable for a social platform. Return only the generated posts, nothing else.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 400,
      n: 1, // We'll parse two posts from one response
    });

    const content = response.choices[0]?.message.content || '';
    
    // Split the content into two posts
    const posts = content
      .split(/\n+/)
      .filter(line => line.trim())
      .slice(0, 2);
    
    // If we don't have exactly 2 posts, generate default ones
    if (posts.length !== 2) {
      return [
        `Reflecting on "${prompt}" today. What are your thoughts?`,
        `Just pondering about ${prompt}. Would love to hear other perspectives!`
      ];
    }
    
    return posts;
  } catch (error) {
    console.error('Error generating posts:', error);
    return [
      `Reflecting on "${prompt}" today. What are your thoughts?`,
      `Just pondering about ${prompt}. Would love to hear other perspectives!`
    ];
  }
}

export default openai;