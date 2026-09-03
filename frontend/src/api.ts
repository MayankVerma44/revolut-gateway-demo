import type {
  CreateOrderRequest,
  EmbeddedCreateOrderResponse,
  HostedCreateOrderResponse,
  PublicConfig,
  PublicOrder,
} from "@demo/shared";

async function parse<T>(responsePromise: Promise<Response>): Promise<T> {
  const response = await responsePromise;
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error((body as { error?: string }).error ?? `Request failed (${response.status})`);
  }
  return body as T;
}

export const api = {
  config: () => parse<PublicConfig>(fetch("/api/config")),
  createOrder: (payload: CreateOrderRequest) =>
    parse<{ order: PublicOrder }>(
      fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }),
    ),
  getOrder: (id: string) => parse<{ order: PublicOrder }>(fetch(`/api/orders/${id}`)),
  getStatus: (id: string) =>
    parse<{ order: PublicOrder; verifiedServerSide: true }>(fetch(`/api/orders/${id}/status`)),
  createEmbedded: (localOrderId: string) =>
    parse<EmbeddedCreateOrderResponse>(
      fetch("/api/revolut/embedded/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ localOrderId }),
      }),
    ),
  createHosted: (localOrderId: string) =>
    parse<HostedCreateOrderResponse>(
      fetch("/api/revolut/hosted/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ localOrderId }),
      }),
    ),
  simulate: (id: string, outcome: "completed" | "failed" | "cancelled" | "pending") =>
    parse<{ order: PublicOrder }>(
      fetch(`/api/demo/orders/${id}/simulate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ outcome }),
      }),
    ),
};
