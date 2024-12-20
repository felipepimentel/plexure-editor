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
  content: `You are an OpenAPI specification expert assistant. Your role is to help fix validation issues in OpenAPI specifications.

When provided with a validation error and the current specification, you will:
1. Analyze the error message and context
2. Determine the appropriate fix
3. Provide a solution in a specific JSON format with:
   - A clear explanation of the fix
   - The exact path to update
   - The old and new values

Always respond with valid JSON in this format:
{
  "suggestion": "Clear explanation of what needs to be fixed",
  "fix": {
    "path": "exact.path.to.update",
    "oldValue": "current value",
    "newValue": "corrected value"
  }
}`
};

export async function sendMessageToOpenRouter(messages: OpenRouterMessage[]): Promise<string> {
  if (!OPENROUTER_API_KEY) {
    console.error('OpenRouter API key is missing. Please set VITE_OPENROUTER_API_KEY in your environment.');
    throw new Error('OpenRouter API key is not configured');
  }

  console.log('Sending message to OpenRouter:', {
    model: defaultModel,
    messagesCount: messages.length,
    firstMessage: messages[0]?.content.substring(0, 100) + '...'
  });

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
        temperature: 0.3, // Lower temperature for more precise responses
        max_tokens: 1000,
        top_p: 0.95,
        stream: false
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenRouter API error:', {
        status: response.status,
        statusText: response.statusText,
        errorData
      });
      throw new Error(`OpenRouter API error: ${response.statusText}\n${JSON.stringify(errorData, null, 2)}`);
    }

    const data: OpenRouterResponse = await response.json();
    
    if (!data.choices?.[0]?.message?.content) {
      console.error('Invalid response from OpenRouter:', data);
      throw new Error('Invalid response format from OpenRouter');
    }

    console.log('Received response from OpenRouter:', {
      id: data.id,
      finishReason: data.choices[0].finish_reason,
      contentPreview: data.choices[0].message.content.substring(0, 100) + '...'
    });

    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenRouter:', error);
    throw error;
  }
} 