import { ValidationMessage } from "./types";

export interface FixChange {
  type: "add" | "update" | "remove";
  path: string;
  oldValue?: any;
  newValue?: any;
}

export interface FixResult {
  fixed: boolean;
  spec: any;
  changes: FixChange[];
}

export class AutoFixer {
  private fixers: Record<string, (spec: any, message: ValidationMessage) => any> = {};

  constructor() {
    this.registerDefaultFixers();
  }

  private registerDefaultFixers() {
    // Security Rules
    this.fixers['security/require-auth'] = (spec: any, message: ValidationMessage) => {
      const newSpec = JSON.parse(JSON.stringify(spec));
      
      // Ensure components and securitySchemes exist
      if (!newSpec.components) {
        newSpec.components = {};
      }
      if (!newSpec.components.securitySchemes) {
        newSpec.components.securitySchemes = {};
      }

      // Add BearerAuth if no security schemes exist
      if (Object.keys(newSpec.components.securitySchemes).length === 0) {
        newSpec.components.securitySchemes.BearerAuth = {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        };
      }

      // Get the first available security scheme
      const availableSchemes = Object.keys(newSpec.components.securitySchemes);
      const defaultScheme = availableSchemes[0];

      // Extract path and method from the message
      const pathMatch = message.path?.match(/^#\/paths\/(.+)\/(\w+)$/);
      if (!pathMatch) return newSpec;

      const [, pathPart, method] = pathMatch;
      const path = pathPart.replace(/~1/g, '/');

      // Ensure paths exist
      if (!newSpec.paths) {
        newSpec.paths = {};
      }

      // Ensure path exists
      if (!newSpec.paths[path]) {
        newSpec.paths[path] = {};
      }

      // Ensure method exists
      if (!newSpec.paths[path][method]) {
        newSpec.paths[path][method] = {};
      }

      // Add security requirement to operation
      newSpec.paths[path][method].security = [
        { [defaultScheme]: [] }
      ];

      // Add global security if none exists
      if (!newSpec.security) {
        newSpec.security = [
          { [defaultScheme]: [] }
        ];
      }

      return newSpec;
    };

    // ... other fixers ...
  }

  public canFix(message: ValidationMessage): boolean {
    return !!this.fixers[message.ruleId];
  }

  public fix(spec: any, message: ValidationMessage): any {
    const fixer = this.fixers[message.ruleId];
    if (!fixer) {
      throw new Error(`No fixer available for rule: ${message.ruleId}`);
    }

    try {
      console.log(`Applying fix for rule: ${message.ruleId}`, {
        message,
        spec: JSON.stringify(spec)
      });

      const result = fixer(spec, message);
      
      console.log('Fix applied successfully:', {
        rule: message.ruleId,
        result: JSON.stringify(result)
      });

      return result;
    } catch (error) {
      console.error(`Failed to apply fix for rule ${message.ruleId}:`, error);
      throw error;
    }
  }

  public fixAll(spec: any, messages: ValidationMessage[]): any {
    return messages.reduce((currentSpec, message) => {
      if (this.canFix(message)) {
        try {
          return this.fix(currentSpec, message);
        } catch (error) {
          console.error(`Skipping fix for rule ${message.ruleId} due to error:`, error);
          return currentSpec;
        }
      }
      return currentSpec;
    }, JSON.parse(JSON.stringify(spec)));
  }
} 