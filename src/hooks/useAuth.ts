import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check active session
    const checkSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth
          .getSession();
        if (sessionError) throw sessionError;
        setUser(session?.user ?? null);
      } catch (err) {
        console.error("Error checking session:", err);
        setError(err instanceof Error ? err.message : "Session check failed");
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      },
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) throw signOutError;
    } catch (err) {
      console.error("Error signing out:", err);
      setError(err instanceof Error ? err.message : "Sign out failed");
    }
  };

  const retry = () => {
    setError(null);
    setLoading(true);
    // Re-check session
    supabase.auth.getSession().then(
      ({ data: { session }, error: sessionError }) => {
        if (sessionError) {
          setError(sessionError.message);
        } else {
          setUser(session?.user ?? null);
        }
        setLoading(false);
      },
    );
  };

  return {
    user,
    loading,
    error,
    signOut,
    retry,
  };
}
