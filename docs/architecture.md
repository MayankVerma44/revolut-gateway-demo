# Architecture

## Revolut API

The backend uses `LiveRevolutProvider` against:

- sandbox: `https://sandbox-merchant.revolut.com`
- prod: `https://merchant.revolut.com`

Selected by `REVOLUT_MODE`.

Both `REVOLUT_PUBLIC_KEY` and `REVOLUT_SECRET_KEY` must be configured for checkout. `GET /api/config` reports `sandboxReady` when keys are present.

## Frontend abstraction

`PaymentIntegration` is the only checkout UI contract.

| Implementation | Behaviour |
| --- | --- |
| `RevolutCheckoutIntegration` | Mounts the Embedded Checkout Web SDK. `createOrder` calls `POST /api/revolut/embedded/create-order` and returns the order token as `publicId`. |
| `HostedCheckoutIntegration` | Calls `POST /api/revolut/hosted/create-order` and assigns `window.location` to `checkoutUrl`. |

The React tree does not create Revolut orders itself.

## Backend layers

```
HTTP routes
  → OrderService / WebhookService
    → LiveRevolutProvider
    → OrderRepository (SQLite via sql.js)
```

`SqliteStore` implements `OrderRepository` and `WebhookEventRepository`. Replace the store class without changing services.

## Payment flows

### Embedded Checkout

1. Merchant checkout creates a local order (`POST /api/orders`).
2. SDK asks the backend for a token.
3. Backend uses the secret key on `POST /api/orders` (Revolut Merchant API).
4. Widget handles payment methods on the merchant page.
5. `onSuccess` / `onError` / `onCancel` send the shopper to merchant result routes.
6. Result pages call `GET /api/orders/:id/status`.

### Hosted payment page/redirect Checkout

1. Local order is created with `hosted_checkout`.
2. Backend creates a Revolut order with `redirect_url` = `{REVOLUT_HOSTED_REDIRECT_URL or APP_BASE_URL}/order/{id}/success`.
3. Response includes `checkout_url`.
4. Browser leaves the merchant origin (banner shown before redirect).
5. After payment, Revolut sends the shopper back. The return page verifies status server-side.
6. Webhooks update local status independently of the redirect.

## Webhooks

`POST /api/webhooks/revolut` stores every event. If `REVOLUT_WEBHOOK_SECRET` is set, the handler verifies `Revolut-Signature` as HMAC-SHA256 over `v1.{timestamp}.{rawBody}`.

Never treat a 200 redirect as fulfilment. `OrderService.refreshFromRevolut` and webhook mapping are the sources of truth.

## Amounts

Product price is £99.00 (`9900` minor units). Shipping is free in this SKU. Quantity 1–5.
