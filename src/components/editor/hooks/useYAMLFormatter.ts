import { useCallback } from 'react';
import { parse, stringify } from 'yaml';

export function useYAMLFormatter() {
  const formatYAML = useCallback((content: string): string => {
    try {
      // Parse and re-stringify to format
      const parsed = parse(content);
      return stringify(parsed, {
        indent: 2,
        lineWidth: 0, // Disable line wrapping
        minContentWidth: 0,
        nullStr: 'null',
        simpleKeys: false,
        singleQuote: false
      });
    } catch (err) {
      // Return original content if parsing fails
      return content;
    }
  }, []);

  return formatYAML;
} 