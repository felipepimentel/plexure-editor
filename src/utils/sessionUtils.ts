import { supabase } from '../lib/supabaseClient';
import { Session } from '@supabase/supabase-js';

export async function getSession(): Promise<Session | null> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

export async function refreshSession(): Promise<Session | null> {
  try {
    const { data: { session } } = await supabase.auth.refreshSession();
    return session;
  } catch (error) {
    console.error('Error refreshing session:', error);
    return null;
  }
}

export async function clearSession(): Promise<void> {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error('Error clearing session:', error);
    throw error;
  }
} 