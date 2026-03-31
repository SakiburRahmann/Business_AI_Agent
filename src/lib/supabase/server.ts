import { createClient as createSupabaseClient } from '@supabase/supabase-js';

/**
 * OmniiChat 1.0 Supabase Client (Edge-Compatible)
 */
export const createClient = () => {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};
