import { createClient, SupabaseClient, AuthError } from '@supabase/supabase-js';
import { SESSION_CONSTANTS, clearSession, getRetryDelay } from '../utils/sessionUtils';

class AuthProvider {
  private static instance: AuthProvider;
  private supabase: SupabaseClient;
  private retryAttempt: number = 0;

  // Credenciais para autenticação demo
  private readonly DEMO_CREDS = {
    email: 'demo@swagger-editor.com',
    password: 'demo123456'
  };

  private constructor() {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Credenciais do Supabase não encontradas');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false
      }
    });
  }

  public static getInstance(): AuthProvider {
    if (!AuthProvider.instance) {
      AuthProvider.instance = new AuthProvider();
    }
    return AuthProvider.instance;
  }

  async initialize() {
    try {
      const { data: { session }, error } = await this.supabase.auth.getSession();
      
      if (error) throw error;
      
      if (!session) {
        return await this.signInWithPassword();
      }
      
      return session;
    } catch (error) {
      console.error('Auth initialization failed:', error);
      throw error;
    }
  }

  private async signInWithPassword() {
    try {
      await clearSession();

      const { data, error } = await this.supabase.auth.signInWithPassword({
        email: this.DEMO_CREDS.email,
        password: this.DEMO_CREDS.password
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          return await this.signUp();
        }
        
        if (this.retryAttempt < (SESSION_CONSTANTS?.RETRY?.MAX_RETRIES ?? 3)) {
          this.retryAttempt++;
          const delay = getRetryDelay(this.retryAttempt);
          await new Promise(resolve => setTimeout(resolve, delay));
          return this.signInWithPassword();
        }
        
        throw error;
      }

      this.retryAttempt = 0;
      return data;
    } catch (error) {
      console.error('Auth error:', error);
      throw error;
    }
  }

  private async signUp() {
    try {
      const { data, error } = await this.supabase.auth.signUp({
        email: this.DEMO_CREDS.email,
        password: this.DEMO_CREDS.password,
        options: {
          data: {
            role: 'demo'
          }
        }
      });

      if (error) throw error;
      
      // Se o signup for bem sucedido, tenta fazer login
      return await this.signInWithPassword();
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  }

  async cleanup() {
    try {
      await this.supabase.auth.signOut();
      this.retryAttempt = 0;
    } catch (error) {
      console.error('Cleanup error:', error);
    }
  }
}

export const authProvider = AuthProvider.getInstance(); 