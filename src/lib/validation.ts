import { parse } from 'yaml';
import { OpenAPIV3 } from 'openapi-types';
import { ValidationMessage } from './types';
import { RuleEngine } from './custom-rules';
import { defaultRules } from './default-rules';
import { RuleConfigManager } from './rule-config';

export class ValidationManager {
  private ruleEngine: RuleEngine;
  private configManager: RuleConfigManager;

  constructor(configFile?: string) {
    this.ruleEngine = new RuleEngine();
    this.configManager = new RuleConfigManager(configFile);

    // Register default rules
    defaultRules.forEach(rule => {
      this.ruleEngine.addRule(rule);
      const config = this.configManager.getRuleConfig(rule.id);
      if (config) {
        this.ruleEngine.configureRule(rule.id, config);
      }
    });
  }

  async validateContent(content: string): Promise<{ messages: ValidationMessage[]; parsedSpec: OpenAPIV3.Document | null }> {
    const messages: ValidationMessage[] = [];
    let parsedSpec: OpenAPIV3.Document | null = null;

    try {
      // Parse YAML
      parsedSpec = parse(content) as OpenAPIV3.Document;

      // Run validation rules
      const validationResults = this.ruleEngine.validateSpec(parsedSpec);

      // Convert validation results to messages
      messages.push(...validationResults.map(result => ({
        id: result.ruleId,
        type: result.type === 'info' ? 'warning' : result.type, // Map 'info' to 'warning' for backward compatibility
        message: result.message,
        path: result.path,
        source: result.source
      })));

    } catch (error) {
      messages.push({
        id: 'yaml-syntax',
        type: 'error',
        message: error instanceof Error ? error.message : 'Invalid YAML syntax'
      });
    }

    return { messages, parsedSpec };
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
export async function validateContent(content: string) {
  return validationManager.validateContent(content);
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
