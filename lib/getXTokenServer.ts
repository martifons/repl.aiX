import type { SupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { X_TOKEN_COOKIE } from '@/lib/xAuth';

/**
 * Obtiene el token de X en rutas API: sesión → header → cookie → DB.
 * Usar en todas las rutas /api/x/* para que el comportamiento sea idéntico.
 */
export async function getXToken(
  supabase: SupabaseClient,
  request?: Request
): Promise<string | null> {
  const { data: { session } } = await supabase.auth.getSession();
  let token =
    session?.provider_token ??
    (request?.headers.get('x-provider-token')?.trim() || undefined) ??
    ((await cookies()).get(X_TOKEN_COOKIE)?.value?.trim() || undefined);

  if (!token && session?.user?.id) {
    const { data: row } = await supabase
      .from('user_x_tokens')
      .select('x_access_token')
      .eq('user_id', session.user.id)
      .single();
    if (row?.x_access_token) token = row.x_access_token;
  }

  return token || null;
}
