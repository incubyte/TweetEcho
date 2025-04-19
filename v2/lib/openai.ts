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
          content: `You are a creative writing assistant that generates thought-provoking and engaging social media posts. 
          Generate exactly THREE unique posts based on the user's input topic. 
          Each post should be:
          1. Different in style, tone, and perspective
          2. Concise (1-3 sentences only)
          3. Thought-provoking and conversation-starting
          4. Not directly quote or mention the user's exact prompt
          5. Suitable for a knowledge-sharing social platform
          
          Return only the three generated posts, each on its own line. Do not include any explanatory text, post numbers, or formatting.`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 600,
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

export default openai;