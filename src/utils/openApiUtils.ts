import { OpenAPI } from 'openapi-types';

interface NavigationNode {
  id: string;
  type: 'path' | 'method' | 'schema' | 'response' | 'parameter';
  label: string;
  children?: NavigationNode[];
  method?: string;
  path?: string;
}

export function buildNavigationTree(spec: OpenAPI.Document | null): NavigationNode[] {
  if (!spec) return [];

  const nodes: NavigationNode[] = [];

  // Add Paths
  if (spec.paths) {
    const pathsNode: NavigationNode = {
      id: 'paths',
      type: 'path',
      label: 'Paths',
      children: []
    };

    Object.entries(spec.paths).forEach(([path, pathItem]) => {
      const pathNode: NavigationNode = {
        id: `path-${path}`,
        type: 'path',
        label: path,
        path,
        children: []
      };

      // Add methods for each path
      if (pathItem) {
        const methods = ['get', 'post', 'put', 'delete', 'patch', 'options', 'head'] as const;
        methods.forEach(method => {
          const operation = pathItem[method];
          if (operation) {
            const methodNode: NavigationNode = {
              id: `${path}-${method}`,
              type: 'method',
              label: operation.summary || method.toUpperCase(),
              method,
              path,
              children: []
            };

            // Add parameters
            if (operation.parameters?.length) {
              methodNode.children?.push({
                id: `${path}-${method}-parameters`,
                type: 'parameter',
                label: 'Parameters',
                children: operation.parameters.map(param => ({
                  id: `${path}-${method}-param-${param.name}`,
                  type: 'parameter',
                  label: param.name
                }))
              });
            }

            // Add responses
            if (operation.responses) {
              const responsesNode: NavigationNode = {
                id: `${path}-${method}-responses`,
                type: 'response',
                label: 'Responses',
                children: []
              };

              Object.entries(operation.responses).forEach(([code, response]) => {
                responsesNode.children?.push({
                  id: `${path}-${method}-response-${code}`,
                  type: 'response',
                  label: `${code} ${(response as any)?.description || ''}`
                });
              });

              methodNode.children?.push(responsesNode);
            }

            pathNode.children?.push(methodNode);
          }
        });
      }

      pathsNode.children?.push(pathNode);
    });

    nodes.push(pathsNode);
  }

  // Add Schemas
  if (spec.components?.schemas) {
    const schemasNode: NavigationNode = {
      id: 'schemas',
      type: 'schema',
      label: 'Schemas',
      children: Object.entries(spec.components.schemas).map(([name, schema]) => ({
        id: `schema-${name}`,
        type: 'schema',
        label: name
      }))
    };

    nodes.push(schemasNode);
  }

  return nodes;
} 