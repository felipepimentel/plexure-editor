import { Session } from '@supabase/supabase-js';
import { supabase } from '../../config/supabase';
import { AUTH_CONSTANTS } from '../../config/auth.constants';

export async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function validateSession(session: Session | null): Promise<boolean> {
  if (!session?.user?.id || !session?.access_token) {
    return false;
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser(session.access_token);
    return !error && !!user;
  } catch {
    return false;
  }
}

export async function clearSession(): Promise<void> {
  try {
    await supabase.auth.signOut({ scope: 'local' });
    await delay(AUTH_CONSTANTS.DELAYS.SIGNOUT);
  } catch (error) {
    console.error('Error clearing session:', error);
  }
}

export function getRetryDelay(attempt: number): number {
  return Math.min(
    AUTH_CONSTANTS.DELAYS.RETRY * Math.pow(AUTH_CONSTANTS.RETRIES.BACKOFF_MULTIPLIER, attempt),
    AUTH_CONSTANTS.TIMEOUTS.AUTH_CHECK
  );
}