import { createBrowserClient } from '@supabase/ssr';

/**
 * Creates a Supabase client for use in the browser.
 * Note: SUPABASE_URL and SUPABASE_ANON_KEY must be set in environment variables.
 */
export function createClient() {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
}
