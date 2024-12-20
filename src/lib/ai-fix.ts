import { ValidationMessage } from './types';

export interface AiFixSuggestion {
  suggestion: string;
  fix: {
    path: string;
    oldValue: any;
    newValue: any;
  };
  error?: boolean;
}

export class AiFixService {
  private static instance: AiFixService;

  private constructor() {}

  public static getInstance(): AiFixService {
    if (!AiFixService.instance) {
      AiFixService.instance = new AiFixService();
    }
    return AiFixService.instance;
  }

  public async getSuggestion(spec: any, message: ValidationMessage): Promise<AiFixSuggestion> {
    try {
      // Extract path from message
      const path = message.path?.replace('#/', '') || '';
      const pathParts = path.split('/');
      const method = pathParts[pathParts.length - 1];
      const endpoint = pathParts.slice(0, -1).join('/');

      // Get current operation
      const operation = this.getValueAtPath(spec, path);

      // Handle authentication errors
      if (message.message.includes('requires authentication')) {
        // Check for existing security schemes
        const availableSchemes = spec.components?.securitySchemes ? Object.keys(spec.components.securitySchemes) : [];
        const securityScheme = availableSchemes.length > 0 ? availableSchemes[0] : 'BearerAuth';

        // Create new operation with security
        const newOperation = {
          ...operation,
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

        return {
          suggestion: `Add ${securityScheme} security requirement to ${method.toUpperCase()} ${endpoint}`,
          fix: {
            path,
            oldValue: operation,
            newValue: newOperation
          }
        };
      }

      // Return a fallback suggestion
      return {
        suggestion: "No automatic fix available for this error",
        fix: {
          path,
          oldValue: operation,
          newValue: operation
        },
        error: true
      };
    } catch (error) {
      console.error("Failed to get AI suggestion:", error);
      return {
        suggestion: "Failed to generate fix",
        fix: {
          path: message.path || "",
          oldValue: {},
          newValue: {}
        },
        error: true
      };
    }
  }

  public async applyFix(spec: any, fix: AiFixSuggestion['fix']): Promise<any> {
    try {
      const newSpec = JSON.parse(JSON.stringify(spec));
      this.setValueAtPath(newSpec, fix.path, fix.newValue);
      return newSpec;
    } catch (error) {
      console.error("Failed to apply fix:", error);
      throw error;
    }
  }

  private getValueAtPath(obj: any, path: string): any {
    if (!path) return obj;
    const parts = path.split('/').filter(Boolean);
    let current = obj;
    for (const part of parts) {
      if (!current || typeof current !== 'object') return undefined;
      current = current[part];
    }
    return current;
  }

  private setValueAtPath(obj: any, path: string, value: any): void {
    if (!path) {
      Object.assign(obj, value);
      return;
    }
    const parts = path.split('/').filter(Boolean);
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