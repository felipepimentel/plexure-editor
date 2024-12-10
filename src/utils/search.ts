interface SearchResult {
  type: 'path' | 'method' | 'schema';
  title: string;
  path: string;
  method?: string;
}

export function searchSpecification(spec: any, query: string): SearchResult[] {
  const results: SearchResult[] = [];
  const normalizedQuery = query.toLowerCase();

  // Search paths
  Object.entries(spec.paths || {}).forEach(([path, pathItem]: [string, any]) => {
    if (path.toLowerCase().includes(normalizedQuery)) {
      results.push({
        type: 'path',
        title: path,
        path: path
      });
    }

    // Search methods
    Object.entries(pathItem || {}).forEach(([method, operation]: [string, any]) => {
      if (method === '$ref') return;

      const searchableText = [
        operation.summary,
        operation.description,
        operation.operationId
      ].filter(Boolean).join(' ').toLowerCase();

      if (searchableText.includes(normalizedQuery)) {
        results.push({
          type: 'method',
          title: operation.summary || `${method.toUpperCase()} ${path}`,
          path: path,
          method: method
        });
      }
    });
  });

  // Search schemas
  Object.entries(spec.components?.schemas || {}).forEach(([name, schema]: [string, any]) => {
    if (name.toLowerCase().includes(normalizedQuery) ||
        schema.description?.toLowerCase().includes(normalizedQuery)) {
      results.push({
        type: 'schema',
        title: name,
        path: `#/components/schemas/${name}`
      });
    }
  });

  return results;
}