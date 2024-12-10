import { Session } from '@supabase/supabase-js';
import { supabase } from '../../config/supabase';
import { AUTH_CONSTANTS } from '../../config/auth.constants';

export async function getSession(): Promise<Session | null> {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  } catch (error) {
    console.debug('Session retrieval failed:', error);
    return null;
  }
}

export async function refreshSession(): Promise<Session | null> {
  try {
    const { data: { session }, error } = await supabase.auth.refreshSession();
    if (error) throw error;
    return session;
  } catch (error) {
    console.debug('Session refresh failed:', error);
    return null;
  }
}

export async function signIn(): Promise<Session | null> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: AUTH_CONSTANTS.DEMO_USER.EMAIL,
      password: AUTH_CONSTANTS.DEMO_USER.PASSWORD
    });

    if (error) throw error;
    return data.session;
  } catch (error) {
    console.error('Sign in failed:', error);
    return null;
  }
}

export async function signOut(): Promise<void> {
  try {
    await supabase.auth.signOut();
  } catch (error) {
    console.error('Sign out failed:', error);
  }
}

export async function validateSession(session: Session | null): Promise<boolean> {
  if (!session?.access_token) return false;

  try {
    const { data: { user }, error } = await supabase.auth.getUser(session.access_token);
    return !error && !!user;
  } catch {
    return false;
  }
}