import { randomUUID } from "node:crypto";
import { config } from "../config.js";
import { log } from "../logger.js";
import type {
  CreateRevolutOrderInput,
  RevolutOrderResult,
  RevolutProvider,
} from "./revolutProvider.js";

const demoOrders = new Map<string, RevolutOrderResult>();

export class DemoRevolutProvider implements RevolutProvider {
  async createOrder(input: CreateRevolutOrderInput): Promise<RevolutOrderResult> {
    const id = `rev_demo_${randomUUID()}`;
    const token = `tok_demo_${randomUUID()}`;
    const checkoutUrl = input.redirectUrl
      ? `${config.appBaseUrl}/demo/hosted-checkout?orderId=${encodeURIComponent(input.merchantReference)}`
      : undefined;
    const result: RevolutOrderResult = {
      id,
      token,
      checkoutUrl,
      state: "pending",
    };
    demoOrders.set(id, result);
    log("info", "revolut.order.created", {
      mode: "demo",
      revolutOrderId: id,
      merchantReference: input.merchantReference,
      redirectUrl: checkoutUrl,
      integrationHint: input.redirectUrl ? "hosted" : "embedded",
    });
    return result;
  }

  async retrieveOrder(revolutOrderId: string): Promise<RevolutOrderResult> {
    const existing = demoOrders.get(revolutOrderId);
    if (!existing) {
      throw new Error(`Demo Revolut order not found: ${revolutOrderId}`);
    }
    return existing;
  }
}
