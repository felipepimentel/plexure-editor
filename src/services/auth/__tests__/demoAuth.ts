import { supabase } from '../../config/supabase';
import { AUTH_CONSTANTS } from '../../config/auth.constants';

export class DemoAuth {
  private static instance: DemoAuth;
  private retryCount = 0;
  private maxRetries = 3;
  private refreshTimer: number | null = null;

  private constructor() {}

  static getInstance(): DemoAuth {
    if (!DemoAuth.instance) {
      DemoAuth.instance = new DemoAuth();
    }
    return DemoAuth.instance;
  }

  async signIn(): Promise<boolean> {
    try {
      // Clear any existing session
      await this.signOut();
      
      while (this.retryCount < this.maxRetries) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: AUTH_CONSTANTS.DEMO_USER.EMAIL,
          password: AUTH_CONSTANTS.DEMO_USER.PASSWORD,
          options: {
            redirectTo: window.location.origin
          }
        });

        if (!error && data.session) {
          this.retryCount = 0;
          return true;
        }

        this.retryCount++;
        if (this.retryCount < this.maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 1000 * this.retryCount));
        }
      }

      throw new Error('Max retries exceeded');
    } catch (error) {
      console.error('Demo sign in failed:', error);
      return false;
    } finally {
      this.retryCount = 0;
    }
  }

  async signOut(): Promise<void> {
    try {
      await supabase.auth.signOut({ scope: 'local' });
      if (this.refreshTimer) {
        window.clearTimeout(this.refreshTimer);
        this.refreshTimer = null;
      }
      // Clear any stored session data
      localStorage.removeItem('supabase.auth.token');
      localStorage.removeItem('sb-zxpsnsyohmfpxsdlqhzr-auth-token');
    } catch (error) {
      console.error('Demo sign out failed:', error);
    }
  }

  async refreshSession(): Promise<boolean> {
    try {
      const { data: { session }, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      return !!session;
    } catch (error) {
      console.error('Session refresh failed:', error);
      return this.signIn(); // Try to sign in again if refresh fails
    }
  }

  setupAutoRefresh(callback: () => void): void {
    if (this.refreshTimer) {
      window.clearTimeout(this.refreshTimer);
    }

    this.refreshTimer = window.setInterval(
      callback,
      AUTH_CONSTANTS.TIMEOUTS.SESSION_REFRESH
    );
  }

  cleanup(): void {
    if (this.refreshTimer) {
      window.clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }
}

export const demoAuth = DemoAuth.getInstance();