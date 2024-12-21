import { ValidationMessage } from "./types";

interface AiFixSuggestion {
  suggestion: string;
  fix: string;
  diff?: string;
  error?: string;
}

export class AiFixService {
  async getSuggestion(spec: any, message: ValidationMessage): Promise<AiFixSuggestion> {
    try {
      // Construct a clear prompt for the LLM
      const prompt = `
Fix the following OpenAPI validation error:

Error: ${message.message}
Path: ${message.path}
${message.context ? `Context: ${JSON.stringify(message.context, null, 2)}` : ''}

Current specification:
\`\`\`yaml
${JSON.stringify(spec, null, 2)}
\`\`\`

Please provide:
1. A brief explanation of the fix
2. The complete corrected YAML content
3. A diff showing the changes (with - for removed lines and + for added lines)

Format your response as:
EXPLANATION: <brief explanation>
CORRECTED_CONTENT: <complete corrected yaml>
DIFF: <diff with +/- lines>
`;

      console.log('=== LLM Input ===');
      console.log('Message:', message);
      console.log('Spec:', spec);
      console.log('Prompt:', prompt);

      // For now, return a mock response - in production this would call the actual LLM
      const mockResponse = this.getMockResponse(message, spec);
      
      console.log('=== LLM Output ===');
      console.log('Response:', mockResponse);
      
      return {
        suggestion: mockResponse.explanation,
        fix: mockResponse.correctedContent,
        diff: mockResponse.diff
      };
    } catch (error) {
      console.error('Error getting AI suggestion:', error);
      return {
        suggestion: 'Failed to generate suggestion',
        fix: '',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async applyFix(spec: any, fix: string): Promise<any> {
    try {
      console.log('=== Applying Fix ===');
      console.log('Original spec:', spec);
      console.log('Fix to apply:', fix);

      // Parse the fix string as YAML/JSON
      const result = JSON.parse(fix);
      
      console.log('=== Result ===');
      console.log('Fixed spec:', result);
      
      return result;
    } catch (error) {
      console.error('Error applying fix:', error);
      throw error;
    }
  }

  private getMockResponse(message: ValidationMessage, spec: any) {
    // Example mock response for authentication requirement
    if (message.message.includes('requires authentication')) {
      const correctedContent = {
        ...spec,
        components: {
          ...spec.components,
          securitySchemes: {
            BearerAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT'
            }
          }
        },
        security: [{ BearerAuth: [] }]
      };

      return {
        explanation: 'Adding Bearer authentication to secure the endpoint',
        correctedContent: JSON.stringify(correctedContent, null, 2),
        diff: `
- paths:
-   /hello:
-     get:
-       summary: Hello World
+ paths:
+   /hello:
+     get:
+       summary: Hello World
+       security:
+         - BearerAuth: []
+ components:
+   securitySchemes:
+     BearerAuth:
+       type: http
+       scheme: bearer
+       bearerFormat: JWT
+ security:
+   - BearerAuth: []`
      };
    }

    // Default mock response
    return {
      explanation: 'No automatic fix available for this error',
      correctedContent: JSON.stringify(spec, null, 2),
      diff: ''
    };
  }
}

export const aiFixService = new AiFixService(); 