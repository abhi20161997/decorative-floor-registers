"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

// If getUser() hangs longer than this, give up and unblock the UI.
// Without this, a stale cookie or slow network leaves the admin stuck on
// the "Loading..." screen forever.
const AUTH_TIMEOUT_MS = 8000;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T | null> {
  return new Promise((resolve) => {
    let settled = false;
    const timer = setTimeout(() => {
      if (!settled) {
        settled = true;
        resolve(null);
      }
    }, ms);
    promise
      .then((value) => {
        if (!settled) {
          settled = true;
          clearTimeout(timer);
          resolve(value);
        }
      })
      .catch(() => {
        if (!settled) {
          settled = true;
          clearTimeout(timer);
          resolve(null);
        }
      });
  });
}

export function useAdmin() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    let cancelled = false;

    const checkAdminRow = async (userId: string) => {
      try {
        const query = supabase
          .from("admin_users")
          .select("id")
          .eq("user_id", userId)
          .maybeSingle();
        const result = await withTimeout(Promise.resolve(query), AUTH_TIMEOUT_MS);
        return !!result?.data;
      } catch {
        return false;
      }
    };

    const checkAuth = async () => {
      try {
        // getSession() reads from local storage synchronously-ish; use it
        // first as a fast path so first paint isn't blocked on a network call.
        const sessionResult = await withTimeout(
          supabase.auth.getSession(),
          AUTH_TIMEOUT_MS
        );
        const sessionUser = sessionResult?.data?.session?.user ?? null;

        if (sessionUser) {
          if (cancelled) return;
          setUser(sessionUser);
          setIsAdmin(await checkAdminRow(sessionUser.id));
        } else {
          // Fallback: hit the server to be safe (handles SSR cookie path)
          const userResult = await withTimeout(
            supabase.auth.getUser(),
            AUTH_TIMEOUT_MS
          );
          const currentUser = userResult?.data?.user ?? null;
          if (cancelled) return;
          setUser(currentUser);
          if (currentUser) {
            setIsAdmin(await checkAdminRow(currentUser.id));
          }
        }
      } catch (err) {
        console.error("Admin auth check failed:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null;
      if (cancelled) return;
      setUser(currentUser);
      if (currentUser) {
        setIsAdmin(await checkAdminRow(currentUser.id));
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const signIn = useCallback(
    async (email: string, password: string) => {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    },
    [supabase]
  );

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
  }, [supabase]);

  return { user, isAdmin, loading, signIn, signOut };
}
