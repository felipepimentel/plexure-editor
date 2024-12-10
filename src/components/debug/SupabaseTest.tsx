import React, { useState } from 'react';
import { supabase } from '../../config/supabase';

export function SupabaseTest() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    try {
      // Test 1: Check configuration
      setResult('Testing configuration...\n');
      const config = {
        url: supabase.supabaseUrl,
        headers: supabase.rest.headers
      };
      setResult(prev => prev + `Configuration:\n${JSON.stringify(config, null, 2)}\n\n`);

      // Test 2: Get current session
      setResult(prev => prev + 'Checking session...\n');
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        setResult(prev => prev + `Session error: ${sessionError.message}\n`);
        return;
      }

      if (!session) {
        setResult(prev => prev + 'No session found, attempting to sign in...\n');
        
        // Test 3: Try to sign in
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: 'demo@swagger-editor.com',
          password: 'demo123456'
        });

        if (signInError) {
          setResult(prev => prev + `Sign in error: ${signInError.message}\n`);
          return;
        }

        setResult(prev => prev + `Signed in as: ${signInData.user?.email}\n`);
      } else {
        setResult(prev => prev + `Active session found for: ${session.user.email}\n`);
      }

      // Test 4: Query specifications
      setResult(prev => prev + '\nTesting specifications query...\n');
      const { data: specs, error: specsError } = await supabase
        .from('specifications')
        .select('*')
        .limit(5);

      if (specsError) {
        setResult(prev => prev + `Query error: ${specsError.message}\n`);
        return;
      }

      setResult(prev => prev + `Success! Found ${specs.length} specifications.\n`);
      
    } catch (error) {
      setResult(prev => prev + `\nUnexpected error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md">
      <h3 className="text-lg font-semibold mb-4 dark:text-white">Supabase Connection Test</h3>
      <div className="space-y-4">
        <button
          onClick={testConnection}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Connection'}
        </button>
        {result && (
          <pre className="p-3 bg-gray-100 dark:bg-gray-700 rounded text-sm overflow-auto max-h-40 dark:text-gray-200">
            {result}
          </pre>
        )}
      </div>
    </div>
  );
}