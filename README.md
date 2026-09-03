# Revolut Gateway Solution Comparison Demo

A polished dummy ecommerce store for **Northline Audio**. Merchants can walk a realistic checkout and compare two Revolut online payment integrations:

1. **Revolut Checkout** — embedded widget on the merchant page (Web SDK)
2. **Hosted Checkout** — server-created order, browser redirect to Revolut `checkout_url`

The app runs in **DEMO mode** (no credentials) or **REAL SANDBOX mode** (Merchant API + official SDK). Secret keys never leave the backend.

## Project structure

```
frontend/   React + Vite + TypeScript storefront
backend/    Express API, SQLite repository, Revolut providers
shared/     Shared order types and product catalog
docs/       Architecture and API notes
```

## Setup

```bash
cp .env.example .env
npm install
npm run dev
```

- Storefront: http://localhost:5173
- API: http://localhost:3001

`DEMO_MODE=true` is the default.

## DEMO mode

Leave `DEMO_MODE=true`. Do not set live secrets.

- Embedded checkout shows an in-page simulated widget and outcome buttons.
- Hosted checkout redirects to a clearly labelled **simulated Revolut-hosted page** inside this app.
- Demo controls: success, failed, cancelled, pending.
- Webhook endpoint is live and can accept events even in DEMO mode.

## REAL SANDBOX mode

1. Create a [Revolut Merchant sandbox](https://developer.revolut.com/docs/guides/merchant/test-and-go-live/set-up-sandbox) account and API keys.
2. Put keys in `.env`:

```
DEMO_MODE=false
REVOLUT_MODE=sandbox
REVOLUT_PUBLIC_KEY=pk_...
REVOLUT_SECRET_KEY=sk_...
APP_BASE_URL=http://localhost:5173
REVOLUT_WEBHOOK_SECRET=wsk_...   # optional but recommended
```

3. Point a sandbox webhook to `https://<public-host>/api/webhooks/revolut` (use a tunnel in local development).
4. Restart `npm run dev`.

The frontend only receives the **public** key via `GET /api/config`. Order creation uses the secret key on the server.

Embedded checkout uses `@revolut/checkout` `embeddedCheckout()` with `createOrder` returning `{ publicId: token }`, matching current Revolut Checkout Web docs.

Hosted checkout creates an order with `redirect_url` set to `/order/:id/return`. The confirmation page always calls `GET /api/orders/:id/status` and, outside DEMO mode, retrieves the Revolut order before showing success.

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Backend + frontend together |
| `npm run typecheck` | TypeScript across workspaces |
| `npm run build` | Production build |
| `npm run start` | Run compiled backend |

## Documentation

- [Architecture](docs/architecture.md)
- [API](docs/api.md)

## Security notes

- Never commit `.env`.
- Logs redact secrets and customer contact fields.
- Fulfilment decisions use server-side status and webhooks, not the browser redirect alone.
