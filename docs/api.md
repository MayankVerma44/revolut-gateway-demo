# API

Base URL in local development: `http://localhost:3001` (Vite proxies `/api` from port 5173).

## `GET /api/health`

Liveness plus current mode flags.

## `GET /api/config`

Public runtime config for the storefront.

```json
{
  "revolutMode": "sandbox",
  "revolutPublicKey": "pk_...",
  "appBaseUrl": "http://localhost:5173",
  "sandboxReady": true,
  "localHostedRedirect": false
}
```

`sandboxReady` is true when both `REVOLUT_PUBLIC_KEY` and `REVOLUT_SECRET_KEY` are configured on the server.

## `POST /api/orders`

Creates a **local** merchant order. Does not call Revolut.

Body:

```json
{
  "quantity": 1,
  "integration": "revolut_checkout",
  "customer": {
    "fullName": "Alex Merchant",
    "email": "alex@northline.example",
    "phone": "+44 20 7946 0958",
    "country": "United Kingdom",
    "city": "London",
    "postcode": "EC2A 2BB",
    "addressLine1": "14 Finsbury Square"
  }
}
```

`integration` is `revolut_checkout` or `hosted_checkout`.

## `POST /api/revolut/embedded/create-order`

Secret-key Revolut order for the embedded widget.

```json
{ "localOrderId": "<uuid>" }
```

Response: `{ "orderId", "token" }`.

## `POST /api/revolut/hosted/create-order`

Secret-key Revolut order for Hosted payment page/redirect Checkout.

Response: `{ "orderId", "token", "checkoutUrl" }`.

## `GET /api/orders/:id`

Local order snapshot.

## `GET /api/orders/:id/status`

Local snapshot, plus a Merchant API retrieve when a Revolut order id exists.

```json
{ "order": { "...": "..." }, "verifiedServerSide": true }
```

## `POST /api/webhooks/revolut`

Raw Revolut webhook receiver. Optional signature headers:

- `Revolut-Request-Timestamp`
- `Revolut-Signature`
