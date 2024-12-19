export const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || '';
export const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

export interface OpenRouterMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface OpenRouterResponse {
  id: string;
  choices: {
    message: OpenRouterMessage;
    finish_reason: string;
  }[];
}

// Using Mistral-7B-Instruct which is more cost-effective
export const defaultModel = 'mistralai/mistral-7b-instruct';

// System message to help guide the model's behavior
const systemMessage: OpenRouterMessage = {
  role: 'system',
  content: 'You are a helpful assistant in a Swagger/OpenAPI editor application. Help users with their API documentation, provide suggestions for improvements, and assist with OpenAPI-related questions.'
};

export async function sendMessageToOpenRouter(messages: OpenRouterMessage[]): Promise<string> {
  if (!OPENROUTER_API_KEY) {
    throw new Error('OpenRouter API key is not configured');
  }

  // Add system message at the start of the conversation
  const fullMessages = [systemMessage, ...messages];

  try {
    const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Plexure Editor'
      },
      body: JSON.stringify({
        model: defaultModel,
        messages: fullMessages,
        temperature: 0.7, // Add some creativity but keep it mostly focused
        max_tokens: 1000, // Reasonable limit for responses
        top_p: 0.9, // Slightly reduce randomness
        stream: false // Don't stream the response
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`OpenRouter API error: ${response.statusText}\n${JSON.stringify(errorData, null, 2)}`);
    }

    const data: OpenRouterResponse = await response.json();
    return data.choices[0]?.message?.content || 'No response from the assistant.';
  } catch (error) {
    console.error('Error calling OpenRouter:', error);
    return 'Error: Unable to get a response from the assistant. Please try again later.';
  }
} 