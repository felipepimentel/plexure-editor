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

        // First try to get from user_profiles_with_teams
        let { data, error: err } = await supabase
          .from('user_profiles_with_teams')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (err) {
          // If view fails, fallback to direct table
          const { data: profileData, error: profileErr } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (profileErr) throw profileErr;
          data = profileData;
        }

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