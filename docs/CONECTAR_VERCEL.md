# Conectar el repo a Vercel (paso a paso)

## 1. Entrar en Vercel

- Abre **https://vercel.com** en el navegador.
- Clic en **Sign Up** o **Log In**.
- Elige **Continue with GitHub** e inicia sesión con tu cuenta de GitHub (martifons).

---

## 2. Importar el proyecto

1. En la página principal de Vercel, clic en **Add New…** → **Project**.
2. En la lista de repositorios, busca **martifons/repl.aiX** (o "repl.aiX").
3. Si no lo ves, clic en **Adjust GitHub App Permissions** y autoriza a Vercel a ver el repo; luego vuelve y selecciónalo.
4. Clic en **Import** al lado de **repl.aiX**.

---

## 3. Configurar el proyecto (antes de desplegar)

- **Framework Preset:** debe detectar **Next.js** solo. No cambies nada.
- **Root Directory:** déjalo vacío (por defecto).
- **Build Command:** vacío (Vercel usa el de Next.js).
- **Output Directory:** vacío.

### Variables de entorno (importante)

Clic en **Environment Variables** y añade **cada una** de estas (nombre y valor). Puedes copiar los valores desde tu archivo `.env.local` del proyecto:

| Nombre | Dónde está el valor | En producción pon |
|--------|----------------------|-------------------|
| `STRIPE_SECRET_KEY` | Tu .env.local | El mismo valor |
| `FRONTEND_URL` | Tu .env.local | **https://replaixai.com** |
| `OPENAI_API_KEY` | Tu .env.local | El mismo valor |
| `NEXT_PUBLIC_SUPABASE_URL` | Tu .env.local | El mismo valor |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Tu .env.local | El mismo valor |
| `STRIPE_WEBHOOK_SECRET` | (opcional) Stripe Dashboard → Webhooks | El que tengas, o déjalo para después |
| `X_API_KEY` | Tu .env.local | El mismo valor (si lo usas) |
| `X_API_SECRET` | Tu .env.local | El mismo valor (si lo usas) |
| `X_BEARER_TOKEN` | Tu .env.local | El mismo valor (si lo usas) |

- Para cada variable: **Name** = nombre de la tabla, **Value** = el valor (pega desde .env.local).
- **Environment:** marca las tres: Production, Preview, Development.
- Clic en **Add** por cada una.

---

## 4. Desplegar

1. Clic en **Deploy**.
2. Espera 1–2 minutos. Verás el progreso del build.
3. Cuando termine, verás **Congratulations!** y una URL tipo **repl-ai-x-xxx.vercel.app**. Esa es tu web desplegada.

---

## 5. Añadir tu dominio (replaixai.com)

1. En el proyecto de Vercel, ve a **Settings** → **Domains**.
2. En "Add", escribe **replaixai.com** → **Add**.
3. Añade también **www.replaixai.com**.
4. Vercel te mostrará qué registros DNS configurar. Anótalos (o deja la pestaña abierta).
5. Ve a **Namecheap** → Domain List → **Manage** en replaixai.com → pestaña **Advanced DNS**.
6. Añade:
   - **A Record:** Host **@**, Value **76.76.21.21**
   - **CNAME Record:** Host **www**, Value **cname.vercel-dns.com**
7. Guarda en Namecheap. En 5–30 minutos (a veces hasta 48 h) Vercel marcará el dominio como válido y **https://replaixai.com** mostrará tu web.

---

## Resumen

| Paso | Dónde | Qué hacer |
|------|--------|-----------|
| 1 | vercel.com | Iniciar sesión con GitHub |
| 2 | Add New → Project | Importar repo **martifons/repl.aiX** |
| 3 | Environment Variables | Añadir STRIPE_SECRET_KEY, FRONTEND_URL=https://replaixai.com, y el resto desde .env.local |
| 4 | Deploy | Pulsar Deploy y esperar |
| 5 | Settings → Domains | Añadir replaixai.com y www; luego configurar DNS en Namecheap |

Cuando el dominio esté activo, actualiza en Stripe "Sitio web de la empresa" a **https://replaixai.com**.
