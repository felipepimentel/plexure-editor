import React from 'react';
import { cn } from '../lib/utils';
import { Editor } from '@monaco-editor/react';
import { CustomRule } from '../lib/custom-rules';
import {
  Play,
  Save,
  Copy,
  AlertCircle,
  AlertTriangle,
  Info,
  CheckCircle2
} from 'lucide-react';
import { Tooltip } from './ui/TooltipComponent';

interface RuleEditorProps {
  rule: CustomRule;
  onSave: (validateFn: string, fixFn?: string) => void;
  className?: string;
}

export const RuleEditor: React.FC<RuleEditorProps> = ({
  rule,
  onSave,
  className
}) => {
  const [validateFn, setValidateFn] = React.useState(rule.validate.toString());
  const [fixFn, setFixFn] = React.useState(rule.fix?.toString() || '');
  const [testResults, setTestResults] = React.useState<{
    success: boolean;
    message: string;
    type: 'error' | 'warning' | 'info' | 'success';
  } | null>(null);

  const handleTest = () => {
    try {
      // Create a test spec
      const testSpec = {
        openapi: '3.0.0',
        info: {
          title: 'Test API',
          version: '1.0.0'
        },
        paths: {},
        components: {
          schemas: {
            userProfile: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                name: { type: 'string' }
              }
            },
            order_item: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                quantity: { type: 'number' }
              }
            }
          }
        }
      };

      // Test the validation function
      const fn = new Function('spec', validateFn);
      const results = fn(testSpec);

      if (Array.isArray(results)) {
        setTestResults({
          success: true,
          message: `Validation function executed successfully. Found ${results.length} issues.`,
          type: 'success'
        });
      } else {
        setTestResults({
          success: false,
          message: 'Validation function must return an array of validation results.',
          type: 'error'
        });
      }
    } catch (error) {
      setTestResults({
        success: false,
        message: `Error executing validation function: ${error.message}`,
        type: 'error'
      });
    }
  };

  const handleSave = () => {
    try {
      // Test the validation function first
      new Function('spec', validateFn);
      
      // Test the fix function if provided
      if (fixFn.trim()) {
        new Function('spec', fixFn);
      }

      // If both functions are valid, save them
      onSave(validateFn, fixFn.trim() || undefined);
    } catch (error) {
      setTestResults({
        success: false,
        message: `Error in function: ${error.message}`,
        type: 'error'
      });
    }
  };

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Toolbar */}
      <div className="flex items-center justify-between p-2 border-b">
        <div className="flex items-center gap-2">
          <Tooltip content="Test">
            <button
              onClick={handleTest}
              className="p-1.5 rounded-md hover:bg-muted"
            >
              <Play className="h-4 w-4" />
            </button>
          </Tooltip>
          <Tooltip content="Save">
            <button
              onClick={handleSave}
              className="p-1.5 rounded-md hover:bg-muted"
            >
              <Save className="h-4 w-4" />
            </button>
          </Tooltip>
        </div>

        {testResults && (
          <div className={cn(
            'flex items-center gap-2 px-3 py-1.5 rounded-md text-sm',
            testResults.type === 'error' && 'bg-destructive/10 text-destructive',
            testResults.type === 'warning' && 'bg-warning/10 text-warning',
            testResults.type === 'info' && 'bg-info/10 text-info',
            testResults.type === 'success' && 'bg-success/10 text-success'
          )}>
            {testResults.type === 'error' && <AlertCircle className="h-4 w-4" />}
            {testResults.type === 'warning' && <AlertTriangle className="h-4 w-4" />}
            {testResults.type === 'info' && <Info className="h-4 w-4" />}
            {testResults.type === 'success' && <CheckCircle2 className="h-4 w-4" />}
            <span>{testResults.message}</span>
          </div>
        )}
      </div>

      {/* Editor */}
      <div className="flex-1 grid grid-rows-[1fr_auto] gap-4 p-4">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Validation Function</h3>
            <div className="h-[300px] border rounded-md overflow-hidden">
              <Editor
                defaultLanguage="javascript"
                value={validateFn}
                onChange={(value) => setValidateFn(value || '')}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                  wordWrap: 'on'
                }}
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              The validation function receives the OpenAPI spec as its only argument and should return an array of validation results.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Fix Function (Optional)</h3>
            <div className="h-[300px] border rounded-md overflow-hidden">
              <Editor
                defaultLanguage="javascript"
                value={fixFn}
                onChange={(value) => setFixFn(value || '')}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                  wordWrap: 'on'
                }}
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              The fix function receives the OpenAPI spec as its only argument and should return the modified spec with the issues fixed.
            </p>
          </div>
        </div>

        {/* Examples */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Example Validation Function</h3>
          <pre className="p-4 rounded-md bg-muted text-xs overflow-x-auto">
            {`function validate(spec) {
  const results = [];
  
  // Check if components.schemas exists
  if (spec.components?.schemas) {
    // Iterate through all schema names
    Object.keys(spec.components.schemas).forEach(schemaName => {
      // Check if schema name follows PascalCase
      if (!/^[A-Z][a-zA-Z0-9]*$/.test(schemaName)) {
        results.push({
          ruleId: 'naming/pascal-case-schemas',
          type: 'warning',
          message: \`Schema name "\${schemaName}" should use PascalCase\`,
          path: \`#/components/schemas/\${schemaName}\`,
          suggestions: [
            schemaName.replace(/(?:^|[-_])(\\w)/g, (_, c) => c.toUpperCase())
          ]
        });
      }
    });
  }
  
  return results;
}`}
          </pre>
        </div>
      </div>
    </div>
  );
}; 