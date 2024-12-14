import { useState, useCallback } from 'react';
import { parse } from 'yaml';

interface OpenAPIInfo {
  title: string;
  version: string;
  description?: string;
}

interface OpenAPIEndpoint {
  path: string;
  method: string;
  summary: string;
  description?: string;
}

interface OpenAPISchema {
  name: string;
  type: string;
  required: string[];
  properties: Record<string, {
    type: string;
    format?: string;
    description?: string;
  }>;
}

interface ParsedOpenAPI {
  info: OpenAPIInfo;
  endpoints: OpenAPIEndpoint[];
  schemas: OpenAPISchema[];
}

export function useEditorState(initialSpec: string) {
  const [spec, setSpec] = useState(initialSpec);
  const [parsedSpec, setParsedSpec] = useState<ParsedOpenAPI | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);

  const parseOpenAPI = useCallback((yamlContent: string) => {
    try {
      const parsed = parse(yamlContent);
      
      // Extract API Info
      const info: OpenAPIInfo = {
        title: parsed.info.title,
        version: parsed.info.version,
        description: parsed.info.description,
      };

      // Extract Endpoints
      const endpoints: OpenAPIEndpoint[] = [];
      Object.entries(parsed.paths || {}).forEach(([path, methods]: [string, any]) => {
        Object.entries(methods).forEach(([method, data]: [string, any]) => {
          endpoints.push({
            path,
            method: method.toUpperCase(),
            summary: data.summary || '',
            description: data.description,
          });
        });
      });

      // Extract Schemas
      const schemas: OpenAPISchema[] = [];
      Object.entries(parsed.components?.schemas || {}).forEach(([name, schema]: [string, any]) => {
        schemas.push({
          name,
          type: schema.type,
          required: schema.required || [],
          properties: schema.properties || {},
        });
      });

      setParsedSpec({ info, endpoints, schemas });
      setParseError(null);
    } catch (error) {
      console.error('Failed to parse OpenAPI spec:', error);
      setParseError(error instanceof Error ? error.message : 'Failed to parse OpenAPI specification');
      setParsedSpec(null);
    }
  }, []);

  const updateSpec = useCallback((newSpec: string) => {
    setSpec(newSpec);
    parseOpenAPI(newSpec);
  }, [parseOpenAPI]);

  return {
    spec,
    parsedSpec,
    parseError,
    updateSpec,
  };
} 