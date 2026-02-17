# Pasos para que Dashboard, Analytics y Perfil muestren datos reales de X

Sigue estos pasos **en orden**. Sin ellos verás datos ficticios (local) o ceros (internet).

## 1. Crear la tabla en Supabase

1. Entra en **Supabase Dashboard** → tu proyecto → **SQL Editor**.
2. Crea una nueva query y pega el contenido del archivo:
   `supabase/migrations/20250117000000_user_x_tokens.sql`
3. Ejecuta la query (Run). Debe crear la tabla `user_x_tokens`.

## 2. Añadir la clave de servicio (service role)

1. En Supabase: **Project Settings** (icono engranaje) → **API**.
2. En **Project API keys** copia la clave **service_role** (secret, no la anon).
3. Añádela como variable de entorno:
   - **Local**: en tu `.env.local` → `SUPABASE_SERVICE_ROLE_KEY=eyJ...`
   - **Vercel**: Project → Settings → Environment Variables → añade `SUPABASE_SERVICE_ROLE_KEY` con ese valor.
4. **Redeploy** en Vercel después de añadir la variable.

## 3. Comprobar X (Twitter) en Supabase

- **Authentication** → **Providers** → **X (OAuth 2.0)** debe estar **Enabled**.
- **Client ID** y **Client Secret** deben ser los de tu app en [developer.x.com](https://developer.x.com).
- En **Redirect URLs** debe estar la de tu sitio, por ejemplo: `https://replaixai.com/auth/callback` y en local `http://localhost:3000/auth/callback`.

## 4. Comprobar la app en X Developer Portal

- Tipo **OAuth 2.0** con **User authentication**.
- **Callback URL**: la de Supabase (`https://<tu-proyecto>.supabase.co/auth/v1/callback`).
- **Scopes**: al menos `tweet.read`, `users.read`, `offline.access`.

## 5. Probar

1. **Cierra sesión** en tu app (si estabas logueado).
2. Vuelve a **Iniciar sesión con X**.
3. Entra en **Dashboard** y **Profile**. Deberían cargarse datos reales (seguidores, respuestas, engagement).  
   Si la primera vez ves ceros, espera unos segundos o recarga: el token se guarda en la base de datos tras el login y las APIs lo usan en la siguiente petición.

Si tras esto sigues viendo datos falsos o ceros, revisa la consola del navegador (F12) y la pestaña Network al cargar el dashboard para ver si `/api/x/analytics` devuelve 401 u otro error.
