import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '../lib/supabaseClient';
import type { UserProfile } from '../types/database';

export function useProfile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        if (!user?.id) {
          setProfile(null);
          return;
        }

        const { data, error: err } = await supabase
          .from('user_profiles')
          .select(`
            *,
            team:teams (
              id,
              name
            )
          `)
          .eq('id', user.id)
          .single();

        if (err) throw err;
        setProfile(data);
        setError(null);
      } catch (err) {
        console.error('Error loading profile:', err);
        setError(err instanceof Error ? err.message : 'Error loading profile');
        setProfile(null);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [user?.id]);

  return { profile, loading, error };
} 