# Configuración de Stripe (repl.aiX)

## Variables de entorno

Añade a `.env.local` (o tu entorno):

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_STARTER=price_...
STRIPE_PRICE_GROWTH=price_...
STRIPE_PRICE_PRO=price_...
FRONTEND_URL=http://localhost:3000
```

## Crear productos y precios en Stripe

1. [Stripe Dashboard](https://dashboard.stripe.com) → **Products** → Add product.
2. Crea tres productos: **Starter** ($15/mo), **Growth** ($29/mo), **Pro** ($49/mo).
3. En cada producto, añade un precio recurrente mensual (y opcionalmente trial en el precio o lo gestionamos en código).
4. Copia los **Price ID** (empiezan por `price_`) a `STRIPE_PRICE_STARTER`, `STRIPE_PRICE_GROWTH`, `STRIPE_PRICE_PRO`.

## Apple Pay, Google Pay y otros métodos de pago

El checkout usa los **métodos de pago activos en tu cuenta**. Para ofrecer Apple Pay, Google Pay, Link, etc.:

1. [Stripe Dashboard](https://dashboard.stripe.com) → **Settings** (engranaje) → **Payment methods**.
2. Activa **Cards**, **Apple Pay**, **Google Pay**, **Link** y los que quieras (Bancontact, iDEAL, etc.).
3. Guarda. En el próximo checkout Stripe mostrará solo los métodos habilitados y compatibles con el navegador del cliente (p. ej. Apple Pay en Safari).

No hace falta cambiar código: la API ya está preparada para usar la configuración del Dashboard. Además, en checkout está activado **códigos promocionales** (cupones) para que los clientes puedan aplicar descuentos.

## Webhook

1. Stripe Dashboard → **Developers** → **Webhooks** → Add endpoint.
2. URL: `https://tu-dominio.com/api/webhooks/stripe` (en local usa [Stripe CLI](https://stripe.com/docs/stripe-cli): `stripe listen --forward-to localhost:3000/api/webhooks/stripe`).
3. Eventos recomendados: `checkout.session.completed`, `invoice.payment_succeeded`, `customer.subscription.updated`, `customer.subscription.deleted`.
4. Copia el **Signing secret** (`whsec_...`) a `STRIPE_WEBHOOK_SECRET`.

## Flujo

- **Subscribe** (landing o dashboard): POST `/api/subscription/create-checkout` con `{ plan, userEmail }` → redirige a Stripe Checkout (tarjeta, Apple Pay, Google Pay).
- **Manage subscription** (perfil): POST `/api/subscription/create-portal` con `{ userEmail }` → redirige al portal de Stripe (cambiar plan, cancelar, facturas).
- **Estado**: GET `/api/subscription/status?email=...` devuelve plan, renovación y trial.

## Proteger rutas premium

Para restringir acceso a rutas según suscripción activa, en un cliente puedes usar:

```ts
const { data } = useSubscriptionStatus(user?.email);
if (data && !data.hasSubscription && data.status !== 'trialing') {
  router.replace('/#pricing');
}
```

O llamar a `fetchSubscriptionStatus(email)` y comprobar `hasSubscription` o `status === 'active' | 'trialing'` antes de mostrar contenido premium.
