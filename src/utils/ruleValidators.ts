import { StyleRule } from '../types/styleGuide';

export const createCustomRule = (
  name: string,
  description: string,
  type: StyleRule['type'],
  severity: StyleRule['severity'],
  validatorFn: StyleRule['validator']
): StyleRule => ({
  id: `custom-${name.toLowerCase().replace(/\s+/g, '-')}`,
  name,
  description,
  type,
  severity,
  validator: validatorFn
});

export const commonValidators = {
  requiredField: (fieldName: string) => (obj: any) => ({
    valid: Boolean(obj?.[fieldName]),
    message: `${fieldName} is required`
  }),

  patternMatch: (pattern: RegExp, description: string) => (value: string) => ({
    valid: pattern.test(value),
    message: `Value must ${description}`
  }),

  enumValues: (allowedValues: string[], fieldName: string) => (value: any) => ({
    valid: allowedValues.includes(value),
    message: `${fieldName} must be one of: ${allowedValues.join(', ')}`
  }),

  maxLength: (maxLength: number, fieldName: string) => (value: string) => ({
    valid: value.length <= maxLength,
    message: `${fieldName} must not exceed ${maxLength} characters`
  })
};