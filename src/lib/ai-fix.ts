import { parse as parseYaml, stringify as stringifyYaml } from 'yaml';
import { ValidationMessage } from "./types";

interface AiFixSuggestion {
  suggestion: string;
  diff: string;
  error?: string;
}

export class AiFixService {
  async getSuggestion(yamlContent: string | any, message: ValidationMessage): Promise<AiFixSuggestion> {
    try {
      // If yamlContent is not a string, stringify it
      const currentYaml = typeof yamlContent === 'string' ? yamlContent : stringifyYaml(yamlContent);
      
      // Construct a direct prompt for the LLM
      const prompt = `Fix OpenAPI validation error:
${message.message}
Path: ${message.path}

Current YAML:
${currentYaml}

Return only the fixed YAML content.`;

      console.log('=== LLM Input ===\n', prompt);

      // For now, return a mock response - in production this would call the actual LLM
      const { suggestion, diff } = this.getMockResponse(message, currentYaml);
      
      console.log('=== LLM Output ===\n', suggestion);
      
      return {
        suggestion,
        diff
      };
    } catch (error) {
      console.error('Error getting AI suggestion:', error);
      throw error;
    }
  }

  private getMockResponse(message: ValidationMessage, currentYaml: string): { suggestion: string; diff: string } {
    // Example mock response for authentication requirement
    if (message.message.includes('requires authentication')) {
      const spec = parseYaml(currentYaml);
      const correctedSpec = {
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

      const suggestion = stringifyYaml(correctedSpec);
      
      // Create a proper unified diff
      const diff = this.createUnifiedDiff(currentYaml, suggestion);

      return {
        suggestion,
        diff
      };
    }

    // Default mock response - no changes
    return {
      suggestion: currentYaml,
      diff: ''
    };
  }

  private createUnifiedDiff(original: string, modified: string): string {
    const originalLines = original.split('\n');
    const modifiedLines = modified.split('\n');
    
    // Find the first different line
    let firstDiff = 0;
    while (firstDiff < originalLines.length && firstDiff < modifiedLines.length 
      && originalLines[firstDiff] === modifiedLines[firstDiff]) {
      firstDiff++;
    }
    
    // Find the last different line, searching backwards
    let lastOriginalDiff = originalLines.length - 1;
    let lastModifiedDiff = modifiedLines.length - 1;
    while (lastOriginalDiff > firstDiff && lastModifiedDiff > firstDiff 
      && originalLines[lastOriginalDiff] === modifiedLines[lastModifiedDiff]) {
      lastOriginalDiff--;
      lastModifiedDiff--;
    }
    
    // Create the diff header
    const diffLines = [
      `@@ -${firstDiff + 1},${lastOriginalDiff - firstDiff + 1} +${firstDiff + 1},${lastModifiedDiff - firstDiff + 1} @@`
    ];
    
    // Add context before (up to 3 lines)
    const contextBefore = Math.max(0, firstDiff - 3);
    for (let i = contextBefore; i < firstDiff; i++) {
      diffLines.push(' ' + originalLines[i]);
    }
    
    // Add the changes
    for (let i = firstDiff; i <= lastOriginalDiff; i++) {
      if (i < originalLines.length) {
        diffLines.push('-' + originalLines[i]);
      }
    }
    
    for (let i = firstDiff; i <= lastModifiedDiff; i++) {
      if (i < modifiedLines.length) {
        diffLines.push('+' + modifiedLines[i]);
      }
    }
    
    // Add context after (up to 3 lines)
    const contextAfter = Math.min(originalLines.length, lastOriginalDiff + 4);
    for (let i = lastOriginalDiff + 1; i < contextAfter; i++) {
      diffLines.push(' ' + originalLines[i]);
    }
    
    return diffLines.join('\n');
  }
}

export const aiFixService = new AiFixService(); 