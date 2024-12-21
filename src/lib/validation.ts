import { OpenAPIV3 } from 'openapi-types';
import { parse } from 'yaml';
import { AutoFixer } from './auto-fix';
import { RuleEngine } from './custom-rules';
import { defaultRules } from './default-rules';
import { RuleConfigManager } from './rule-config';
import { ValidationMessage, ValidationOptions, ValidationResult } from './types';

export class ValidationManager {
  private ruleEngine: RuleEngine;
  private configManager: RuleConfigManager;
  private autoFixer: AutoFixer;

  constructor(configFile?: string) {
    this.ruleEngine = new RuleEngine();
    this.configManager = new RuleConfigManager(configFile);
    this.autoFixer = new AutoFixer();

    // Register default rules
    defaultRules.forEach(rule => {
      this.ruleEngine.addRule(rule);
      const config = this.configManager.getRuleConfig(rule.id);
      if (config) {
        this.ruleEngine.configureRule(rule.id, config);
      }
    });
  }

  async validateContent(content: string, options: ValidationOptions = {}): Promise<ValidationResult> {
    try {
      const spec = parse(content) as OpenAPIV3.Document;
      const messages: ValidationMessage[] = [];

      // Run custom rules validation
      if (options.customRules !== false) {
        const customResults = this.ruleEngine.validateSpec(spec);
        messages.push(...customResults);
      }

      // Run standard OpenAPI validation if enabled
      if (options.standardRules !== false) {
        // TODO: Implement standard OpenAPI validation
      }

      // Filter messages based on severity
      const filteredMessages = messages.filter(msg => {
        if (!options.severity) return true;
        return msg.type === options.severity;
      });

      // Include source content if requested
      if (options.includeSource) {
        filteredMessages.forEach(msg => {
          if (msg.path) {
            try {
              // Extract relevant portion of the spec based on the path
              const source = this.extractSource(spec, msg.path);
              if (source) {
                msg.source = source;
              }
            } catch (error) {
              console.warn(`Failed to extract source for path ${msg.path}:`, error);
            }
          }
        });
      }

      // Include fix suggestions if requested
      if (options.includeSuggestions) {
        filteredMessages.forEach(msg => {
          const suggestions = this.generateSuggestions(spec, msg);
          if (suggestions.length > 0) {
            msg.suggestions = suggestions;
          }
        });
      }

      return {
        messages: filteredMessages,
        valid: filteredMessages.length === 0
      };
    } catch (error) {
      return {
        messages: [{
          id: 'parse-error',
          type: 'error',
          message: `Failed to parse OpenAPI specification: ${error.message}`
        }],
        valid: false
      };
    }
  }

  private extractSource(spec: any, path: string): string | undefined {
    try {
      const parts = path.split('.');
      let current = spec;
      for (const part of parts) {
        if (current[part] === undefined) return undefined;
        current = current[part];
      }
      return JSON.stringify(current, null, 2);
    } catch {
      return undefined;
    }
  }

  private generateSuggestions(spec: any, message: ValidationMessage): string[] {
    const suggestions: string[] = [];
    
    // Generate suggestions based on the message type and context
    if (message.context?.schemaName) {
      const pascalCase = this.toPascalCase(message.context.schemaName);
      if (pascalCase !== message.context.schemaName) {
        suggestions.push(`Rename schema to "${pascalCase}"`);
      }
    }

    if (message.context?.path && message.context?.method) {
      if (!spec.paths?.[message.context.path]?.[message.context.method]?.security) {
        suggestions.push("Add security requirement: { \"BearerAuth\": [] }");
      }
    }

    return suggestions;
  }

  private toPascalCase(str: string): string {
    return str
      .split(/[-_\s]+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('');
  }

  async fixContent(content: string): Promise<string> {
    try {
      // Parse YAML
      const spec = parse(content) as OpenAPIV3.Document;

      // Apply fixes
      const fixedSpec = this.ruleEngine.fixSpec(spec);

      // Convert back to YAML
      return JSON.stringify(fixedSpec, null, 2);
    } catch (error) {
      throw new Error(`Failed to fix content: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  getRuleEngine(): RuleEngine {
    return this.ruleEngine;
  }

  getConfigManager(): RuleConfigManager {
    return this.configManager;
  }

  getAutoFixer(): AutoFixer {
    return this.autoFixer;
  }

  addCustomRule(rule: OpenAPIV3.Document): void {
    // In a real implementation, this would validate and compile the rule
    // For now, we'll just log that it's not implemented
    console.warn('Adding custom rules is not implemented yet');
  }

  exportConfig(): string {
    return this.configManager.exportConfig();
  }

  importConfig(configJson: string): void {
    this.configManager.importConfig(configJson);
    
    // Update rule engine with new configs
    Object.entries(this.configManager.getAllConfigs()).forEach(([ruleId, config]) => {
      this.ruleEngine.configureRule(ruleId, config);
    });
  }
}

// Create a singleton instance for global use
export const validationManager = new ValidationManager();

// Export convenience functions that use the singleton
export async function validateContent(content: string, options: ValidationOptions = {}) {
  try {
    // First, check YAML syntax
    const spec = parse(content) as OpenAPIV3.Document;

    const messages: ValidationMessage[] = [];

    // Run custom rules validation
    const customResults = validationManager.getRuleEngine().validateSpec(spec);
    messages.push(...customResults);

    // Run standard OpenAPI validation
    const standardResults = await validateOpenAPI(content);
    messages.push(...standardResults.messages);

    // Run linting for basic OpenAPI structure
    const lintResults = lintOpenAPI(content);
    messages.push(...lintResults.messages);

    // Filter messages based on severity if specified
    const filteredMessages = options.severity 
      ? messages.filter(msg => msg.type === options.severity)
      : messages;

    return {
      messages: filteredMessages,
      parsedSpec: spec,
      valid: filteredMessages.length === 0
    };
  } catch (error) {
    console.error('Validation error:', error);
    return {
      messages: [{
        id: 'parse-error',
        type: 'error',
        message: `Failed to parse OpenAPI specification: ${error instanceof Error ? error.message : 'Unknown error'}`
      }],
      parsedSpec: null,
      valid: false
    };
  }
}

export async function fixContent(content: string) {
  return validationManager.fixContent(content);
}

export function exportValidationConfig() {
  return validationManager.exportConfig();
}

export function importValidationConfig(configJson: string) {
  return validationManager.importConfig(configJson);
}
