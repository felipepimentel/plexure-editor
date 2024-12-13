import { supabase } from '../config/supabase';
import { getAuthErrorMessage } from '../utils/auth/authErrors';
import { ensureValidSession, validateSession } from '../utils/auth/sessionManager';

export interface AuthUser {
  id: string;
  email: string;
}

export const authService = {
  async signIn(): Promise<AuthUser | null> {
    try {
      const session = await ensureValidSession();
      if (!session?.user) {
        throw new Error('Failed to establish session');
      }

      return {
        id: session.user.id,
        email: session.user.email!
      };
    } catch (error) {
      const message = getAuthErrorMessage(error);
      console.error('Authentication failed:', message);
      throw new Error(message);
    }
  },

  async signOut() {
    try {
      await supabase.auth.signOut({ scope: 'local' });
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      const message = getAuthErrorMessage(error);
      console.error('Sign out failed:', message);
      throw new Error(message);
    }
  },

  onAuthStateChange(callback: (user: AuthUser | null) => void) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.debug('Auth state changed:', event);

      if (event === 'SIGNED_OUT' || !session?.user) {
        callback(null);
        return;
      }

      if (await validateSession(session)) {
        callback({
          id: session.user.id,
          email: session.user.email!
        });
      } else {
        callback(null);
      }
    });

    return subscription;
  }
};