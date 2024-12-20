import { OpenRouterMessage, sendMessageToOpenRouter } from "./openrouter-config";
import { ValidationMessage } from "./types";

export interface AiFixSuggestion {
  suggestion: string;
  fix: {
    path: string;
    oldValue: any;
    newValue: any;
  };
  preview?: string;
  error?: boolean;
}

export class AiFixService {
  private static instance: AiFixService;
  private securitySchemes = ['oauth2', 'apiKey', 'http', 'openIdConnect'];

  private constructor() {}

  public static getInstance(): AiFixService {
    if (!AiFixService.instance) {
      AiFixService.instance = new AiFixService();
    }
    return AiFixService.instance;
  }

  public async getSuggestion(spec: any, message: ValidationMessage): Promise<AiFixSuggestion> {
    try {
      console.log('Building prompt for message:', {
        messageId: message.id,
        type: message.type,
        path: message.path
      });

      // Pre-process the spec to understand the context
      const context = this.analyzeContext(spec, message);
      const prompt = this.buildPrompt(spec, message, context);
      console.log('Generated prompt:', prompt);

      const messages: OpenRouterMessage[] = [{
        role: 'user',
        content: prompt
      }];

      const response = await sendMessageToOpenRouter(messages);
      console.log('Raw response from OpenRouter:', response);

      const suggestion = this.parseResponse(response, context);
      console.log('Parsed suggestion:', suggestion);

      // Validate the suggestion before returning
      const validatedSuggestion = await this.validateSuggestion(spec, suggestion);
      console.log('Validated suggestion:', validatedSuggestion);

      return validatedSuggestion;
    } catch (error) {
      console.error("Failed to get AI suggestion:", error);
      return this.getFallbackSuggestion(spec, message);
    }
  }

  private async validateSuggestion(spec: any, suggestion: AiFixSuggestion): Promise<AiFixSuggestion> {
    try {
      if (!suggestion.fix || !suggestion.fix.path) {
        throw new Error("Invalid suggestion: missing fix or path");
      }

      // Try to apply the fix to a copy of the spec
      const specCopy = JSON.parse(JSON.stringify(spec));
      const fixedSpec = await this.applyFix(specCopy, suggestion.fix);

      // Generate a preview of the changes
      const preview = this.generatePreview(suggestion.fix.oldValue, suggestion.fix.newValue);

      return {
        ...suggestion,
        preview
      };
    } catch (error) {
      console.error("Failed to validate suggestion:", error);
      return {
        ...suggestion,
        error: true,
        suggestion: `Failed to validate fix: ${error.message}`
      };
    }
  }

  private generatePreview(oldValue: any, newValue: any): string {
    try {
      const oldStr = typeof oldValue === 'object' ? JSON.stringify(oldValue, null, 2) : String(oldValue);
      const newStr = typeof newValue === 'object' ? JSON.stringify(newValue, null, 2) : String(newValue);

      return `${newStr}`;
    } catch (error) {
      console.error("Failed to generate preview:", error);
      return "Failed to generate preview";
    }
  }

  private buildPrompt(spec: any, message: ValidationMessage, context: any): string {
    const currentValue = this.getValueAtPath(spec, message.path || "");
    
    // Get more context for security-related issues
    let securityContext = '';
    if (message.message.includes('authentication') || message.message.includes('security')) {
      securityContext = `
Security Context:
- Available security schemes: ${context.availableSecuritySchemes.length ? context.availableSecuritySchemes.join(', ') : 'none'}
- Global security: ${context.globalSecurity ? JSON.stringify(context.globalSecurity, null, 2) : 'not defined'}
- Path security: ${context.pathSecurity ? JSON.stringify(context.pathSecurity, null, 2) : 'not defined'}
- Components.securitySchemes: ${spec.components?.securitySchemes ? JSON.stringify(spec.components.securitySchemes, null, 2) : 'not defined'}`;
    }
    
    let prompt = `Fix the following OpenAPI validation error:

Error Details:
- Message: ${message.message}
- Path: ${message.path || "root"}
- Type: ${message.type}
${message.context?.schemaName ? `- Schema: ${message.context.schemaName}` : ""}
${message.context?.method ? `- Method: ${message.context.method}` : ""}

Current value at path:
\`\`\`json
${JSON.stringify(currentValue, null, 2)}
\`\`\`

${securityContext}

Relevant part of the OpenAPI spec:
\`\`\`json
${JSON.stringify(this.getRelevantSpecPart(spec, message.path), null, 2)}
\`\`\`

Provide a fix in the following JSON format:
{
  "suggestion": "A clear explanation of what needs to be fixed",
  "fix": {
    "path": "${message.path || ""}",
    "oldValue": <current value>,
    "newValue": <corrected value>
  }
}

Important:
1. The fix should follow OpenAPI best practices
2. Maintain consistency with the rest of the specification
3. The path should be in OpenAPI format (use ~1 for forward slashes)
4. The newValue should be a complete, valid OpenAPI object for the path
5. Security schemes should match existing ones if available
6. For security fixes:
   - Use existing security schemes if available
   - Add BearerAuth scheme if no schemes exist
   - Add global security if none exists
   - Ensure components.securitySchemes is defined

Example for security fix:
{
  "suggestion": "Add security requirement using existing BearerAuth scheme",
  "fix": {
    "path": "#/paths/~1api~1resource/get",
    "oldValue": {},
    "newValue": {
      "security": [
        {
          "BearerAuth": []
        }
      ]
    }
  }
}`;

    return prompt;
  }

  private parseResponse(content: string, context: any): AiFixSuggestion {
    try {
      // Clean up the response content by removing code blocks and extra whitespace
      const cleanContent = content
        .replace(/```json\s*|\s*```/g, '')
        .replace(/\\n/g, '\n')
        .trim();
      
      // Try to find JSON objects in the response
      const jsonMatches = cleanContent.match(/\{[\s\S]*?\}/g) || [];
      
      // Try each matched JSON object
      for (const match of jsonMatches) {
        try {
          const parsed = JSON.parse(match);
          
          // Validate the response format
          if (
            typeof parsed === 'object' &&
            parsed !== null &&
            typeof parsed.suggestion === 'string' &&
            typeof parsed.fix === 'object' &&
            parsed.fix !== null &&
            typeof parsed.fix.path === 'string'
          ) {
            // Clean up the path format
            const path = parsed.fix.path.replace(/~1/g, '/').replace(/^#\//, '');
            
            // Normalize security schemes if present
            const newValue = this.normalizeSecurityScheme(parsed.fix.newValue, context);
            
            return {
              suggestion: parsed.suggestion,
              fix: {
                path: path,
                oldValue: parsed.fix.oldValue || {},
                newValue: newValue || {}
              }
            };
          }
        } catch (innerError) {
          console.warn("Failed to parse JSON match:", innerError);
          continue;
        }
      }

      // If no valid JSON was found in the matches, try parsing the entire content
      try {
        const lastAttempt = JSON.parse(cleanContent);
        if (
          typeof lastAttempt === 'object' &&
          lastAttempt !== null &&
          typeof lastAttempt.suggestion === 'string' &&
          typeof lastAttempt.fix === 'object' &&
          lastAttempt.fix !== null &&
          typeof lastAttempt.fix.path === 'string'
        ) {
          const path = lastAttempt.fix.path.replace(/~1/g, '/').replace(/^#\//, '');
          const newValue = this.normalizeSecurityScheme(lastAttempt.fix.newValue, context);
          
          return {
            suggestion: lastAttempt.suggestion,
            fix: {
              path: path,
              oldValue: lastAttempt.fix.oldValue || {},
              newValue: newValue || {}
            }
          };
        }
      } catch (finalError) {
        console.warn("Failed to parse entire content as JSON:", finalError);
      }

      // If we get here, we couldn't find a valid suggestion
      throw new Error("No valid suggestion format found in response");
    } catch (error) {
      console.error("Failed to parse AI response:", error);
      throw error;
    }
  }

  private analyzeContext(spec: any, message: ValidationMessage): any {
    const context: any = {};

    // Analyze security schemes
    if (spec.components?.securitySchemes) {
      context.availableSecuritySchemes = Object.keys(spec.components.securitySchemes);
    } else {
      context.availableSecuritySchemes = [];
    }

    // Analyze global security
    if (Array.isArray(spec.security)) {
      context.globalSecurity = spec.security;
    }

    // Analyze path-level security
    if (message.path) {
      const pathParts = message.path.split('/');
      const method = pathParts[pathParts.length - 1];
      const path = pathParts.slice(0, -1).join('/');
      const operation = this.getValueAtPath(spec, path);
      
      if (operation) {
        context.pathSecurity = operation.security;
        context.method = method;
        context.path = path;
      }
    }

    return context;
  }

  private normalizeSecurityScheme(value: any, context: any): any {
    if (!value || typeof value !== 'object') return value;

    // If dealing with security configuration
    if (value.security && Array.isArray(value.security)) {
      // Use existing security schemes if available
      if (context.availableSecuritySchemes.length > 0) {
        return {
          ...value,
          security: value.security.map((scheme: any) => {
            const schemeKey = Object.keys(scheme)[0];
            if (!context.availableSecuritySchemes.includes(schemeKey)) {
              return { [context.availableSecuritySchemes[0]]: [] };
            }
            return scheme;
          })
        };
      }
      
      // If no security schemes exist, add BearerAuth
      if (!context.components?.securitySchemes) {
        context.components = {
          ...context.components,
          securitySchemes: {
            BearerAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT'
            }
          }
        };
      }
      
      return {
        ...value,
        security: [{ BearerAuth: [] }]
      };
    }

    return value;
  }

  public async applyFix(spec: any, fix: AiFixSuggestion["fix"]): Promise<any> {
    try {
      console.log('Applying fix:', {
        path: fix.path,
        oldValue: fix.oldValue,
        newValue: fix.newValue
      });

      const newSpec = JSON.parse(JSON.stringify(spec));
      this.setValueAtPath(newSpec, fix.path, fix.newValue);

      console.log('Fix applied successfully');
      return newSpec;
    } catch (error) {
      console.error("Failed to apply AI fix:", error);
      throw error;
    }
  }

  private getRelevantSpecPart(spec: any, path?: string): any {
    if (!path) return spec;
    
    const parts = path.split(".");
    // Get parent object for context
    if (parts.length > 1) {
      const parentPath = parts.slice(0, -1).join(".");
      return this.getValueAtPath(spec, parentPath);
    }
    return this.getValueAtPath(spec, path);
  }

  private getFallbackSuggestion(spec: any, message: ValidationMessage): AiFixSuggestion {
    const currentValue = this.getValueAtPath(spec, message.path || "");
    let suggestion: string;
    let newValue: any = currentValue;

    // Improved fallback suggestions based on message type
    if (message.message.includes("requires authentication")) {
      suggestion = "Add security requirement to the endpoint";
      
      // Check for existing security schemes
      const availableSchemes = spec.components?.securitySchemes ? Object.keys(spec.components.securitySchemes) : [];
      const securityScheme = availableSchemes.length > 0 ? availableSchemes[0] : 'BearerAuth';
      
      newValue = {
        ...currentValue,
        security: [{ [securityScheme]: [] }]
      };

      // If no security schemes exist, add BearerAuth
      if (availableSchemes.length === 0) {
        if (!spec.components) spec.components = {};
        if (!spec.components.securitySchemes) spec.components.securitySchemes = {};
        
        spec.components.securitySchemes.BearerAuth = {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        };
      }

      // Add global security if none exists
      if (!spec.security) {
        spec.security = [{ [securityScheme]: [] }];
      }
    } else if (message.message.includes("required")) {
      suggestion = "Add the required property with a default value based on its type.";
      newValue = typeof currentValue === "object" ? {} : "";
    } else if (message.message.includes("type")) {
      suggestion = "Update the value to match the expected type.";
      newValue = typeof currentValue === "string" ? "" : {};
    } else if (message.message.includes("format")) {
      suggestion = "Update the value to match the required format.";
      newValue = "";
    } else {
      suggestion = "Review and update the value according to the OpenAPI specification.";
    }

    return {
      suggestion,
      fix: {
        path: message.path || "",
        oldValue: currentValue,
        newValue
      }
    };
  }

  private getValueAtPath(obj: any, path: string): any {
    if (!path) return obj;
    
    // Handle OpenAPI path format
    if (path.startsWith('#/')) {
      path = path.substring(2);
    }
    
    // Split path and handle empty segments and URL-encoded segments
    const parts = path.split('/').filter(p => p !== '').map(p => p.replace(/~1/g, '/'));
    
    let current = obj;
    for (const part of parts) {
      if (!current || typeof current !== 'object') {
        return {};
      }
      current = current[part];
    }
    
    return current || {};
  }

  private setValueAtPath(obj: any, path: string, value: any): void {
    if (!path) {
      Object.assign(obj, value);
      return;
    }

    // Handle OpenAPI path format
    if (path.startsWith('#/')) {
      path = path.substring(2);
    }

    // Split path and handle empty segments and URL-encoded segments
    const parts = path.split('/').filter(p => p !== '').map(p => p.replace(/~1/g, '/'));
    const lastPart = parts.pop()!;
    
    let current = obj;
    for (const part of parts) {
      if (!current[part] || typeof current[part] !== 'object') {
        current[part] = {};
      }
      current = current[part];
    }
    
    current[lastPart] = value;
  }
}

export const aiFixService = AiFixService.getInstance(); 