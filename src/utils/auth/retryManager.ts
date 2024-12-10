import { AUTH_CONSTANTS } from '../../config/auth.constants';

export class RetryManager {
  private attempts = 0;

  reset(): void {
    this.attempts = 0;
  }

  async retry<T>(operation: () => Promise<T>): Promise<T> {
    while (this.attempts < AUTH_CONSTANTS.RETRIES.MAX_ATTEMPTS) {
      try {
        const result = await operation();
        this.reset();
        return result;
      } catch (error) {
        this.attempts++;
        
        if (this.attempts >= AUTH_CONSTANTS.RETRIES.MAX_ATTEMPTS) {
          throw error;
        }

        await this.delay();
      }
    }

    throw new Error('Max retries exceeded');
  }

  private async delay(): Promise<void> {
    const delay = AUTH_CONSTANTS.TIMEOUTS.RETRY_BASE * 
      Math.pow(AUTH_CONSTANTS.RETRIES.BACKOFF_FACTOR, this.attempts);
    
    await new Promise(resolve => setTimeout(resolve, delay));
  }
}