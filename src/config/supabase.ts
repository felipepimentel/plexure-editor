import { createClient } from '@supabase/supabase-js';
import { AUTH_CONSTANTS } from './auth.constants';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase configuration');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storage: localStorage,
    storageKey: 'sb-zxpsnsyohmfpxsdlqhzr-auth-token',
    debug: import.meta.env.DEV
  },
  global: {
    headers: {
      'x-client-info': 'swagger-editor',
      'x-client-version': '1.0.0'
    }
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  },
  db: {
    schema: 'public'
  }
});

// Configure default timeout
supabase.rest.headers['x-client-timeout'] = String(AUTH_CONSTANTS.TIMEOUTS.AUTH_CHECK);