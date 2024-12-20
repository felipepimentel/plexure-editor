import { CustomRule } from './custom-rules';
import { OpenAPIV3 } from 'openapi-types';

export const defaultRules: CustomRule[] = [
  // Naming Conventions
  {
    id: 'naming/pascal-case-schemas',
    name: 'Pascal Case Schema Names',
    description: 'Schema names should use PascalCase',
    category: 'naming',
    severity: 'warning',
    enabled: true,
    options: {
      ignorePatterns: {
        type: 'array',
        description: 'Patterns to ignore when validating schema names',
        default: [],
      },
      allowedPrefixes: {
        type: 'array',
        description: 'Allowed prefixes for schema names',
        default: [],
      },
    },
    validate: (spec, config) => {
      const results = [];
      const ignorePatterns = config?.options?.ignorePatterns || [];
      const allowedPrefixes = config?.options?.allowedPrefixes || [];

      if (spec.components?.schemas) {
        Object.keys(spec.components.schemas).forEach(schemaName => {
          // Skip if name matches ignore patterns
          if (ignorePatterns.some(pattern => new RegExp(pattern).test(schemaName))) {
            return;
          }

          // Check if name starts with allowed prefix
          const hasAllowedPrefix = allowedPrefixes.some(prefix => schemaName.startsWith(prefix));
          const nameToCheck = hasAllowedPrefix 
            ? schemaName.substring(schemaName.indexOf('_') + 1)
            : schemaName;

          if (!/^[A-Z][a-zA-Z0-9]*$/.test(nameToCheck)) {
            results.push({
              ruleId: 'naming/pascal-case-schemas',
              type: config?.severity || 'warning',
              message: `Schema name "${schemaName}" should use PascalCase`,
              path: `#/components/schemas/${schemaName}`,
              suggestions: [
                nameToCheck.replace(/(?:^|[-_])(\w)/g, (_, c) => c.toUpperCase())
              ]
            });
          }
        });
      }
      return results;
    },
    fix: (spec, config) => {
      if (spec.components?.schemas) {
        const ignorePatterns = config?.options?.ignorePatterns || [];
        const allowedPrefixes = config?.options?.allowedPrefixes || [];
        const newSchemas = {};

        Object.entries(spec.components.schemas).forEach(([name, schema]) => {
          // Skip if name matches ignore patterns
          if (ignorePatterns.some(pattern => new RegExp(pattern).test(name))) {
            newSchemas[name] = schema;
            return;
          }

          // Check if name starts with allowed prefix
          const hasAllowedPrefix = allowedPrefixes.some(prefix => name.startsWith(prefix));
          const nameToFix = hasAllowedPrefix 
            ? name.substring(name.indexOf('_') + 1)
            : name;

          const pascalName = nameToFix.replace(/(?:^|[-_])(\w)/g, (_, c) => c.toUpperCase());
          newSchemas[hasAllowedPrefix ? `${name.split('_')[0]}_${pascalName}` : pascalName] = schema;
        });

        spec.components.schemas = newSchemas;
      }
      return spec;
    },
    aiPrompt: 'When generating schema names, always use PascalCase (e.g., UserProfile, OrderItem).',
    examples: {
      valid: ['UserProfile', 'OrderItem', 'PaymentMethod'],
      invalid: ['userProfile', 'order_item', 'payment-method']
    }
  },

  // Security
  {
    id: 'security/require-auth',
    name: 'Require Authentication',
    description: 'All endpoints should require authentication except those explicitly marked as public',
    category: 'security',
    severity: 'error',
    enabled: true,
    options: {
      allowedPublicPaths: {
        type: 'array',
        description: 'Paths that are allowed to be public',
        default: ['/health', '/metrics', '/docs'],
      },
      publicTag: {
        type: 'string',
        description: 'Tag to mark endpoints as public',
        default: 'public',
      },
      requiredScopes: {
        type: 'array',
        description: 'Required OAuth scopes for protected endpoints',
        default: [],
      },
    },
    validate: (spec, config) => {
      const results = [];
      const paths = spec.paths || {};
      const allowedPublicPaths = config?.options?.allowedPublicPaths || [];
      const publicTag = config?.options?.publicTag || 'public';
      const requiredScopes = config?.options?.requiredScopes || [];
      
      Object.entries(paths).forEach(([path, pathItem]) => {
        // Skip allowed public paths
        if (allowedPublicPaths.some(p => path.startsWith(p))) {
          return;
        }

        Object.entries(pathItem || {}).forEach(([method, operation]) => {
          if (method === 'parameters') return;
          
          const op = operation as OpenAPIV3.OperationObject;
          const isPublic = op.tags?.includes(publicTag);
          const hasAuth = op.security && op.security.length > 0;
          
          if (!isPublic && !hasAuth) {
            results.push({
              ruleId: 'security/require-auth',
              type: config?.severity || 'error',
              message: `Endpoint ${method.toUpperCase()} ${path} requires authentication`,
              path: `#/paths/${path}/${method}`,
              suggestions: [
                'Add security requirement to the operation',
                `Mark the endpoint as public using the "${publicTag}" tag`
              ]
            });
          }

          // Check required scopes for protected endpoints
          if (hasAuth && requiredScopes.length > 0) {
            const missingScopes = requiredScopes.filter(scope => 
              !op.security?.some(sec => 
                Object.values(sec).some(scopes => 
                  Array.isArray(scopes) && scopes.includes(scope)
                )
              )
            );

            if (missingScopes.length > 0) {
              results.push({
                ruleId: 'security/require-auth',
                type: config?.severity || 'warning',
                message: `Endpoint ${method.toUpperCase()} ${path} is missing required scopes: ${missingScopes.join(', ')}`,
                path: `#/paths/${path}/${method}/security`,
                suggestions: [
                  `Add the following scopes: ${missingScopes.join(', ')}`
                ]
              });
            }
          }
        });
      });
      
      return results;
    },
    aiPrompt: 'All API endpoints should require authentication by default. Use appropriate tags to mark public endpoints.',
    examples: {
      valid: [
        '{"security": [{"bearerAuth": []}]}',
        '{"tags": ["public"]}'
      ],
      invalid: [
        '{"security": []}',
        '{}'
      ]
    }
  }
]; 