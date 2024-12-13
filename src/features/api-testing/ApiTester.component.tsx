import React, { useState } from 'react';
import { Play, Copy, Download } from 'lucide-react';
import { BaseButton } from '@ui/Button';
import { BaseForm, BaseFormField, BaseFormInput, BaseFormTextArea } from '@ui/Form';

interface ApiTesterProps {
  method: string;
  path: string;
  parameters?: any[];
  requestBody?: any;
  darkMode: boolean;
}

export function ApiTester({
  method,
  path,
  parameters,
  requestBody,
  darkMode
}: ApiTesterProps) {
  const [paramValues, setParamValues] = useState<Record<string, string>>({});
  const [bodyValue, setBodyValue] = useState('');
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Implement API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setResponse({
        status: 200,
        data: { message: 'Success' }
      });
    } catch (error) {
      setResponse({
        status: 500,
        error: 'Failed to make request'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopyResponse = () => {
    if (response) {
      navigator.clipboard.writeText(JSON.stringify(response, null, 2));
    }
  };

  const handleDownloadResponse = () => {
    if (response) {
      const blob = new Blob([JSON.stringify(response, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'response.json';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="space-y-4">
      <BaseForm onSubmit={handleSubmit} darkMode={darkMode}>
        {parameters?.map(param => (
          <BaseFormField
            key={param.name}
            label={param.name}
            darkMode={darkMode}
          >
            <BaseFormInput
              type="text"
              value={paramValues[param.name] || ''}
              onChange={(e) => setParamValues(prev => ({
                ...prev,
                [param.name]: e.target.value
              }))}
              placeholder={param.description}
              required={param.required}
              darkMode={darkMode}
            />
          </BaseFormField>
        ))}

        {requestBody && (
          <BaseFormField
            label="Request Body"
            darkMode={darkMode}
          >
            <BaseFormTextArea
              value={bodyValue}
              onChange={(e) => setBodyValue(e.target.value)}
              rows={5}
              placeholder="Enter request body (JSON)"
              darkMode={darkMode}
              className="font-mono text-sm"
            />
          </BaseFormField>
        )}

        <div className="flex justify-end gap-2">
          <BaseButton
            type="submit"
            loading={loading}
            darkMode={darkMode}
            icon={<Play className="w-4 h-4" />}
          >
            Send Request
          </BaseButton>
        </div>
      </BaseForm>

      {response && (
        <div className={`p-4 rounded-lg ${
          darkMode ? 'bg-gray-700' : 'bg-gray-100'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <div className={`text-sm font-medium ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Response
            </div>
            <div className="flex gap-2">
              <BaseButton
                variant="ghost"
                size="sm"
                onClick={handleCopyResponse}
                darkMode={darkMode}
                icon={<Copy className="w-4 h-4" />}
              >
                Copy
              </BaseButton>
              <BaseButton
                variant="ghost"
                size="sm"
                onClick={handleDownloadResponse}
                darkMode={darkMode}
                icon={<Download className="w-4 h-4" />}
              >
                Download
              </BaseButton>
            </div>
          </div>
          <pre className={`text-sm font-mono overflow-auto ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}