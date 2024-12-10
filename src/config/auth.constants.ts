export const AUTH_CONSTANTS = {
  DEMO_USER: {
    EMAIL: 'demo@swagger-editor.com',
    PASSWORD: 'demo123456'
  },
  TIMEOUTS: {
    AUTH_CHECK: 30000,
    SESSION_REFRESH: 300000, // 5 minutes
    RETRY_BASE: 1000
  },
  RETRIES: {
    MAX_ATTEMPTS: 3,
    BACKOFF_FACTOR: 1.5
  }
} as const;

export const AUTH_ERRORS = {
  INITIALIZATION: 'Failed to initialize authentication',
  INVALID_CREDENTIALS: 'Invalid credentials',
  SESSION_EXPIRED: 'Session expired',
  NETWORK_ERROR: 'Network error',
  UNKNOWN: 'An unexpected error occurred'
} as const;