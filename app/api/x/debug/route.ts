import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { X_TOKEN_COOKIE } from '@/lib/xAuth';

/**
 * Diagnóstico: comprueba si hay sesión, token (cookie/DB) y si la API de X responde.
 * Abre /api/x/debug estando logueado EN EL MISMO SITIO (local con local, producción con producción).
 */
export async function GET() {
  try {
    const cookieStore = await cookies();
    const cookieNames = cookieStore.getAll().map((c) => c.name);

    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id ?? null;

    let token: string | undefined = session?.provider_token ?? undefined;
    let source: 'session' | 'cookie' | 'db' | null = token ? 'session' : null;

    if (!token) {
      const cookieToken = (await cookies()).get(X_TOKEN_COOKIE)?.value?.trim();
      if (cookieToken) {
        token = cookieToken;
        source = 'cookie';
      }
    }

    if (!token && userId) {
      const { data: row } = await supabase.from('user_x_tokens').select('x_access_token').eq('user_id', userId).single();
      if (row?.x_access_token) {
        token = row.x_access_token;
        source = 'db';
      }
    }

    let xApiOk = false;
    let xApiError: string | null = null;
    if (token) {
      try {
        const res = await fetch('https://api.twitter.com/2/users/me?user.fields=public_metrics', {
          headers: { Authorization: `Bearer ${token}` },
        });
        xApiOk = res.ok;
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          xApiError = (body as { detail?: string }).detail || `HTTP ${res.status}`;
        }
      } catch (e) {
        xApiError = e instanceof Error ? e.message : 'Request failed';
      }
    }

    const hasSupabaseCookie = cookieNames.some((n) => n.startsWith('sb-'));
    const hasReplaixToken = cookieNames.includes(X_TOKEN_COOKIE);

    return NextResponse.json({
      hasSession: !!session,
      userId: userId ?? null,
      hasToken: !!token,
      tokenSource: source,
      xApiOk,
      xApiError,
      cookieNames: cookieNames.length > 20 ? [...cookieNames.slice(0, 20), '...'] : cookieNames,
      hasSupabaseCookie,
      hasReplaixToken,
      hint: !session
        ? hasSupabaseCookie
          ? 'Hay cookies de Supabase pero la sesión no se leyó. Prueba en la misma URL donde hiciste login (local con local, producción con producción).'
          : 'No hay sesión ni cookies de Supabase. Inicia sesión con X en ESTE mismo sitio (si estás en localhost, haz login en localhost; si estás en replaixai.com, haz login ahí) y vuelve a abrir /api/x/debug.'
        : !token
          ? 'Hay sesión pero no hay token de X (ni en cookie ni en DB). Supabase puede no estar devolviendo provider_token con X.'
          : !xApiOk
            ? `Token encontrado (${source}) pero la API de X falla: ${xApiError}. Revisa permisos de la app en developer.x.com.`
            : 'Todo correcto: sesión, token y API de X OK. Si el dashboard sigue a 0, recarga o revisa la consola.',
    });
  } catch (e) {
    return NextResponse.json({
      error: e instanceof Error ? e.message : 'Error',
      hasSession: false,
      hasToken: false,
      tokenSource: null,
      xApiOk: false,
      xApiError: null,
      cookieNames: [],
      hasSupabaseCookie: false,
      hasReplaixToken: false,
      hint: 'Error al ejecutar el diagnóstico.',
    }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
