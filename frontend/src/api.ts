import type {
  CreateOrderRequest,
  EmbeddedCreateOrderResponse,
  HostedCreateOrderResponse,
  PublicConfig,
  PublicOrder,
} from "@demo/shared";

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(url, init);
  } catch {
    throw new Error(
      "Cannot reach the backend API. Start the server with `npm run dev` (backend on port 3001).",
    );
  }
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error((body as { error?: string }).error ?? `Request failed (${response.status})`);
  }
  return body as T;
}

export const api = {
  config: () => request<PublicConfig>("/api/config"),
  createOrder: (payload: CreateOrderRequest) =>
    request<{ order: PublicOrder }>("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  getOrder: (id: string) => request<{ order: PublicOrder }>(`/api/orders/${id}`),
  getStatus: (id: string) =>
    request<{ order: PublicOrder; verifiedServerSide: true }>(`/api/orders/${id}/status`),
  createEmbedded: (localOrderId: string) =>
    request<EmbeddedCreateOrderResponse>("/api/revolut/embedded/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ localOrderId }),
    }),
  createHosted: (localOrderId: string) =>
    request<HostedCreateOrderResponse>("/api/revolut/hosted/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ localOrderId }),
    }),
  simulate: (id: string, outcome: "completed" | "failed" | "cancelled" | "pending") =>
    request<{ order: PublicOrder }>(`/api/demo/orders/${id}/simulate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ outcome }),
    }),
};
