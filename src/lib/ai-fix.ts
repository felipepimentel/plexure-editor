import { diffLines } from 'diff';
import { ValidationMessage } from "./types";

interface AiFixSuggestion {
  suggestion: string;
  error?: string;
  diff?: string;
}

export const aiFixService = {
  async getSuggestion(currentContent: string, message: ValidationMessage): Promise<AiFixSuggestion> {
    try {
      console.log('=== LLM Input ===\n', `Fix OpenAPI validation error:
${message.message}
Path: ${message.path}

Current YAML:
${currentContent}

Return only the fixed YAML content.`);

      // Simulated LLM response for this example
      const fixedContent = `openapi: 3.0.0
info:
  title: Sample API
  description: A sample API to demonstrate OpenAPI features
  version: 1.0.0
servers:
  - url: https://api.example.com/v1
    description: Production server
paths:
  /hello:
    get:
      summary: Hello World
      description: Returns a greeting message
      responses:
        "200":
          description: Successful response
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                    example: Hello, World!
components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
security:
  - BearerAuth: []`;

      console.log('=== LLM Output ===\n', fixedContent);

      // Generate a proper diff
      const differences = diffLines(currentContent, fixedContent);
      const diff = differences.map(part => {
        if (part.added) {
          return part.value.split('\n').map(line => line ? `+${line}` : '').join('\n');
        }
        if (part.removed) {
          return part.value.split('\n').map(line => line ? `-${line}` : '').join('\n');
        }
        return part.value.split('\n').map(line => line ? ` ${line}` : '').join('\n');
      }).join('');

      return {
        suggestion: fixedContent,
        diff
      };
    } catch (error) {
      console.error('Failed to get AI suggestion:', error);
      return {
        suggestion: currentContent,
        error: 'Failed to get AI suggestion'
      };
    }
  }
}; 