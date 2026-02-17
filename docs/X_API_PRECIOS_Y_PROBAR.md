# API de X: precios y cómo probar que funcione (402 → datos reales)

X ha cambiado varias veces el modelo de precios. Resumen y qué hacer para **probar con el mínimo coste** que respuestas, engagement y actividad real funcionen.

---

## Situación actual (lo que sabemos)

- **402 Payment Required** = el endpoint `GET /2/users/:id/tweets` (timeline del usuario) **no está incluido en el plan gratuito** de X API.
- Para que ese endpoint responda hace falta **acceso de pago** en la app que usas en developer.x.com.

### Modelos de precio de X (según fuentes públicas)

| Modelo | Descripción | Para probar |
|--------|-------------|-------------|
| **Plan gratuito** | Muy limitado (p. ej. 100 lecturas/mes). No incluye timeline de tweets → **402**. | No sirve para timeline. |
| **Basic (antiguo)** | ~200 USD/mes fijo, más lecturas. | Caro solo para probar. |
| **Pro (antiguo)** | ~5.000 USD/mes. | No recomendable para pruebas. |
| **Pay-per-use (nuevo / pilot)** | Sin cuota fija; pagas por uso (p. ej. ~0,005 USD por post leído, ~0,01 USD por user). | **Lo que más puede rentar para “solo ver si funciona”**: pocos dólares en créditos. |

X ha anunciado o probado un modelo **pay-per-use** (pago por uso). Si en tu cuenta está disponible, suele ser la opción más barata para hacer unas pocas pruebas.

---

## Qué hacer ahora para ver si funciona realmente

### 1. Entrar en el portal de X

1. Ve a **https://developer.x.com** e inicia sesión.
2. Entra en tu **proyecto** y en la **app** que usa repl.aiX (la misma que tiene el Client ID/Secret en Supabase).

### 2. Buscar opción de pago / créditos / productos

En el menú del proyecto o de la app, revisa si hay algo de:

- **Products** / **Productos**
- **Billing** / **Facturación**
- **Pay-as-you-go** / **Pay-per-use** / **Pago por uso**
- **Credits** / **Créditos** o **Add credits**
- **Upgrade** / **Actualizar plan**

Si ves **pay-per-use o créditos**:

- Añade un **mínimo** (p. ej. 5–10 USD si te lo permiten).
- No hace falta contratar Basic de 200 USD/mes para probar.

Si **solo** ves planes **Basic (200 USD/mes)** o **Pro**:

- Basic es la opción más barata para tener acceso al timeline; no suele haber “prueba de un día” oficial.

### 3. Comprobar que ya funciona

1. Tras tener algún tipo de acceso de pago activo (créditos o Basic), en repl.aiX **cierra sesión** y **vuelve a entrar con X** (por si el token se actualiza).
2. Abre **https://replaixai.com/api/x/debug** (o tu dominio) con la sesión iniciada.
3. Mira el JSON:
   - **`tweetsApiOk: true`** y **`tweetsError: null`** → el endpoint de tweets ya responde; Dashboard, Analytics y Recent activity deberían mostrar datos reales.
   - Si sigue **402**, el proyecto/app aún no tiene acceso de pago aplicado a esa app (o hay que esperar unos minutos).

### 4. Enlaces útiles

- **Productos y precios oficiales:**  
  https://developer.x.com/en/portal/products  
  (comprueba ahí la opción más barata disponible en tu región/cuenta.)

- **Anuncio pay-per-use (comunidad):**  
  https://devcommunity.x.com/t/announcing-the-x-api-pay-per-use-pricing-pilot/250253  
  (por si en tu cuenta aparece “pilot” o “pay-per-use”.)

---

## Resumen: qué te renta más para “solo ver si funciona”

1. **Entrar en developer.x.com** → tu app.
2. **Buscar “Pay-per-use” / “Credits” / “Billing”** y, si existe, **añadir pocos dólares en créditos** (5–10 USD suele bastar para unas cuantas cargas del dashboard).
3. **Si no hay pay-per-use**, la opción oficial más barata suele ser **Basic** (~200 USD/mes); solo compensa si quieres usarlo en serio.
4. **Comprobar** con `/api/x/debug`: `tweetsApiOk: true` = está funcionando con datos reales.

Los precios y nombres exactos pueden cambiar; la fuente de verdad es siempre **developer.x.com** (Products / Billing de tu proyecto).
