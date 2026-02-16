# Dominio y poner la web visible (repl.aiX)

## 1. Qué poner en Stripe ya

En "Sitio web de la empresa" puedes poner:

- **Si vas a comprar el dominio:** `https://replaix.com` (o el que elijas: replaix.app, getreplaix.com, etc.). Aunque la web aún no esté lista, Stripe suele aceptarlo.
- **Si primero desplegas sin dominio:** la URL que te dé Vercel, por ejemplo `https://replaix.vercel.app`. Luego la cambias en Stripe cuando tengas el dominio.

---

## 2. No necesitas comprar un servidor

Para un SaaS en Next.js se usa **hosting gestionado**:

- **Vercel** (recomendado para Next.js): plan gratuito, despliegue desde GitHub, HTTPS y dominio propio incluido.
- Tú solo compras el **dominio** (≈10–15 €/año) y lo conectas a Vercel. El "servidor" lo gestiona Vercel.

---

## 3. Comprar el dominio

1. Entra en un registrador (por ejemplo):
   - [Cloudflare](https://www.cloudflare.com/products/registrar/) (precio coste, sin margen)
   - [Namecheap](https://www.namecheap.com)
   - [Google Domains](https://domains.google) (ahora Squarespace)
2. Busca el nombre que quieras: **replaix.com**, **replaix.app**, **getreplaix.com**, etc.
3. Compra el dominio (solo el dominio, no contratos de hosting si no los necesitas).
4. Cuando tengas el dominio, en el panel del registrador podrás **configurar DNS** (en el paso 5).

---

## 4. Desplegar la web en Vercel

1. Sube el proyecto a **GitHub** (si no está ya):
   - Crea un repo en github.com y sube el código.
2. Entra en [vercel.com](https://vercel.com) e inicia sesión con GitHub.
3. **Add New Project** → importa el repo de replaix.
4. En **Environment Variables** añade las mismas que tienes en `.env.local`:
   - `STRIPE_SECRET_KEY`
   - `FRONTEND_URL` (aquí pon `https://replaix.com` o la URL que vayas a usar)
   - Y el resto: Supabase, OpenAI, etc.
5. **Deploy**. Vercel te dará una URL tipo `replaix-xxx.vercel.app`. La web ya es visible en esa URL.

---

## 5. Conectar tu dominio a Vercel

1. En Vercel: **Project** → **Settings** → **Domains**.
2. Añade tu dominio (ej. `replaix.com` y opcionalmente `www.replaix.com`).
3. Vercel te mostrará qué registros DNS poner (normalmente un registro **A** o **CNAME**).
4. En el panel de tu registrador de dominio (Cloudflare, Namecheap, etc.):
   - Ve a **DNS** / **Manage DNS**.
   - Añade el registro que indique Vercel (ej. **A** con el valor que te den, o **CNAME** de `www` a `cname.vercel-dns.com`).
5. Espera unos minutos (hasta 48 h, a veces solo 5–10 min). Vercel marcará el dominio como activo y tu web será visible en `https://replaix.com`.

---

## 6. Después de conectar el dominio

- En **Stripe** (si habías puesto la URL de Vercel): actualiza "Sitio web de la empresa" a `https://replaix.com`.
- En **Vercel** → **Environment Variables**: pon `FRONTEND_URL=https://replaix.com` y haz un redeploy para que los enlaces de pago (Stripe) usen la URL correcta.

---

**Resumen:** Compras solo el dominio → despliegas en Vercel (sin servidor) → conectas el dominio en Vercel con los DNS. La web queda visible en tu dominio y puedes usar esa URL en Stripe.
