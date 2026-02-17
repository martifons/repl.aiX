import { createClient } from '@supabase/supabase-js';

/**
 * Server-only Supabase client with service role. Use only in auth callback
 * to store the X token (bypasses RLS). Requires SUPABASE_SERVICE_ROLE_KEY.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    return null;
  }
  return createClient(url, key, { auth: { persistSession: false } });
}
