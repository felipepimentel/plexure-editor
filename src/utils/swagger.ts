import { OpenAPI } from 'openapi-types';
import YAML from 'yaml';

export function validateOpenAPI(spec: any): string | null {
  try {
    if (!spec.openapi && !spec.swagger) {
      return 'Missing OpenAPI/Swagger version';
    }

    if (!spec.info) {
      return 'Missing info object';
    }

    if (!spec.paths) {
      return 'Missing paths object';
    }

    if (!spec.info.title) {
      return 'Missing API title';
    }

    if (!spec.info.version) {
      return 'Missing API version';
    }

    // Validate paths
    for (const [path, methods] of Object.entries<any>(spec.paths)) {
      if (!path.startsWith('/')) {
        return `Invalid path: ${path} - Must start with /`;
      }

      for (const [method, operation] of Object.entries<any>(methods)) {
        if (!['get', 'post', 'put', 'delete', 'patch', 'options', 'head'].includes(method)) {
          return `Invalid HTTP method: ${method} for path ${path}`;
        }

        if (operation.parameters) {
          for (const param of operation.parameters) {
            if (!param.name) {
              return `Missing parameter name in ${method.toUpperCase()} ${path}`;
            }
            if (!param.in) {
              return `Missing parameter location (in) in ${method.toUpperCase()} ${path}`;
            }
          }
        }
      }
    }

    return null;
  } catch (err) {
    return err instanceof Error ? err.message : 'Unknown error occurred';
  }
}

export async function parseSpecification(content: string): Promise<{ spec: OpenAPI.Document | null; error: string | null }> {
  try {
    const parsed = YAML.parse(content);
    const validationError = validateOpenAPI(parsed);
    
    if (validationError) {
      return { spec: null, error: validationError };
    }

    return { spec: parsed as OpenAPI.Document, error: null };
  } catch (err) {
    return { 
      spec: null, 
      error: err instanceof Error ? err.message : 'Failed to parse YAML content' 
    };
  }
}