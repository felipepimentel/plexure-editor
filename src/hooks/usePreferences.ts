import { useEffect, useState, useCallback, useRef } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '../lib/supabaseClient';
import type { UserPreferences, PreferenceKey, PreferenceValue } from '../types/preferences';

const DEBOUNCE_MS = 500;

const DEFAULT_PREFERENCES: Omit<UserPreferences, 'id' | 'created_at' | 'updated_at'> = {
  theme: 'dark',
  left_panel_width: 320,
  right_panel_width: 480,
  left_panel_collapsed: false,
  right_panel_collapsed: false,
  current_view: 'navigator',
  last_opened_path: ['root']
};

export function usePreferences() {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const updateQueue = useRef<{[K in PreferenceKey]?: PreferenceValue}>({});
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const initializeAttempted = useRef(false);

  // Load or create preferences
  useEffect(() => {
    async function loadPreferences() {
      try {
        if (!user?.id) {
          setPreferences(null);
          return;
        }

        // Try to get existing preferences
        const { data: existingData, error: selectErr } = await supabase
          .from('user_preferences')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        // If preferences don't exist and we haven't tried to create them yet
        if (!existingData && !initializeAttempted.current) {
          initializeAttempted.current = true;

          // Create new preferences using upsert to handle race conditions
          const { data: newData, error: upsertErr } = await supabase
            .from('user_preferences')
            .upsert({
              id: user.id,
              ...DEFAULT_PREFERENCES
            })
            .select('*')
            .single();

          if (upsertErr) {
            console.error('Error creating preferences:', upsertErr);
            // If upsert fails, try to get preferences one more time
            const { data: retryData, error: retryErr } = await supabase
              .from('user_preferences')
              .select('*')
              .eq('id', user.id)
              .single();

            if (retryErr) throw retryErr;
            setPreferences(retryData);
          } else {
            setPreferences(newData);
          }
        } else if (selectErr && selectErr.code !== 'PGRST116') {
          // If there's an error other than "no rows returned"
          throw selectErr;
        } else {
          // If preferences exist, use them
          setPreferences(existingData);
        }

        setError(null);
      } catch (err) {
        console.error('Error loading preferences:', err);
        setError(err instanceof Error ? err.message : 'Error loading preferences');
        
        // Set default preferences in memory if we can't load from database
        if (!preferences) {
          setPreferences({
            id: user.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            ...DEFAULT_PREFERENCES
          });
        }
      } finally {
        setLoading(false);
      }
    }

    loadPreferences();
  }, [user?.id]);

  // Debounced update function
  const debouncedUpdate = useCallback(async () => {
    if (!user?.id || !Object.keys(updateQueue.current).length) return;

    try {
      const { error: err } = await supabase
        .from('user_preferences')
        .update(updateQueue.current)
        .eq('id', user.id);

      if (err) throw err;
      
      // Clear the queue after successful update
      updateQueue.current = {};
    } catch (err) {
      console.error('Error updating preferences:', err);
      setError(err instanceof Error ? err.message : 'Error updating preferences');
    }
  }, [user?.id]);

  // Update preference with debouncing
  const updatePreference = useCallback(<K extends PreferenceKey>(
    key: K,
    value: UserPreferences[K]
  ) => {
    if (!preferences) return;

    // Update local state immediately
    setPreferences(prev => prev ? { ...prev, [key]: value } : null);

    // Queue the update
    updateQueue.current[key] = value;

    // Clear existing timeout
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }

    // Set new timeout for debounced update
    updateTimeoutRef.current = setTimeout(debouncedUpdate, DEBOUNCE_MS);
  }, [preferences, debouncedUpdate]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, []);

  return {
    preferences,
    loading,
    error,
    updatePreference
  };
} 