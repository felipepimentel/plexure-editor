import React from 'react';
import { validateOpenAPI, validateYAMLSyntax, lintOpenAPI } from './validation';
import YAML from 'yaml';
import { OpenAPIV3 } from 'openapi-types';
import { RuleEngine, ValidationResult } from './custom-rules';
import { ruleTemplates } from './rule-templates';

export interface ValidationContext {
  spec: OpenAPIV3.Document;
  ruleEngine: RuleEngine;
  aiPrompts: string[];
}

export async function validateSpec(context: ValidationContext): Promise<ValidationResult[]> {
  const { spec, ruleEngine } = context;
  
  // Run custom rules validation
  const customResults = ruleEngine.validateSpec(spec);

  // Run standard OpenAPI validation
  const standardResults = validateOpenAPI(spec);

  return [...customResults, ...standardResults];
}

export function validateOpenAPI(spec: OpenAPIV3.Document): ValidationResult[] {
  const results: ValidationResult[] = [];

  // Basic OpenAPI structure validation
  if (!spec.openapi) {
    results.push({
      ruleId: 'openapi/version',
      type: 'error',
      message: 'OpenAPI version is required',
      path: '#/openapi'
    });
  } else if (!spec.openapi.startsWith('3.0')) {
    results.push({
      ruleId: 'openapi/version',
      type: 'error',
      message: 'Only OpenAPI 3.0.x is supported',
      path: '#/openapi'
    });
  }

  if (!spec.info) {
    results.push({
      ruleId: 'openapi/info',
      type: 'error',
      message: 'Info object is required',
      path: '#/info'
    });
  } else {
    if (!spec.info.title) {
      results.push({
        ruleId: 'openapi/info/title',
        type: 'error',
        message: 'API title is required',
        path: '#/info/title'
      });
    }
    if (!spec.info.version) {
      results.push({
        ruleId: 'openapi/info/version',
        type: 'error',
        message: 'API version is required',
        path: '#/info/version'
      });
    }
  }

  if (!spec.paths) {
    results.push({
      ruleId: 'openapi/paths',
      type: 'error',
      message: 'Paths object is required',
      path: '#/paths'
    });
  }

  return results;
}

export function getAIPrompts(context: ValidationContext): string[] {
  const { ruleEngine } = context;
  
  // Get prompts from enabled rules
  const rulePrompts = ruleEngine.getAIPrompts();

  // Add standard OpenAPI prompts
  const standardPrompts = [
    'Follow OpenAPI 3.0.x specification format.',
    'Include clear and concise descriptions for all components.',
    'Use proper HTTP methods for operations (GET for retrieval, POST for creation, etc.).',
    'Include appropriate response codes and schemas.',
    'Document security requirements clearly.',
  ];

  return [...standardPrompts, ...rulePrompts];
}

export function initializeRuleEngine(): RuleEngine {
  const engine = new RuleEngine();
  
  // Register rule templates
  ruleTemplates.forEach(rule => engine.addRule(rule));
  
  return engine;
}

export function generateRuleGroup(rules: string[]): string {
  return rules.map(rule => {
    const template = ruleTemplates.find(t => t.id === rule);
    if (template) {
      return `// ${template.name}
// ${template.description}
${template.validate.toString()}

${template.fix ? `// Fix function
${template.fix.toString()}` : ''}

// Examples:
// Valid: ${template.examples?.valid.join(', ')}
// Invalid: ${template.examples?.invalid.join(', ')}
`;
    }
    return '';
  }).join('\n\n');
}

export function formatValidationMessage(result: ValidationResult): string {
  const severity = result.type === 'error' ? '🔴' :
                  result.type === 'warning' ? '🟡' : '🔵';
  
  let message = `${severity} ${result.message}`;
  
  if (result.path) {
    message += `\n   at ${result.path}`;
  }
  
  if (result.line) {
    message += ` (line ${result.line}`;
    if (result.column) {
      message += `, column ${result.column}`;
    }
    message += ')';
  }
  
  if (result.suggestions?.length) {
    message += '\n   Suggestions:';
    result.suggestions.forEach(suggestion => {
      message += `\n   - ${suggestion}`;
    });
  }
  
  return message;
}

export function getValidationSummary(results: ValidationResult[]): string {
  const errors = results.filter(r => r.type === 'error').length;
  const warnings = results.filter(r => r.type === 'warning').length;
  const infos = results.filter(r => r.type === 'info').length;
  
  return `Found ${errors} error${errors !== 1 ? 's' : ''}, ${warnings} warning${warnings !== 1 ? 's' : ''}, and ${infos} info message${infos !== 1 ? 's' : ''}.`;
}

export function shouldPreventPreview(results: ValidationResult[]): boolean {
  // Prevent preview if there are any errors
  return results.some(r => r.type === 'error');
}

export function getFixSuggestions(results: ValidationResult[]): string[] {
  const suggestions: string[] = [];
  
  results.forEach(result => {
    if (result.suggestions?.length) {
      suggestions.push(`${result.message}:\n${result.suggestions.map(s => `- ${s}`).join('\n')}`);
    }
  });
  
  return suggestions;
}

export function generateAIContext(context: ValidationContext): string {
  const { spec, ruleEngine } = context;
  
  // Get validation results
  const results = validateSpec(context);
  
  // Get AI prompts
  const prompts = getAIPrompts(context);
  
  // Generate context
  return `
Current OpenAPI Specification:
${JSON.stringify(spec, null, 2)}

Validation Results:
${results.map(formatValidationMessage).join('\n')}

${getValidationSummary(results)}

Guidelines for Modification:
${prompts.map(p => `- ${p}`).join('\n')}

Fix Suggestions:
${getFixSuggestions(results).map(s => `- ${s}`).join('\n')}
`;
}

export const createValidationHandlers = (
  setValidationMessages: React.Dispatch<React.SetStateAction<Array<{
    id: string;
    type: 'error' | 'warning';
    message: string;
    path?: string;
  }>>>,
  setIsValidating: React.Dispatch<React.SetStateAction<boolean>>,
  setParsedSpec: React.Dispatch<React.SetStateAction<any>>
) => {
  const validateContent = async (content: string) => {
    setIsValidating(true);
    try {
      // First, check YAML syntax
      const syntaxResult = validateYAMLSyntax(content);
      if (!syntaxResult.isValid) {
        setValidationMessages(syntaxResult.messages);
        return;
      }

      // Then, lint for basic OpenAPI structure
      const lintResult = lintOpenAPI(content);
      
      // Finally, perform full OpenAPI validation
      const validationResult = await validateOpenAPI(content);

      // Combine lint warnings with validation results
      setValidationMessages([
        ...lintResult.messages.filter(m => m.type === 'warning'),
        ...validationResult.messages,
      ]);
    } catch (error) {
      console.error('Validation error:', error);
      setValidationMessages([{
        id: Date.now().toString(),
        type: 'error',
        message: 'An unexpected error occurred during validation',
      }]);
    } finally {
      setIsValidating(false);
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value) {
      validateContent(value);
      try {
        const parsed = YAML.parse(value);
        setParsedSpec(parsed);
      } catch (error) {
        setParsedSpec(null);
      }
    }
  };

  return {
    validateContent,
    handleEditorChange,
  };
}; 