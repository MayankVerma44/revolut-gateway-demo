import { config, revolutMerchantBaseUrl } from "../config.js";
import { log } from "../logger.js";
import type {
  CreateRevolutOrderInput,
  RevolutOrderResult,
  RevolutProvider,
} from "./revolutProvider.js";

interface RevolutApiOrder {
  id: string;
  token?: string;
  public_id?: string;
  checkout_url?: string;
  state?: string;
}

function toResult(body: RevolutApiOrder): RevolutOrderResult {
  const token = body.token ?? body.public_id;
  if (!token) {
    throw new Error("Revolut order response did not include a token.");
  }
  return {
    id: body.id,
    token,
    checkoutUrl: body.checkout_url,
    state: body.state ?? "pending",
  };
}

export class LiveRevolutProvider implements RevolutProvider {
  private async request(path: string, init: RequestInit): Promise<RevolutApiOrder> {
    const url = `${revolutMerchantBaseUrl()}${path}`;
    const response = await fetch(url, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${config.revolutSecretKey}`,
        "Revolut-Api-Version": config.revolutApiVersion,
        ...(init.headers ?? {}),
      },
    });
    const text = await response.text();
    let parsed: unknown = {};
    try {
      parsed = text ? JSON.parse(text) : {};
    } catch {
      parsed = { raw: text };
    }
    if (!response.ok) {
      log("error", "revolut.api.error", {
        path,
        status: response.status,
      });
      throw new Error(`Revolut API ${path} failed with status ${response.status}`);
    }
    return parsed as RevolutApiOrder;
  }

  async createOrder(input: CreateRevolutOrderInput): Promise<RevolutOrderResult> {
    const payload: Record<string, unknown> = {
      amount: input.amountMinor,
      currency: input.currency,
      description: input.description,
      merchant_order_data: {
        reference: input.merchantReference,
      },
      customer: {
        email: input.customerEmail,
      },
    };
    if (input.redirectUrl) {
      payload.redirect_url = input.redirectUrl;
    }

    const created = await this.request("/api/orders", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    const result = toResult(created);
    log("info", "revolut.order.created", {
      mode: config.revolutMode,
      revolutOrderId: result.id,
      merchantReference: input.merchantReference,
      redirectUrl: result.checkoutUrl,
      integrationHint: input.redirectUrl ? "hosted" : "embedded",
    });
    return result;
  }

  async retrieveOrder(revolutOrderId: string): Promise<RevolutOrderResult> {
    const body = await this.request(`/api/orders/${revolutOrderId}`, {
      method: "GET",
    });
    return toResult(body);
  }
}
