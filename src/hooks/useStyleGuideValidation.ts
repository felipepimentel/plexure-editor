import { useEffect, useState } from 'react';
import { OpenAPI } from 'openapi-types';
import { ValidationResult } from '../types/styleGuide';
import { useStyleGuideStore } from '../store/styleGuideStore';
import { validateStyleGuide } from '../utils/validateStyleGuide';
import { parseSpecification } from '../utils/swagger';

export function useStyleGuideValidation(specContent: string) {
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);
  const { activeGuide } = useStyleGuideStore();

  useEffect(() => {
    const validateSpec = async () => {
      const { spec, error } = await parseSpecification(specContent);
      
      if (error || !spec) {
        setValidationResults([]);
        return;
      }

      const results = validateStyleGuide(spec as OpenAPI.Document, activeGuide);
      setValidationResults(results);
    };

    validateSpec();
  }, [specContent, activeGuide]);

  return validationResults;
}