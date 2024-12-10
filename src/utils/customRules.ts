import { StyleRule } from '../types/styleGuide';
import { createCustomRule, commonValidators } from './ruleValidators';

export const createCommonRules = (): StyleRule[] => [
  createCustomRule(
    'Kebab Case Path Parameters',
    'Path parameters should use kebab-case',
    'naming',
    'warning',
    commonValidators.patternMatch(/^[a-z][a-z0-9-]*$/, 'use kebab-case format')
  ),

  createCustomRule(
    'Response Schema Required',
    'Each operation should define response schemas',
    'content',
    'error',
    (operation: any) => ({
      valid: Object.values(operation.responses || {}).some((response: any) => 
        response.content?.['application/json']?.schema
      ),
      message: 'Response schema is required for JSON responses'
    })
  ),

  createCustomRule(
    'Description Length',
    'Operation descriptions should be concise',
    'content',
    'warning',
    commonValidators.maxLength(500, 'Operation description')
  ),

  createCustomRule(
    'Valid Status Codes',
    'Response status codes should be valid HTTP codes',
    'content',
    'error',
    (operation: any) => {
      const validStatusCodes = new Set([
        '200', '201', '202', '204',
        '300', '301', '302', '304',
        '400', '401', '403', '404', '409', '422',
        '500', '502', '503', '504'
      ]);
      
      const hasInvalidCode = Object.keys(operation.responses || {})
        .some(code => !validStatusCodes.has(code));
      
      return {
        valid: !hasInvalidCode,
        message: hasInvalidCode ? 'Contains invalid HTTP status codes' : undefined
      };
    }
  )
];