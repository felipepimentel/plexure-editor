import { OpenAPIV3 } from 'openapi-types';
import { CustomRule } from './custom-rules';
import { ruleTemplates } from './rule-templates';

export const defaultRules: CustomRule[] = [
  // Naming Conventions
  ruleTemplates.namingConventions.pascalCaseSchemas().build(),
  ruleTemplates.namingConventions.camelCaseProperties().build(),
  ruleTemplates.namingConventions.camelCaseParameters().build(),

  // Security
  ruleTemplates.security.requireAuth({
    allowedPublicPaths: ['/health', '/metrics', '/docs'],
    requiredScopes: ['api:access']
  }).build(),
  ruleTemplates.security.validateScopes(['read:users', 'write:users']).build(),

  // Documentation
  ruleTemplates.documentation.requireDescription({ minLength: 20 }).build(),
  ruleTemplates.documentation.requireExamples().build(),
  ruleTemplates.documentation.requireParameterDescriptions().build(),

  // Structure
  ruleTemplates.structure.consistentResponse({
    type: 'object',
    required: ['data', 'metadata'],
    properties: {
      data: { type: 'object' },
      metadata: {
        type: 'object',
        required: ['timestamp', 'requestId'],
        properties: {
          timestamp: { type: 'string', format: 'date-time' },
          requestId: { type: 'string' },
          pagination: {
            type: 'object',
            properties: {
              page: { type: 'integer' },
              pageSize: { type: 'integer' },
              total: { type: 'integer' }
            }
          }
        }
      }
    }
  }).build(),

  // Custom Rules
  {
    id: 'custom/rate-limit-headers',
    name: 'Rate Limit Headers',
    description: 'Ensure rate limit headers are documented for all endpoints',
    category: 'custom',
    severity: 'warning',
    enabled: true,
    validate: (spec) => {
      const results = [];
      const paths = spec.paths || {};

      Object.entries(paths).forEach(([path, pathItem]) => {
        Object.entries(pathItem || {}).forEach(([method, operation]) => {
          if (method === 'parameters') return;

          const op = operation as OpenAPIV3.OperationObject;
          const responses = op.responses || {};

          Object.entries(responses).forEach(([code, response]) => {
            if (typeof response === 'object' && response && 'headers' in response) {
              const resp = response as OpenAPIV3.ResponseObject;
              const hasRateLimitHeaders = resp.headers && (
                'X-RateLimit-Limit' in resp.headers ||
                'RateLimit-Limit' in resp.headers
              );

              if (!hasRateLimitHeaders) {
                results.push({
                  ruleId: 'custom/rate-limit-headers',
                  type: 'warning',
                  message: `Response ${code} for ${method.toUpperCase()} ${path} should include rate limit headers`,
                  path: `#/paths/${path}/${method}/responses/${code}/headers`,
                  suggestions: [
                    'Add X-RateLimit-Limit header',
                    'Add X-RateLimit-Remaining header',
                    'Add X-RateLimit-Reset header'
                  ]
                });
              }
            }
          });
        });
      });

      return results;
    },
    fix: (spec) => {
      const paths = spec.paths || {};

      Object.entries(paths).forEach(([path, pathItem]) => {
        Object.entries(pathItem || {}).forEach(([method, operation]) => {
          if (method === 'parameters') return;

          const op = operation as OpenAPIV3.OperationObject;
          const responses = op.responses || {};

          Object.entries(responses).forEach(([code, response]) => {
            if (typeof response === 'object' && response && 'headers' in response) {
              const resp = response as OpenAPIV3.ResponseObject;
              if (!resp.headers) {
                resp.headers = {};
              }

              if (!resp.headers['X-RateLimit-Limit']) {
                resp.headers['X-RateLimit-Limit'] = {
                  schema: { type: 'integer' },
                  description: 'The maximum number of requests allowed in the time window'
                };
              }

              if (!resp.headers['X-RateLimit-Remaining']) {
                resp.headers['X-RateLimit-Remaining'] = {
                  schema: { type: 'integer' },
                  description: 'The number of requests remaining in the current time window'
                };
              }

              if (!resp.headers['X-RateLimit-Reset']) {
                resp.headers['X-RateLimit-Reset'] = {
                  schema: { type: 'integer', format: 'unix-timestamp' },
                  description: 'The time when the current rate limit window resets'
                };
              }
            }
          });
        });
      });

      return spec;
    },
    options: {
      headerPrefix: {
        type: 'string',
        description: 'Prefix for rate limit headers',
        default: 'X-RateLimit-',
        enum: ['X-RateLimit-', 'RateLimit-']
      },
      requiredHeaders: {
        type: 'array',
        description: 'List of required rate limit headers',
        default: ['Limit', 'Remaining', 'Reset'],
        items: { type: 'string' }
      }
    },
    examples: {
      valid: [
        {
          headers: {
            'X-RateLimit-Limit': { schema: { type: 'integer' } },
            'X-RateLimit-Remaining': { schema: { type: 'integer' } },
            'X-RateLimit-Reset': { schema: { type: 'integer' } }
          }
        }
      ],
      invalid: [
        { headers: {} },
        { headers: { 'X-RateLimit-Limit': { schema: { type: 'integer' } } } }
      ]
    }
  }
]; 