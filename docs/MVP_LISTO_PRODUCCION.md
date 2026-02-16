# MVP listo para producción: qué tienes y qué falta

## Lo que ya está bien

- **Stripe:** Checkout, portal, webhooks, productos (Starter/Growth/Pro), dominio, pagos.
- **Dominio y web:** replaixai.com en Vercel, HTTPS.
- **OpenAI:** Respuestas con IA (gpt-4o-mini), configurable.
- **Planes definidos:** Starter 15 respuestas/día, Growth 30/día, Pro 50/día (y 1/2/5 cuentas X según plan).
- **Auth con X (código listo):** "Sign in with X" en login/signup, middleware, callback, AuthContext con Supabase. Falta configurar X Developer Portal + Supabase Twitter provider + env vars.

---

## Qué falta para que la gente use y pague de verdad

**Configuración para Sign in with X:** (1) X Developer Portal: app con OAuth 2.0, callback `https://<project>.supabase.co/auth/v1/callback`, Read and write. (2) Supabase → Auth → Providers → Twitter: Client ID y Client Secret. (3) Env: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

### 1. Login y registro con X (Twitter)

**Ahora:** Login/signup con email y contraseña en el navegador; el “usuario” es solo un objeto en localStorage (mock).

**Objetivo:** Que la gente entre con su cuenta de X (“Sign in with X”) y que la app pueda usar la API de X en su nombre (ver tweets, publicar respuestas, ver sus estadísticas).

**Qué hace falta:**
- **Supabase Auth** con proveedor **Twitter (X)**.
- En **Supabase Dashboard** → Authentication → Providers → Twitter: activar y poner **API Key** y **API Secret** de tu app de X.
- En **X Developer Portal** ([developer.x.com](https://developer.x.com)): crear un proyecto y una app, activar OAuth 2.0, poner la URL de callback que te dé Supabase (tipo `https://xxx.supabase.co/auth/v1/callback`).
- En la app: sustituir el formulario de login/signup por un botón **“Sign in with X”** que llame a Supabase (`signInWithOAuth({ provider: 'twitter' })`). Así el registro y el login son con X.

Cuando un usuario inicia sesión con X, Supabase guarda la sesión y (si lo configuras) puedes usar el token de X para llamar a la API de X por su cuenta.

---

### 2. API de X configurada para tus planes

**Planes y límites que tienes:**

| Plan   | Respuestas/día | Cuentas X |
|--------|-----------------|-----------|
| Starter| 15              | 1         |
| Growth | 30              | 2         |
| Pro    | 50              | 5         |

**Qué hace falta en X (developer.x.com):**

1. **Tipo de acceso**
   - Para que los usuarios conecten su cuenta (OAuth) y tú puedas **leer** y **escribir** en su nombre (buscar tweets, publicar respuestas, leer su perfil), necesitas al menos el nivel que permita OAuth 2.0 y uso de la API v2 (por ejemplo **Basic** o el que permita “Read and write” con OAuth).
   - En la app de X: permisos **Read and write** (para publicar respuestas desde la app).

2. **Endpoints que usarás**
   - **Búsqueda de tweets:** `GET /2/tweets/search/recent` (para “smart tweet discovery”) → con **Bearer Token** de la app o con el token del usuario, según cómo lo implementes.
   - **Publicar respuesta:** `POST /2/tweets` (reply a un tweet) → con el **token del usuario** (OAuth) que ha hecho “Sign in with X”.
   - **Estadísticas del usuario:** `GET /2/users/me` (o por username) para seguidores, etc. → con el **token del usuario**.

3. **Coste**
   - X cobra por uso (p. ej. por tweet leído/escrito). Para no gastar un dineral:
   - Aplicar los **límites por plan** (15/30/50 respuestas/día) en tu backend.
   - Opcional: límite global de llamadas a búsqueda por día en tu servidor.

Con eso la API de X queda alineada con tus planes (límites y tipo de uso).

---

### 3. Base de datos para usuarios y uso (Supabase)

**Ahora:** No hay base de datos; el “usuario” y el “plan” vienen de localStorage y de Stripe por email.

**Objetivo:** Guardar por usuario: quién es (vinculado a Supabase Auth y a X), qué plan tiene (Stripe) y cuántas respuestas ha usado hoy (para aplicar 15/30/50).

**Qué hace falta:**
- **Tabla `profiles` (o `users`):**
  - `id` (uuid, mismo que `auth.users.id`),
  - `email`, `name`, `avatar_url`, `x_username`, `x_user_id`,
  - `stripe_customer_id` (opcional),
  - `plan` (Starter/Growth/Pro) — puede rellenarse desde Stripe cuando abras el dashboard o por webhook.
- **Tabla de uso diario**, por ejemplo `daily_usage`:
  - `user_id`, `date` (día), `replies_count`.
  - O en `profiles`: `replies_used_today`, `last_usage_reset_at` y actualizar/resetear a medianoche.

Así puedes:
- Saber el plan de cada usuario (Stripe + esta tabla).
- Comprobar antes de cada respuesta: “¿replies_used_today < límite del plan?” (15, 30 o 50).
- Mostrar en el dashboard “X respuestas usadas hoy de Y”.

---

### 4. Lógica en el backend

**Qué falta por implementar:**

1. **Auth**
   - Sustituir mock auth por **Supabase Auth**.
   - Login y registro = solo “Sign in with X” (Supabase + OAuth X).
   - Proteger rutas del dashboard comprobando la sesión de Supabase.

2. **Uso de la API de X**
   - **Búsqueda:** una ruta API (ej. `GET /api/tweets/search?q=...`) que llame a `GET /2/tweets/search/recent` (con Bearer de app o token de usuario, según lo que permita tu plan de X).
   - **Publicar respuesta:** una ruta API (ej. `POST /api/tweets/reply`) que reciba `tweetId` y `text`, tome el **token de X del usuario** (desde sesión Supabase o desde `profiles`) y llame a `POST /2/tweets` como reply.
   - **Estadísticas:** una ruta API (ej. `GET /api/x/me` o `GET /api/user/stats`) que con el token del usuario llame a la API de X para obtener su perfil (seguidores, etc.) y devolverlo al front para “sus estadísticas”.

3. **Límites por plan**
   - Antes de llamar a `POST /2/tweets` en tu backend:
     - Obtener el `user_id` de la sesión Supabase.
     - Obtener su plan (desde Stripe por email o desde `profiles` si ya lo guardas ahí).
     - Comprobar en `daily_usage` o `profiles` si `replies_used_today < límite` (15, 30 o 50).
     - Si pasa: llamar a X, incrementar `replies_used_today` (o fila de `daily_usage`) y devolver éxito.
     - Si no pasa: devolver error tipo “Has llegado al límite de respuestas de tu plan”.

4. **Sincronizar plan con Stripe**
   - Al cargar el dashboard (o al abrir “perfil” / “suscripción”): llamar a tu API de estado de suscripción (por email del usuario) y actualizar en front (y opcionalmente en `profiles`) el plan actual.
   - Opcional: en el webhook de Stripe (cuando se suscribe/cancela), actualizar `profiles.plan` si guardas el plan en Supabase.

Con esto, Stripe y la API de X quedan configurados para cumplir tus planes (15/30/50 y 1/2/5 cuentas) y el MVP puede usarse y pagarse de verdad.

---

## Resumen de pasos (orden sugerido)

1. **X Developer Portal:** Crear proyecto y app, OAuth 2.0, Read and write, callback URL de Supabase.
2. **Supabase:** Activar Auth con proveedor Twitter; crear tablas `profiles` y (si quieres) `daily_usage`; configurar RLS.
3. **App:** Cambiar a Supabase Auth, botón “Sign in with X” en login y signup, quitar mock de usuario.
4. **App:** Rutas API que usen la API de X (búsqueda, publicar reply, estadísticas) con el token del usuario (y Bearer de app donde aplique).
5. **App:** Comprobar límites 15/30/50 antes de cada reply y guardar uso en Supabase.
6. **Stripe:** Dejar como está; solo asegurar que el plan que devuelve tu API de suscripción se use para los límites y para la UI.

Cuando todo eso esté hecho, el MVP quedará listo para que la gente se registre con X, pague (Stripe), use las respuestas con IA y vea sus estadísticas, respetando los planes que tienes activos.
