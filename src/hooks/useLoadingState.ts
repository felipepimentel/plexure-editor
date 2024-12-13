import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';

interface LoadingState {
  [key: string]: boolean;
}

interface LoadingOperation<T> {
  key: string;
  operation: () => Promise<T>;
  successMessage?: string;
  errorMessage?: string;
  onSuccess?: (result: T) => void;
  onError?: (error: Error) => void;
}

export function useLoadingState() {
  const [loadingState, setLoadingState] = useState<LoadingState>({});

  const setLoading = useCallback((key: string, isLoading: boolean) => {
    setLoadingState(prev => ({ ...prev, [key]: isLoading }));
  }, []);

  const isLoading = useCallback((key: string) => {
    return loadingState[key] || false;
  }, [loadingState]);

  const withLoading = useCallback(async <T>({
    key,
    operation,
    successMessage,
    errorMessage,
    onSuccess,
    onError,
  }: LoadingOperation<T>): Promise<T | null> => {
    try {
      setLoading(key, true);
      const result = await operation();
      
      if (successMessage) {
        toast.success(successMessage);
      }
      
      onSuccess?.(result);
      return result;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'An unknown error occurred';
      
      if (errorMessage) {
        toast.error(errorMessage);
      } else {
        toast.error(`Operation failed: ${errorMsg}`);
      }
      
      if (error instanceof Error) {
        onError?.(error);
      }
      
      return null;
    } finally {
      setLoading(key, false);
    }
  }, [setLoading]);

  const withLoadingSync = useCallback(<T>(
    key: string,
    operation: () => T,
    {
      successMessage,
      errorMessage,
      onSuccess,
      onError,
    }: Omit<LoadingOperation<T>, 'key' | 'operation'> = {}
  ): T | null => {
    try {
      setLoading(key, true);
      const result = operation();
      
      if (successMessage) {
        toast.success(successMessage);
      }
      
      onSuccess?.(result);
      return result;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'An unknown error occurred';
      
      if (errorMessage) {
        toast.error(errorMessage);
      } else {
        toast.error(`Operation failed: ${errorMsg}`);
      }
      
      if (error instanceof Error) {
        onError?.(error);
      }
      
      return null;
    } finally {
      setLoading(key, false);
    }
  }, [setLoading]);

  return {
    isLoading,
    setLoading,
    withLoading,
    withLoadingSync,
  };
} 