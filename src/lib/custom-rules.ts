import { OpenAPIV3 } from 'openapi-types';

export interface ValidationMessage {
  id: string;
  type: 'error' | 'warning' | 'info';
  message: string;
  path?: string;
  context?: {
    schemaName?: string;
    method?: string;
  };
}

export enum ValidationSeverity {
  Error = 'error',
  Warning = 'warning',
  Info = 'info'
}

export type RuleCategory = 'naming' | 'security' | 'documentation' | 'structure' | 'governance' | 'custom';

export interface ValidationResult {
  ruleId: string;
  type: ValidationSeverity;
  message: string;
  path?: string;
  line?: number;
  column?: number;
  source?: string;
  suggestions?: string[];
  context?: Record<string, any>;
}

export interface RuleConfig {
  enabled: boolean;
  severity?: ValidationSeverity;
  options?: Record<string, any>;
}

export interface CustomRule {
  id: string;
  name: string;
  description: string;
  category: RuleCategory;
  severity: ValidationSeverity;
  enabled: boolean;
  validate: (spec: OpenAPIV3.Document, config?: RuleConfig) => ValidationResult[];
  fix?: (spec: OpenAPIV3.Document, config?: RuleConfig) => OpenAPIV3.Document;
  options?: {
    [key: string]: {
      type: 'string' | 'number' | 'boolean' | 'array' | 'object';
      description: string;
      default?: any;
      enum?: any[];
      required?: boolean;
    };
  };
  aiPrompt?: string;
  examples?: {
    valid: string[];
    invalid: string[];
  };
}

export class RuleEngine {
  private rules: Map<string, CustomRule> = new Map();
  private config: Map<string, RuleConfig> = new Map();

  constructor() {
    // Initialize with default configuration
    this.loadDefaultConfig();
  }

  private loadDefaultConfig() {
    // Load from environment or default settings
    // This could be extended to load from a config file
  }

  addRule(rule: CustomRule) {
    this.rules.set(rule.id, rule);
    if (!this.config.has(rule.id)) {
      this.config.set(rule.id, {
        enabled: rule.enabled,
        severity: rule.severity,
        options: {}
      });
    }
  }

  configureRule(ruleId: string, config: Partial<RuleConfig>) {
    const existingConfig = this.config.get(ruleId) || { enabled: true, options: {} };
    this.config.set(ruleId, {
      ...existingConfig,
      ...config
    });
  }

  validateSpec(spec: OpenAPIV3.Document): ValidationResult[] {
    const results: ValidationResult[] = [];

    for (const [ruleId, rule] of this.rules.entries()) {
      const config = this.config.get(ruleId);
      if (config?.enabled) {
        try {
          const ruleResults = rule.validate(spec, config);
          results.push(...ruleResults.map(result => ({
            ...result,
            type: config.severity || result.type
          })));
        } catch (error) {
          console.error(`Error running rule ${ruleId}:`, error);
          results.push({
            ruleId,
            type: 'error',
            message: `Rule execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`
          });
        }
      }
    }

    return results;
  }

  fixSpec(spec: OpenAPIV3.Document): OpenAPIV3.Document {
    let modifiedSpec = { ...spec };

    for (const [ruleId, rule] of this.rules.entries()) {
      const config = this.config.get(ruleId);
      if (config?.enabled && rule.fix) {
        try {
          modifiedSpec = rule.fix(modifiedSpec, config);
        } catch (error) {
          console.error(`Error running fix for rule ${ruleId}:`, error);
        }
      }
    }

    return modifiedSpec;
  }

  getRule(ruleId: string): CustomRule | undefined {
    return this.rules.get(ruleId);
  }

  getRules(): CustomRule[] {
    return Array.from(this.rules.values());
  }

  getRuleConfig(ruleId: string): RuleConfig | undefined {
    return this.config.get(ruleId);
  }

  getAIPrompts(): string[] {
    return Array.from(this.rules.values())
      .filter(rule => this.config.get(rule.id)?.enabled && rule.aiPrompt)
      .map(rule => rule.aiPrompt!)
      .filter(Boolean);
  }
} 