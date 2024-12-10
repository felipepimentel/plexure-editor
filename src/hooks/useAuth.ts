import { useState, useEffect, useCallback } from 'react';
import { authProvider } from '../providers/authProvider';
import { AUTH_ERRORS } from '../config/auth.constants';

export function useAuth() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const initialize = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await authProvider.initialize();
    } catch (error) {
      setError(error instanceof Error ? error.message : AUTH_ERRORS.UNKNOWN);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initialize().catch(console.error);
    return () => {
      authProvider.cleanup().catch(console.error);
    };
  }, [initialize]);

  const retry = useCallback(() => {
    return initialize();
  }, [initialize]);

  return { loading, error, retry };
}