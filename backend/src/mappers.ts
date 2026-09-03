import type { PaymentStatus, PublicOrder } from "@demo/shared";
import type { StoredOrder } from "./domain.js";

export function toPublicOrder(order: StoredOrder): PublicOrder {
  return {
    id: order.id,
    product: {
      productId: order.productId,
      name: order.productName,
      quantity: order.quantity,
      unitAmountMinor: order.unitAmountMinor,
    },
    quantity: order.quantity,
    amountMinor: order.amountMinor,
    currency: order.currency,
    customer: order.customer,
    integration: order.integration,
    revolutOrderId: order.revolutOrderId,
    revolutOrderToken: order.revolutOrderToken,
    checkoutUrl: order.checkoutUrl,
    paymentStatus: order.paymentStatus,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };
}

export function mapRevolutState(state: string | undefined): PaymentStatus | undefined {
  switch ((state ?? "").toLowerCase()) {
    case "pending":
      return "pending";
    case "processing":
      return "processing";
    case "authorised":
    case "authorized":
      return "authorised";
    case "completed":
      return "completed";
    case "cancelled":
    case "canceled":
      return "cancelled";
    case "failed":
    case "declined":
      return "failed";
    default:
      return undefined;
  }
}

export function mapWebhookEvent(eventType: string): PaymentStatus | undefined {
  const normalized = eventType.toUpperCase();
  if (normalized.includes("COMPLETED") || normalized === "ORDER_COMPLETED") {
    return "completed";
  }
  if (normalized.includes("AUTHORISED") || normalized.includes("AUTHORIZED")) {
    return "authorised";
  }
  if (normalized.includes("CANCEL")) {
    return "cancelled";
  }
  if (
    normalized.includes("FAILED") ||
    normalized.includes("DECLINED") ||
    normalized.includes("PAYMENT_FAILED")
  ) {
    return "failed";
  }
  return undefined;
}
