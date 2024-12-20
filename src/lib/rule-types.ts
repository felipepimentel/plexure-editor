import { OpenAPIV3 } from 'openapi-types';

export interface RuleOption {
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  description: string;
  default?: any;
  enum?: any[];
  required?: boolean;
  items?: {
    type: string;
    enum?: any[];
  };
  properties?: Record<string, RuleOption>;
}

export interface RuleDefinition {
  id: string;
  name: string;
  description: string;
  category: string;
  severity: 'error' | 'warning' | 'info';
  options?: Record<string, RuleOption>;
  validate: string; // Function body as string
  fix?: string; // Function body as string
  examples?: {
    valid: string[];
    invalid: string[];
  };
}

export interface RuleTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  severity: 'error' | 'warning' | 'info';
  template: string;
  defaultOptions?: Record<string, any>;
  examples?: {
    valid: string[];
    invalid: string[];
  };
}

export const ruleTemplates: RuleTemplate[] = [
  {
    id: 'naming/custom-prefix',
    name: 'Custom Prefix Rule',
    description: 'Enforce a specific prefix for schema names',
    category: 'naming',
    severity: 'warning',
    template: `
      const prefix = options.prefix || '';
      const results = [];
      
      if (spec.components?.schemas) {
        Object.keys(spec.components.schemas).forEach(schemaName => {
          if (!schemaName.startsWith(prefix)) {
            results.push({
              ruleId: 'naming/custom-prefix',
              type: 'warning',
              message: \`Schema name "\${schemaName}" should start with "\${prefix}"\`,
              path: \`#/components/schemas/\${schemaName}\`,
              suggestions: [
                \`\${prefix}\${schemaName}\`
              ]
            });
          }
        });
      }
      
      return results;
    `,
    defaultOptions: {
      prefix: 'Api'
    },
    examples: {
      valid: ['ApiUser', 'ApiOrder'],
      invalid: ['User', 'Order']
    }
  },
  {
    id: 'security/required-headers',
    name: 'Required Headers Rule',
    description: 'Enforce specific headers for all operations',
    category: 'security',
    severity: 'error',
    template: `
      const requiredHeaders = options.headers || [];
      const results = [];
      
      const paths = spec.paths || {};
      Object.entries(paths).forEach(([path, pathItem]) => {
        Object.entries(pathItem || {}).forEach(([method, operation]) => {
          if (method === 'parameters') return;
          
          const op = operation as OpenAPIV3.OperationObject;
          const parameters = op.parameters || [];
          
          requiredHeaders.forEach(header => {
            const hasHeader = parameters.some(param => 
              param.in === 'header' && param.name === header
            );
            
            if (!hasHeader) {
              results.push({
                ruleId: 'security/required-headers',
                type: 'error',
                message: \`Operation \${method.toUpperCase()} \${path} is missing required header "\${header}"\`,
                path: \`#/paths/\${path}/\${method}/parameters\`,
                suggestions: [
                  \`Add header parameter: \${header}\`
                ]
              });
            }
          });
        });
      });
      
      return results;
    `,
    defaultOptions: {
      headers: ['X-API-Version', 'X-Request-ID']
    },
    examples: {
      valid: [
        '{"parameters": [{"in": "header", "name": "X-API-Version"}]}',
        '{"parameters": [{"in": "header", "name": "X-Request-ID"}]}'
      ],
      invalid: [
        '{"parameters": []}',
        '{"parameters": [{"in": "query", "name": "version"}]}'
      ]
    }
  },
  {
    id: 'structure/response-pagination',
    name: 'Response Pagination Rule',
    description: 'Enforce pagination structure for list endpoints',
    category: 'structure',
    severity: 'warning',
    template: `
      const results = [];
      const paths = spec.paths || {};
      
      Object.entries(paths).forEach(([path, pathItem]) => {
        Object.entries(pathItem || {}).forEach(([method, operation]) => {
          if (method === 'parameters') return;
          
          const op = operation as OpenAPIV3.OperationObject;
          if (op.responses) {
            Object.entries(op.responses).forEach(([code, response]: [string, any]) => {
              if (code.startsWith('2') && 
                  response.content?.['application/json']?.schema &&
                  path.includes('list')) {
                const schema = response.content['application/json'].schema;
                
                // Check pagination structure
                const hasData = schema.properties?.data;
                const hasPagination = schema.properties?.pagination;
                
                if (!hasData || !hasPagination) {
                  results.push({
                    ruleId: 'structure/response-pagination',
                    type: 'warning',
                    message: \`List endpoint \${method.toUpperCase()} \${path} should include pagination structure\`,
                    path: \`#/paths/\${path}/\${method}/responses/\${code}\`,
                    suggestions: [
                      'Add pagination structure: { data: T[], pagination: { total: number, page: number, limit: number } }'
                    ]
                  });
                }
              }
            });
          }
        });
      });
      
      return results;
    `,
    defaultOptions: {
      paginationFields: ['total', 'page', 'limit']
    },
    examples: {
      valid: [
        '{"data": [], "pagination": {"total": 100, "page": 1, "limit": 10}}',
        '{"data": [], "pagination": {"total": 0, "page": 1, "limit": 20}}'
      ],
      invalid: [
        '{"items": []}',
        '{"data": [], "meta": {"count": 100}}'
      ]
    }
  }
]; 