import { OpenAPIV3 } from 'openapi-types';
import { CustomRule, ValidationResult } from './custom-rules';
import { RuleDefinition, RuleTemplate } from './rule-types';

type ValidationFunction = (spec: OpenAPIV3.Document) => ValidationResult[];
type FixFunction = (spec: OpenAPIV3.Document) => OpenAPIV3.Document;

export class RuleBuilder {
  private validateFns: ValidationFunction[] = [];
  private fixFns: FixFunction[] = [];
  private definition: RuleDefinition;

  constructor(definition: RuleDefinition) {
    this.definition = definition;
  }

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

  addValidation(fn: ValidationFunction): RuleBuilder {
    this.validateFns.push(fn);
    return this;
  }

  addFix(fn: FixFunction): RuleBuilder {
    this.fixFns.push(fn);
    return this;
  }

  withPathPattern(pattern: string | RegExp): RuleBuilder {
    this.addValidation((spec) => {
      const results: ValidationResult[] = [];
      const regex = pattern instanceof RegExp ? pattern : new RegExp(pattern);

      Object.keys(spec.paths || {}).forEach(path => {
        if (!regex.test(path)) {
          results.push({
            ruleId: this.definition.id,
            type: this.definition.severity,
            message: `Path "${path}" does not match required pattern ${pattern}`,
            path: `#/paths/${path}`
          });
        }
      });

      return results;
    });

    return this;
  }

  withSchemaPattern(pattern: string | RegExp): RuleBuilder {
    this.addValidation((spec) => {
      const results: ValidationResult[] = [];
      const regex = pattern instanceof RegExp ? pattern : new RegExp(pattern);

      Object.keys(spec.components?.schemas || {}).forEach(schemaName => {
        if (!regex.test(schemaName)) {
          results.push({
            ruleId: this.definition.id,
            type: this.definition.severity,
            message: `Schema name "${schemaName}" does not match required pattern ${pattern}`,
            path: `#/components/schemas/${schemaName}`
          });
        }
      });

      return results;
    });

    return this;
  }

  withOperationValidation(fn: (path: string, method: string, operation: OpenAPIV3.OperationObject) => ValidationResult[]): RuleBuilder {
    this.addValidation((spec) => {
      const results: ValidationResult[] = [];

      Object.entries(spec.paths || {}).forEach(([path, pathItem]) => {
        Object.entries(pathItem || {}).forEach(([method, operation]) => {
          if (method === 'parameters') return;
          
          const op = operation as OpenAPIV3.OperationObject;
          results.push(...fn(path, method, op));
        });
      });

      return results;
    });

    return this;
  }

  withSchemaValidation(fn: (schemaName: string, schema: OpenAPIV3.SchemaObject) => ValidationResult[]): RuleBuilder {
    this.addValidation((spec) => {
      const results: ValidationResult[] = [];

      Object.entries(spec.components?.schemas || {}).forEach(([schemaName, schema]) => {
        results.push(...fn(schemaName, schema as OpenAPIV3.SchemaObject));
      });

      return results;
    });

    return this;
  }

  withSecurityValidation(requiredScopes?: string[]): RuleBuilder {
    this.addValidation((spec) => {
      const results: ValidationResult[] = [];

      Object.entries(spec.paths || {}).forEach(([path, pathItem]) => {
        Object.entries(pathItem || {}).forEach(([method, operation]) => {
          if (method === 'parameters') return;
          
          const op = operation as OpenAPIV3.OperationObject;
          const hasAuth = op.security && op.security.length > 0;
          const isPublic = op.tags?.includes('public');

          if (!isPublic && !hasAuth) {
            results.push({
              ruleId: this.definition.id,
              type: this.definition.severity,
              message: `Endpoint ${method.toUpperCase()} ${path} requires authentication`,
              path: `#/paths/${path}/${method}`
            });
          }

          if (requiredScopes && hasAuth) {
            const missingScopes = requiredScopes.filter(scope => 
              !op.security?.some(sec => 
                Object.values(sec).some(scopes => 
                  Array.isArray(scopes) && scopes.includes(scope)
                )
              )
            );

            if (missingScopes.length > 0) {
              results.push({
                ruleId: this.definition.id,
                type: this.definition.severity,
                message: `Endpoint ${method.toUpperCase()} ${path} is missing required scopes: ${missingScopes.join(', ')}`,
                path: `#/paths/${path}/${method}/security`
              });
            }
          }
        });
      });

      return results;
    });

    return this;
  }

  build(): CustomRule {
    return {
      id: this.definition.id,
      name: this.definition.name,
      description: this.definition.description,
      category: this.definition.category,
      severity: this.definition.severity,
      enabled: true,
      validate: (spec: OpenAPIV3.Document) => {
        return this.validateFns.reduce((results, fn) => {
          try {
            return [...results, ...fn(spec)];
          } catch (error) {
            console.error(`Error in validation function for rule ${this.definition.id}:`, error);
            return results;
          }
        }, [] as ValidationResult[]);
      },
      fix: this.fixFns.length > 0 ? (spec: OpenAPIV3.Document) => {
        return this.fixFns.reduce((updatedSpec, fn) => {
          try {
            return fn(updatedSpec);
          } catch (error) {
            console.error(`Error in fix function for rule ${this.definition.id}:`, error);
            return updatedSpec;
          }
        }, spec);
      } : undefined,
      options: this.definition.options,
      examples: this.definition.examples
    };
  }

  toString(): string {
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