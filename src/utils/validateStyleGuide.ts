import { OpenAPI } from 'openapi-types';
import { StyleGuide, ValidationResult } from '../types/styleGuide';

export function validateStyleGuide(spec: OpenAPI.Document, styleGuide: StyleGuide): ValidationResult[] {
  const results: ValidationResult[] = [];

  // Validate paths
  Object.entries(spec.paths || {}).forEach(([path, pathItem]) => {
    styleGuide.rules.forEach(rule => {
      if (rule.type === 'naming' || rule.type === 'structure') {
        const result = rule.validator(path);
        if (!result.valid) {
          results.push({
            valid: false,
            rule,
            message: result.message,
            path
          });
        }
      }
    });

    // Validate operations
    Object.entries(pathItem || {}).forEach(([method, operation]) => {
      if (method === '$ref') return;

      styleGuide.rules.forEach(rule => {
        if (rule.type === 'content') {
          const result = rule.validator(operation);
          if (!result.valid) {
            results.push({
              valid: false,
              rule,
              message: result.message,
              path: `${path} [${method.toUpperCase()}]`
            });
          }
        }
      });
    });
  });

  return results;
}