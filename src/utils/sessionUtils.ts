export const SESSION_CONSTANTS = {
  SIGNOUT: {
    TIMEOUT: 5000,
    MAX_RETRIES: 3
  },
  RETRY: {
    BASE_DELAY: 1000,
    MAX_DELAY: 5000,
    MAX_RETRIES: 3
  }
} as const;

export const clearSession = async () => {
  try {
    if (!SESSION_CONSTANTS?.SIGNOUT?.TIMEOUT) {
      throw new Error('SESSION_CONSTANTS.SIGNOUT não está definido');
    }
    
    await new Promise(resolve => setTimeout(resolve, SESSION_CONSTANTS.SIGNOUT.TIMEOUT));
    return true;
  } catch (error) {
    console.error('Error clearing session:', error);
    throw error;
  }
};

export const getRetryDelay = (attempt: number): number => {
  if (!SESSION_CONSTANTS?.RETRY?.BASE_DELAY || !SESSION_CONSTANTS?.RETRY?.MAX_DELAY) {
    throw new Error('SESSION_CONSTANTS.RETRY não está definido');
  }
  
  const { BASE_DELAY, MAX_DELAY } = SESSION_CONSTANTS.RETRY;
  return Math.min(BASE_DELAY * Math.pow(2, attempt), MAX_DELAY);
}; 