import { StyleGuide } from '../types/styleGuide';

export const defaultStyleGuide: StyleGuide = {
  id: 'default',
  name: 'Default Style Guide',
  description: 'Default OpenAPI style guide with common best practices',
  rules: [
    {
      id: 'plural-resource-names',
      name: 'Plural Resource Names',
      description: 'Resource names in paths should be plural (e.g., /users instead of /user)',
      type: 'naming',
      severity: 'warning',
      validator: (path: string) => {
        const segments = path.split('/').filter(Boolean);
        const lastSegment = segments[segments.length - 1];
        if (!lastSegment) return { valid: true };
        
        // Common irregular plurals
        const irregularPlurals = {
          person: 'people',
          child: 'children',
          foot: 'feet',
          tooth: 'teeth',
          goose: 'geese',
          mouse: 'mice',
          criterion: 'criteria'
        };

        const isPlural = (word: string): boolean => {
          if (irregularPlurals[word as keyof typeof irregularPlurals]) {
            return word === irregularPlurals[word as keyof typeof irregularPlurals];
          }
          return word.endsWith('s') || word.endsWith('es') || word.endsWith('ies');
        };

        return {
          valid: isPlural(lastSegment),
          message: !isPlural(lastSegment) 
            ? `Resource "${lastSegment}" should be plural` 
            : undefined
        };
      }
    },
    {
      id: 'version-in-path',
      name: 'Version in Path',
      description: 'API paths should include version prefix (e.g., /v1/users)',
      type: 'structure',
      severity: 'error',
      validator: (path: string) => ({
        valid: /^\/v\d+/.test(path),
        message: !(/^\/v\d+/.test(path)) 
          ? 'Path should start with version prefix (e.g., /v1)' 
          : undefined
      })
    },
    {
      id: 'operation-summary',
      name: 'Operation Summary',
      description: 'Each operation should have a summary',
      type: 'content',
      severity: 'warning',
      validator: (operation: any) => ({
        valid: Boolean(operation.summary),
        message: !operation.summary 
          ? 'Operation should have a summary' 
          : undefined
      })
    }
  ]
};