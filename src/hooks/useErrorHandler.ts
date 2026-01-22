import { useState, useCallback } from 'react';

interface ErrorState {
  message: string;
  type: 'network' | 'validation' | 'server' | 'unknown';
  code?: string;
  details?: any;
}

export const useErrorHandler = () => {
  const [error, setError] = useState<ErrorState | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleError = useCallback((error: any, context?: string) => {
    console.error(`Error in ${context || 'unknown context'}:`, error);

    let errorState: ErrorState;

    if (error.name === 'NetworkError' || error.message?.includes('fetch')) {
      errorState = {
        message: 'Network connection failed. Please check your internet connection.',
        type: 'network',
        code: 'NETWORK_ERROR'
      };
    } else if (error.status >= 400 && error.status < 500) {
      errorState = {
        message: error.message || 'Invalid request. Please check your input.',
        type: 'validation',
        code: `HTTP_${error.status}`
      };
    } else if (error.status >= 500) {
      errorState = {
        message: 'Server error. Please try again later.',
        type: 'server',
        code: `HTTP_${error.status}`
      };
    } else {
      errorState = {
        message: error.message || 'An unexpected error occurred.',
        type: 'unknown',
        details: error
      };
    }

    setError(errorState);
    setIsLoading(false);

    // Auto-clear error after 5 seconds for non-critical errors
    if (errorState.type !== 'server') {
      setTimeout(() => {
        setError(null);
      }, 5000);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const withErrorHandling = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    context?: string
  ): Promise<T | null> => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await asyncFn();
      setIsLoading(false);
      return result;
    } catch (err) {
      handleError(err, context);
      return null;
    }
  }, [handleError]);

  return {
    error,
    isLoading,
    handleError,
    clearError,
    withErrorHandling,
    setIsLoading
  };
};