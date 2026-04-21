"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Session, User } from "@supabase/supabase-js";

// If an auth call hangs longer than this, give up and unblock the UI.
// Without this, a stale cookie or slow network leaves the admin stuck on
// the "Loading..." screen forever.
const AUTH_TIMEOUT_MS = 8000;

type AuthState = {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
};

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
  // Single state object so user/isAdmin can never drift between renders.
  // This prevents the "user valid but isAdmin=false stale" flash that
  // caused AdminGuard to render <AccessDenied/> for a split second on
  // auth-state-change events (tab focus, token refresh).
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAdmin: false,
    loading: true,
  });
  const supabase = createClient();

  useEffect(() => {
    let cancelled = false;

    const checkAdminRow = async (userId: string): Promise<boolean> => {
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

    const resolveFromSession = async (session: Session | null) => {
      const currentUser = session?.user ?? null;
      // Compute admin status BEFORE committing state so user + isAdmin
      // always land in the same render.
      const isAdmin = currentUser ? await checkAdminRow(currentUser.id) : false;
      if (cancelled) return;
      setAuthState({ user: currentUser, isAdmin, loading: false });
    };

    const bootstrap = async () => {
      try {
        const result = await withTimeout(
          supabase.auth.getSession(),
          AUTH_TIMEOUT_MS
        );
        if (cancelled) return;
        await resolveFromSession(result?.data?.session ?? null);
      } catch (err) {
        console.error("Admin auth check failed:", err);
        if (!cancelled) {
          setAuthState({ user: null, isAdmin: false, loading: false });
        }
      }
    };

    bootstrap();

    // onAuthStateChange fires on SIGNED_IN, SIGNED_OUT, TOKEN_REFRESHED,
    // USER_UPDATED, and (sometimes) tab focus. We re-resolve the full auth
    // state each time to keep user + isAdmin in sync.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      await resolveFromSession(session);
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
    setAuthState({ user: null, isAdmin: false, loading: false });
  }, [supabase]);

  return { ...authState, signIn, signOut };
}
