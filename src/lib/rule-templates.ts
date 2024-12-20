import { OpenAPIV3 } from 'openapi-types';
import { RuleBuilder } from './rule-builder';

export const ruleTemplates = {
  // Naming Conventions
  namingConventions: {
    pascalCaseSchemas: () => new RuleBuilder({
      id: 'naming/pascal-case-schemas',
      name: 'Pascal Case Schema Names',
      description: 'Schema names should use PascalCase',
      category: 'naming',
      severity: 'warning',
      validate: '',
      examples: {
        valid: ['UserProfile', 'OrderItem', 'PaymentMethod'],
        invalid: ['userProfile', 'order_item', 'payment-method']
      }
    }).withSchemaPattern(/^[A-Z][a-zA-Z0-9]*$/),

    camelCaseProperties: () => new RuleBuilder({
      id: 'naming/camel-case-properties',
      name: 'Camel Case Properties',
      description: 'Property names should use camelCase',
      category: 'naming',
      severity: 'warning',
      validate: '',
      examples: {
        valid: ['firstName', 'lastName', 'emailAddress'],
        invalid: ['FirstName', 'last_name', 'EMAIL_ADDRESS']
      }
    }).withSchemaValidation((schemaName, schema) => {
      const results = [];
      if (schema.properties) {
        Object.keys(schema.properties).forEach(propName => {
          if (!/^[a-z][a-zA-Z0-9]*$/.test(propName)) {
            results.push({
              ruleId: 'naming/camel-case-properties',
              type: 'warning',
              message: `Property "${propName}" in schema "${schemaName}" should use camelCase`,
              path: `#/components/schemas/${schemaName}/properties/${propName}`
            });
          }
        });
      }
      return results;
    }),

    camelCaseParameters: () => new RuleBuilder({
      id: 'naming/camel-case-parameters',
      name: 'Camel Case Parameters',
      description: 'Operation parameters should use camelCase',
      category: 'naming',
      severity: 'warning',
      validate: '',
      examples: {
        valid: ['userId', 'orderStatus', 'pageSize'],
        invalid: ['UserID', 'ORDER_STATUS', 'page-size']
      }
    }).withOperationValidation((path, method, operation) => {
      const results = [];
      const parameters = [
        ...(operation.parameters || []),
        ...Object.values(operation.requestBody?.content || {}).flatMap(content => {
          if (content.schema && 'properties' in content.schema) {
            return Object.keys(content.schema.properties || {});
          }
          return [];
        })
      ];

      parameters.forEach(param => {
        const paramName = typeof param === 'string' ? param : param.name;
        if (!/^[a-z][a-zA-Z0-9]*$/.test(paramName)) {
          results.push({
            ruleId: 'naming/camel-case-parameters',
            type: 'warning',
            message: `Parameter "${paramName}" in ${method.toUpperCase()} ${path} should use camelCase`,
            path: `#/paths/${path}/${method}/parameters/${paramName}`
          });
        }
      });

      return results;
    })
  },

  // Security
  security: {
    requireAuth: (options?: { allowedPublicPaths?: string[]; requiredScopes?: string[] }) => new RuleBuilder({
      id: 'security/require-auth',
      name: 'Require Authentication',
      description: 'All endpoints should require authentication except those explicitly marked as public',
      category: 'security',
      severity: 'error',
      validate: '',
      examples: {
        valid: ['{"security": [{"bearerAuth": []}]}', '{"tags": ["public"]}'],
        invalid: ['{"security": []}', '{}']
      }
    })
    .withOperationValidation((path, method, operation) => {
      const results = [];
      const isPublic = operation.tags?.includes('public');
      const hasAuth = operation.security && operation.security.length > 0;
      const isAllowedPath = options?.allowedPublicPaths?.some(p => path.startsWith(p));

      if (!isPublic && !isAllowedPath && !hasAuth) {
        results.push({
          ruleId: 'security/require-auth',
          type: 'error',
          message: `Endpoint ${method.toUpperCase()} ${path} requires authentication`,
          path: `#/paths/${path}/${method}`
        });
      }

      return results;
    })
    .withSecurityValidation(options?.requiredScopes),

    validateScopes: (requiredScopes: string[]) => new RuleBuilder({
      id: 'security/validate-scopes',
      name: 'Validate OAuth Scopes',
      description: 'Ensure endpoints have the required OAuth scopes',
      category: 'security',
      severity: 'error',
      validate: '',
      examples: {
        valid: ['{"security": [{"oauth2": ["read:users"]}]}'],
        invalid: ['{"security": [{"oauth2": []}]}']
      }
    }).withSecurityValidation(requiredScopes)
  },

  // Documentation
  documentation: {
    requireDescription: (options?: { minLength?: number }) => new RuleBuilder({
      id: 'documentation/require-description',
      name: 'Require Description',
      description: 'All schemas and operations should have descriptions',
      category: 'documentation',
      severity: 'warning',
      validate: '',
      examples: {
        valid: ['{"description": "A detailed description"}'],
        invalid: ['{}', '{"description": ""}']
      }
    })
    .withSchemaValidation((schemaName, schema) => {
      const results = [];
      const minLength = options?.minLength || 10;

      if (!schema.description || schema.description.length < minLength) {
        results.push({
          ruleId: 'documentation/require-description',
          type: 'warning',
          message: `Schema "${schemaName}" should have a description of at least ${minLength} characters`,
          path: `#/components/schemas/${schemaName}`
        });
      }

      return results;
    })
    .withOperationValidation((path, method, operation) => {
      const results = [];
      const minLength = options?.minLength || 10;

      if (!operation.description || operation.description.length < minLength) {
        results.push({
          ruleId: 'documentation/require-description',
          type: 'warning',
          message: `Operation ${method.toUpperCase()} ${path} should have a description of at least ${minLength} characters`,
          path: `#/paths/${path}/${method}`
        });
      }

      return results;
    }),

    requireExamples: () => new RuleBuilder({
      id: 'documentation/require-examples',
      name: 'Require Examples',
      description: 'Response schemas should include examples',
      category: 'documentation',
      severity: 'warning',
      validate: '',
      examples: {
        valid: ['{"content": {"application/json": {"example": {...}}}}'],
        invalid: ['{"content": {"application/json": {}}}']
      }
    })
    .withOperationValidation((path, method, operation) => {
      const results = [];

      if (operation.responses) {
        Object.entries(operation.responses).forEach(([code, response]) => {
          if (response && typeof response === 'object' && 'content' in response) {
            const resp = response as OpenAPIV3.ResponseObject;
            Object.entries(resp.content || {}).forEach(([mediaType, content]) => {
              if (!content.example && !content.examples) {
                results.push({
                  ruleId: 'documentation/require-examples',
                  type: 'warning',
                  message: `Response ${code} for ${method.toUpperCase()} ${path} (${mediaType}) should include examples`,
                  path: `#/paths/${path}/${method}/responses/${code}/content/${mediaType}`
                });
              }
            });
          }
        });
      }

      return results;
    }),

    requireParameterDescriptions: () => new RuleBuilder({
      id: 'documentation/require-parameter-descriptions',
      name: 'Require Parameter Descriptions',
      description: 'All operation parameters should have descriptions',
      category: 'documentation',
      severity: 'warning',
      validate: '',
      examples: {
        valid: ['{"parameters": [{"name": "userId", "description": "The unique identifier of the user"}]}'],
        invalid: ['{"parameters": [{"name": "userId"}]}']
      }
    })
    .withOperationValidation((path, method, operation) => {
      const results = [];

      (operation.parameters || []).forEach((param, index) => {
        if (!param.description || param.description.trim().length === 0) {
          results.push({
            ruleId: 'documentation/require-parameter-descriptions',
            type: 'warning',
            message: `Parameter "${param.name}" in ${method.toUpperCase()} ${path} should have a description`,
            path: `#/paths/${path}/${method}/parameters/${index}`
          });
        }
      });

      if (operation.requestBody && 'content' in operation.requestBody) {
        const requestBody = operation.requestBody as OpenAPIV3.RequestBodyObject;
        if (!requestBody.description || requestBody.description.trim().length === 0) {
          results.push({
            ruleId: 'documentation/require-parameter-descriptions',
            type: 'warning',
            message: `Request body in ${method.toUpperCase()} ${path} should have a description`,
            path: `#/paths/${path}/${method}/requestBody`
          });
        }
      }

      return results;
    })
  },

  // Structure
  structure: {
    consistentResponse: (template: any) => new RuleBuilder({
      id: 'structure/consistent-response',
      name: 'Consistent Response Structure',
      description: 'Response objects should follow a consistent structure',
      category: 'structure',
      severity: 'warning',
      validate: '',
      examples: {
        valid: ['{"data": {...}, "metadata": {...}}'],
        invalid: ['[...]', '{"items": [...]}']
      }
    })
    .withOperationValidation((path, method, operation) => {
      const results = [];

      if (operation.responses) {
        Object.entries(operation.responses).forEach(([code, response]) => {
          if (response && typeof response === 'object' && 'content' in response) {
            const resp = response as OpenAPIV3.ResponseObject;
            Object.entries(resp.content || {}).forEach(([mediaType, content]) => {
              if (content.schema && !matchesTemplate(content.schema, template)) {
                results.push({
                  ruleId: 'structure/consistent-response',
                  type: 'warning',
                  message: `Response ${code} for ${method.toUpperCase()} ${path} does not match the required structure`,
                  path: `#/paths/${path}/${method}/responses/${code}/content/${mediaType}/schema`
                });
              }
            });
          }
        });
      }

      return results;
    })
  },

  // API Consistency
  apiConsistency: {
    resourceNaming: (options?: { allowedResources?: string[] }) => new RuleBuilder({
      id: 'consistency/resource-naming',
      name: 'Resource Naming Convention',
      description: 'Ensure API resources follow RESTful naming conventions',
      category: 'structure',
      severity: 'warning',
      validate: '',
      examples: {
        valid: ['/users', '/users/{id}', '/users/{userId}/orders'],
        invalid: ['/getUsers', '/user', '/users/{userId}/getOrders']
      }
    })
    .withOperationValidation((path, method, operation) => {
      const results = [];
      const pathSegments = path.split('/').filter(Boolean);
      const allowedMethods = {
        get: ['', '/{id}', '/search', '/count'],
        post: ['', '/batch', '/import'],
        put: ['/{id}'],
        patch: ['/{id}'],
        delete: ['/{id}', '/batch']
      };

      // Check if resource name is plural
      pathSegments.forEach((segment, index) => {
        if (!segment.startsWith('{') && !segment.endsWith('}')) {
          if (!/s$/.test(segment)) {
            results.push({
              ruleId: 'consistency/resource-naming',
              type: 'warning',
              message: `Resource "${segment}" should be plural`,
              path: `#/paths/${path}`,
              suggestions: [
                `Change "${segment}" to "${segment}s"`,
                `Consider using a collective noun if appropriate`
              ],
              context: {
                resourceName: segment,
                suggestedName: `${segment}s`,
                pathSegment: index,
                fixable: true
              }
            });
          }
        }
      });

      // Check method-path consistency
      const lastSegment = pathSegments[pathSegments.length - 1];
      const allowedPatterns = allowedMethods[method.toLowerCase() as keyof typeof allowedMethods] || [];
      const matchesPattern = allowedPatterns.some(pattern => {
        const regex = new RegExp(`^${pattern.replace(/{id}/g, '{[^}]+}')}$`);
        return regex.test('/' + lastSegment);
      });

      if (!matchesPattern) {
        results.push({
          ruleId: 'consistency/resource-naming',
          type: 'warning',
          message: `${method.toUpperCase()} operation path doesn't follow REST conventions`,
          path: `#/paths/${path}/${method}`,
          suggestions: [
            `Consider using one of: ${allowedPatterns.join(', ')}`,
            'Follow REST resource naming conventions'
          ],
          context: {
            method,
            path,
            allowedPatterns,
            fixable: false
          }
        });
      }

      return results;
    }),

    versionedEndpoints: () => new RuleBuilder({
      id: 'consistency/versioned-endpoints',
      name: 'Versioned Endpoints',
      description: 'Ensure all endpoints are properly versioned',
      category: 'structure',
      severity: 'error',
      validate: '',
      examples: {
        valid: ['/v1/users', '/v2/orders'],
        invalid: ['/users', '/api/orders']
      }
    })
    .withOperationValidation((path, method, operation) => {
      const results = [];
      const versionPattern = /^\/v\d+\//;

      if (!versionPattern.test(path)) {
        const suggestedPath = `/v1${path}`;
        results.push({
          ruleId: 'consistency/versioned-endpoints',
          type: 'error',
          message: `Endpoint ${method.toUpperCase()} ${path} is not versioned`,
          path: `#/paths/${path}`,
          suggestions: [
            `Move to ${suggestedPath}`,
            'Add version prefix to the path'
          ],
          context: {
            currentPath: path,
            suggestedPath,
            fixable: true,
            fix: {
              type: 'movePath',
              from: path,
              to: suggestedPath
            }
          }
        });
      }

      return results;
    }),

    consistentErrorResponses: () => new RuleBuilder({
      id: 'consistency/error-responses',
      name: 'Consistent Error Responses',
      description: 'Ensure error responses follow a consistent structure',
      category: 'structure',
      severity: 'warning',
      validate: '',
      examples: {
        valid: [
          {
            description: 'Error response',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['code', 'message'],
                  properties: {
                    code: { type: 'string' },
                    message: { type: 'string' },
                    details: { type: 'object' }
                  }
                }
              }
            }
          }
        ],
        invalid: [
          { description: 'Error', schema: { type: 'string' } },
          { content: { 'application/json': { schema: { type: 'object' } } } }
        ]
      }
    })
    .withOperationValidation((path, method, operation) => {
      const results = [];
      const errorCodes = ['400', '401', '403', '404', '409', '422', '429', '500'];
      const requiredErrorStructure = {
        type: 'object',
        required: ['code', 'message'],
        properties: {
          code: { type: 'string' },
          message: { type: 'string' },
          details: { type: 'object' }
        }
      };

      if (operation.responses) {
        Object.entries(operation.responses).forEach(([code, response]) => {
          if (errorCodes.includes(code)) {
            if (response && typeof response === 'object' && 'content' in response) {
              const resp = response as OpenAPIV3.ResponseObject;
              const jsonContent = resp.content?.['application/json'];

              if (!jsonContent?.schema || !matchesTemplate(jsonContent.schema, requiredErrorStructure)) {
                results.push({
                  ruleId: 'consistency/error-responses',
                  type: 'warning',
                  message: `Error response ${code} for ${method.toUpperCase()} ${path} should follow standard error structure`,
                  path: `#/paths/${path}/${method}/responses/${code}`,
                  suggestions: [
                    'Use standard error response structure',
                    'Include code and message fields',
                    'Add details object for additional information'
                  ],
                  context: {
                    statusCode: code,
                    currentSchema: jsonContent?.schema,
                    requiredStructure: requiredErrorStructure,
                    fixable: true,
                    fix: {
                      type: 'updateSchema',
                      schema: requiredErrorStructure
                    }
                  }
                });
              }

              // Check error description
              if (!resp.description || resp.description.length < 10) {
                results.push({
                  ruleId: 'consistency/error-responses',
                  type: 'warning',
                  message: `Error response ${code} should have a clear description`,
                  path: `#/paths/${path}/${method}/responses/${code}/description`,
                  suggestions: [
                    `Add a description explaining when this error occurs`,
                    `Include possible resolution steps in the description`
                  ],
                  context: {
                    statusCode: code,
                    currentDescription: resp.description || '',
                    fixable: true
                  }
                });
              }
            }
          }
        });
      }

      return results;
    })
  }
};

function matchesTemplate(schema: any, template: any): boolean {
  if (typeof template !== typeof schema) return false;
  if (Array.isArray(template) !== Array.isArray(schema)) return false;

  if (typeof template === 'object' && template !== null) {
    return Object.keys(template).every(key => {
      if (!(key in schema)) return false;
      return matchesTemplate(schema[key], template[key]);
    });
  }

  return true;
} 