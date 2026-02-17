# Configuración de X (Twitter) para analytics y perfil

Para que el Dashboard, Analytics, Perfil y Tweets muestren **datos reales** de X.

## 0. Tabla en Supabase y clave de servicio (importante)

1. En **Supabase Dashboard → SQL Editor**, ejecuta el contenido de:
   `supabase/migrations/20250117000000_user_x_tokens.sql`
   (crea la tabla `user_x_tokens` para guardar el token de X y usarlo en las APIs).

2. Añade la variable de entorno **SUPABASE_SERVICE_ROLE_KEY**:
   - En Supabase: **Project Settings → API** → copia la clave **service_role** (no la anon).
   - En **Vercel** (y en `.env.local` para local): `SUPABASE_SERVICE_ROLE_KEY=eyJ...`
   Así el callback puede guardar el token de X en la base de datos y las APIs pueden usarlo aunque la cookie falle.

## 1. Supabase Dashboard

- **Authentication → Providers**: X (OAuth 2.0) debe estar **Enabled**.
- **Client ID** y **Client Secret** de tu app de X (OAuth 2.0).
- **Redirect URL** en la allow list: `https://tu-dominio.com/auth/callback` (y en local `http://localhost:3000/auth/callback`).

## 2. X Developer Portal (developer.x.com)

- **App type**: la app debe ser tipo “OAuth 2.0” (no solo “App-only”).
- **User authentication settings**:
  - **App permissions**: **Read and write** (necesario para que la API de tweets devuelva datos; solo "Read" suele dar 403 en `/users/:id/tweets`).
  - **Type of App**: “Web App”.
  - **Callback URL**: la de Supabase (`https://<tu-proyecto>.supabase.co/auth/v1/callback`).
  - **Website URL**: tu sitio (ej. `https://replaixai.com`).
- En **Scopes** (o permisos de la app) deben estar, como mínimo:
  - `tweet.read`
  - `users.read`
  - `offline.access` (para refresh)

## 3. Flujo en esta app

1. **Login**: el usuario hace “Sign in with X” y Supabase hace el OAuth con X.
2. **Callback** (`/auth/callback`): tras el login, guardamos el `provider_token` de X en una **cookie httpOnly** para que las APIs puedan usarlo.
3. **APIs** (`/api/x/analytics`, `/api/x/me`, `/api/x/activity`, `/api/x/tweets`): leen el token de la sesión de Supabase, del header `x-provider-token` (cliente) o de la **cookie**.
4. **Logout**: se borra la cookie de X y la sesión de Supabase.

Si tras configurar bien sigues viendo ceros o “Not authenticated”:

- Cierra sesión, vuelve a entrar con X y recarga el Dashboard.
- Revisa en el navegador (DevTools → Application → Cookies) que exista la cookie `replaix_x_token` tras el login.
- En el X Developer Portal, confirma que la app no esté en modo “Read-only” restringido ni con permisos insuficientes.

### Si los seguidores salen bien pero respuestas/engagement/actividad en 0

La API de tweets (`GET /2/users/:id/tweets`) devuelve **403** si la app no tiene permiso para leer tweets. Solución:

1. En **developer.x.com** → tu proyecto → tu app → **User authentication settings**.
2. En **App permissions** elige **Read and write** (no solo “Read”).
3. Guarda. **Cierra sesión** en repl.aiX y vuelve a **iniciar sesión con X** (así el token incluye el nuevo scope).
4. Abre de nuevo el Dashboard; las respuestas, el engagement y la actividad reciente deberían cargarse.
5. Para comprobar: abre `/api/x/debug`; si `tweetsApiOk` es `true`, ya está bien.
