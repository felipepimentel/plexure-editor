import { OpenAPIV3 } from 'openapi-types';
import { CustomRule, ValidationResult } from './custom-rules';
import { RuleDefinition, RuleTemplate } from './rule-types';

export class RuleBuilder {
  private validateFn: ((spec: OpenAPIV3.Document) => ValidationResult[]) | null = null;
  private fixFn: ((spec: OpenAPIV3.Document) => OpenAPIV3.Document) | null = null;

  constructor(private definition: RuleDefinition) {}

  static fromTemplate(template: RuleTemplate, options?: Record<string, any>): RuleBuilder {
    const definition: RuleDefinition = {
      id: template.id,
      name: template.name,
      description: template.description,
      category: template.category,
      severity: template.severity,
      validate: template.template,
      examples: template.examples,
      options: {}
    };

    if (options) {
      definition.options = Object.entries(options).reduce((acc, [key, value]) => {
        acc[key] = {
          type: typeof value as any,
          description: `Option for ${key}`,
          default: value
        };
        return acc;
      }, {} as Record<string, any>);
    }

    return new RuleBuilder(definition);
  }

  private compileFunction(code: string): Function {
    try {
      return new Function('spec', 'options', code);
    } catch (error) {
      throw new Error(`Failed to compile function: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  withValidate(validateFn: (spec: OpenAPIV3.Document) => ValidationResult[]): RuleBuilder {
    this.validateFn = validateFn;
    return this;
  }

  withFix(fixFn: (spec: OpenAPIV3.Document) => OpenAPIV3.Document): RuleBuilder {
    this.fixFn = fixFn;
    return this;
  }

  withOptions(options: Record<string, any>): RuleBuilder {
    this.definition.options = Object.entries(options).reduce((acc, [key, value]) => {
      acc[key] = {
        type: typeof value as any,
        description: `Option for ${key}`,
        default: value
      };
      return acc;
    }, {} as Record<string, any>);
    return this;
  }

  build(): CustomRule {
    if (!this.validateFn) {
      // Compile validate function from definition
      const validateFn = this.compileFunction(this.definition.validate);
      this.validateFn = (spec: OpenAPIV3.Document) => validateFn(spec, this.definition.options);
    }

    if (this.definition.fix && !this.fixFn) {
      // Compile fix function from definition
      const fixFn = this.compileFunction(this.definition.fix);
      this.fixFn = (spec: OpenAPIV3.Document) => fixFn(spec, this.definition.options);
    }

    return {
      id: this.definition.id,
      name: this.definition.name,
      description: this.definition.description,
      category: this.definition.category as any,
      severity: this.definition.severity,
      enabled: true,
      validate: this.validateFn,
      fix: this.fixFn || undefined,
      options: this.definition.options,
      examples: this.definition.examples
    };
  }

  static validateRule(rule: CustomRule): void {
    // Validate rule structure
    if (!rule.id) throw new Error('Rule must have an ID');
    if (!rule.name) throw new Error('Rule must have a name');
    if (!rule.description) throw new Error('Rule must have a description');
    if (!rule.category) throw new Error('Rule must have a category');
    if (!rule.severity) throw new Error('Rule must have a severity level');
    if (!rule.validate) throw new Error('Rule must have a validate function');

    // Test validate function
    try {
      const result = rule.validate({
        openapi: '3.0.0',
        info: { title: 'Test API', version: '1.0.0' },
        paths: {}
      });
      if (!Array.isArray(result)) {
        throw new Error('Validate function must return an array');
      }
    } catch (error) {
      throw new Error(`Invalid validate function: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // Test fix function if present
    if (rule.fix) {
      try {
        const result = rule.fix({
          openapi: '3.0.0',
          info: { title: 'Test API', version: '1.0.0' },
          paths: {}
        });
        if (!result || typeof result !== 'object') {
          throw new Error('Fix function must return an OpenAPI specification object');
        }
      } catch (error) {
        throw new Error(`Invalid fix function: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  }

  static createRuleFromJson(json: string): CustomRule {
    try {
      const definition = JSON.parse(json) as RuleDefinition;
      return new RuleBuilder(definition).build();
    } catch (error) {
      throw new Error(`Failed to create rule from JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  toJson(): string {
    return JSON.stringify({
      id: this.definition.id,
      name: this.definition.name,
      description: this.definition.description,
      category: this.definition.category,
      severity: this.definition.severity,
      options: this.definition.options,
      validate: this.definition.validate,
      fix: this.definition.fix,
      examples: this.definition.examples
    }, null, 2);
  }
} 