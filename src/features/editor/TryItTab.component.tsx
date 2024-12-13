import React, { useState } from 'react';
import { Play } from 'lucide-react';
import { BaseButton } from '../../ui/Button';
import { ParameterInput } from '../ParameterInput';
import { RequestBodyInput } from '../RequestBodyInput';

interface TryItTabProps {
  path: string;
  method: string;
  operation: any;
  darkMode: boolean;
}

export function TryItTab({ path, method, operation, darkMode }: TryItTabProps) {
  const [loading, setLoading] = useState(false);
  const [parameters, setParameters] = useState<Record<string, any>>({});
  const [requestBody, setRequestBody] = useState<any>(null);

  const handleSend = async () => {
    setLoading(true);
    try {
      // Implement send logic
      await new Promise(resolve => setTimeout(resolve, 1000));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-4">
      {/* Parameters */}
      {operation.parameters && operation.parameters.length > 0 && (
        <section>
          <h3 className={`text-sm font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Parameters
          </h3>
          <div className="space-y-3">
            {operation.parameters.map(param => (
              <ParameterInput
                key={`${param.in}-${param.name}`}
                parameter={param}
                value={parameters[param.name]}
                onChange={value => setParameters(prev => ({ ...prev, [param.name]: value }))}
                darkMode={darkMode}
              />
            ))}
          </div>
        </section>
      )}

      {/* Request Body */}
      {operation.requestBody && (
        <section>
          <h3 className={`text-sm font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Request Body
          </h3>
          <RequestBodyInput
            requestBody={operation.requestBody}
            value={requestBody}
            onChange={setRequestBody}
            darkMode={darkMode}
          />
        </section>
      )}

      {/* Send Button */}
      <div className="flex justify-end">
        <BaseButton
          onClick={handleSend}
          disabled={loading}
          darkMode={darkMode}
          icon={<Play className="w-4 h-4" />}
          loading={loading}
        >
          {loading ? 'Sending...' : 'Send Request'}
        </BaseButton>
      </div>
    </div>
  );
} 