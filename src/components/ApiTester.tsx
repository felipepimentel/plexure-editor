import React, { useState } from 'react';
import { Play, Code, Copy, Download } from 'lucide-react';

interface ApiTesterProps {
  method: string;
  path: string;
  parameters: any[];
  requestBody: any;
  darkMode: boolean;
}

export function ApiTester({ method, path, parameters, requestBody, darkMode }: ApiTesterProps) {
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [paramValues, setParamValues] = useState<Record<string, string>>({});
  const [bodyContent, setBodyContent] = useState(
    requestBody ? JSON.stringify(requestBody.content?.['application/json']?.example || {}, null, 2) : ''
  );

  const handleTest = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setResponse({
        status: 200,
        headers: {
          'content-type': 'application/json',
          'x-response-time': '123ms'
        },
        body: { message: 'Success', data: {} }
      });
    } catch (error) {
      console.error('API test failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`mt-4 p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
      <h4 className={`font-medium mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
        Test Endpoint
      </h4>

      {parameters?.length > 0 && (
        <div className="mb-4 space-y-2">
          <h5 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Parameters
          </h5>
          {parameters.map(param => (
            <div key={param.name} className="flex items-center gap-2">
              <label className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {param.name}:
              </label>
              <input
                type="text"
                value={paramValues[param.name] || ''}
                onChange={e => setParamValues(prev => ({ ...prev, [param.name]: e.target.value }))}
                placeholder={param.example || param.type}
                className={`flex-1 px-2 py-1 text-sm rounded ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-gray-200'
                    : 'bg-white border-gray-300 text-gray-800'
                }`}
              />
            </div>
          ))}
        </div>
      )}

      {requestBody && (
        <div className="mb-4">
          <h5 className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Request Body
          </h5>
          <textarea
            value={bodyContent}
            onChange={e => setBodyContent(e.target.value)}
            rows={5}
            className={`w-full p-2 font-mono text-sm rounded ${
              darkMode
                ? 'bg-gray-700 border-gray-600 text-gray-200'
                : 'bg-white border-gray-300 text-gray-800'
            }`}
          />
        </div>
      )}

      <div className="flex items-center gap-2">
        <button
          onClick={handleTest}
          disabled={loading}
          className={`px-3 py-1.5 rounded flex items-center gap-1 ${
            darkMode
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
          }`}
        >
          <Play className="w-4 h-4" />
          {loading ? 'Testing...' : 'Test'}
        </button>
      </div>

      {response && (
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <h5 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Response
            </h5>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigator.clipboard.writeText(JSON.stringify(response, null, 2))}
                className={`p-1 rounded ${
                  darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                }`}
              >
                <Copy className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              </button>
              <button
                onClick={() => {
                  const blob = new Blob([JSON.stringify(response, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'response.json';
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className={`p-1 rounded ${
                  darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                }`}
              >
                <Download className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              </button>
            </div>
          </div>
          <div className={`p-2 rounded font-mono text-sm ${
            darkMode ? 'bg-gray-900 text-gray-300' : 'bg-white text-gray-800'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2 py-0.5 rounded ${
                response.status < 400
                  ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                  : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
              }`}>
                {response.status}
              </span>
              {Object.entries(response.headers).map(([key, value]) => (
                <span key={key} className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {key}: {value}
                </span>
              ))}
            </div>
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(response.body, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}