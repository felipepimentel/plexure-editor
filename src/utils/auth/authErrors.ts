import { AuthError } from '@supabase/supabase-js';

export const AUTH_ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid credentials. Please try again.',
  SESSION_EXPIRED: 'Your session has expired. Please sign in again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SESSION_MISSING: 'Session not found. Please sign in again.',
  MAX_RETRIES: 'Failed to authenticate after multiple attempts.',
  UNKNOWN: 'An unexpected error occurred. Please try again.'
} as const;

export function getAuthErrorMessage(error: unknown): string {
  if (error instanceof AuthError) {
    switch (error.name) {
      case 'AuthApiError':
        if (error.message.includes('invalid_credentials')) {
          return AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS;
        }
        break;
      case 'AuthSessionMissingError':
        return AUTH_ERROR_MESSAGES.SESSION_MISSING;
    }
  }

  if (error instanceof Error) {
    if (error.message.includes('network')) {
      return AUTH_ERROR_MESSAGES.NETWORK_ERROR;
    }
    if (error.message.includes('session expired')) {
      return AUTH_ERROR_MESSAGES.SESSION_EXPIRED;
    }
    if (error.message.includes('Max retries exceeded')) {
      return AUTH_ERROR_MESSAGES.MAX_RETRIES;
    }
    return error.message;
  }

  return AUTH_ERROR_MESSAGES.UNKNOWN;
}