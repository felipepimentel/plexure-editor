import { parse } from 'yaml';
import type { ValidationMessage } from './types';

export async function validateContent(content: string) {
  const messages: ValidationMessage[] = [];
  let parsedSpec = null;

  try {
    // Parse YAML
    parsedSpec = parse(content);

    // Basic OpenAPI validation
    if (!parsedSpec.openapi) {
      messages.push({
        id: 'openapi-version',
        type: 'error',
        message: 'Missing OpenAPI version'
      });
    }

    if (!parsedSpec.info) {
      messages.push({
        id: 'info',
        type: 'error',
        message: 'Missing info object'
      });
    } else {
      if (!parsedSpec.info.title) {
        messages.push({
          id: 'info-title',
          type: 'error',
          message: 'Missing API title'
        });
      }
      if (!parsedSpec.info.version) {
        messages.push({
          id: 'info-version',
          type: 'error',
          message: 'Missing API version'
        });
      }
    }

    if (!parsedSpec.paths) {
      messages.push({
        id: 'paths',
        type: 'warning',
        message: 'No paths defined'
      });
    } else {
      // Validate each path
      Object.entries(parsedSpec.paths).forEach(([path, pathObj]: [string, any]) => {
        if (!path.startsWith('/')) {
          messages.push({
            id: `path-${path}`,
            type: 'error',
            message: `Path "${path}" must start with /`,
            path: `paths.${path}`
          });
        }

        // Validate operations
        const operations = ['get', 'post', 'put', 'delete', 'patch', 'options', 'head', 'trace'];
        operations.forEach(op => {
          if (pathObj[op]) {
            if (!pathObj[op].responses) {
              messages.push({
                id: `${path}-${op}-responses`,
                type: 'error',
                message: `Missing responses for ${op.toUpperCase()} ${path}`,
                path: `paths.${path}.${op}`
              });
            }
          }
        });
      });
    }

  } catch (error) {
    messages.push({
      id: 'yaml-syntax',
      type: 'error',
      message: error instanceof Error ? error.message : 'Invalid YAML syntax'
    });
  }

  return { messages, parsedSpec };
}
