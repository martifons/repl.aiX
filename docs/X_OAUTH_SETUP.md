# Configuración de X (Twitter) para analytics y perfil

Para que el Dashboard, Analytics, Perfil y Tweets muestren **datos reales** de X:

## 1. Supabase Dashboard

- **Authentication → Providers**: X (OAuth 2.0) debe estar **Enabled**.
- **Client ID** y **Client Secret** de tu app de X (OAuth 2.0).
- **Redirect URL** en la allow list: `https://tu-dominio.com/auth/callback` (y en local `http://localhost:3000/auth/callback`).

## 2. X Developer Portal (developer.x.com)

- **App type**: la app debe ser tipo “OAuth 2.0” (no solo “App-only”).
- **User authentication settings**:
  - **App permissions**: al menos **Read** (y **Read and write** si quieres publicar).
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
