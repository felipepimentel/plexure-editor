import { supabase } from '../../config/supabase';
import { AUTH_CONSTANTS, AUTH_ERRORS } from '../../config/auth.constants';
import { validateSession, clearSession, delay, getRetryDelay } from './sessionUtils';
import { jwtDecode } from 'jwt-decode';

class AuthProvider {
  private retryCount = 0;
  private refreshTimer: number | null = null;

  async initialize(): Promise<void> {
    try {
      await this.clearStaleData();
      const session = await this.getExistingSession();
      
      if (session && await validateSession(session)) {
        this.setupRefreshTimer(session.access_token);
        return;
      }

      const newSession = await this.authenticate();
      if (newSession) {
        this.setupRefreshTimer(newSession.access_token);
      }
    } catch (error) {
      console.error('Auth initialization failed:', error);
      throw new Error(AUTH_ERRORS.INITIALIZATION);
    }
  }

  private async clearStaleData() {
    try {
      localStorage.removeItem('supabase.auth.token');
      localStorage.removeItem('supabase.auth.expires_at');
      await clearSession();
    } catch (error) {
      console.warn('Error clearing stale data:', error);
    }
  }

  private setupRefreshTimer(token: string) {
    if (this.refreshTimer) {
      window.clearTimeout(this.refreshTimer);
    }

    try {
      const decoded = jwtDecode(token);
      const expiresIn = (decoded.exp as number * 1000) - Date.now() - 60000; // Refresh 1 minute before expiry
      
      this.refreshTimer = window.setTimeout(
        () => this.refreshSession(),
        Math.max(0, Math.min(expiresIn, AUTH_CONSTANTS.TIMEOUTS.SESSION_REFRESH))
      );
    } catch (error) {
      console.warn('Error setting up refresh timer:', error);
    }
  }

  private async getExistingSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return session;
    } catch (error) {
      console.debug('No existing session:', error);
      return null;
    }
  }

  private async authenticate() {
    this.retryCount = 0;
    await clearSession();

    while (this.retryCount < AUTH_CONSTANTS.RETRIES.MAX_ATTEMPTS) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: AUTH_CONSTANTS.DEMO_USER.EMAIL,
          password: AUTH_CONSTANTS.DEMO_USER.PASSWORD,
          options: {
            redirectTo: window.location.origin
          }
        });

        if (error) throw error;
        if (!data.session) throw new Error('No session received');

        return data.session;
      } catch (error) {
        this.retryCount++;
        
        if (this.retryCount >= AUTH_CONSTANTS.RETRIES.MAX_ATTEMPTS) {
          throw error;
        }

        await delay(getRetryDelay(this.retryCount));
      }
    }

    throw new Error('Authentication failed after max retries');
  }

  async refreshSession(): Promise<void> {
    try {
      const { data: { session }, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      if (!session) throw new Error('Session refresh failed');
      
      this.setupRefreshTimer(session.access_token);
    } catch (error) {
      console.error('Session refresh failed:', error);
      await this.authenticate();
    }
  }

  onAuthStateChange(callback: (session: any) => void) {
    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        if (this.refreshTimer) {
          window.clearTimeout(this.refreshTimer);
          this.refreshTimer = null;
        }
        callback(null);
        return;
      }

      if (session && await validateSession(session)) {
        this.setupRefreshTimer(session.access_token);
        callback(session);
      } else {
        callback(null);
      }
    });

    return data.subscription;
  }

  cleanup() {
    if (this.refreshTimer) {
      window.clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }
}

export const authProvider = new AuthProvider();