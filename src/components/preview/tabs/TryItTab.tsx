import React, { useState } from 'react';
import { Play, Copy, Download } from 'lucide-react';
import { ParameterInput } from '../ParameterInput';
import { RequestBodyInput } from '../RequestBodyInput';
import { ResponseViewer } from '../ResponseViewer';

interface TryItTabProps {
  path: string;
  method: string;
  operation: any;
  darkMode: boolean;
}

export function TryItTab({ path, method, operation, darkMode }: TryItTabProps) {
  const [parameters, setParameters] = useState<Record<string, any>>({});
  const [requestBody, setRequestBody] = useState<any>(null);
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    setLoading(true);
    try {
      // Implementar lógica de envio da requisição
      const result = await sendRequest(path, method, parameters, requestBody);
      setResponse(result);
    } catch (error) {
      setResponse({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* URL Preview */}
      <div className={`
        p-3 rounded-lg font-mono text-sm
        ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}
      `}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-x-auto">
            <span className={method === 'get' ? 'text-blue-400' : 'text-green-400'}>
              {method.toUpperCase()}
            </span>
            <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
              {formatUrl(path, parameters)}
            </span>
          </div>
          <button
            onClick={() => copyToClipboard(formatUrl(path, parameters))}
            className="p-1.5 rounded-lg hover:bg-gray-700 text-gray-400"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>
      </div>

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
        <button
          onClick={handleSend}
          disabled={loading}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg
            ${darkMode ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'}
            text-white font-medium transition-colors
          `}
        >
          {loading ? 'Sending...' : (
            <>
              <Play className="w-4 h-4" />
              Send Request
            </>
          )}
        </button>
      </div>

      {/* Response */}
      {response && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Response
            </h3>
            <button
              onClick={() => downloadResponse(response)}
              className="flex items-center gap-1.5 px-2 py-1 text-xs rounded-lg
                text-gray-400 hover:text-gray-300 hover:bg-gray-800"
            >
              <Download className="w-3 h-3" />
              Download
            </button>
          </div>
          <ResponseViewer
            response={response}
            darkMode={darkMode}
          />
        </section>
      )}
    </div>
  );
} 