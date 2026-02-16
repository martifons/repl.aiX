# Configuración local y en la web

## Variables de entorno

### Local (`.env.local`)

Copia `.env.example` a `.env.local` y rellena al menos:

- `NEXT_PUBLIC_SUPABASE_URL` — URL del proyecto (Supabase → Settings → API)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — anon public key (misma sección)

El resto (OpenAI, Stripe, etc.) según necesites.

### Producción (Vercel)

En Vercel → proyecto → **Settings** → **Environment Variables** añade:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **`NEXT_PUBLIC_APP_URL`** = `https://replaixai.com` (o tu dominio con https, sin barra final). Así el login con X redirige siempre a tu web y no a localhost.

Después de añadir o cambiar variables, haz **Redeploy** del último deployment.

---

## Probar "Sign in with X" en local

1. **Supabase:** Añade la URL de tu app en local a las permitidas.
   - Supabase Dashboard → **Authentication** → **URL Configuration**.
   - En **Redirect URLs** agrega: `http://localhost:3000/auth/callback` (y si usas 127.0.0.1: `http://127.0.0.1:3000/auth/callback`).
   - Pulsa **Save**.

2. **Variables:** En `.env.local` ten `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` (mismo proyecto que en producción).

3. En la terminal: `npm run dev`.

4. Abre `http://localhost:3000/login` y pulsa **Sign in with X**.

La callback en X (Developer Console) sigue siendo la de Supabase; no hace falta añadir localhost ahí.
