# Revolut Gateway Solution Comparison Demo

A polished dummy ecommerce store for **Northline Audio**. Merchants can walk a realistic checkout and compare two Revolut online payment integrations:

1. **Embedded Checkout** — embedded widget on the merchant page (Web SDK)
2. **Hosted payment page/redirect Checkout** — server-created order, browser redirect to Revolut `checkout_url`

The app uses the Revolut Merchant API and official SDK. Secret keys never leave the backend.

## Project structure

```
frontend/   React + Vite + TypeScript storefront
backend/    Express API, SQLite repository, Revolut provider
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

## Revolut sandbox

1. Create a [Revolut Merchant sandbox](https://developer.revolut.com/docs/guides/merchant/test-and-go-live/set-up-sandbox) account and API keys.
2. Put keys in `.env`:

```
REVOLUT_MODE=sandbox
REVOLUT_PUBLIC_KEY=pk_...
REVOLUT_SECRET_KEY=sk_...
APP_BASE_URL=http://localhost:5173
REVOLUT_WEBHOOK_SECRET=wsk_...   # optional but recommended
```

3. Point a sandbox webhook to `https://<public-host>/api/webhooks/revolut` (use a tunnel in local development).
4. Restart `npm run dev`.

The frontend only receives the **public** key via `GET /api/config`. Order creation uses the secret key on the server.

Embedded Checkout uses `@revolut/checkout` `embeddedCheckout()` with `createOrder` returning `{ publicId: token }`, matching current Embedded Checkout Web docs.

Hosted payment page/redirect Checkout creates an order with `redirect_url` set to `/order/:id/success`. The confirmation page always calls `GET /api/orders/:id/status` and retrieves the Revolut order before showing success.

For local Hosted payment page/redirect Checkout, set `REVOLUT_HOSTED_REDIRECT_URL` to a public tunnel URL — Revolut sandbox rejects localhost redirect URLs.

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
