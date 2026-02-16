# APIs para el MVP: X (Twitter) y OpenAI sin gastar de más

## 1. OpenAI (respuestas con IA)

### Qué usas ahora
- El proyecto llama a **/api/generateReply** para generar respuestas a tweets.
- Se puede usar **gpt-3.5-turbo** (más barato) o **gpt-4o-mini** (mejor calidad, aún barato).

### Recomendación para pruebas y MVP
- **Modelo:** **gpt-4o-mini**  
  - Mejor calidad que 3.5, precio muy bajo (pocos céntimos por miles de respuestas).
  - En el código está configurable con la variable `OPENAI_MODEL` (por defecto gpt-4o-mini).
- **Límite de uso (recomendado):**
  1. Entra en [OpenAI Platform](https://platform.openai.com/account/limits).
  2. Pon un **límite mensual** (ej. 5–10 €) para que no se dispare el gasto.
- **max_tokens:** Se mantiene en 60–80 por respuesta para que cada llamada sea barata.

Con eso el MVP puede ser funcional con IA buena y coste bajo.

---

## 2. X (Twitter) API – búsqueda de tweets

### Situación actual
- **No hay plan gratuito** oficial para leer tweets; X cobra por uso (aprox. 0,005 USD por recurso leído).
- En el proyecto, la búsqueda de tweets usa **datos mock** (fake). No se gasta nada en X.

### Opciones para el MVP

**A) Seguir con mocks (recomendado al empezar)**  
- No configuras nada de X API.  
- Las búsquedas y el “feed” son datos de prueba.  
- Sirve para desarrollar y probar flujo, respuestas con IA y Stripe sin gastar en X.

**B) Activar X API con mucho control de gasto**  
- Te das de alta en [developer.x.com](https://developer.x.com) y creas un proyecto/app para tener **Bearer Token** (solo lectura).  
- En el código se puede limitar el número de búsquedas reales por día (ej. 20–50) para que el coste sea bajo (pocos dólares al mes).  
- Útil cuando quieras probar con tweets reales sin gastar “un dineral”.

**C) Probar con créditos gratuitos de un proxy**  
- Servicios como **GetXAPI** a veces dan créditos gratis al registrarte.  
- Sirve para probar integración real sin tocar la API de pago de X; luego puedes pasar a la API oficial si te interesa.

### Recomendación
- **Fase MVP / primeras pruebas:** mantener **mocks** (opción A).  
- Cuando quieras tweets reales: activar **X API con límite diario bajo** (opción B) o usar un proxy con créditos gratis (opción C) para no gastar mucho.

---

## 3. Resumen

| Qué              | Para pruebas / MVP              | Coste aproximado   |
|------------------|----------------------------------|--------------------|
| **OpenAI**       | gpt-4o-mini + límite 5–10 €/mes | Muy bajo           |
| **X (Twitter)** | Seguir con mocks                 | 0 €                |
| **X (Twitter)** | Si quieres tweets reales         | Límite bajo en código = pocos €/mes |

Así el MVP puede ser funcional con IA buena (OpenAI) y sin gastar un dineral; X lo puedes dejar en mocks hasta que quieras pagar por uso real.
