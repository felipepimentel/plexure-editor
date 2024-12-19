import { OpenAPIV3 } from 'openapi-types';

export interface CustomRule {
  id: string;
  name: string;
  description: string;
  category: 'security' | 'naming' | 'structure' | 'documentation' | 'governance' | 'custom';
  severity: 'error' | 'warning' | 'info';
  enabled: boolean;
  validate: (spec: OpenAPIV3.Document) => ValidationResult[];
  fix?: (spec: OpenAPIV3.Document) => OpenAPIV3.Document;
  aiPrompt?: string; // Guidance for the LLM when generating/modifying specs
  examples?: {
    valid: string[];
    invalid: string[];
  };
  metadata?: Record<string, any>;
}

export interface ValidationResult {
  ruleId: string;
  type: 'error' | 'warning' | 'info';
  message: string;
  path?: string;
  line?: number;
  column?: number;
  source?: string;
  suggestions?: string[];
  context?: Record<string, any>;
}

export interface RuleGroup {
  id: string;
  name: string;
  description: string;
  rules: CustomRule[];
  enabled: boolean;
  metadata?: Record<string, any>;
}

export class RuleEngine {
  private rules: Map<string, CustomRule> = new Map();
  private groups: Map<string, RuleGroup> = new Map();

  constructor() {
    // Register built-in rules
    this.registerBuiltInRules();
  }

  private registerBuiltInRules() {
    // Example built-in rules
    this.addRule({
      id: 'naming/pascal-case-schemas',
      name: 'Pascal Case Schema Names',
      description: 'Schema names should use PascalCase',
      category: 'naming',
      severity: 'warning',
      enabled: true,
      validate: (spec) => {
        const results: ValidationResult[] = [];
        if (spec.components?.schemas) {
          Object.keys(spec.components.schemas).forEach(schemaName => {
            if (!/^[A-Z][a-zA-Z0-9]*$/.test(schemaName)) {
              results.push({
                ruleId: 'naming/pascal-case-schemas',
                type: 'warning',
                message: `Schema name "${schemaName}" should use PascalCase`,
                path: `#/components/schemas/${schemaName}`,
                suggestions: [
                  schemaName.replace(/(?:^|[-_])(\w)/g, (_, c) => c.toUpperCase())
                ]
              });
            }
          });
        }
        return results;
      },
      aiPrompt: 'When generating schema names, always use PascalCase (e.g., UserProfile, OrderItem).',
      examples: {
        valid: ['UserProfile', 'OrderItem', 'PaymentMethod'],
        invalid: ['userProfile', 'order_item', 'payment-method']
      }
    });
  }

  addRule(rule: CustomRule) {
    this.rules.set(rule.id, rule);
  }

  removeRule(ruleId: string) {
    this.rules.delete(ruleId);
  }

  addGroup(group: RuleGroup) {
    this.groups.set(group.id, group);
    group.rules.forEach(rule => this.addRule(rule));
  }

  removeGroup(groupId: string) {
    const group = this.groups.get(groupId);
    if (group) {
      group.rules.forEach(rule => this.removeRule(rule.id));
      this.groups.delete(groupId);
    }
  }

  validateSpec(spec: OpenAPIV3.Document): ValidationResult[] {
    const results: ValidationResult[] = [];
    
    for (const rule of this.rules.values()) {
      if (rule.enabled) {
        try {
          const ruleResults = rule.validate(spec);
          results.push(...ruleResults);
        } catch (error) {
          console.error(`Error validating rule ${rule.id}:`, error);
          results.push({
            ruleId: rule.id,
            type: 'error',
            message: `Rule validation failed: ${error.message}`,
          });
        }
      }
    }

    return results;
  }

  getAIPrompts(): string[] {
    const prompts: string[] = [];
    for (const rule of this.rules.values()) {
      if (rule.enabled && rule.aiPrompt) {
        prompts.push(rule.aiPrompt);
      }
    }
    return prompts;
  }

  exportRules(): string {
    return JSON.stringify({
      rules: Array.from(this.rules.values()),
      groups: Array.from(this.groups.values())
    }, null, 2);
  }

  importRules(json: string) {
    try {
      const data = JSON.parse(json);
      
      // Clear existing rules and groups
      this.rules.clear();
      this.groups.clear();

      // Register built-in rules first
      this.registerBuiltInRules();

      // Import custom rules and groups
      if (data.rules) {
        data.rules.forEach((rule: CustomRule) => this.addRule(rule));
      }
      if (data.groups) {
        data.groups.forEach((group: RuleGroup) => this.addGroup(group));
      }
    } catch (error) {
      throw new Error(`Failed to import rules: ${error.message}`);
    }
  }

  createRuleFromTemplate(template: {
    id: string;
    name: string;
    description: string;
    category: CustomRule['category'];
    severity: CustomRule['severity'];
    validateFn: string;
    fixFn?: string;
    aiPrompt?: string;
    examples?: CustomRule['examples'];
  }): CustomRule {
    try {
      const validateFn = new Function('spec', template.validateFn) as (spec: OpenAPIV3.Document) => ValidationResult[];
      const fixFn = template.fixFn ? new Function('spec', template.fixFn) as (spec: OpenAPIV3.Document) => OpenAPIV3.Document : undefined;

      return {
        id: template.id,
        name: template.name,
        description: template.description,
        category: template.category,
        severity: template.severity,
        enabled: true,
        validate: validateFn,
        fix: fixFn,
        aiPrompt: template.aiPrompt,
        examples: template.examples
      };
    } catch (error) {
      throw new Error(`Failed to create rule from template: ${error.message}`);
    }
  }
} 