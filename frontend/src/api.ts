import type {
  CreateOrderRequest,
  EmbeddedCreateOrderResponse,
  HostedCreateOrderResponse,
  PublicConfig,
  PublicOrder,
} from "@demo/shared";

/** Empty in local dev (Vite proxies /api). Set VITE_API_URL to the Render backend in production. */
const API_BASE = import.meta.env.DEV
  ? ""
  : (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, "") ?? "";

function apiUrl(path: string): string {
  return `${API_BASE}${path}`;
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(url, init);
  } catch {
    throw new Error(
      import.meta.env.DEV
        ? "Cannot reach the backend API. Start the server with `npm run dev` (backend on port 3001)."
        : "Cannot reach the backend API. Check VITE_API_URL points to your Render service.",
    );
  }
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error((body as { error?: string }).error ?? `Request failed (${response.status})`);
  }
  return body as T;
}

export const api = {
  config: () => request<PublicConfig>(apiUrl("/api/config")),
  createOrder: (payload: CreateOrderRequest) =>
    request<{ order: PublicOrder }>(apiUrl("/api/orders"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  getOrder: (id: string) => request<{ order: PublicOrder }>(apiUrl(`/api/orders/${id}`)),
  getStatus: (id: string) =>
    request<{ order: PublicOrder; verifiedServerSide: true }>(
      apiUrl(`/api/orders/${id}/status`),
    ),
  createEmbedded: (localOrderId: string) =>
    request<EmbeddedCreateOrderResponse>(apiUrl("/api/revolut/embedded/create-order"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ localOrderId }),
    }),
  createHosted: (localOrderId: string) =>
    request<HostedCreateOrderResponse>(apiUrl("/api/revolut/hosted/create-order"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ localOrderId }),
    }),
};
