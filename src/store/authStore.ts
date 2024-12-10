import { create } from 'zustand';
import { AuthUser, authService } from '../services/authService';

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  setUser: (user: AuthUser | null) => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  error: null,

  setUser: (user) => set({ user, error: null }),
  setError: (error) => set({ error }),
  setLoading: (loading) => set({ loading }),

  signOut: async () => {
    set({ loading: true, error: null });
    try {
      await authService.signOut();
      set({ user: null, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Sign out failed',
        loading: false 
      });
    }
  }
}));