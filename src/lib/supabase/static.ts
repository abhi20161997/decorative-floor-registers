/**
 * Supabase client for static/ISR pages (no cookies).
 *
 * Using the server client (which calls cookies()) forces pages to be dynamic.
 * This client uses the anon key directly — safe for public read-only queries
 * since RLS allows public reads on active items.
 */
import { createClient } from "@supabase/supabase-js";

export function createStaticClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
