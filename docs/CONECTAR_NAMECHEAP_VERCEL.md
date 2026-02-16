# Conectar replaixai.com (Namecheap) con Vercel

Sigue estos pasos en orden.

---

## Parte 1: Tener la web desplegada en Vercel

### 1.1 Subir el proyecto a GitHub (si aún no está)

1. Crea una cuenta en [github.com](https://github.com) si no tienes.
2. Clic en **New repository**. Nombre: `replaix` (o el que quieras). Público. Crear.
3. En tu PC, en la carpeta del proyecto (`xgrowthsaas`), abre terminal y ejecuta:

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/replaix.git
   git push -u origin main
   ```

   (Sustituye `TU_USUARIO` por tu usuario de GitHub y el nombre del repo si es distinto.)

### 1.2 Crear proyecto en Vercel

1. Entra en [vercel.com](https://vercel.com) e **Inicia sesión con GitHub**.
2. **Add New…** → **Project**.
3. **Import** el repositorio `replaix` (o el nombre que hayas usado).
4. Antes de desplegar, en **Environment Variables** añade las variables de tu `.env.local`:
   - `STRIPE_SECRET_KEY` = (tu clave)
   - `FRONTEND_URL` = `https://replaixai.com`
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `OPENAI_API_KEY`
   - Las de X (API keys, etc.) si las usas
5. Clic en **Deploy**. Espera a que termine. Te dará una URL tipo `replaix-xxxx.vercel.app`. La web ya funciona ahí.

---

## Parte 2: Conectar el dominio replaixai.com en Vercel

1. En Vercel, abre tu **proyecto** → pestaña **Settings** → **Domains**.
2. En "Add", escribe: **replaixai.com** → **Add**.
3. Añade también **www.replaixai.com** (Add → `www.replaixai.com`).
4. Vercel te mostrará qué registros DNS configurar. Anota:
   - Para **replaixai.com** (dominio raíz): suele ser un registro **A** con valor **76.76.21.21**
   - Para **www**: un **CNAME** con nombre **www** y valor **cname.vercel-dns.com**

(Los valores exactos los muestra Vercel en esa misma pantalla; si ves otros números o nombres, usa esos.)

---

## Parte 3: Configurar DNS en Namecheap

1. Entra en [Namecheap](https://www.namecheap.com) → **Domain List** → al lado de **replaixai.com** → **Manage**.
2. Ve a la pestaña **Advanced DNS**.
3. Borra o edita registros que molesten (por ejemplo si hay "URL Redirect" o "Parking" en @ o www, quítalos o desactívalos).
4. Añade los registros que Vercel te pidió:

   **Para el dominio raíz (replaixai.com):**

   - Clic **Add New Record**.
   - Tipo: **A Record**.
   - Host: **@**
   - Value: **76.76.21.21** (o el que Vercel te haya dado).
   - TTL: Automatic (o 300). Guardar.

   **Para www (www.replaixai.com):**

   - Clic **Add New Record**.
   - Tipo: **CNAME Record**.
   - Host: **www**
   - Value: **cname.vercel-dns.com** (o el que Vercel indique).
   - TTL: Automatic. Guardar.

5. Guarda los cambios si Namecheap lo pide.

---

## Parte 4: Esperar y comprobar

- La propagación DNS puede tardar **5 minutos** o hasta **24–48 horas**.
- En Vercel, en **Settings → Domains**, al lado de `replaixai.com` y `www.replaixai.com` verás si están "Valid Configuration" o si sigue "Pending".
- Cuando estén en verde, abre en el navegador:
  - **https://replaixai.com**
  - **https://www.replaixai.com**

Si una funciona y la otra no, espera un poco más; a veces `www` tarda un poco más.

---

## Resumen

| Dónde       | Qué hacer |
|------------|-----------|
| **GitHub** | Subir el código del proyecto. |
| **Vercel** | Importar repo, poner env vars, desplegar. Añadir dominios `replaixai.com` y `www.replaixai.com`. |
| **Namecheap** | Advanced DNS: A record @ → 76.76.21.21; CNAME www → cname.vercel-dns.com. |

Cuando Vercel marque los dominios como válidos, tu web ya estará en **https://replaixai.com**.
