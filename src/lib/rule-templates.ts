import { CustomRule } from './custom-rules';

export const ruleTemplates: CustomRule[] = [
  // Naming Conventions
  {
    id: 'naming/pascal-case-schemas',
    name: 'Pascal Case Schema Names',
    description: 'Schema names should use PascalCase',
    category: 'naming',
    severity: 'warning',
    enabled: true,
    validate: (spec) => {
      const results = [];
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
    fix: (spec) => {
      if (spec.components?.schemas) {
        const newSchemas = {};
        Object.entries(spec.components.schemas).forEach(([name, schema]) => {
          const pascalName = name.replace(/(?:^|[-_])(\w)/g, (_, c) => c.toUpperCase());
          newSchemas[pascalName] = schema;
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
    validate: (spec) => {
      const results = [];
      const paths = spec.paths || {};
      
      Object.entries(paths).forEach(([path, pathItem]) => {
        Object.entries(pathItem || {}).forEach(([method, operation]) => {
          if (method === 'parameters') return;
          
          const op = operation as any;
          const isPublic = op['x-public'] === true;
          const hasAuth = op.security && op.security.length > 0;
          
          if (!isPublic && !hasAuth) {
            results.push({
              ruleId: 'security/require-auth',
              type: 'error',
              message: `Endpoint ${method.toUpperCase()} ${path} requires authentication`,
              path: `#/paths/${path}/${method}`,
              suggestions: [
                'Add security requirement to the operation',
                'Mark the endpoint as public using x-public: true'
              ]
            });
          }
        });
      });
      
      return results;
    },
    aiPrompt: 'All API endpoints should require authentication by default. Use x-public: true to explicitly mark public endpoints.',
    examples: {
      valid: [
        '{"security": [{"bearerAuth": []}]}',
        '{"x-public": true}'
      ],
      invalid: [
        '{"security": []}',
        '{}'
      ]
    }
  },

  // Documentation
  {
    id: 'docs/require-description',
    name: 'Require Descriptions',
    description: 'All schemas and endpoints should have descriptions',
    category: 'documentation',
    severity: 'warning',
    enabled: true,
    validate: (spec) => {
      const results = [];
      
      // Check schemas
      if (spec.components?.schemas) {
        Object.entries(spec.components.schemas).forEach(([name, schema]: [string, any]) => {
          if (!schema.description) {
            results.push({
              ruleId: 'docs/require-description',
              type: 'warning',
              message: `Schema "${name}" is missing a description`,
              path: `#/components/schemas/${name}`,
              suggestions: [
                'Add a clear and concise description of what this schema represents'
              ]
            });
          }
        });
      }
      
      // Check endpoints
      const paths = spec.paths || {};
      Object.entries(paths).forEach(([path, pathItem]) => {
        Object.entries(pathItem || {}).forEach(([method, operation]) => {
          if (method === 'parameters') return;
          
          const op = operation as any;
          if (!op.description && !op.summary) {
            results.push({
              ruleId: 'docs/require-description',
              type: 'warning',
              message: `Operation ${method.toUpperCase()} ${path} is missing a description`,
              path: `#/paths/${path}/${method}`,
              suggestions: [
                'Add a description explaining what this endpoint does',
                'Add a summary for a brief overview'
              ]
            });
          }
        });
      });
      
      return results;
    },
    aiPrompt: 'Always include clear descriptions for schemas and endpoints to improve API documentation.',
    examples: {
      valid: [
        '{"description": "A user profile containing basic information"}',
        '{"summary": "Create a new user", "description": "Creates a new user account with the provided information"}'
      ],
      invalid: [
        '{}',
        '{"summary": ""}'
      ]
    }
  },

  // Structure
  {
    id: 'structure/consistent-response',
    name: 'Consistent Response Structure',
    description: 'All responses should follow a consistent structure with data and metadata',
    category: 'structure',
    severity: 'warning',
    enabled: true,
    validate: (spec) => {
      const results = [];
      const paths = spec.paths || {};
      
      Object.entries(paths).forEach(([path, pathItem]) => {
        Object.entries(pathItem || {}).forEach(([method, operation]) => {
          if (method === 'parameters') return;
          
          const op = operation as any;
          if (op.responses) {
            Object.entries(op.responses).forEach(([code, response]: [string, any]) => {
              if (code.startsWith('2') && response.content?.['application/json']?.schema) {
                const schema = response.content['application/json'].schema;
                
                // Check if response follows standard structure
                const hasData = schema.properties?.data;
                const hasMetadata = schema.properties?.metadata;
                
                if (!hasData || !hasMetadata) {
                  results.push({
                    ruleId: 'structure/consistent-response',
                    type: 'warning',
                    message: `Response for ${method.toUpperCase()} ${path} should follow standard structure with data and metadata`,
                    path: `#/paths/${path}/${method}/responses/${code}`,
                    suggestions: [
                      'Use standard response structure: { data: T, metadata: { ... } }'
                    ]
                  });
                }
              }
            });
          }
        });
      });
      
      return results;
    },
    fix: (spec) => {
      const paths = spec.paths || {};
      
      Object.entries(paths).forEach(([path, pathItem]) => {
        Object.entries(pathItem || {}).forEach(([method, operation]) => {
          if (method === 'parameters') return;
          
          const op = operation as any;
          if (op.responses) {
            Object.entries(op.responses).forEach(([code, response]: [string, any]) => {
              if (code.startsWith('2') && response.content?.['application/json']?.schema) {
                const schema = response.content['application/json'].schema;
                
                if (!schema.properties?.data || !schema.properties?.metadata) {
                  const originalSchema = { ...schema };
                  response.content['application/json'].schema = {
                    type: 'object',
                    required: ['data', 'metadata'],
                    properties: {
                      data: originalSchema,
                      metadata: {
                        type: 'object',
                        properties: {
                          timestamp: {
                            type: 'string',
                            format: 'date-time'
                          },
                          requestId: {
                            type: 'string'
                          }
                        }
                      }
                    }
                  };
                }
              }
            });
          }
        });
      });
      
      return spec;
    },
    aiPrompt: 'All API responses should follow a consistent structure with data and metadata fields.',
    examples: {
      valid: [
        '{"data": {...}, "metadata": {...}}',
        '{"data": [], "metadata": {"total": 0, "page": 1}}'
      ],
      invalid: [
        '[...]',
        '{"items": [...]}',
        '{"result": {...}}'
      ]
    }
  },

  // Governance
  {
    id: 'governance/version-policy',
    name: 'Version Policy',
    description: 'API version should follow semantic versioning and be included in the path',
    category: 'governance',
    severity: 'error',
    enabled: true,
    validate: (spec) => {
      const results = [];
      const paths = spec.paths || {};
      
      // Check API version format
      if (!spec.info?.version || !/^\d+\.\d+\.\d+$/.test(spec.info.version)) {
        results.push({
          ruleId: 'governance/version-policy',
          type: 'error',
          message: 'API version should follow semantic versioning (MAJOR.MINOR.PATCH)',
          path: '#/info/version',
          suggestions: [
            'Use semantic versioning format: MAJOR.MINOR.PATCH',
            'Example: 1.0.0'
          ]
        });
      }
      
      // Check version in paths
      Object.keys(paths).forEach(path => {
        if (!path.includes('/v1/') && !path.includes('/v2/')) {
          results.push({
            ruleId: 'governance/version-policy',
            type: 'error',
            message: `Path "${path}" should include version (e.g., /v1/)`,
            path: `#/paths/${path}`,
            suggestions: [
              `Change to /v1${path}`,
              `Change to /v2${path}`
            ]
          });
        }
      });
      
      return results;
    },
    aiPrompt: 'Use semantic versioning for API version and include version in all paths (e.g., /v1/users).',
    examples: {
      valid: [
        '/v1/users',
        '/v2/orders',
        'version: 1.0.0'
      ],
      invalid: [
        '/users',
        '/api/orders',
        'version: 1'
      ]
    }
  }
]; 